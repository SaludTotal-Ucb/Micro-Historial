import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Agregar prefijo /api global.
  app.setGlobalPrefix('api');

  // Habilitar CORS
  app.enableCors({
    origin: ['http://localhost', 'http://127.0.0.1', 'http://localhost:5174', 'http://127.0.0.1:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();
