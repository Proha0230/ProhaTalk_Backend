import { Injectable } from "@nestjs/common"
import { Server, Socket } from "socket.io"
import { isEmpty as _isEmpty } from "lodash"
import { WsJoinChatRoomDto } from "../../DTO/websocket/user-chat/send-message.dto"
import {AuthenticatedSocket, IUserJWTInfo} from "./types/index.types"
import { InjectRepository } from "@nestjs/typeorm"
import { UsersDB } from "../../../database/entities/users/users-db.entity"
import { Repository } from "typeorm"
import { JwtService } from "@nestjs/jwt"
import { WsException } from "@nestjs/websockets"
import { UniversalService } from "../../user/universal/universal.service"

@Injectable()
export class WsUserService {
    constructor(
        @InjectRepository(UsersDB)
        private readonly usersRepository: Repository<UsersDB>,
        private readonly jwtService: JwtService,
        private readonly universalService: UniversalService
    ) {}

    private clients: Array<Socket> = []

    getRoomName(dto: WsJoinChatRoomDto, client: AuthenticatedSocket) {
        // сортируем id юзеров чтобы меньший был всегда userOneId а больший userTwoId и из них формируем название комнаты
        const [userOneId, userTwoId] = client.user.id < dto.id ? [client.user.id, dto.id] : [dto.id, client.user.id]
        return `chat_room_${userOneId}-${userTwoId}`
    }

    async joinChatRoom(dto: WsJoinChatRoomDto, client: AuthenticatedSocket) {
        // здесь еще добавить проверку на дружбу между контактами

        const nameRoom = this.getRoomName(dto, client)
        await client.join(nameRoom)
    }

    addClient(client: Socket) {
        this.clients.push(client)
    }

    // отдаем логины юзеров кто сейчас подсоединен к вебсокету
    getOnlineUsers() {
        return this.clients.map((client: AuthenticatedSocket) => {
            return {
                userLogin: client.user.login
            }
        })
    }

    async onUpdateUserLastSeen(client: Socket) {
        const token: string = client.handshake?.auth?.token
        const userJWTInfo: IUserJWTInfo = await this.jwtService.verifyAsync(token)

        if (!_isEmpty(userJWTInfo) && userJWTInfo.id) {
            // нахождение и проверка существования юзера, чтобы обновить lastSeen
            const user = await this.universalService.universalCheckingUserExistence(userJWTInfo.id)

            if (!user) {
                throw new WsException('Пользователь не найден')
            }

            user.lastSeen = new Date()
            await this.usersRepository.save(user)

        } else {
            throw new WsException("JWT невалиден")
        }
    }

    removeClient(client: Socket) {
        this.clients = this.clients.filter(clientItem => clientItem.id !== client.id)
    }

    getClientById(id: string) {
        return this.clients.find((clientItem) => clientItem.id === id)
    }
}