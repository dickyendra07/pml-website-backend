import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LegalPagesController } from './legal-pages.controller';
import { LegalPagesService } from './legal-pages.service';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [
    LegalPagesController,
  ],
  providers: [
    LegalPagesService,
  ],
})
export class LegalPagesModule {}
