import { IsString, IsNotEmpty, MinLength } from 'class-validator'
import { Type } from 'class-transformer'

// отправка голосовых сообщений
// $socket.value?.emit('send-voice-message', {
//     id: +contactId, // id кому отправляем голосовое сообщение
//     idM: response.data.idM, // id message
//     mV: response.data.mV // messageValue
// })

export class ChatsSendVoiceMessageDto {
    // value сообщения (название файла в БД (SSD))
    @Type(() => String)
    @IsString({ message: 'mV должен быть string' })
    @MinLength(1, { message: "mV должен быть минимум из 1 символа"})
    @IsNotEmpty({ message: 'mV не может быть пустым' })
    mV: string

    // id Сообщения
    @Type(() => Number)
    @IsNotEmpty({ message: 'idM не может быть пустым' })
    idM: number

    // id юзера кому отправили сообщение
    @Type(() => Number)
    @IsNotEmpty({ message: 'id не может быть пустым' })
    id: number
}