import { IsNotEmpty, IsString } from 'class-validator'

export class PushSubscribeKeysDto {
    @IsString({ message: 'Поле p256dh должно быть string' })
    @IsNotEmpty({ message: 'Поле p256dh не может быть пустым' })
    p256dh: string

    @IsString({ message: 'Поле auth должно быть string' })
    @IsNotEmpty({ message: 'Поле auth не может быть пустым' })
    auth: string

}