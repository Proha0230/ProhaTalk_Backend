import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class ChatsGetListMessagesDto {
    @Type(() => Number)
    @IsNotEmpty({ message: 'id не может быть пустым' })
    id: number
}