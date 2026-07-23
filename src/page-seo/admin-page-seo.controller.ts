import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdatePageSeoDto } from './dto/update-page-seo.dto';
import { PageSeoService } from './page-seo.service';

@Controller('admin/page-seo')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class AdminPageSeoController {
  constructor(private readonly pageSeoService: PageSeoService) {}

  @Get()
  findAll() {
    return this.pageSeoService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePageSeoDto) {
    return this.pageSeoService.update(id, dto);
  }

  @Post('seed-defaults')
  seedDefaults() {
    return this.pageSeoService.seedDefaults();
  }
}
