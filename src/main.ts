import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:4200',
      'http://127.0.0.1:4200',
      'https://synterra-app.witpoc.com',
      'https://app.synterra.fr',
    ],
  });
  await app.listen(3000);
}
bootstrap();
