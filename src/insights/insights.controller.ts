import { Controller, Get, Param, Query } from '@nestjs/common';

import { InsightsService } from './insights.service';

@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  findPublic(
    @Query('category') category?: string,
    @Query('locale') locale?: string,
  ) {
    const selectedLocale = locale === 'id' ? 'id' : 'en';

    return this.insightsService.findPublic(category, selectedLocale);
  }

  @Get(':slug')
  findBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ) {
    const selectedLocale = locale === 'id' ? 'id' : 'en';

    return this.insightsService.findPublicBySlug(
      slug,
      selectedLocale,
    );
  }
}
