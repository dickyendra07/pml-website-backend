import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

function parseCorsOrigins() {
  const environment = process.env.NODE_ENV || 'development';
  const rawOrigins = process.env.CORS_ORIGIN?.trim();

  if (!rawOrigins && environment === 'production') {
    throw new Error('CORS_ORIGIN is required in production.');
  }

  return (rawOrigins || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app =
    await NestFactory.create<NestExpressApplication>(AppModule);

  const allowedOrigins = parseCorsOrigins();

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.use(
    (_request: Request, response: Response, next: NextFunction) => {
      response.setHeader('X-Content-Type-Options', 'nosniff');
      response.setHeader('X-Frame-Options', 'DENY');
      response.setHeader('Referrer-Policy', 'no-referrer');

      if (process.env.NODE_ENV === 'production') {
        response.setHeader(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains; preload',
        );
      }

      next();
    },
  );

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = origin.replace(/\/$/, '');

      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      logger.warn(`Blocked CORS origin: ${origin}`);

      callback(null, false);
    },

    credentials: true,

    methods:
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',

    allowedHeaders:
      'Content-Type,Authorization',

    optionsSuccessStatus: 204,
  });

  app.use(
    (request: Request, response: Response, next: NextFunction) => {
      if (request.method === 'OPTIONS') {
        response.sendStatus(204);
        return;
      }

      next();
    },
  );

  app.useStaticAssets(join(process.cwd(), 'public/uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;

  await app.listen(port);

  logger.log(
    `Application running on port ${port}`,
  );
}

bootstrap();
