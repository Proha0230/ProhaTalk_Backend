import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Удаляет лишние поля
    forbidNonWhitelisted: true, // если клиент пришел лишние поля которых не ожидает бэк, то выдаст 400 ошибку
    transform: true, // @Type(() => Boolean) преобразования к нужному типу в DTO.
  }))

  // разрешаем корсы для клиент фронта http://localhost:3000
  app.enableCors({
    origin: [
      process.env.API_URL_DEV_CORS,
      process.env.API_URL_PROD_CORS,
      process.env.API_URL_PROD_WEB_SOCKET_CORD
    ],
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
    credentials: true
  })

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0') // слушаем 127.0.0.1:3001 куда ссылается nginx

  console.log('Server started on port', process.env.PORT ?? 3001)
}

bootstrap()
