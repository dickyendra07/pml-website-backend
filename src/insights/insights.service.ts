import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PublishStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateInsightDto } from './dto/create-insight.dto';
import { UpdateInsightDto } from './dto/update-insight.dto';

type InsightLocale = 'en' | 'id';

function normalizeOptionalText(value?: string | null) {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

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
export class InsightsService {
  constructor(private readonly prisma: PrismaService) {}

  private ensureAtLeastOneLanguage(dto: CreateInsightDto) {
    const hasEnglish = Boolean(normalizeOptionalText(dto.titleEn));
    const hasIndonesian = Boolean(normalizeOptionalText(dto.titleId));

    if (!hasEnglish && !hasIndonesian) {
      throw new BadRequestException(
        'At least one English or Indonesian title is required.',
      );
    }
  }

  private buildCreateData(
    dto: CreateInsightDto,
  ): Prisma.InsightPostCreateInput {
    this.ensureAtLeastOneLanguage(dto);

    const titleEn = normalizeOptionalText(dto.titleEn);
    const titleId = normalizeOptionalText(dto.titleId);

    const slugEnSource = normalizeOptionalText(dto.slugEn) || titleEn;
    const slugIdSource = normalizeOptionalText(dto.slugId) || titleId;

    const status = dto.status || PublishStatus.DRAFT;

    return {
      titleEn,
      slugEn: slugEnSource ? slugify(slugEnSource) : null,
      excerptEn: normalizeOptionalText(dto.excerptEn),
      contentEn: normalizeOptionalText(dto.contentEn),
      tagsEn: dto.tagsEn || [],
      seoTitleEn: normalizeOptionalText(dto.seoTitleEn),
      metaDescriptionEn: normalizeOptionalText(dto.metaDescriptionEn),

      titleId,
      slugId: slugIdSource ? slugify(slugIdSource) : null,
      excerptId: normalizeOptionalText(dto.excerptId),
      contentId: normalizeOptionalText(dto.contentId),
      tagsId: dto.tagsId || [],
      seoTitleId: normalizeOptionalText(dto.seoTitleId),
      metaDescriptionId: normalizeOptionalText(dto.metaDescriptionId),

      category: dto.category,
      coverImage: normalizeOptionalText(dto.coverImage),
      status,
      isFeatured: dto.isFeatured || false,
      publishedAt:
        dto.publishedAt !== undefined
          ? toDate(dto.publishedAt)
          : status === PublishStatus.PUBLISHED
            ? new Date()
            : null,
    };
  }

  private buildUpdateData(
    dto: UpdateInsightDto,
  ): Prisma.InsightPostUpdateInput {
    const data: Prisma.InsightPostUpdateInput = {};

    if (dto.titleEn !== undefined) {
      data.titleEn = normalizeOptionalText(dto.titleEn);
    }

    if (dto.slugEn !== undefined) {
      const value = normalizeOptionalText(dto.slugEn);
      data.slugEn = value ? slugify(value) : null;
    }

    if (dto.excerptEn !== undefined) {
      data.excerptEn = normalizeOptionalText(dto.excerptEn);
    }

    if (dto.contentEn !== undefined) {
      data.contentEn = normalizeOptionalText(dto.contentEn);
    }

    if (dto.tagsEn !== undefined) data.tagsEn = dto.tagsEn;

    if (dto.seoTitleEn !== undefined) {
      data.seoTitleEn = normalizeOptionalText(dto.seoTitleEn);
    }

    if (dto.metaDescriptionEn !== undefined) {
      data.metaDescriptionEn = normalizeOptionalText(dto.metaDescriptionEn);
    }

    if (dto.titleId !== undefined) {
      data.titleId = normalizeOptionalText(dto.titleId);
    }

    if (dto.slugId !== undefined) {
      const value = normalizeOptionalText(dto.slugId);
      data.slugId = value ? slugify(value) : null;
    }

    if (dto.excerptId !== undefined) {
      data.excerptId = normalizeOptionalText(dto.excerptId);
    }

    if (dto.contentId !== undefined) {
      data.contentId = normalizeOptionalText(dto.contentId);
    }

    if (dto.tagsId !== undefined) data.tagsId = dto.tagsId;

    if (dto.seoTitleId !== undefined) {
      data.seoTitleId = normalizeOptionalText(dto.seoTitleId);
    }

    if (dto.metaDescriptionId !== undefined) {
      data.metaDescriptionId = normalizeOptionalText(dto.metaDescriptionId);
    }

    if (dto.category !== undefined) data.category = dto.category;

    if (dto.coverImage !== undefined) {
      data.coverImage = normalizeOptionalText(dto.coverImage);
    }

    if (dto.status !== undefined) data.status = dto.status;
    if (dto.isFeatured !== undefined) data.isFeatured = dto.isFeatured;

    if (dto.publishedAt !== undefined) {
      data.publishedAt = toDate(dto.publishedAt);
    }

    return data;
  }

  private mapPublicPost(
    post: Prisma.InsightPostGetPayload<Record<string, never>>,
    locale: InsightLocale,
  ) {
    const isIndonesian = locale === 'id';

    const title = isIndonesian ? post.titleId : post.titleEn;
    const slug = isIndonesian ? post.slugId : post.slugEn;
    const excerpt = isIndonesian ? post.excerptId : post.excerptEn;
    const content = isIndonesian ? post.contentId : post.contentEn;
    const tags = isIndonesian ? post.tagsId : post.tagsEn;
    const seoTitle = isIndonesian ? post.seoTitleId : post.seoTitleEn;
    const metaDescription = isIndonesian
      ? post.metaDescriptionId
      : post.metaDescriptionEn;

    return {
      id: post.id,
      title: title || '',
      slug: slug || '',
      excerpt,
      content,
      category: post.category,
      coverImage: post.coverImage,
      tags,
      seoTitle: seoTitle || title || '',
      metaDescription: metaDescription || excerpt || '',
      status: post.status,
      isFeatured: post.isFeatured,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async findPublic(category?: string, locale: InsightLocale = 'en') {
    const isIndonesian = locale === 'id';

    const posts = await this.prisma.insightPost.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        ...(category ? { category } : {}),
        ...(isIndonesian
          ? {
              titleId: { not: null },
              slugId: { not: null },
            }
          : {
              titleEn: { not: null },
              slugEn: { not: null },
            }),
      },
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    return posts.map((post) => this.mapPublicPost(post, locale));
  }

  async findAllAdmin() {
    return this.prisma.insightPost.findMany({
      orderBy: [{ updatedAt: 'desc' }],
    });
  }

  async create(dto: CreateInsightDto) {
    return this.prisma.insightPost.create({
      data: this.buildCreateData(dto),
    });
  }

  async update(id: string, dto: UpdateInsightDto) {
    const existing = await this.prisma.insightPost.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Insight post not found.');
    }

    const resultingTitleEn =
      dto.titleEn !== undefined
        ? normalizeOptionalText(dto.titleEn)
        : existing.titleEn;

    const resultingTitleId =
      dto.titleId !== undefined
        ? normalizeOptionalText(dto.titleId)
        : existing.titleId;

    if (!resultingTitleEn && !resultingTitleId) {
      throw new BadRequestException(
        'At least one English or Indonesian title is required.',
      );
    }

    return this.prisma.insightPost.update({
      where: { id },
      data: this.buildUpdateData(dto),
    });
  }

  async archive(id: string) {
    const existing = await this.prisma.insightPost.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Insight post not found.');
    }

    return this.prisma.insightPost.update({
      where: { id },
      data: {
        status: PublishStatus.ARCHIVED,
      },
    });
  }
}
