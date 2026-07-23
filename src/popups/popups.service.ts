import { Injectable, NotFoundException } from '@nestjs/common';
import { PopupType, Prisma, PublishStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePopupDto } from './dto/create-popup.dto';
import { UpdatePopupDto } from './dto/update-popup.dto';

type PopupWriteDto = CreatePopupDto | UpdatePopupDto;

@Injectable()
export class PopupsService {
  constructor(private readonly prisma: PrismaService) {}

  private toDate(value?: string) {
    return value ? new Date(value) : undefined;
  }

  private buildUpdateData(
    dto: PopupWriteDto,
  ): Prisma.PopupAnnouncementUpdateInput {
    const data: Prisma.PopupAnnouncementUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.buttonLabel !== undefined) data.buttonLabel = dto.buttonLabel;
    if (dto.buttonUrl !== undefined) data.buttonUrl = dto.buttonUrl;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.layout !== undefined) data.layout = dto.layout;
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.placementPages !== undefined)
      data.placementPages = dto.placementPages;
    if (dto.frequency !== undefined) data.frequency = dto.frequency;
    if (dto.startsAt !== undefined) data.startsAt = this.toDate(dto.startsAt);
    if (dto.endsAt !== undefined) data.endsAt = this.toDate(dto.endsAt);
    if (dto.priority !== undefined) data.priority = dto.priority;

    return data;
  }

  async findActiveForPage(path = '/') {
    const now = new Date();

    return this.prisma.popupAnnouncement.findFirst({
      where: {
        status: PublishStatus.PUBLISHED,
        placementPages: {
          has: path,
        },
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [
          {
            OR: [{ endsAt: null }, { endsAt: { gte: now } }],
          },
        ],
      },
      orderBy: [{ priority: 'desc' }, { updatedAt: 'desc' }],
    });
  }

  async findAll() {
    return this.prisma.popupAnnouncement.findMany({
      orderBy: [{ priority: 'desc' }, { updatedAt: 'desc' }],
    });
  }

  async create(dto: CreatePopupDto) {
    return this.prisma.popupAnnouncement.create({
      data: {
        title: dto.title,
        description: dto.description,
        buttonLabel: dto.buttonLabel,
        buttonUrl: dto.buttonUrl,
        imageUrl: dto.imageUrl,
        layout: dto.layout || 'IMAGE_LEFT',
        type: dto.type || PopupType.ANNOUNCEMENT,
        status: dto.status || PublishStatus.DRAFT,
        placementPages: dto.placementPages || ['/'],
        frequency: dto.frequency || 'ONCE_PER_SESSION',
        startsAt: this.toDate(dto.startsAt),
        endsAt: this.toDate(dto.endsAt),
        priority: dto.priority || 0,
      },
    });
  }

  async update(id: string, dto: UpdatePopupDto) {
    const existing = await this.prisma.popupAnnouncement.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Popup announcement not found.');
    }

    return this.prisma.popupAnnouncement.update({
      where: { id },
      data: this.buildUpdateData(dto),
    });
  }

  async archive(id: string) {
    const existing = await this.prisma.popupAnnouncement.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Popup announcement not found.');
    }

    return this.prisma.popupAnnouncement.update({
      where: { id },
      data: {
        status: PublishStatus.ARCHIVED,
      },
    });
  }
}
