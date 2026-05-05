import {IsString, IsNotEmpty, IsEmail, MinLength, IsBoolean, Equals} from 'class-validator'
import { Type } from 'class-transformer'

export class SignUpDto {
    // login
    @Type(() => String)
    @IsString({ message: 'login должен быть string' })
    @MinLength(6, { message: "Логин должен быть минимум из 6 символов"})
    @IsNotEmpty({ message: 'login не может быть пустым' })
    login: string


    // password
    @Type(() => String)
    @IsString({ message: 'password должен быть string' })
    @MinLength(6, { message: "Пароль должен быть минимум из 6 символов"})
    @IsNotEmpty({ message: 'password не может быть пустым' })
    password: string


    // email
    @IsEmail({}, {
        message: 'Некорректный email',
    })
    @MinLength(6, { message: "Email должен быть минимум из 6 символов"})
    @IsNotEmpty({ message: 'Поле email не может быть пустым' })
    email: string


    // checkbox
    @Type(() => Boolean)
    @Equals(true, {
        message: 'Необходимо принять условия',
    })
    acceptedTheTerms: boolean
}