import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { accessSync, constants, mkdirSync } from 'fs';
import { join, resolve } from 'path';

function prepareUploadsStorage() {
  const uploadsDirectory = resolve(process.cwd(), 'public/uploads');
  const railwayProjectId = process.env.RAILWAY_PROJECT_ID?.trim();
  const railwayVolumePath = process.env.RAILWAY_VOLUME_MOUNT_PATH?.trim();

  if (railwayProjectId && !railwayVolumePath) {
    throw new Error(
      'A Railway Volume mounted at public/uploads is required for persistent CMS uploads.',
    );
  }

  if (railwayVolumePath && resolve(railwayVolumePath) !== uploadsDirectory) {
    throw new Error(
      `Railway Volume must be mounted at ${uploadsDirectory}; received ${railwayVolumePath}.`,
    );
  }

  mkdirSync(uploadsDirectory, { recursive: true });
  accessSync(uploadsDirectory, constants.R_OK | constants.W_OK);

  return uploadsDirectory;
}

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
  const publicDirectory = join(process.cwd(), 'public');
  const uploadsDirectory = prepareUploadsStorage();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const allowedOrigins = parseCorsOrigins();

  app.setGlobalPrefix('api');

  app.useStaticAssets(uploadsDirectory, {
    prefix: '/uploads',
  });
  app.useStaticAssets(publicDirectory);

  logger.log(`CMS uploads served from ${uploadsDirectory}`);

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.use((_request: Request, response: Response, next: NextFunction) => {
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
  });

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

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',

    allowedHeaders: 'Content-Type,Authorization',

    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 4000);

  logger.log(`Application running on port ${process.env.PORT ?? 4000}`);
}

void bootstrap();
