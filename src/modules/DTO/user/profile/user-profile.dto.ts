import {IsString, MaxLength, IsOptional} from 'class-validator'
import { Type } from 'class-transformer'

export class UserProfileDto {
    // Имя
    @IsOptional() // опциональный - необязательный
    @Type(() => String)
    @IsString({ message: 'Поле Имя должно быть string' })
    @MaxLength(20, { message: "Имя должно быть не длиннее 20 символов"})
    name?: string


    // Фамилия
    @IsOptional()
    @Type(() => String)
    @IsString({ message: 'Поле password должен быть string' })
    @MaxLength(20, { message: "Фамилия должна быть не длиннее 20 символов"})
    lastname?: string


    // Статус
    @IsOptional()
    @Type(() => String)
    @IsString({ message: 'Поле password должен быть string' })
    @MaxLength(80, { message: "Статус должен быть не длиннее 80 символов"})
    status?: string
}