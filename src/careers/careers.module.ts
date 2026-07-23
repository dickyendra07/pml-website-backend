import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminCareersController } from './admin-careers.controller';
import { CareersController } from './careers.controller';
import { CareersService } from './careers.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CareersController, AdminCareersController],
  providers: [CareersService],
})
export class CareersModule {}
