import {IsString, IsNotEmpty, MinLength, IsNumber} from 'class-validator'
import { Type } from 'class-transformer'

export class InviteFriendDTO {
    // login
    @Type(() => Number)
    @IsNumber({}, { message: 'Поле ptid должно быть number' })
    @IsNotEmpty({ message: 'Поле ptid не может быть пустым' })
    ptid: number
}