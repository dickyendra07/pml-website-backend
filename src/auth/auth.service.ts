import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

type JwtAdminPayload = {
  sub: string;
  email: string;
  role: string;
};

type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.prisma.adminUser.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatch = await bcrypt.compare(
      dto.password,
      admin.passwordHash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    await this.prisma.adminUser.update({
      where: {
        id: admin.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    const user = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    return {
      accessToken: await this.signAdminToken(user),
      user,
    };
  }

  async refresh(admin: AdminSession) {
    return {
      accessToken: await this.signAdminToken(admin),
      user: admin,
    };
  }

  async verifyToken(token: string): Promise<AdminSession> {
    try {
      const payload = await this.jwt.verifyAsync<JwtAdminPayload>(token);

      const admin = await this.prisma.adminUser.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (!admin || !admin.isActive) {
        throw new UnauthorizedException('Invalid admin session.');
      }

      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };
    } catch {
      throw new UnauthorizedException('Invalid admin session.');
    }
  }

  private signAdminToken(admin: AdminSession) {
    const payload: JwtAdminPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    return this.jwt.signAsync(payload);
  }
}
