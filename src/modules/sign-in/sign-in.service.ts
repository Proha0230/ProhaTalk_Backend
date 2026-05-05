import {BadRequestException, Injectable} from '@nestjs/common'
import { Repository } from "typeorm"
import { UsersDB } from "../../database/entities/users/users-db.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { SignInDto } from "../DTO/sign-in/sign-in.dto"
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class SignInService {
    constructor(
        @InjectRepository(UsersDB)
        private readonly usersRepository: Repository<UsersDB>,
        private readonly jwtService: JwtService
    ) {}

    async SignUp(dto: SignInDto): Promise<{ message: string, jwt: string }> {
        const user = await this.usersRepository.findOne({
            where: {
                login: dto.login,
            }
        })

        if (!user) {
            throw new BadRequestException('Неверный логин или пароль',)
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password,
        )

        if (!isPasswordValid) {
            throw new BadRequestException('Неверный логин или пароль',)
        } else {
            const accessToken = this.jwtService.sign({
                id: user.id,
                login: user.login,
            })

            return { message: "Вы успешно авторизовались!", jwt: accessToken }
        }
    }
}