import { Body, Controller, Post } from '@nestjs/common'
import { SignUpService } from './sign-up.service'
import { SignUpDto } from "../DTO/sign-up/sign-up.dto"

@Controller('api/sign-up')
export class SignUpController {
    constructor(private readonly signInService: SignUpService) {}

    @Post('/create')
    signUp(
        @Body() dto: SignUpDto
    ): Promise<{ message: string }> {
        return this.signInService.createUser(dto)
    }

}