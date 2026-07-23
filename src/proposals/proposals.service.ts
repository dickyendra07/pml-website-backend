import { Injectable, NotFoundException } from '@nestjs/common';
import { InquiryStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProposalDto) {
    return this.prisma.proposalSubmission.create({
      data: {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone || null,
        country: data.country || null,
        serviceType: data.serviceType,
        projectNeeds: data.projectNeeds,
        sourcePage: data.sourcePage || null,
      },
    });
  }

  async findAll() {
    return this.prisma.proposalSubmission.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
  }

  async findOne(id: string) {
    const proposal = await this.prisma.proposalSubmission.findUnique({
      where: {
        id,
      },
    });

    if (!proposal) {
      throw new NotFoundException('Inquiry not found.');
    }

    return proposal;
  }

  async updateStatus(id: string, status: InquiryStatus) {
    await this.findOne(id);

    return this.prisma.proposalSubmission.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  async updateInternalNote(id: string, internalNote?: string) {
    await this.findOne(id);

    return this.prisma.proposalSubmission.update({
      where: {
        id,
      },
      data: {
        internalNote: internalNote?.trim() || null,
      },
    });
  }

  async markAsSpam(id: string) {
    await this.findOne(id);

    return this.prisma.proposalSubmission.update({
      where: {
        id,
      },
      data: {
        status: InquiryStatus.SPAM,
      },
    });
  }
}
