import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CatalogueDownloadMode,
  InquiryStatus,
  Prisma,
  PublishStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatalogueRequestDto } from './dto/create-catalogue-request.dto';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

@Injectable()
export class CataloguesService {
  constructor(private readonly prisma: PrismaService) {}

  private buildCatalogueData(
    dto: CreateCatalogueDto | UpdateCatalogueDto,
  ): Prisma.CatalogueItemUncheckedUpdateInput {
    const data: Prisma.CatalogueItemUncheckedUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.slug !== undefined) data.slug = slugify(dto.slug);
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.serviceType !== undefined) data.serviceType = dto.serviceType;
    if (dto.fileUrl !== undefined) data.fileUrl = dto.fileUrl;
    if (dto.coverImage !== undefined) data.coverImage = dto.coverImage;
    if (dto.downloadMode !== undefined) data.downloadMode = dto.downloadMode;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;

    return data;
  }

  async findPublic() {
    return this.prisma.catalogueItem.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
      },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  async findAllAdmin() {
    return this.prisma.catalogueItem.findMany({
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      include: {
        _count: {
          select: {
            requests: true,
          },
        },
      },
    });
  }

  async create(dto: CreateCatalogueDto) {
    const slug = slugify(dto.slug || dto.title);

    return this.prisma.catalogueItem.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        serviceType: dto.serviceType,
        fileUrl: dto.fileUrl,
        coverImage: dto.coverImage,
        downloadMode:
          dto.downloadMode || CatalogueDownloadMode.REQUEST_REQUIRED,
        status: dto.status || PublishStatus.DRAFT,
        sortOrder: dto.sortOrder || 0,
      },
    });
  }

  async update(id: string, dto: UpdateCatalogueDto) {
    const existing = await this.prisma.catalogueItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Catalogue item not found.');
    }

    const data = this.buildCatalogueData(dto);

    if (dto.title && !dto.slug) {
      data.slug = existing.slug;
    }

    return this.prisma.catalogueItem.update({
      where: { id },
      data,
    });
  }

  async archive(id: string) {
    const existing = await this.prisma.catalogueItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Catalogue item not found.');
    }

    return this.prisma.catalogueItem.update({
      where: { id },
      data: {
        status: PublishStatus.ARCHIVED,
      },
    });
  }

  async createRequest(dto: CreateCatalogueRequestDto) {
    if (dto.catalogueId) {
      const existing = await this.prisma.catalogueItem.findUnique({
        where: { id: dto.catalogueId },
      });

      if (!existing) {
        throw new NotFoundException('Catalogue item not found.');
      }
    }

    return this.prisma.catalogueRequest.create({
      data: {
        catalogueId: dto.catalogueId,
        name: dto.name,
        company: dto.company,
        email: dto.email,
        phone: dto.phone,
        message: dto.message,
        status: InquiryStatus.NEW,
      },
      include: {
        catalogue: true,
      },
    });
  }

  async findRequestsAdmin() {
    return this.prisma.catalogueRequest.findMany({
      orderBy: [{ createdAt: 'desc' }],
      include: {
        catalogue: true,
      },
    });
  }
}
