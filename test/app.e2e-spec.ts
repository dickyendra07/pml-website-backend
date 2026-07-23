import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';

type ApiInformationResponse = {
  name: string;
};

type HealthResponse = {
  status: string;
  checks: {
    api: {
      status: string;
    };
    database: {
      status: string;
    };
    redis: {
      status: string;
    };
  };
};

type LoginResponse = {
  accessToken: string;
  user: {
    email: string;
  };
};

type ErrorResponse = {
  message: string;
};

type ProposalResponse = {
  success: boolean;
  id: string;
};

function getResponseBody<T>(response: { body: unknown }): T {
  return response.body as T;
}

describe('PML API (e2e)', () => {
  const adminEmail = 'e2e-admin@pharmametriclabs.com';
  const adminCredential = 'E2E-Strong-Password-2026!';
  const invalidAdminCredential = 'incorrect-password';
  const proposalEmail = 'e2e-proposal@example.com';

  let app: INestApplication<App>;
  let prisma: PrismaService;
  let redis: RedisService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);
    redis = app.get(RedisService);

    await redis.ping();
    await redis.getClient().flushdb();

    const passwordHash = await bcrypt.hash(adminCredential, 4);

    await prisma.adminUser.upsert({
      where: {
        email: adminEmail,
      },
      update: {
        name: 'E2E Administrator',
        passwordHash,
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
      },
      create: {
        name: 'E2E Administrator',
        email: adminEmail,
        passwordHash,
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
      },
    });
  });

  beforeEach(async () => {
    await redis.getClient().flushdb();
  });

  afterAll(async () => {
    await prisma.proposalSubmission.deleteMany({
      where: {
        email: proposalEmail,
      },
    });

    await prisma.adminUser.deleteMany({
      where: {
        email: adminEmail,
      },
    });

    await redis.getClient().flushdb();
    await app.close();
  });

  it('GET /api returns API information', async () => {
    const response = await request(app.getHttpServer()).get('/api').expect(200);

    const body = getResponseBody<ApiInformationResponse>(response);

    expect(typeof body.name).toBe('string');
  });

  it('GET /api/health/public reports public service status', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/health/public')
      .expect(200);

    const body = getResponseBody<HealthResponse>(response);

    expect(['operational', 'degraded']).toContain(body.status);
    expect(body.checks.api.status).toBe('ok');
  });

  it('rejects unauthenticated access to detailed health status', async () => {
    await request(app.getHttpServer()).get('/api/health').expect(401);
  });

  it('rejects an invalid admin password', async () => {
    await request(app.getHttpServer())
      .post('/api/admin/auth/login')
      .send({
        email: adminEmail,
        password: invalidAdminCredential,
      })
      .expect(401);
  });

  it('logs in an active administrator', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/admin/auth/login')
      .send({
        email: adminEmail,
        password: adminCredential,
      })
      .expect(201);

    const body = getResponseBody<LoginResponse>(response);

    expect(typeof body.accessToken).toBe('string');
    expect(body.user.email).toBe(adminEmail);

    accessToken = body.accessToken;
  });

  it('rejects a protected route without a bearer token', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/admin/settings')
      .expect(401);

    const body = getResponseBody<ErrorResponse>(response);

    expect(body.message).toBe('Missing authorization token.');
  });

  it('allows an authenticated administrator to access a protected route', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/admin/auth/login')
      .send({
        email: adminEmail,
        password: adminCredential,
      })
      .expect(201);

    const loginBody = getResponseBody<LoginResponse>(loginResponse);

    accessToken = loginBody.accessToken;

    await request(app.getHttpServer())
      .get('/api/admin/settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('creates a valid proposal submission', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/proposals')
      .send({
        name: 'E2E Proposal',
        company: 'PML E2E Test',
        email: proposalEmail,
        phone: '+628123456789',
        country: 'Indonesia',
        serviceType: 'Clinical Trial',
        projectNeeds: 'Automated end-to-end testing request.',
        sourcePage: '/e2e-test',
      })
      .expect(201);

    const body = getResponseBody<ProposalResponse>(response);

    expect(body.success).toBe(true);
    expect(typeof body.id).toBe('string');
  });

  it('rate limits proposal submissions after five requests', async () => {
    const payload = {
      name: 'E2E Rate Limit',
      company: 'PML E2E Test',
      email: proposalEmail,
      serviceType: 'Contract Analysis',
      projectNeeds: 'Automated rate-limit verification.',
      sourcePage: '/e2e-rate-limit',
    };

    for (let requestNumber = 1; requestNumber <= 5; requestNumber += 1) {
      await request(app.getHttpServer())
        .post('/api/proposals')
        .send(payload)
        .expect(201);
    }

    await request(app.getHttpServer())
      .post('/api/proposals')
      .send(payload)
      .expect(429);
  });
});
