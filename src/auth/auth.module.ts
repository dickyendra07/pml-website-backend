import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

function resolveJwtSecret(config: ConfigService) {
  const environment = config.get<string>('NODE_ENV') || 'development';
  const configuredSecret = config.get<string>('JWT_SECRET')?.trim();

  if (configuredSecret) {
    if (environment === 'production' && configuredSecret.length < 32) {
      throw new Error(
        'JWT_SECRET must contain at least 32 characters in production.',
      );
    }

    return configuredSecret;
  }

  if (environment === 'production') {
    throw new Error('JWT_SECRET is required in production.');
  }

  return 'pml-local-development-secret-only';
}

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: resolveJwtSecret(config),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ||
            '8h') as SignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
