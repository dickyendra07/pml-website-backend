import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller('api')
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
      update: {},
      create: {
        type: 'PRIVACY_POLICY',
        titleEn: 'Privacy Policy',
        contentEn:
          '<p>Privacy Policy content will be updated from CMS.</p>',
        titleId: 'Kebijakan Privasi',
        contentId:
          '<p>Konten Kebijakan Privasi akan diperbarui melalui CMS.</p>',
        status: 'PUBLISHED',
      },
    });

    await this.prisma.legalPage.upsert({
      where: {
        type: 'COOKIE_POLICY',
      },
      update: {},
      create: {
        type: 'COOKIE_POLICY',
        titleEn: 'Cookie Policy',
        contentEn:
          '<p>Cookie Policy content will be updated from CMS.</p>',
        titleId: 'Kebijakan Cookie',
        contentId:
          '<p>Konten Kebijakan Cookie akan diperbarui melalui CMS.</p>',
        status: 'PUBLISHED',
      },
    });

    return {
      success: true,
      message: 'Legal pages seeded successfully',
    };
  }
}
