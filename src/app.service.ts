import { Injectable } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';

type ServiceStatus = 'ok' | 'error';

type ServiceCheck = {
  status: ServiceStatus;
  responseTimeMs: number;
};

type HealthCheckResult = {
  status: ServiceStatus;
  service: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  checks: {
    api: ServiceCheck;
    database: ServiceCheck;
    redis: ServiceCheck;
  };
};

type PublicHealthResult = {
  status: 'operational' | 'degraded';
  checkedAt: string;
  services: {
    website: 'operational';
    backend: 'operational';
    database: 'operational' | 'unavailable';
    caching: 'operational' | 'unavailable';
  };
};

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  getApiInfo() {
    return {
      name: 'Pharma Metric Labs API',
      service: 'pml-cms-api',
      status: 'running',
      version: '0.1.0',
      standard: 'NestJS backend for Kalbe corporate project',
      endpoints: {
        health: '/api/health',
        publicHealth: '/api/health/public',
        proposals: '/api/proposals',
      },
    };
  }

  private async checkServices() {
    const databaseStartedAt = performance.now();
    let databaseStatus: ServiceStatus = 'error';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      databaseStatus = 'ok';
    } catch {
      databaseStatus = 'error';
    }

    const databaseResponseTime =
      Math.round((performance.now() - databaseStartedAt) * 100) / 100;

    const redisStartedAt = performance.now();
    let redisStatus: ServiceStatus = 'error';

    try {
      const response = await this.redis.ping();
      redisStatus = response === 'PONG' ? 'ok' : 'error';
    } catch {
      redisStatus = 'error';
    }

    const redisResponseTime =
      Math.round((performance.now() - redisStartedAt) * 100) / 100;

    return {
      database: {
        status: databaseStatus,
        responseTimeMs: databaseResponseTime,
      },
      redis: {
        status: redisStatus,
        responseTimeMs: redisResponseTime,
      },
    };
  }

  async getHealth(): Promise<HealthCheckResult> {
    const checks = await this.checkServices();

    const isHealthy =
      checks.database.status === 'ok' && checks.redis.status === 'ok';

    return {
      status: isHealthy ? 'ok' : 'error',
      service: 'pml-cms-api',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      checks: {
        api: {
          status: 'ok',
          responseTimeMs: 0,
        },
        database: checks.database,
        redis: checks.redis,
      },
    };
  }

  async getPublicHealth(): Promise<PublicHealthResult> {
    const checks = await this.checkServices();

    const databaseOperational = checks.database.status === 'ok';
    const cachingOperational = checks.redis.status === 'ok';
    const allOperational = databaseOperational && cachingOperational;

    return {
      status: allOperational ? 'operational' : 'degraded',
      checkedAt: new Date().toISOString(),
      services: {
        website: 'operational',
        backend: 'operational',
        database: databaseOperational ? 'operational' : 'unavailable',
        caching: cachingOperational ? 'operational' : 'unavailable',
      },
    };
  }
}
