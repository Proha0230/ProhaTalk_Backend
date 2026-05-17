import {BadRequestException, Injectable} from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { UsersDB } from "../../database/entities/users/users-db.entity"
import { Repository } from "typeorm"
import { SignUpDto } from "../DTO/sign-up/sign-up.dto"
import * as bcrypt from 'bcrypt'

@Injectable()
export class SignUpService {
    constructor(
        @InjectRepository(UsersDB)
        private readonly usersRepository: Repository<UsersDB>
    ) {}

    async createUser(dto: SignUpDto) {
        const existingUser = await this.usersRepository.findOne({
            where: [
                { email: dto.email },
                { login: dto.login },
            ],
        })

        if (existingUser) {
            throw new BadRequestException(
                'Такой пользователь уже существует',
            )
        }

        // создаем хэшированный пароль 123456 -> $2b$10$kjasdhkjasdh
        const hashedPassword = await bcrypt.hash(
            dto.password,
            10,
        )

        const user = this.usersRepository.create({
            email: dto.email,
            login: dto.login,
            password: hashedPassword,
            acceptedTheTerms: dto.acceptedTheTerms,
            lastSeen: new Date()
        })

        await this.usersRepository.save(user)

        return {
            message: "Вы успешно зарегистрировались"
        }
    }
}