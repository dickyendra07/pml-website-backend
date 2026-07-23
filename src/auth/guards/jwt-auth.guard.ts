import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CurrentAdmin } from '../decorators/current-admin.decorator';

type RequestWithAdmin = {
  headers: {
    authorization?: string | string[];
  };
  admin?: CurrentAdmin;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAdmin>();
    const authorization = request.headers.authorization;

    if (typeof authorization !== 'string') {
      throw new UnauthorizedException('Missing authorization token.');
    }

    const token = authorization.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      throw new UnauthorizedException('Missing authorization token.');
    }

    request.admin = await this.authService.verifyToken(token);

    return true;
  }
}
