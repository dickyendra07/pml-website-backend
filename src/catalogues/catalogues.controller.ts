import { Body, Controller, Get, Post } from '@nestjs/common';
import { CataloguesService } from './catalogues.service';
import { CreateCatalogueRequestDto } from './dto/create-catalogue-request.dto';

@Controller('catalogues')
export class CataloguesController {
  constructor(private readonly cataloguesService: CataloguesService) {}

  @Get()
  findPublic() {
    return this.cataloguesService.findPublic();
  }

  @Post('requests')
  createRequest(@Body() dto: CreateCatalogueRequestDto) {
    return this.cataloguesService.createRequest(dto);
  }
}
