import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  sanitizeMediaFolder,
} from '../common/upload/upload-security';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';
import { MediaService } from './media.service';

const allowedMediaTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'video/mp4',
] as const;

@Controller('admin/media')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class AdminMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  findAll(@Query('type') type?: string, @Query('folder') folder?: string) {
    return this.mediaService.findAll(type, folder);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createSecureDiskStorage('public/uploads/media'),
      limits: {
        fileSize: 20 * 1024 * 1024,
        files: 1,
        fields: 5,
        parts: 6,
        fieldNameSize: 100,
        fieldSize: 1024,
      },
      fileFilter: createMimeTypeFilter(allowedMediaTypes),
    }),
  )
  upload(
    @UploadedFile() uploadedFile: Express.Multer.File | undefined,
    @Body('folder') folder?: string,
  ) {
    const file = requireUploadedFile(uploadedFile);

    return this.mediaService.createFromUpload(
      file,
      sanitizeMediaFolder(folder),
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMediaAssetDto) {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
