import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // use global validation pipe for all routes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // it will ignore any properties that are not defined in the DTO
      forbidNonWhitelisted: true, // it will throw an error if there are any properties that are not defined in the DTO
      transform: true, // it will automatically transform the payload to the DTO class instance
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
