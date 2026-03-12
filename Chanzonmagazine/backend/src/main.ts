import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'https://chazonmagazine.com',
      process.env.DASHBOARD_URL || 'https://admin.chazonmagazine.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  )

  app.setGlobalPrefix('api')

  const port = process.env.PORT || 4444
  await app.listen(port)
  console.log(`🚀 Chanzon Backend running on https://api.chazonmagazine.com:${port}/api`)
}

bootstrap()
