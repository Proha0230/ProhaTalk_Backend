import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from "@nestjs/passport"
import type { IReqInfo } from "../../../global-types/types"
import { AllUsersService } from "./all-users.service"
import { IGetCurrentUserDTO } from "../../DTO/all-users/all-users.dto"
import { IUser, IUserInAllUsers } from "./types/all-users.types"

@Controller('api/all-users')
export class AllUsersController {
    constructor(private readonly allUsersService: AllUsersService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    getAllUsers(
    ): Promise<Array<IUser>> {
        return this.allUsersService.getAllUsers()
    }

    @Get('get-current')
    @UseGuards(AuthGuard('jwt'))
    getCurrentUsers(
        @Query() dto: IGetCurrentUserDTO,
        @Req() req: IReqInfo
    ): Promise<IUserInAllUsers> {
        return this.allUsersService.getCurrentUser(dto, req.user)
    }
}