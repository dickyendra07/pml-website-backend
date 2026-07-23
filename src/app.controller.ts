import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getApiInfo() {
    return this.appService.getApiInfo();
  }

  @Get('health')
  @UseGuards(JwtAuthGuard)
  async getHealth() {
    return this.appService.getHealth();
  }

  @Get('health/public')
  async getPublicHealth() {
    return this.appService.getPublicHealth();
  }
}
