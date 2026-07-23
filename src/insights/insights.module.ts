import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminInsightsController } from './admin-insights.controller';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [InsightsController, AdminInsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
