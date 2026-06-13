import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class ChatsGetVoiceMessageDto {
    @Type(() => String)
    @IsNotEmpty({ message: 'voice не может быть пустым' })
    voice: string

    // login user'a отправившего сообщение
    @Type(() => String)
    @IsNotEmpty({ message: 'uS не может быть пустым' })
    uS: string
}