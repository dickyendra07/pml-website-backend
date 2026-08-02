import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaType, Prisma } from '@prisma/client';
import { unlink } from 'fs/promises';
import { resolve, sep } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizeMediaFolder } from '../common/upload/upload-security';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';

function detectMediaType(mimeType?: string): MediaType {
  if (!mimeType) return MediaType.OTHER;

  if (mimeType.startsWith('image/')) return MediaType.IMAGE;
  if (mimeType === 'application/pdf') return MediaType.DOCUMENT;
  if (mimeType.startsWith('video/')) return MediaType.VIDEO;

  return MediaType.OTHER;
}

async function deletePhysicalMediaFile(url: string) {
  const mediaDirectory = resolve(process.cwd(), 'public/uploads/media');
  const relativeUrl = url.replace(/^\/+/, '');
  const filePath = resolve(process.cwd(), 'public', relativeUrl);

  if (!filePath.startsWith(`${mediaDirectory}${sep}`)) {
    return;
  }

  try {
    await unlink(filePath);
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException;

    if (fileError.code !== 'ENOENT') {
      throw error;
    }
  }
}

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(type?: string, folder?: string) {
    return this.prisma.mediaAsset.findMany({
      where: {
        ...(type ? { type: type as MediaType } : {}),
        ...(folder ? { folder } : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  async createFromUpload(file: Express.Multer.File, folder = 'general') {
    const url = `/uploads/media/${file.filename}`;

    return this.prisma.mediaAsset.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url,
        type: detectMediaType(file.mimetype),
        folder: sanitizeMediaFolder(folder),
      },
    });
  }

  async update(id: string, dto: UpdateMediaAssetDto) {
    const existing = await this.prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Media asset not found.');
    }

    const data: Prisma.MediaAssetUpdateInput = {};

    if (dto.altText !== undefined) data.altText = dto.altText;
    if (dto.caption !== undefined) data.caption = dto.caption;
    if (dto.folder !== undefined) {
      data.folder = sanitizeMediaFolder(dto.folder);
    }
    if (dto.type !== undefined) data.type = dto.type;

    return this.prisma.mediaAsset.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Media asset not found.');
    }

    await deletePhysicalMediaFile(existing.url);

    await this.prisma.mediaAsset.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Media asset and physical file deleted successfully.',
    };
  }
}
