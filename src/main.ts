import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Agregar prefijo /api global.
  app.setGlobalPrefix('api');

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:5174', // Frontend local
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();
