import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import {
  privacyPolicyContent,
  cookiePolicyContent,
} from './scripts/legal-pages-content';

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/public')
  healthPublic() {
    return {
      status: 'ok',
      public: true,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('seed-legal-pages-temp')
  async seedLegalPagesTemp() {
    await this.prisma.legalPage.upsert({
      where: {
        type: 'PRIVACY_POLICY',
      },
      update: {
        titleEn: privacyPolicyContent.titleEn,
        contentEn: privacyPolicyContent.contentEn,
        titleId: privacyPolicyContent.titleId,
        contentId: privacyPolicyContent.contentId,
        status: 'PUBLISHED',
      },
      create: {
        type: 'PRIVACY_POLICY',
        titleEn: privacyPolicyContent.titleEn,
        contentEn: privacyPolicyContent.contentEn,
        titleId: privacyPolicyContent.titleId,
        contentId: privacyPolicyContent.contentId,
        status: 'PUBLISHED',
      },
    });

    await this.prisma.legalPage.upsert({
      where: {
        type: 'COOKIE_POLICY',
      },
      update: {
        titleEn: cookiePolicyContent.titleEn,
        contentEn: cookiePolicyContent.contentEn,
        titleId: cookiePolicyContent.titleId,
        contentId: cookiePolicyContent.contentId,
        status: 'PUBLISHED',
      },
      create: {
        type: 'COOKIE_POLICY',
        titleEn: cookiePolicyContent.titleEn,
        contentEn: cookiePolicyContent.contentEn,
        titleId: cookiePolicyContent.titleId,
        contentId: cookiePolicyContent.contentId,
        status: 'PUBLISHED',
      },
    });

    return {
      success: true,
      message: 'Legal pages seeded from CMS content',
    };
  }
}
