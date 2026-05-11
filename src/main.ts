import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Удаляет лишние поля
    transform: true, // @Type(() => Boolean) преобразования к нужному типу в DTO.
  }))

  // разрешаем корсы для клиент фронта http://localhost:3000
  app.enableCors({
    origin: 'http://localhost:3000',
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

  await app.listen(process.env.PORT ?? 3000)

  console.log('Server started on port', process.env.PORT ?? 3000)
}

bootstrap()
