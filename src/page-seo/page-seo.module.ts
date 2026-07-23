import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminPageSeoController } from './admin-page-seo.controller';
import { PageSeoController } from './page-seo.controller';
import { PageSeoService } from './page-seo.service';

@Module({
  imports: [AuthModule],
  controllers: [PageSeoController, AdminPageSeoController],
  providers: [PageSeoService],
  exports: [PageSeoService],
})
export class PageSeoModule {}
