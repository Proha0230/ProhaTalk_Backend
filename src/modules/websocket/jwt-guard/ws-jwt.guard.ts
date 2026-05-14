import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor( private readonly jwtService: JwtService ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient()
        // здесь лежит auth-token который мы передаем на клиенте
        // const socket = io('ws://localhost:3001/user-chat', {
        //     auth: {
        //         token: 'JWT_TOKEN'
        //     }
        // })
        const token = client.handshake?.auth?.token || client.handshake?.headers?.authorization

        if (!token) {
            throw new UnauthorizedException()
        }

        try {
            client.user = await this.jwtService.verifyAsync(token)
            return true
        } catch {
            throw new UnauthorizedException()
        }
    }
}