import {IsString, IsNotEmpty, MinLength, IsNumber} from 'class-validator'
import { Type } from 'class-transformer'

export class InviteFriendDTO {
    // login
    @Type(() => Number)
    @IsNumber({}, { message: 'Поле id должно быть number' })
    @IsNotEmpty({ message: 'Поле id не может быть пустым' })
    id: number
}