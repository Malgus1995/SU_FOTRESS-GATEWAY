import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
    ],
    credentials: true,
  });

  const config =
    new DocumentBuilder()
      .setTitle(
        'Fortress Gateway API',
      )
      .setDescription(
        'Realtime Fortress Gateway Server',
      )
      .setVersion('1.0')
      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'swagger',
    app,
    document,
  );

  await app.listen(3000);

  console.log(`
Swagger:
http://localhost:3000/swagger
`);
}

bootstrap();