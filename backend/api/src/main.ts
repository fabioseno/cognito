import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;
  app.enableCors();
  await app.listen(port);
  console.log(`App running on port ${port}`)
}
bootstrap();
