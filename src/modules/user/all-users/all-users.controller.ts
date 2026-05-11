import { Body, Controller, Post, Get, Headers, UseGuards, Req, Res } from '@nestjs/common'
import { AuthGuard } from "@nestjs/passport"
import type { IReqInfo } from "../../../global-types/types"
import { AllUsersService } from "./all-users.service"

@Controller('all-users')
export class AllUsersController {
    constructor(private readonly allUsersService: AllUsersService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    getAllUsers(
        @Req() req: IReqInfo
    ) {
        return this.allUsersService.getAllUsers()
    }
}