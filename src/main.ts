import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from './common/logging.interceptor.js';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter.js';
import { AllExceptionsFilter } from './common/all-exceptions.filter.js';




async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new PrismaExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Institucion Educativa')
    .setDescription('API Istitucion Educativa en Nest')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document, {
    swaggerOptions:{
      operationsSorter: 'method',
      tagsSorter:'alpha'
    }
  });

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT')!);
}
await bootstrap();
