import { ArgumentMetadata, Injectable, ValidationPipe,} from '@nestjs/common'
import { WsException } from '@nestjs/websockets'

@Injectable()
export class WsValidationPipe extends ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            transform: true,
            exceptionFactory: (errors) => {
                console.log("error", errors)
                return new WsException(errors.map(err => err.constraints))
            }
        })
    }
}