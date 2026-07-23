import { Injectable, NotFoundException } from '@nestjs/common';
import { PageSeo, PublishStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePageSeoDto } from './dto/update-page-seo.dto';

type DefaultPageSeo = {
  path: string;
  label: string;
  title: string;
  description: string;
};

export const defaultPageSeoItems: DefaultPageSeo[] = [
  {
    path: '/',
    label: 'Homepage',
    title: 'Pharma Metric Labs | Contract Research Organization in Indonesia',
    description:
      'Integrated CRO services for pharmaceutical development, including BA/BE studies, clinical trial services, contract analysis, and regulatory consultation.',
  },
  {
    path: '/about-us',
    label: 'About Us',
    title: 'About Us',
    description:
      'Learn about Pharma Metric Labs, an Indonesian contract research organization supporting pharmaceutical development through clinical, analytical, and regulatory expertise.',
  },
  {
    path: '/services',
    label: 'Services',
    title: 'Services',
    description:
      'Explore Pharma Metric Labs CRO services, including BA/BE studies, clinical trial services, contract analysis, and regulatory consultation for pharmaceutical development.',
  },
  {
    path: '/services/babe-studies',
    label: 'BA/BE Studies',
    title: 'BA/BE Studies',
    description:
      'End-to-end bioequivalence study support from clinical conduct and bioanalysis to regulatory-ready reporting at Pharma Metric Labs.',
  },
  {
    path: '/services/clinical-trial',
    label: 'Clinical Trial Services',
    title: 'Clinical Trial Services',
    description:
      'Clinical trial support with local expertise, hospital partnerships, monitoring, medical writing, and regulatory coordination.',
  },
  {
    path: '/services/contract-analysis',
    label: 'Contract Analysis',
    title: 'Contract Analysis',
    description:
      'Analytical testing support for pharmaceutical, cosmetic, food, beverage, and medical device product quality and documentation needs.',
  },
  {
    path: '/services/regulatory-consultation',
    label: 'Regulatory Consultation',
    title: 'Regulatory Consultation',
    description:
      'Regulatory affairs consultation for BPOM registration, ACTD documents, compliance, licensing, and submission readiness.',
  },
  {
    path: '/facilities',
    label: 'Facilities',
    title: 'Facilities',
    description:
      'Explore Pharma Metric Labs clinical, analytical, and supporting facilities for reliable study and laboratory execution.',
  },
  {
    path: '/contact',
    label: 'Contact Us',
    title: 'Contact Us',
    description:
      'Contact Pharma Metric Labs to discuss BA/BE studies, clinical trial services, contract analysis, regulatory consultation, and pharmaceutical project inquiries.',
  },
  {
    path: '/insight',
    label: 'Insight',
    title: 'Insight',
    description:
      'Explore Pharma Metric Labs articles, news, publications, and frequently asked questions about CRO services and pharmaceutical development.',
  },
];

@Injectable()
export class PageSeoService {
  constructor(private readonly prisma: PrismaService) {}

  async seedDefaults(): Promise<PageSeo[]> {
    const results: PageSeo[] = [];

    for (const item of defaultPageSeoItems) {
      const result = await this.prisma.pageSeo.upsert({
        where: {
          path: item.path,
        },
        update: {},
        create: {
          ...item,
          ogTitle: item.title,
          ogDescription: item.description,
          status: PublishStatus.PUBLISHED,
        },
      });

      results.push(result);
    }

    return results;
  }

  async findPublicByPath(path: string) {
    return this.prisma.pageSeo.findFirst({
      where: {
        path,
        status: PublishStatus.PUBLISHED,
      },
    });
  }

  async findAll() {
    return this.prisma.pageSeo.findMany({
      orderBy: [{ path: 'asc' }],
    });
  }

  async update(id: string, dto: UpdatePageSeoDto) {
    const existing = await this.prisma.pageSeo.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Page SEO item not found.');
    }

    return this.prisma.pageSeo.update({
      where: {
        id,
      },
      data: {
        ...dto,
        status: dto.status,
      },
    });
  }
}
