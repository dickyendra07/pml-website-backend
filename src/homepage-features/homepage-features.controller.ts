import { Controller, Get, Query } from '@nestjs/common';
import { HomepageFeaturesService } from './homepage-features.service';

@Controller('homepage-features')
export class HomepageFeaturesController {
  constructor(
    private readonly homepageFeaturesService: HomepageFeaturesService,
  ) {}

  @Get()
  findPublic(@Query('type') type?: string) {
    return this.homepageFeaturesService.findPublic(type);
  }
}
