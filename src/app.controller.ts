import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
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
}
