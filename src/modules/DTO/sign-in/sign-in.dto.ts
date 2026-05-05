import { IsString, IsNotEmpty, MinLength } from 'class-validator'
import { Type } from 'class-transformer'

export class SignInDto {
    // login
    @Type(() => String)
    @IsString({ message: 'Поле login должен быть string' })
    @IsNotEmpty({ message: 'Поле login не может быть пустым' })
    @MinLength(6, { message: "Логин должен быть минимум из 6 символов"})
    login: string


    // password
    @Type(() => String)
    @IsString({ message: 'Поле password должен быть string' })
    @IsNotEmpty({ message: 'Поле password не может быть пустым' })
    @MinLength(6, { message: "Пароль должен быть минимум из 6 символов"})
    password: string
}