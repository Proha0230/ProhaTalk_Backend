import { Type } from "class-transformer"
import {IsNotEmpty, IsOptional, IsString} from "class-validator"

export class IGetSearchUsersDTO {
    // uLON - userNameOrLogin
    @Type(() => String)
    @IsOptional() // опциональный - необязательный
    @IsString( { message: 'Поле uLON должно быть string' })
    @IsNotEmpty({ message: 'Поле uLON не может быть пустым' })
    uLON?: string
}