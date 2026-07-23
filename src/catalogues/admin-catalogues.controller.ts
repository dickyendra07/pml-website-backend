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
import { CataloguesService } from './catalogues.service';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';

const allowedPdfTypes = ['application/pdf'] as const;
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;

@Controller('admin/catalogues')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class AdminCataloguesController {
  constructor(private readonly cataloguesService: CataloguesService) {}

  @Get()
  findAll() {
    return this.cataloguesService.findAllAdmin();
  }

  @Get('requests')
  findRequests() {
    return this.cataloguesService.findRequestsAdmin();
  }

  @Post()
  create(@Body() dto: CreateCatalogueDto) {
    return this.cataloguesService.create(dto);
  }

  @Post('upload-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createSecureDiskStorage('public/uploads/catalogues/files'),
      limits: {
        fileSize: 20 * 1024 * 1024,
        files: 1,
        fields: 2,
        parts: 3,
        fieldNameSize: 100,
        fieldSize: 1024,
      },
      fileFilter: createMimeTypeFilter(allowedPdfTypes),
    }),
  )
  uploadFile(@UploadedFile() uploadedFile: Express.Multer.File | undefined) {
    const file = requireUploadedFile(uploadedFile, 'Catalogue PDF');

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/catalogues/files/${file.filename}`,
    };
  }

  @Post('upload-cover')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createSecureDiskStorage('public/uploads/catalogues/covers'),
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
    const file = requireUploadedFile(uploadedFile, 'Catalogue cover');

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/catalogues/covers/${file.filename}`,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCatalogueDto) {
    return this.cataloguesService.update(id, dto);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.cataloguesService.archive(id);
  }
}
