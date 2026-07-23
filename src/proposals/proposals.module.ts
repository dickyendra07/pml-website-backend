import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminProposalsController } from './admin-proposals.controller';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';

@Module({
  imports: [AuthModule],
  controllers: [ProposalsController, AdminProposalsController],
  providers: [ProposalsService],
})
export class ProposalsModule {}
