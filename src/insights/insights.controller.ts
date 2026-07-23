import { Controller, Get, Query } from '@nestjs/common';

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
}
