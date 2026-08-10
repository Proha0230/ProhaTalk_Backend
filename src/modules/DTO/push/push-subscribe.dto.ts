import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { PushSubscribeKeysDto } from "./push-subscribe-keys.dto"

export class SubscribePushDTO {
    @IsString({ message: 'Поле endpoint должно быть string' })
    @IsNotEmpty({ message: 'Поле endpoint не может быть пустым' })
    endpoint: string

    // для вложенных объектов делаем отдельное DTO
    // c помощью @ValidateNested()
    @ValidateNested()
    @Type(() => PushSubscribeKeysDto)
    keys: PushSubscribeKeysDto

}