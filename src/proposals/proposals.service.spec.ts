import { NotFoundException } from '@nestjs/common';
import { InquiryStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ProposalsService } from './proposals.service';

describe('ProposalsService', () => {
  const proposal = {
    id: 'proposal-1',
    name: 'Dicky Endra',
    company: 'Kara Digital',
    email: 'dicky@example.com',
    phone: '+628123456789',
    country: 'Indonesia',
    serviceType: 'Clinical Trial',
    projectNeeds: 'Clinical trial support for a pharmaceutical project.',
    sourcePage: '/contact',
    status: InquiryStatus.NEW,
    internalNote: null,
    createdAt: new Date('2026-07-11T03:00:00.000Z'),
    updatedAt: new Date('2026-07-11T03:00:00.000Z'),
  };

  const prisma = {
    proposalSubmission: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  let service: ProposalsService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ProposalsService(prisma as unknown as PrismaService);
  });

  describe('create', () => {
    it('creates a proposal submission with optional values', async () => {
      const dto: CreateProposalDto = {
        name: proposal.name,
        company: proposal.company,
        email: proposal.email,
        phone: proposal.phone,
        country: proposal.country,
        serviceType: proposal.serviceType,
        projectNeeds: proposal.projectNeeds,
        sourcePage: proposal.sourcePage,
      };

      prisma.proposalSubmission.create.mockResolvedValue(proposal);

      await expect(service.create(dto)).resolves.toEqual(proposal);

      expect(prisma.proposalSubmission.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          company: dto.company,
          email: dto.email,
          phone: dto.phone,
          country: dto.country,
          serviceType: dto.serviceType,
          projectNeeds: dto.projectNeeds,
          sourcePage: dto.sourcePage,
        },
      });
    });

    it('stores missing optional values as null', async () => {
      const dto: CreateProposalDto = {
        name: proposal.name,
        company: proposal.company,
        email: proposal.email,
        serviceType: proposal.serviceType,
        projectNeeds: proposal.projectNeeds,
      };

      prisma.proposalSubmission.create.mockResolvedValue({
        ...proposal,
        phone: null,
        country: null,
        sourcePage: null,
      });

      await service.create(dto);

      expect(prisma.proposalSubmission.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          company: dto.company,
          email: dto.email,
          phone: null,
          country: null,
          serviceType: dto.serviceType,
          projectNeeds: dto.projectNeeds,
          sourcePage: null,
        },
      });
    });
  });

  describe('findAll', () => {
    it('returns the latest 100 proposal submissions', async () => {
      prisma.proposalSubmission.findMany.mockResolvedValue([proposal]);

      await expect(service.findAll()).resolves.toEqual([proposal]);

      expect(prisma.proposalSubmission.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
        take: 100,
      });
    });
  });

  describe('findOne', () => {
    it('returns an existing proposal submission', async () => {
      prisma.proposalSubmission.findUnique.mockResolvedValue(proposal);

      await expect(service.findOne(proposal.id)).resolves.toEqual(proposal);

      expect(prisma.proposalSubmission.findUnique).toHaveBeenCalledWith({
        where: {
          id: proposal.id,
        },
      });
    });

    it('throws when the proposal submission does not exist', async () => {
      prisma.proposalSubmission.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );

      await expect(service.findOne('missing-id')).rejects.toThrow(
        'Inquiry not found.',
      );
    });
  });

  describe('updateStatus', () => {
    it('updates the status after confirming the proposal exists', async () => {
      prisma.proposalSubmission.findUnique.mockResolvedValue(proposal);
      prisma.proposalSubmission.update.mockResolvedValue({
        ...proposal,
        status: InquiryStatus.IN_REVIEW,
      });

      await expect(
        service.updateStatus(proposal.id, InquiryStatus.IN_REVIEW),
      ).resolves.toEqual({
        ...proposal,
        status: InquiryStatus.IN_REVIEW,
      });

      expect(prisma.proposalSubmission.update).toHaveBeenCalledWith({
        where: {
          id: proposal.id,
        },
        data: {
          status: InquiryStatus.IN_REVIEW,
        },
      });
    });

    it('does not update status when the proposal does not exist', async () => {
      prisma.proposalSubmission.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('missing-id', InquiryStatus.IN_REVIEW),
      ).rejects.toThrow('Inquiry not found.');

      expect(prisma.proposalSubmission.update).not.toHaveBeenCalled();
    });
  });

  describe('updateInternalNote', () => {
    it('trims and stores a non-empty internal note', async () => {
      prisma.proposalSubmission.findUnique.mockResolvedValue(proposal);
      prisma.proposalSubmission.update.mockResolvedValue({
        ...proposal,
        internalNote: 'Follow up next week.',
      });

      await service.updateInternalNote(proposal.id, '  Follow up next week.  ');

      expect(prisma.proposalSubmission.update).toHaveBeenCalledWith({
        where: {
          id: proposal.id,
        },
        data: {
          internalNote: 'Follow up next week.',
        },
      });
    });

    it('stores an empty internal note as null', async () => {
      prisma.proposalSubmission.findUnique.mockResolvedValue(proposal);
      prisma.proposalSubmission.update.mockResolvedValue(proposal);

      await service.updateInternalNote(proposal.id, '   ');

      expect(prisma.proposalSubmission.update).toHaveBeenCalledWith({
        where: {
          id: proposal.id,
        },
        data: {
          internalNote: null,
        },
      });
    });
  });

  describe('markAsSpam', () => {
    it('marks an existing proposal as spam', async () => {
      prisma.proposalSubmission.findUnique.mockResolvedValue(proposal);
      prisma.proposalSubmission.update.mockResolvedValue({
        ...proposal,
        status: InquiryStatus.SPAM,
      });

      await service.markAsSpam(proposal.id);

      expect(prisma.proposalSubmission.update).toHaveBeenCalledWith({
        where: {
          id: proposal.id,
        },
        data: {
          status: InquiryStatus.SPAM,
        },
      });
    });

    it('does not mark a missing proposal as spam', async () => {
      prisma.proposalSubmission.findUnique.mockResolvedValue(null);

      await expect(service.markAsSpam('missing-id')).rejects.toThrow(
        'Inquiry not found.',
      );

      expect(prisma.proposalSubmission.update).not.toHaveBeenCalled();
    });
  });
});
