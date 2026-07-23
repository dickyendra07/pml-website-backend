import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';

describe('AppController', () => {
  let appController: AppController;

  const prismaMock = {
    $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
  };

  const redisMock = {
    ping: jest.fn().mockResolvedValue('PONG'),
  };

  const jwtAuthGuardMock = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: RedisService,
          useValue: redisMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(jwtAuthGuardMock)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('api info', () => {
    it('should return API info', () => {
      expect(appController.getApiInfo()).toMatchObject({
        name: 'Pharma Metric Labs API',
        service: 'pml-cms-api',
        status: 'running',
      });
    });
  });

  describe('health', () => {
    it('should return health status', async () => {
      const result = await appController.getHealth();

      expect(result.status).toBe('ok');
      expect(result.service).toBe('pml-cms-api');
      expect(result.checks.api.status).toBe('ok');
      expect(result.checks.database.status).toBe('ok');
      expect(result.checks.redis.status).toBe('ok');

      expect(typeof result.checks.api.responseTimeMs).toBe('number');
      expect(typeof result.checks.database.responseTimeMs).toBe('number');
      expect(typeof result.checks.redis.responseTimeMs).toBe('number');

      expect(typeof result.timestamp).toBe('string');
      expect(result.uptimeSeconds).toBeGreaterThanOrEqual(0);
    });
  });
});
