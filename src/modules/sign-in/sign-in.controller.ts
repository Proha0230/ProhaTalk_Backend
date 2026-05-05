import { Body, Controller, Post, Get, Headers, BadRequestException } from '@nestjs/common'
import { SignInService } from './sign-in.service'
import { SignInDto } from "../DTO/sign-in/sign-in.dto"

@Controller('sign-in')
export class SignInController {
    constructor(private readonly authService: SignInService) {}

    @Post()
    signUp(
        @Body() dto: SignInDto
    ): Promise<{ message: string, jwt: string }> {
        return this.authService.SignUp(dto)
    }

}