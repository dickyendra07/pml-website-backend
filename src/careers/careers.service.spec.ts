import { NotFoundException } from '@nestjs/common';
import { PublishStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CareersService } from './careers.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

describe('CareersService', () => {
  const career = {
    id: 'career-1',
    title: 'Clinical Research Associate',
    slug: 'clinical-research-associate',
    department: 'Clinical Operations',
    location: 'Jakarta',
    employmentType: 'Full Time',
    experienceLevel: 'Mid Level',
    summary: 'Support clinical research projects.',
    description: 'Detailed career description.',
    responsibilities: 'Manage clinical research activities.',
    requirements: 'Relevant degree and experience.',
    benefits: 'Competitive benefits.',
    applyEmail: 'careers@pharmametriclabs.com',
    applyUrl: null,
    status: PublishStatus.PUBLISHED,
    sortOrder: 1,
    publishedAt: new Date('2026-07-11T03:00:00.000Z'),
    createdAt: new Date('2026-07-11T03:00:00.000Z'),
    updatedAt: new Date('2026-07-11T03:00:00.000Z'),
  };

  const prisma = {
    careerPost: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  let service: CareersService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new CareersService(prisma as unknown as PrismaService);
  });

  describe('findPublic', () => {
    it('returns published careers in public order', async () => {
      prisma.careerPost.findMany.mockResolvedValue([career]);

      await expect(service.findPublic()).resolves.toEqual([career]);

      expect(prisma.careerPost.findMany).toHaveBeenCalledWith({
        where: {
          status: PublishStatus.PUBLISHED,
        },
        orderBy: [
          { sortOrder: 'asc' },
          { publishedAt: 'desc' },
          { updatedAt: 'desc' },
        ],
      });
    });
  });

  describe('findAllAdmin', () => {
    it('returns all careers in admin order', async () => {
      prisma.careerPost.findMany.mockResolvedValue([career]);

      await expect(service.findAllAdmin()).resolves.toEqual([career]);

      expect(prisma.careerPost.findMany).toHaveBeenCalledWith({
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      });
    });
  });

  describe('create', () => {
    it('creates a published career and generates a slug from the title', async () => {
      const now = new Date('2026-07-11T04:00:00.000Z');
      jest.useFakeTimers();
      jest.setSystemTime(now);

      const dto: CreateCareerDto = {
        title: 'Clinical Research & Quality Associate',
        department: 'Clinical Operations',
        location: 'Jakarta',
        status: PublishStatus.PUBLISHED,
      };

      prisma.careerPost.create.mockResolvedValue(career);

      await service.create(dto);

      expect(prisma.careerPost.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          slug: 'clinical-research-and-quality-associate',
          department: dto.department,
          location: dto.location,
          employmentType: undefined,
          experienceLevel: undefined,
          summary: undefined,
          description: undefined,
          responsibilities: undefined,
          requirements: undefined,
          benefits: undefined,
          applyEmail: undefined,
          applyUrl: undefined,
          status: PublishStatus.PUBLISHED,
          sortOrder: 0,
          publishedAt: now,
        },
      });

      jest.useRealTimers();
    });

    it('uses the provided slug and converts it to a safe slug', async () => {
      const dto: CreateCareerDto = {
        title: 'Research Associate',
        slug: '  Research & Development Associate  ',
        status: PublishStatus.DRAFT,
        sortOrder: 3,
      };

      prisma.careerPost.create.mockResolvedValue({
        ...career,
        slug: 'research-and-development-associate',
        status: PublishStatus.DRAFT,
        sortOrder: 3,
        publishedAt: null,
      });

      await service.create(dto);

      expect(prisma.careerPost.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          slug: 'research-and-development-associate',
          department: undefined,
          location: undefined,
          employmentType: undefined,
          experienceLevel: undefined,
          summary: undefined,
          description: undefined,
          responsibilities: undefined,
          requirements: undefined,
          benefits: undefined,
          applyEmail: undefined,
          applyUrl: undefined,
          status: PublishStatus.DRAFT,
          sortOrder: 3,
          publishedAt: null,
        },
      });
    });

    it('stores a valid provided publication date', async () => {
      const dto: CreateCareerDto = {
        title: 'Research Associate',
        publishedAt: '2026-07-15T08:30:00.000Z',
      };

      prisma.careerPost.create.mockResolvedValue(career);

      await service.create(dto);

      expect(prisma.careerPost.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          slug: 'research-associate',
          department: undefined,
          location: undefined,
          employmentType: undefined,
          experienceLevel: undefined,
          summary: undefined,
          description: undefined,
          responsibilities: undefined,
          requirements: undefined,
          benefits: undefined,
          applyEmail: undefined,
          applyUrl: undefined,
          status: PublishStatus.DRAFT,
          sortOrder: 0,
          publishedAt: new Date('2026-07-15T08:30:00.000Z'),
        },
      });
    });

    it('stores an invalid publication date as null', async () => {
      const dto: CreateCareerDto = {
        title: 'Research Associate',
        publishedAt: 'invalid-date',
      };

      prisma.careerPost.create.mockResolvedValue(career);

      await service.create(dto);

      expect(prisma.careerPost.create).toHaveBeenCalledWith({
        data: {
          title: dto.title,
          slug: 'research-associate',
          department: undefined,
          location: undefined,
          employmentType: undefined,
          experienceLevel: undefined,
          summary: undefined,
          description: undefined,
          responsibilities: undefined,
          requirements: undefined,
          benefits: undefined,
          applyEmail: undefined,
          applyUrl: undefined,
          status: PublishStatus.DRAFT,
          sortOrder: 0,
          publishedAt: null,
        },
      });
    });
  });

  describe('update', () => {
    it('updates an existing career and sanitizes updated fields', async () => {
      const dto: UpdateCareerDto = {
        title: 'Senior Research Associate',
        slug: 'Senior Research & Quality Associate',
        department: 'Research',
        location: 'Jakarta',
        employmentType: 'Full Time',
        experienceLevel: 'Senior',
        summary: 'Updated summary.',
        description: 'Updated description.',
        responsibilities: 'Updated responsibilities.',
        requirements: 'Updated requirements.',
        benefits: 'Updated benefits.',
        applyEmail: 'jobs@pharmametriclabs.com',
        applyUrl: 'https://example.com/apply',
        status: PublishStatus.PUBLISHED,
        sortOrder: 4,
        publishedAt: '2026-07-20T09:00:00.000Z',
      };

      prisma.careerPost.findUnique.mockResolvedValue(career);
      prisma.careerPost.update.mockResolvedValue({
        ...career,
        ...dto,
      });

      await service.update(career.id, dto);

      expect(prisma.careerPost.update).toHaveBeenCalledWith({
        where: {
          id: career.id,
        },
        data: {
          title: dto.title,
          slug: 'senior-research-and-quality-associate',
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
          status: dto.status,
          sortOrder: dto.sortOrder,
          publishedAt: new Date('2026-07-20T09:00:00.000Z'),
        },
      });
    });

    it('stores an invalid updated publication date as null', async () => {
      prisma.careerPost.findUnique.mockResolvedValue(career);
      prisma.careerPost.update.mockResolvedValue(career);

      await service.update(career.id, {
        publishedAt: 'invalid-date',
      });

      expect(prisma.careerPost.update).toHaveBeenCalledWith({
        where: {
          id: career.id,
        },
        data: {
          publishedAt: null,
        },
      });
    });

    it('throws when updating a missing career', async () => {
      prisma.careerPost.findUnique.mockResolvedValue(null);

      await expect(
        service.update('missing-id', {
          title: 'Updated title',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.careerPost.update).not.toHaveBeenCalled();
    });
  });

  describe('archive', () => {
    it('archives an existing career', async () => {
      prisma.careerPost.findUnique.mockResolvedValue(career);
      prisma.careerPost.update.mockResolvedValue({
        ...career,
        status: PublishStatus.ARCHIVED,
      });

      await service.archive(career.id);

      expect(prisma.careerPost.update).toHaveBeenCalledWith({
        where: {
          id: career.id,
        },
        data: {
          status: PublishStatus.ARCHIVED,
        },
      });
    });

    it('throws when archiving a missing career', async () => {
      prisma.careerPost.findUnique.mockResolvedValue(null);

      await expect(service.archive('missing-id')).rejects.toThrow(
        'Career post not found.',
      );

      expect(prisma.careerPost.update).not.toHaveBeenCalled();
    });
  });
});
