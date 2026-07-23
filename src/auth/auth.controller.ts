import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentAdminUser } from './decorators/current-admin.decorator';
import type { CurrentAdmin } from './decorators/current-admin.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentAdminUser() admin: CurrentAdmin) {
    return admin;
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  refresh(@CurrentAdminUser() admin: CurrentAdmin) {
    return this.authService.refresh(admin);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout() {
    return {
      success: true,
      message: 'Logged out successfully.',
    };
  }
}
