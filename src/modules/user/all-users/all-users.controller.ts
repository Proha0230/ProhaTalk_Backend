import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from "@nestjs/passport"
import type { IReqInfo } from "../../../global-types/types"
import { AllUsersService } from "./all-users.service"
import { IGetCurrentUserDTO } from "../../DTO/all-users/all-users.dto"
import { IUser, IUserInAllUsers } from "./types/all-users.types"
import { IGetSearchUsersDTO } from "../../DTO/all-users/get-search-users.dto"

@Controller('api/all-users')
export class AllUsersController {
    constructor(private readonly allUsersService: AllUsersService) {}

    // получение всего списка пользователей
    @Get()
    @UseGuards(AuthGuard('jwt'))
    getAllUsers(): Promise<Array<IUser>> {
        return this.allUsersService.getAllUsers()
    }

    // поиск пользователей
    @Get('search')
    @UseGuards(AuthGuard('jwt'))
    getSearchUsers(
        @Query() dto: IGetSearchUsersDTO
    ) {
        return this.allUsersService.getSearchUsers(dto)
    }


    // получение текущего юзера в карточке поиска пользователей
    @Get('get-current')
    @UseGuards(AuthGuard('jwt'))
    getCurrentUsers(
        @Query() dto: IGetCurrentUserDTO,
        @Req() req: IReqInfo
    ): Promise<IUserInAllUsers> {
        return this.allUsersService.getCurrentUser(dto, req.user)
    }
}