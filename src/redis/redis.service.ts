import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
  }

  getClient() {
    return this.client;
  }

  async ping() {
    if (this.client.status === 'wait') {
      await this.client.connect();
    }

    return this.client.ping();
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, seconds?: number) {
    if (seconds) {
      return this.client.set(key, value, 'EX', seconds);
    }

    return this.client.set(key, value);
  }

  async increment(key: string, seconds?: number) {
    if (this.client.status === 'wait') {
      await this.client.connect();
    }

    const value = await this.client.incr(key);

    if (value === 1 && seconds) {
      await this.client.expire(key, seconds);
    }

    return value;
  }

  async onModuleDestroy() {
    if (this.client.status !== 'end') {
      await this.client.quit();
    }
  }
}
