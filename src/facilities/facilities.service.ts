import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PublishStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';

@Injectable()
export class FacilitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic(key?: string) {
    return this.prisma.facility.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        ...(key ? { key } : {}),
      },
      orderBy: [
        {
          sortOrder: 'asc',
        },
        {
          updatedAt: 'desc',
        },
      ],
    });
  }

  async findAllAdmin() {
    return this.prisma.facility.findMany({
      orderBy: [
        {
          sortOrder: 'asc',
        },
        {
          updatedAt: 'desc',
        },
      ],
    });
  }

  async findOneAdmin(id: string) {
    const facility = await this.prisma.facility.findUnique({
      where: {
        id,
      },
    });

    if (!facility) {
      throw new NotFoundException('Facility not found.');
    }

    return facility;
  }

  async create(dto: CreateFacilityDto) {
    return this.prisma.facility.create({
      data: {
        key: dto.key,
        titleEn: dto.titleEn,
        titleId: dto.titleId,
        eyebrowEn: dto.eyebrowEn,
        eyebrowId: dto.eyebrowId,
        summaryEn: dto.summaryEn,
        summaryId: dto.summaryId,
        contentEn: dto.contentEn,
        contentId: dto.contentId,
        image: dto.image,
        gallery: dto.gallery || [],
        pointsEn: dto.pointsEn || [],
        pointsId: dto.pointsId || [],
        category: dto.category,
        status: dto.status || PublishStatus.DRAFT,
        sortOrder: dto.sortOrder || 0,
      },
    });
  }

  async update(id: string, dto: UpdateFacilityDto) {
    await this.findOneAdmin(id);

    const data: Prisma.FacilityUpdateInput = {};

    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'gallery') {
          data[key] = value as Prisma.InputJsonValue;
        } else {
          data[key] = value as never;
        }
      }
    });

    return this.prisma.facility.update({
      where: {
        id,
      },
      data,
    });
  }

  async archive(id: string) {
    await this.findOneAdmin(id);

    return this.prisma.facility.update({
      where: {
        id,
      },
      data: {
        status: PublishStatus.ARCHIVED,
      },
    });
  }
}
