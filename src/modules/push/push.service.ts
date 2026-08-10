import { Injectable, OnModuleInit } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { PushSubscriptionDB } from "../../database/entities/push/push-subscriptions-db.entity"
import { IReqInfoUser } from "../../global-types/types"
import * as webPush from 'web-push'
import { SubscribePushDTO } from "../DTO/push/push-subscribe.dto"
import { PushUnsubscribeDto } from "../DTO/push/push-unsubscribe.dto"
import { ConfigService } from "@nestjs/config"


@Injectable()
export class PushService implements OnModuleInit {
    constructor(
        @InjectRepository(PushSubscriptionDB) private readonly pushSubscriptionRepository: Repository<PushSubscriptionDB>,
        private readonly configService: ConfigService
    ) {}

    // инициализация WebPush при инициализации модуля
    onModuleInit() {
        const email = this.configService.get<string>('WEB_PUSH_VAPID_EMAIL')!
        const publicKey = this.configService.get<string>('WEB_PUSH_VAPID_PUBLIC_KEY')!
        const privateKey = this.configService.get<string>('WEB_PUSH_VAPID_PRIVATE_KEY')!

        webPush.setVapidDetails(
            email,
            publicKey,
            privateKey,
        )
    }

    // добавляем подписку на пуши
    async subscribePush(req: IReqInfoUser, dto: SubscribePushDTO) {
        // проверяем подписку юзера на уведомления по endpoint
        const existingSubscription = await this.pushSubscriptionRepository.findOne({
            where: {
                endpoint: dto.endpoint
            }
        })

        // если есть, то обновляем ее
        if (existingSubscription) {
            existingSubscription.userId = req.id
            existingSubscription.p256dh = dto.keys.p256dh
            existingSubscription.auth = dto.keys.auth

            await this.pushSubscriptionRepository.save(existingSubscription)

            return
        }

        // если нет, то создаем запись и сохраняем ее
        await this.pushSubscriptionRepository.save({
            endpoint: dto.endpoint,
            p256dh: dto.keys.p256dh,
            auth: dto.keys.auth,
            userId: req.id
        })
    }

    // перед выходом из аккаунта удаляем подписку на пуши
    async unsubscribePush(req: IReqInfoUser, dto: PushUnsubscribeDto) {
        await this.pushSubscriptionRepository.delete({
            endpoint: dto.endpoint,
            userId: req.id
        })
    }
}