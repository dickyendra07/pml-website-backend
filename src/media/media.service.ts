import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaType, Prisma } from '@prisma/client';
import { unlink } from 'fs/promises';
import { resolve, sep, join } from 'path';
import sharp from 'sharp';

import { PrismaService } from '../prisma/prisma.service';
import { sanitizeMediaFolder } from '../common/upload/upload-security';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';
import { CropMediaDto } from './dto/crop-media.dto';


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
  constructor(
    private readonly prisma: PrismaService,
  ) {}


  async findAll(
    type?: string,
    folder?: string,
  ) {
    return this.prisma.mediaAsset.findMany({
      where: {
        ...(type ? { type: type as MediaType } : {}),
        ...(folder ? { folder } : {}),
      },
      include: {
        variants: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  }


  async createFromUpload(
    file: Express.Multer.File,
    folder = 'general',
  ) {

    const safeFolder = sanitizeMediaFolder(folder);

    const uploadDirectory = resolve(
      process.cwd(),
      'public/uploads/media',
    );


    const originalUrl =
      `/uploads/media/${file.filename}`;


    let width: number | null = null;
    let height: number | null = null;


    const isImage =
      file.mimetype.startsWith('image/');


    const variants: {
      name: string;
      url: string;
      width: number;
      height: number;
    }[] = [];


    if (isImage) {

      const metadata = await sharp(file.path)
        .metadata();


      width = metadata.width || null;
      height = metadata.height || null;


      const baseName =
        file.filename.replace(/\.[^/.]+$/, '');


      const variantConfigs = [
        {
          name: 'hero',
          width: 1600,
          height: 900,
        },
        {
          name: 'card',
          width: 900,
          height: 600,
        },
        {
          name: 'thumbnail',
          width: 400,
          height: 400,
        },
      ];


      for (const variant of variantConfigs) {

        const filename =
          `${baseName}-${variant.name}.webp`;


        const outputPath =
          join(
            uploadDirectory,
            filename,
          );


        await sharp(file.path)
          .resize(
            variant.width,
            variant.height,
            {
              fit: 'cover',
            },
          )
          .webp({
            quality: 85,
          })
          .toFile(outputPath);


        variants.push({
          name: variant.name,
          url:
            `/uploads/media/${filename}`,
          width: variant.width,
          height: variant.height,
        });
      }
    }


    return this.prisma.mediaAsset.create({
      data: {

        filename: file.filename,

        originalName:
          file.originalname,

        mimeType:
          file.mimetype,

        size:
          file.size,

        width,

        height,

        url:
          originalUrl,

        type:
          detectMediaType(file.mimetype),

        folder:
          safeFolder,


        variants: {
          create:
            variants,
        },
      },

      include: {
        variants: true,
      },
    });
  }


  async crop(
    id: string,
    dto: CropMediaDto,
  ) {
    const existing =
      await this.prisma.mediaAsset.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      throw new NotFoundException(
        'Media asset not found.',
      );
    }


    const sourcePath =
      resolve(
        process.cwd(),
        'public',
        existing.url.replace(/^\/+/, ''),
      );


    const baseName =
      existing.filename.replace(
        /\.[^/.]+$/,
        '',
      );


    const safeRatio =
      dto.ratio
        .replace(/[^a-zA-Z0-9-]/g, '-')
        .toLowerCase();


    const filename =
      `${baseName}-${safeRatio}-${Date.now()}.webp`;


    const outputPath =
      join(
        resolve(
          process.cwd(),
          'public/uploads/media',
        ),
        filename,
      );


    let pipeline = sharp(sourcePath);

    if (
      dto.x !== undefined &&
      dto.y !== undefined &&
      dto.cropWidth !== undefined &&
      dto.cropHeight !== undefined
    ) {
      const metadata = await sharp(sourcePath).metadata();
      const sourceWidth = metadata.width || 0;
      const sourceHeight = metadata.height || 0;

      if (sourceWidth > 0 && sourceHeight > 0) {
        const left = Math.min(
          Math.max(0, Math.round(dto.x)),
          sourceWidth - 1,
        );
        const top = Math.min(
          Math.max(0, Math.round(dto.y)),
          sourceHeight - 1,
        );
        const cropWidth = Math.min(
          Math.max(1, Math.round(dto.cropWidth)),
          sourceWidth - left,
        );
        const cropHeight = Math.min(
          Math.max(1, Math.round(dto.cropHeight)),
          sourceHeight - top,
        );

        pipeline = pipeline.extract({
          left,
          top,
          width: cropWidth,
          height: cropHeight,
        });
      }
    }

    await pipeline
      .resize(
        dto.width,
        dto.height,
        {
          fit: 'cover',
          position: 'centre',
        },
      )
      .webp({
        quality: 85,
      })
      .toFile(outputPath);


    return this.prisma.mediaVariant.create({
      data: {
        mediaId: existing.id,
        name: dto.ratio,
        url: `/uploads/media/${filename}`,
        width: dto.width,
        height: dto.height,
      },
    });
  }



  async update(
    id: string,
    dto: UpdateMediaAssetDto,
  ) {

    const existing =
      await this.prisma.mediaAsset.findUnique({
        where: {
          id,
        },
      });


    if (!existing) {
      throw new NotFoundException(
        'Media asset not found.',
      );
    }


    const data:
      Prisma.MediaAssetUpdateInput = {};


    if (dto.title !== undefined)
      data.title = dto.title;


    if (dto.altText !== undefined)
      data.altText = dto.altText;


    if (dto.description !== undefined)
      data.description = dto.description;


    if (dto.caption !== undefined)
      data.caption = dto.caption;


    if (dto.tags !== undefined)
      data.tags = dto.tags;


    if (dto.folder !== undefined)
      data.folder =
        sanitizeMediaFolder(dto.folder);


    if (dto.type !== undefined)
      data.type = dto.type;


    console.log("MEDIA UPDATE DTO:", dto);
    console.log("MEDIA UPDATE DATA:", data);


    return this.prisma.mediaAsset.update({
      where: {
        id,
      },
      data,
      include: {
        variants: true,
      },
    });
  }


  async remove(id: string) {

    const existing =
      await this.prisma.mediaAsset.findUnique({
        where: {
          id,
        },
        include: {
          variants: true,
        },
      });


    if (!existing) {
      throw new NotFoundException(
        'Media asset not found.',
      );
    }


    await deletePhysicalMediaFile(
      existing.url,
    );


    for (const variant of existing.variants) {
      await deletePhysicalMediaFile(
        variant.url,
      );
    }


    await this.prisma.mediaAsset.delete({
      where: {
        id,
      },
    });


    return {
      success: true,
      message:
        'Media asset deleted successfully.',
    };
  }
}
