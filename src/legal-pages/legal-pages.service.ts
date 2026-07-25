import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLegalPageDto } from './dto/update-legal-page.dto';

@Injectable()
export class LegalPagesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findPublic(type: string) {
    const page = await this.prisma.legalPage.findUnique({
      where: {
        type: type as any,
      },
    });

    if (!page) {
      throw new NotFoundException(
        'Legal page not found.',
      );
    }

    return page;
  }

  async findAll() {
    return this.prisma.legalPage.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async update(
    type: string,
    dto: UpdateLegalPageDto,
  ) {
    return this.prisma.legalPage.upsert({
      where: {
        type: type as any,
      },
      update: dto,
      create: {
        type: type as any,
        titleEn:
          dto.titleEn ||
          type.replaceAll('_', ' '),
        contentEn:
          dto.contentEn || '',
        ...dto,
      },
    });
  }
}
