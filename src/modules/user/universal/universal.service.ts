import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UsersDB } from "../../../database/entities/users/users-db.entity"
import { Repository } from "typeorm"
import { IUser } from "../all-users/types/all-users.types"
import { FriendsRequestsDB } from "../../../database/entities/friends/friends-request-db.entity"
import { FriendsUsersDB } from "../../../database/entities/friends/friends-users-db.entity"
import * as fs from 'fs'
import * as path from 'path'
import { ConfigService } from "@nestjs/config"
import { randomUUID } from 'crypto'
import sharp from 'sharp'

@Injectable()
export class UniversalService {
    constructor(
        @InjectRepository(UsersDB) private readonly usersRepository: Repository<UsersDB>,
        @InjectRepository(FriendsRequestsDB) private readonly friendsRequestsRepository: Repository<FriendsRequestsDB>,
        @InjectRepository(FriendsUsersDB) private readonly friendsUsersRepository: Repository<FriendsUsersDB>,
        private readonly configService: ConfigService
    ) {}

    // нахождение и проверка существования юзера
    async universalCheckingUserExistence({ userId, userLogin }: { userId?: number, userLogin?: string }): Promise<IUser | null> {
        const userIdOrUserLogin = userLogin ? { login: userLogin } : { id: userId }

        return await this.usersRepository.findOne({
            where: userIdOrUserLogin,
            // select - выбираем то что конкретно нам отдаст БД в ответе
            select: {
                id: true,
                login: true,
                name: true,
                lastname: true,
                status: true,
                lastSeen: true,
                avatar: true
            }
        })
    }

    // проверка наличия отправленной заявки на добавление в контакты
    async universalCheckingSubmittedRequestToAddContacts(senderId: number, receiverId: number): Promise<boolean> {
        const isSubmittedRequestToAddContacts = await this.friendsRequestsRepository.findOne({
            where: {
                senderId: senderId,
                receiverId: receiverId
            }
        })

        return !!isSubmittedRequestToAddContacts
    }

    // проверяем дружбу между юзерами
    async universalCheckingFriendship(userOneId: number, userTwoId: number): Promise<boolean> {
        const isUserFriend = await this.friendsUsersRepository.findOne({
            where: {
                userId: userOneId,
                friendId: userTwoId
            }
        })

        return !!isUserFriend
    }

    async universalSharpCompressImage(file: Express.Multer.File): Promise<Buffer> {
            return await sharp(file.buffer)
                .resize({ width: 1280, withoutEnlargement: true }) // если картинка меньше 1200px,
                // то не будет увеличивать ее до 1200px - withoutEnlargement: true, а если больше - уменьшит до 1200px
                .webp({ quality: 85 }) // преобразует файл изображения в .webp и оставляет 85% качества
                .toBuffer() // возвращает buffer для записи в БД (SSD)
    }

    //TODO создание из blob файл изображения и сохранение его в БД (SSD)
    // шпаргалка - type a - avatar, type mi - massage-image
    async universalCreateBlobImageInDB(userID: number, type: "a" | "mi", file: Express.Multer.File): Promise<{ fileName: string }> {
        let directoryName = type === "a" ? "AvatarImageDB" : "MessageImageDB"

        // строим путь до наших БД (SSD) с аватарами - STORAGE_PATH + directoryName
        const rootPath = path.resolve(this.configService.get<string>('STORAGE_PATH')!, directoryName)

        // папка пользователя с его userID
        const userDirectoryPath = path.join(rootPath, String(userID))

        // создаём директорию в БД (SSD) "AvatarDB" если ее нет
        if (!fs.existsSync(rootPath)) {
            fs.mkdirSync(rootPath, {
                // создай ВСЕ недостающие папки по пути т.к. нода сама не умеет создавать целую цепочку папок
                recursive: true
            })
        }

        // создаём папку с аватаром пользователя если ее нет
        if (!fs.existsSync(userDirectoryPath)) {
            fs.mkdirSync(userDirectoryPath, {
                // создай ВСЕ недостающие папки по пути т.к. нода сама не умеет создавать целую цепочку папок
                recursive: true
            })
        }

        // проверяем файл на его тип - если не png и не jpeg → ошибка
        if (!file.mimetype.includes('png') && !file.mimetype.includes('jpeg')) {
            throw new BadRequestException('Файл загруженный вами не поддерживается')
        }

        const compressFile = await this.universalSharpCompressImage(file)
        // создаем имя файла если это сообщение то в названии указываем его id, а если его нет значит это аватар
        const fileName = `${randomUUID()}.webp`

        // полный путь до файла
        const filePath = path.join(userDirectoryPath, fileName)

        // запись файла ассинхронная - writeFileSync() - нельзя блокировать поток!
        await fs.promises.writeFile(filePath, compressFile)

        // возвращаем название файла и записываем его в MySQL
        return {
            fileName: fileName
        }
    }

    //TODO создание аудио файла в БД (SSD) из blob
    async universalCreateBlobVoiceInDB(userID: number, file: Express.Multer.File): Promise<{ fileName: string }> {
        let directoryName = "MessageVoiceDB"

        // строим путь до наших БД (SSD) с аудио записями или изображениями - STORAGE_PATH + directoryName
        const rootPath = path.resolve(this.configService.get<string>('STORAGE_PATH')!, directoryName)

        // папка пользователя с его userID
        const userDirectoryPath = path.join(rootPath, String(userID))

        // создаём "MessageVoiceDB"
        if (!fs.existsSync(rootPath)) {
            fs.mkdirSync(rootPath, {
                // создай ВСЕ недостающие папки по пути т.к. нода сама не умеет создавать целую цепочку папок
                recursive: true
            })
        }

        // создаём папку пользователя если нет
        if (!fs.existsSync(userDirectoryPath)) {
            fs.mkdirSync(userDirectoryPath, {
                // создай ВСЕ недостающие папки по пути т.к. нода сама не умеет создавать целую цепочку папок
                recursive: true
            })
        }

        // определяем расширение файла голосовой записи - если не webm то кидаем ошибку
        if (!file.mimetype.includes('webm')) {
            throw new BadRequestException('Файл загруженный вами не поддерживается')
        }

        // создаем имя файла
        const fileName = `${randomUUID()}.webm`

        // полный путь до файла
        const filePath = path.join(userDirectoryPath, fileName)

        // запись файла
        await fs.promises.writeFile(filePath, file.buffer)

        // возвращаем название файла и записываем его в MySQL
        return {
            fileName: fileName
        }
    }

    //TODO получение File аудио/изображение файла из БД (SSD) отдельным запросом
    // по каждому айтему отдельно загружаем и возвращаем поток
    // шпаргалка - type a - avatar, type mi - massage-image, type mv - massage-voice
    async getBlobFileInDB(userId: number, fileName: string, type: "a" | "mi" | "mv"): Promise<fs.ReadStream> {
        let directoryName = ""

        switch (type) {
            case "a":
                directoryName = "AvatarImageDB"
                break
            case "mi":
                directoryName = "MessageImageDB"
                break
            case "mv":
                directoryName = "MessageVoiceDB"
                break
        }

        // получаем путь до нашего изображения или аудио
        const fullPath = path.join(this.configService.get<string>('STORAGE_PATH')!, directoryName, userId.toString(), fileName)

        if (!fs.existsSync(fullPath)) {
            throw new NotFoundException('Файл не найден')
        }

        return fs.createReadStream(fullPath)

        // в контроллере отдаем стрим пайпы
        // @Get('audio/:id')
        // async getAudio(
        //     @Param('id') id: string,
        //     @Res() res: Response
        // ) {
        // const stream = await this.universalServie.getBlobFileInDB(path)
        //
        // res.contentType('audio/webm')
        // или для изображений
        // res.contentType('image/webp')
        //
        // stream.pipe(res)
        // }
    }
}