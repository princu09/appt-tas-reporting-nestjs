import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { existsSync, mkdirSync } from 'fs';
import Helmet from 'helmet';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis-io.adpater';
import { ValidatorModule } from './validator/validator.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    bodyParser: false, // We handle this with a middleware function, stripe and other apis need the RAW body
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      ...(process.env?.FORBID_NON_WHITELISTED && {
        forbidNonWhitelisted: true,
      }),
    }),
  );
  app.use(cookieParser());
  app.use(Helmet());

  if (!process.env.IS_PRODUCTION) {
    app.enableCors({
      origin: [
        'http://localhost',
        'http://localhost:3000',
        'https://stage-frontend-transatlantic.ontheappt.cloud',
        'https://dev-frontend-transatlantic.ontheappt.cloud',
      ],
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: [
        'https://prod-frontend-transatlantic.ontheappt.cloud',
        'http://prod-frontend-transatlantic.ontheappt.cloud',
      ],
      credentials: true,
    });
  }

  useContainer(app.select(ValidatorModule), { fallbackOnErrors: true });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Check tmp file exists
  if (!existsSync(process.env.TMP_FILE_PATH)) {
    mkdirSync(process.env.TMP_FILE_PATH);
  }

  // Listen for pm2 exits
  app.enableShutdownHooks();

  // Set the websocket adapter
  app.useWebSocketAdapter(new RedisIoAdapter(app));

  if (!process.env.SWAGGER_DOCS_OFF) {
    const config = new DocumentBuilder()
      .setTitle('Transatlantic API')
      .setDescription(
        `<h4>Every endpoint apart from the <strong>/authentication</strong> endpoints will require 3 things:
       <br>
        - Api token return to you by the <strong>/authentication/login</strong> endpoint
        <br>
        - A 'orgId' parameter - This is the id of an organisation passed to you from the <strong>/authentication/login</strong> endpoint 
        <br>
        - A 'siteId' parameter (Optional when the organisation has no site ID attached to it) - This is the id of an site passed to you from the <strong>/authentication/login</strong> endpoint</h4>`,
      )
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  //admin.initializeApp({
  //credential: admin.credential.applicationDefault(),
  //})

  await app.listen(3000);
}
bootstrap();
