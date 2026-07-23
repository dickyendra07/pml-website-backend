import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AdminPopupsController } from './admin-popups.controller';
import { PopupsController } from './popups.controller';
import { PopupsService } from './popups.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PopupsController, AdminPopupsController],
  providers: [PopupsService],
})
export class PopupsModule {}
