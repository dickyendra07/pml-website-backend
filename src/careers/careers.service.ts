import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PublishStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function toDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

@Injectable()
export class CareersService {
  constructor(private readonly prisma: PrismaService) {}

  private buildUpdateData(dto: UpdateCareerDto): Prisma.CareerPostUpdateInput {
    const data: Prisma.CareerPostUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.slug !== undefined) data.slug = slugify(dto.slug);
    if (dto.department !== undefined) data.department = dto.department;
    if (dto.location !== undefined) data.location = dto.location;
    if (dto.employmentType !== undefined)
      data.employmentType = dto.employmentType;
    if (dto.experienceLevel !== undefined)
      data.experienceLevel = dto.experienceLevel;
    if (dto.summary !== undefined) data.summary = dto.summary;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.responsibilities !== undefined)
      data.responsibilities = dto.responsibilities;
    if (dto.requirements !== undefined) data.requirements = dto.requirements;
    if (dto.benefits !== undefined) data.benefits = dto.benefits;
    if (dto.applyEmail !== undefined) data.applyEmail = dto.applyEmail;
    if (dto.applyUrl !== undefined) data.applyUrl = dto.applyUrl;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.publishedAt !== undefined)
      data.publishedAt = toDate(dto.publishedAt);

    return data;
  }

  async findPublic() {
    return this.prisma.careerPost.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { publishedAt: 'desc' },
        { updatedAt: 'desc' },
      ],
    });
  }

  async findAllAdmin() {
    return this.prisma.careerPost.findMany({
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  async create(dto: CreateCareerDto) {
    const slug = slugify(dto.slug || dto.title);
    const status = dto.status || PublishStatus.DRAFT;

    return this.prisma.careerPost.create({
      data: {
        title: dto.title,
        slug,
        department: dto.department,
        location: dto.location,
        employmentType: dto.employmentType,
        experienceLevel: dto.experienceLevel,
        summary: dto.summary,
        description: dto.description,
        responsibilities: dto.responsibilities,
        requirements: dto.requirements,
        benefits: dto.benefits,
        applyEmail: dto.applyEmail,
        applyUrl: dto.applyUrl,
        status,
        sortOrder: dto.sortOrder || 0,
        publishedAt:
          dto.publishedAt !== undefined
            ? toDate(dto.publishedAt)
            : status === PublishStatus.PUBLISHED
              ? new Date()
              : null,
      },
    });
  }

  async update(id: string, dto: UpdateCareerDto) {
    const existing = await this.prisma.careerPost.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Career post not found.');
    }

    return this.prisma.careerPost.update({
      where: { id },
      data: this.buildUpdateData(dto),
    });
  }

  async archive(id: string) {
    const existing = await this.prisma.careerPost.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Career post not found.');
    }

    return this.prisma.careerPost.update({
      where: { id },
      data: {
        status: PublishStatus.ARCHIVED,
      },
    });
  }
}
