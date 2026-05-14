import { Socket } from "socket.io"
import { IReqInfoUser } from "../../../../global-types/types"

export interface IMessage {
    value: string,
    socketId: string
}

export interface AuthenticatedSocket extends Socket {
    user: IReqInfoUser
}