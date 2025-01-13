import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4000);

  //Habilitando globalmente a validacao de dados
  app.useGlobalPipes(new ValidationPipe());

  //Habilitando o CORS na aplicação
  app.enableCors(); 

}
bootstrap();

