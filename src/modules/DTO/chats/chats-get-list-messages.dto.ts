import {IsInt, IsNotEmpty, IsOptional, Min} from 'class-validator'
import { Type } from 'class-transformer'

export class ChatsGetListMessagesDto {
    @Type(() => Number)
    @IsNotEmpty({ message: 'id не может быть пустым' })
    id: number

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    cursor?: number
}