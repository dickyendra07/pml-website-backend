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
import { CreateHomepageFeatureDto } from './dto/create-homepage-feature.dto';
import { UpdateHomepageFeatureDto } from './dto/update-homepage-feature.dto';
import { HomepageFeaturesService } from './homepage-features.service';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;

@Controller('admin/homepage-features')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class AdminHomepageFeaturesController {
  constructor(
    private readonly homepageFeaturesService: HomepageFeaturesService,
  ) {}

  @Get()
  findAll() {
    return this.homepageFeaturesService.findAllAdmin();
  }

  @Post()
  create(@Body() dto: CreateHomepageFeatureDto) {
    return this.homepageFeaturesService.create(dto);
  }

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createSecureDiskStorage('public/uploads/homepage-features'),
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
    const file = requireUploadedFile(uploadedFile, 'Homepage feature image');

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/homepage-features/${file.filename}`,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHomepageFeatureDto) {
    return this.homepageFeaturesService.update(id, dto);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.homepageFeaturesService.archive(id);
  }
}
