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
import { CreatePopupDto } from './dto/create-popup.dto';
import { UpdatePopupDto } from './dto/update-popup.dto';
import { PopupsService } from './popups.service';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;

@Controller('admin/popups')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class AdminPopupsController {
  constructor(private readonly popupsService: PopupsService) {}

  @Get()
  findAll() {
    return this.popupsService.findAll();
  }

  @Post()
  create(@Body() dto: CreatePopupDto) {
    return this.popupsService.create(dto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createSecureDiskStorage('public/uploads/popups'),
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
  uploadImage(@UploadedFile() uploadedFile: Express.Multer.File | undefined) {
    const file = requireUploadedFile(uploadedFile, 'Popup image');

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/popups/${file.filename}`,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePopupDto) {
    return this.popupsService.update(id, dto);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.popupsService.archive(id);
  }
}
