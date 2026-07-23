import { Controller, Get, Query } from '@nestjs/common';
import { PageSeoService } from './page-seo.service';

@Controller('page-seo')
export class PageSeoController {
  constructor(private readonly pageSeoService: PageSeoService) {}

  @Get()
  findByPath(@Query('path') path = '/') {
    return this.pageSeoService.findPublicByPath(path);
  }
}
