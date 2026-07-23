import { Controller, Get, Param } from '@nestjs/common';

import { FacilitiesService } from './facilities.service';

@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Get()
  findPublic() {
    return this.facilitiesService.findPublic();
  }

  @Get(':key')
  findByKey(@Param('key') key: string) {
    return this.facilitiesService.findPublic(key);
  }
}
