import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber } from "class-validator"

export class GetUserAvatarDTO {
    // id
    @Type(() => Number)
    @IsNumber({}, { message: 'Поле id должно быть number' })
    @IsNotEmpty({ message: 'Поле id не может быть пустым' })
    id: number
}