import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  createMimeTypeFilter,
  createSecureDiskStorage,
  requireUploadedFile,
} from '../common/upload/upload-security';
import { CreateInsightDto } from './dto/create-insight.dto';
import { UpdateInsightDto } from './dto/update-insight.dto';
import { InsightsService } from './insights.service';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;

@Controller('admin/insights')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class AdminInsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  findAll() {
    return this.insightsService.findAllAdmin();
  }

  @Post()
  create(@Body() dto: CreateInsightDto) {
    return this.insightsService.create(dto);
  }

  @Post('upload-cover')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createSecureDiskStorage('public/uploads/insights/covers'),
      limits: {
        fileSize: 8 * 1024 * 1024,
        files: 1,
        fields: 2,
        parts: 3,
        fieldNameSize: 100,
        fieldSize: 1024,
      },
      fileFilter: createMimeTypeFilter(allowedImageTypes),
    }),
  )
  uploadCover(@UploadedFile() uploadedFile: Express.Multer.File | undefined) {
    const file = requireUploadedFile(uploadedFile, 'Insight cover');

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/insights/covers/${file.filename}`,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInsightDto) {
    return this.insightsService.update(id, dto);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.insightsService.archive(id);
  }
}
