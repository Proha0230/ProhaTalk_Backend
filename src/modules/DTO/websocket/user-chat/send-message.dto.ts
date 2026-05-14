import { IsNotEmpty, IsNumber } from 'class-validator'

export class WsJoinChatRoomDto {
    // id
    @IsNumber({}, { message: "id должен быть number!"})
    @IsNotEmpty({ message: 'id не может быть пустым' })
    id: number
}