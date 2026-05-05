import { Body, Controller, Post, Get, Headers, BadRequestException } from '@nestjs/common'
import { SignUpService } from './sign-up.service'
import { SignUpDto } from "../DTO/sign-up/sign-up.dto"
import { UsersDB } from "../../database/entities/users/users-db.entity"

@Controller('sign-up')
export class SignUpController {
    constructor(private readonly signInService: SignUpService) {}

    @Post('/create')
    signUp(
        @Body() dto: SignUpDto
    ): Promise<{ message: string }> {
        return this.signInService.createUser(dto)
    }

}