import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { LegalPagesService } from './legal-pages.service';
import { UpdateLegalPageDto } from './dto/update-legal-page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller()
export class LegalPagesController {
  constructor(
    private readonly service: LegalPagesService,
  ) {}

  // Public legal pages
  @Get('legal-pages/:type')
  findPublic(
    @Param('type') type: string,
  ) {
    return this.service.findPublic(type);
  }


  // Admin CMS legal pages
  @Get('admin/legal-pages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  findAll() {
    return this.service.findAll();
  }


  @Patch('admin/legal-pages/:type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  update(
    @Param('type') type: string,
    @Body() dto: UpdateLegalPageDto,
  ) {
    return this.service.update(type, dto);
  }
}
