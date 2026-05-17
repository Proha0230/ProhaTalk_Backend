import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer, WsException
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { WsUserService } from "./ws-user.service"
import { WsJoinChatRoomDto } from "../../DTO/websocket/user-chat/send-message.dto"
import { UseGuards, UsePipes} from "@nestjs/common"
import { WsValidationPipe } from "../validation-pipe/ws-validation.pipe"
import { WsJwtGuard } from "../jwt-guard/ws-jwt.guard"
import type { AuthenticatedSocket } from "./types/index.types"
import { ChatsService } from "../../user/chats/chats.service"
import { ChatsMessageSendDto } from "../../DTO/chats/chats-send.dto"
import { MessagesDB } from "../../../database/entities/chats/users-chats-messages-db.entity"
import { JwtService } from "@nestjs/jwt"

// проверка JWT токена юзера
@UseGuards(WsJwtGuard)
// запуск DTO если не проходит, то будет возвращен WsException, который сможет прослушать клиент
@UsePipes(WsValidationPipe)
// ws://localhost:3001/user-chat
@WebSocketGateway({
    namespace: 'user',
    cors: {
        origin: "*"
    }
})
export class WsUserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly jwtService: JwtService,
        private readonly wsUserChatService: WsUserService,
        private readonly chatsService: ChatsService
    ) {}

    @WebSocketServer() server: Server

    // обрабатываем событие "send-message" - проводим флоу по новому сообщению
    // и отдаем его по WS клиенту - на котором пушим его в пинию
    @SubscribeMessage('send-message')
    async sendMessage(
        @MessageBody() dto: ChatsMessageSendDto,
        @ConnectedSocket() client: AuthenticatedSocket
    ): Promise<void> {
        try {
            const nameRoom = this.wsUserChatService.getRoomName(dto, client)

            const newMessage = await this.chatsService.messageSend(dto, client.user, true)

            const resultMessage = await this.chatsService.getChatMessage(newMessage as MessagesDB)

            this.server.to(nameRoom).emit('new-message', resultMessage)
        } catch (error) {
            throw new WsException(error.message)
        }
    }

    @SubscribeMessage('join-room')
    async joinChatRoom(
        @MessageBody() dto: WsJoinChatRoomDto,
        @ConnectedSocket() client: AuthenticatedSocket
    ): Promise<void> {
        await this.wsUserChatService.joinChatRoom(dto, client)
    }


    // соединяем клиента по ws с сервером
    async handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
        if(!this.wsUserChatService.getClientById(client.id)) {
            try {
                const token = client.handshake?.auth?.token

                if (!token) {
                    client.disconnect()
                    return
                }

                client.user = await this.jwtService.verifyAsync(token)

                this.wsUserChatService.addClient(client)

                // посылаем событие на клиент отдающий текущий онлайн список пользователей
                this.server.emit('online-users', this.wsUserChatService.getOnlineUsers())
            } catch {
                client.disconnect(true)
            }
        }
    }

    // отключаем клиента по ws от сервера
    async handleDisconnect(@ConnectedSocket() client: Socket) {
        if(this.wsUserChatService.getClientById(client.id)) {
            try {
                // обновляем ему ключ lastSeen в UserDB
                await this.wsUserChatService.onUpdateUserLastSeen(client)
            } finally {
                this.wsUserChatService.removeClient(client)
                this.server.emit('online-users', this.wsUserChatService.getOnlineUsers())
            }
        }
    }
}