import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PublishStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomepageFeatureDto } from './dto/create-homepage-feature.dto';
import { UpdateHomepageFeatureDto } from './dto/update-homepage-feature.dto';

@Injectable()
export class HomepageFeaturesService {
  constructor(private readonly prisma: PrismaService) {}

  private buildUpdateData(
    dto: UpdateHomepageFeatureDto,
  ): Prisma.HomepageFeatureUpdateInput {
    const data: Prisma.HomepageFeatureUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.referenceId !== undefined) data.referenceId = dto.referenceId;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.buttonLabel !== undefined) data.buttonLabel = dto.buttonLabel;
    if (dto.buttonUrl !== undefined) data.buttonUrl = dto.buttonUrl;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;

    return data;
  }

  async findPublic(type?: string) {
    return this.prisma.homepageFeature.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        ...(type ? { type } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  async findAllAdmin() {
    return this.prisma.homepageFeature.findMany({
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  async create(dto: CreateHomepageFeatureDto) {
    return this.prisma.homepageFeature.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        referenceId: dto.referenceId,
        imageUrl: dto.imageUrl,
        buttonLabel: dto.buttonLabel,
        buttonUrl: dto.buttonUrl,
        status: dto.status || PublishStatus.DRAFT,
        sortOrder: dto.sortOrder || 0,
      },
    });
  }

  async update(id: string, dto: UpdateHomepageFeatureDto) {
    const existing = await this.prisma.homepageFeature.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Homepage feature not found.');
    }

    return this.prisma.homepageFeature.update({
      where: { id },
      data: this.buildUpdateData(dto),
    });
  }

  async archive(id: string) {
    const existing = await this.prisma.homepageFeature.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Homepage feature not found.');
    }

    return this.prisma.homepageFeature.update({
      where: { id },
      data: {
        status: PublishStatus.ARCHIVED,
      },
    });
  }
}
