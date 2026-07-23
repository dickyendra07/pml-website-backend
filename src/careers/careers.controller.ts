import { Controller, Get } from '@nestjs/common';
import { CareersService } from './careers.service';

@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Get()
  findPublic() {
    return this.careersService.findPublic();
  }
}
