import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminHomepageFeaturesController } from './admin-homepage-features.controller';
import { HomepageFeaturesController } from './homepage-features.controller';
import { HomepageFeaturesService } from './homepage-features.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [HomepageFeaturesController, AdminHomepageFeaturesController],
  providers: [HomepageFeaturesService],
})
export class HomepageFeaturesModule {}
