import { Injectable } from "@nestjs/common"
import { Server, Socket } from "socket.io"
import { WsJoinChatRoomDto } from "../../DTO/websocket/user-chat/send-message.dto"
import type { AuthenticatedSocket } from "./types/index.types"

@Injectable()
export class WsUserService {
    constructor() {}

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

    removeClient(client: Socket) {
        this.clients = this.clients.filter(clientItem => clientItem.id !== client.id)
    }

    getClientById(id: string) {
        return this.clients.find((clientItem) => clientItem.id === id)
    }
}