import { Controller, Get, Query } from '@nestjs/common';
import { PopupsService } from './popups.service';

@Controller('popups')
export class PopupsController {
  constructor(private readonly popupsService: PopupsService) {}

  @Get('active')
  async findActive(@Query('path') path = '/') {
    const popup = await this.popupsService.findActiveForPage(path);

    return {
      popup,
    };
  }
}
