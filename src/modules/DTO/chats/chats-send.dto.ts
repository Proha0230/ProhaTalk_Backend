import {IsString, IsNotEmpty, IsEmail, MinLength, IsBoolean, Equals} from 'class-validator'
import { Type } from 'class-transformer'

export class ChatsMessageSendDto {
    // messageValue
    @Type(() => String)
    @IsString({ message: 'messageValue должен быть string' })
    @MinLength(1, { message: "messageValue должен быть минимум из 1 символа"})
    @IsNotEmpty({ message: 'messageValue не может быть пустым' })
    messageValue: string

    @Type(() => Number)
    @IsNotEmpty({ message: 'idUserReceiving не может быть пустым' })
    id: number
}