import { IsNotEmpty, IsString } from 'class-validator'

export class PushUnsubscribeDto {
    @IsString({message: 'Поле endpoint должно быть string'})
    @IsNotEmpty({message: 'Поле endpoint не может быть пустым'})
    endpoint: string
}