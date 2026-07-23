import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateProposalNoteDto } from './dto/update-proposal-note.dto';
import { UpdateProposalStatusDto } from './dto/update-proposal-status.dto';
import { ProposalsService } from './proposals.service';

@Controller('admin/proposals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'VIEWER')
export class AdminProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get()
  findAll() {
    return this.proposalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proposalsService.findOne(id);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'ADMIN')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateProposalStatusDto) {
    return this.proposalsService.updateStatus(id, dto.status);
  }

  @Patch(':id/internal-note')
  @Roles('SUPER_ADMIN', 'ADMIN')
  updateInternalNote(
    @Param('id') id: string,
    @Body() dto: UpdateProposalNoteDto,
  ) {
    return this.proposalsService.updateInternalNote(id, dto.internalNote);
  }

  @Patch(':id/spam')
  @Roles('SUPER_ADMIN', 'ADMIN')
  markAsSpam(@Param('id') id: string) {
    return this.proposalsService.markAsSpam(id);
  }
}
