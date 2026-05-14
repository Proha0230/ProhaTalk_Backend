import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from "@nestjs/passport"
import type { IReqInfo } from "../../../global-types/types"
import { AllUsersService } from "./all-users.service"
import { IGetCurrentUserDTO } from "../../DTO/all-users/all-users.dto"
import { IUser } from "./types/all-users.types"

@Controller('all-users')
export class AllUsersController {
    constructor(private readonly allUsersService: AllUsersService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    getAllUsers(
        @Req() req: IReqInfo
    ): Promise<Array<IUser>> {
        return this.allUsersService.getAllUsers()
    }

    @Get('get-current')
    @UseGuards(AuthGuard('jwt'))
    getCurrentUsers(
        @Query() dto: IGetCurrentUserDTO,
        @Req() req: IReqInfo
    ): Promise<IUser> {
        return this.allUsersService.getCurrentUsers(dto)
    }
}