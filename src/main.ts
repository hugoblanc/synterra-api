import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:4200',
      'http://127.0.0.1:4200',
      'https://synterra-api.witpoc.com',
    ],
  });
  await app.listen(3000);
}
bootstrap();
