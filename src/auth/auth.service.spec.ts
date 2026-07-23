import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

type MockAdmin = {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash: string;
  isActive: boolean;
};

const AUTH_TEST_VALUES = {
  storedHash: 'hashed-password',
  validInput: 'correct-password',
  genericInput: 'password',
  invalidInput: 'wrong-password',
} as const;

describe('AuthService', () => {
  const admin: MockAdmin = {
    id: 'admin-1',
    name: 'PML Administrator',
    email: 'admin@pharmametriclabs.com',
    role: 'SUPER_ADMIN',
    passwordHash: AUTH_TEST_VALUES.storedHash,
    isActive: true,
  };

  const prisma = {
    adminUser: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const jwt = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new AuthService(
      prisma as unknown as PrismaService,
      jwt as unknown as JwtService,
    );
  });

  describe('login', () => {
    it('logs in an active admin and returns an access token', async () => {
      prisma.adminUser.findUnique.mockResolvedValue(admin);
      prisma.adminUser.update.mockResolvedValue(admin);
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);
      jwt.signAsync.mockResolvedValue('signed-token');

      const result = await service.login({
        email: 'ADMIN@PHARMAMETRICLABS.COM',
        password: AUTH_TEST_VALUES.validInput,
      });

      expect(prisma.adminUser.findUnique).toHaveBeenCalledWith({
        where: {
          email: 'admin@pharmametriclabs.com',
        },
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        AUTH_TEST_VALUES.validInput,
        admin.passwordHash,
      );

      expect(prisma.adminUser.update).toHaveBeenCalledTimes(1);
      expect(prisma.adminUser.update).toHaveBeenCalledWith({
        where: {
          id: admin.id,
        },
        data: {
          lastLoginAt: expect.objectContaining({}) as Date,
        },
      });

      expect(jwt.signAsync).toHaveBeenCalledWith({
        sub: admin.id,
        email: admin.email,
        role: admin.role,
      });

      expect(result).toEqual({
        accessToken: 'signed-token',
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    });

    it('rejects login when admin is not found', async () => {
      prisma.adminUser.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'missing@pharmametriclabs.com',
          password: AUTH_TEST_VALUES.genericInput,
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(prisma.adminUser.update).not.toHaveBeenCalled();
    });

    it('rejects login when admin is inactive', async () => {
      prisma.adminUser.findUnique.mockResolvedValue({
        ...admin,
        isActive: false,
      });

      await expect(
        service.login({
          email: admin.email,
          password: AUTH_TEST_VALUES.genericInput,
        }),
      ).rejects.toThrow('Invalid email or password.');

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('rejects login when password is invalid', async () => {
      prisma.adminUser.findUnique.mockResolvedValue(admin);
      jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        service.login({
          email: admin.email,
          password: AUTH_TEST_VALUES.invalidInput,
        }),
      ).rejects.toThrow('Invalid email or password.');

      expect(prisma.adminUser.update).not.toHaveBeenCalled();
      expect(jwt.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('returns a refreshed access token and current admin session', async () => {
      const session = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };

      jwt.signAsync.mockResolvedValue('refreshed-token');

      await expect(service.refresh(session)).resolves.toEqual({
        accessToken: 'refreshed-token',
        user: session,
      });

      expect(jwt.signAsync).toHaveBeenCalledWith({
        sub: admin.id,
        email: admin.email,
        role: admin.role,
      });
    });
  });

  describe('verifyToken', () => {
    it('returns an active admin session for a valid token', async () => {
      jwt.verifyAsync.mockResolvedValue({
        sub: admin.id,
        email: admin.email,
        role: admin.role,
      });

      prisma.adminUser.findUnique.mockResolvedValue(admin);

      await expect(service.verifyToken('valid-token')).resolves.toEqual({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      });

      expect(jwt.verifyAsync).toHaveBeenCalledWith('valid-token');
      expect(prisma.adminUser.findUnique).toHaveBeenCalledWith({
        where: {
          id: admin.id,
        },
      });
    });

    it('rejects a token when the admin no longer exists', async () => {
      jwt.verifyAsync.mockResolvedValue({
        sub: admin.id,
        email: admin.email,
        role: admin.role,
      });

      prisma.adminUser.findUnique.mockResolvedValue(null);

      await expect(service.verifyToken('valid-token')).rejects.toThrow(
        'Invalid admin session.',
      );
    });

    it('rejects a token when the admin is inactive', async () => {
      jwt.verifyAsync.mockResolvedValue({
        sub: admin.id,
        email: admin.email,
        role: admin.role,
      });

      prisma.adminUser.findUnique.mockResolvedValue({
        ...admin,
        isActive: false,
      });

      await expect(service.verifyToken('valid-token')).rejects.toThrow(
        'Invalid admin session.',
      );
    });

    it('rejects malformed or expired tokens', async () => {
      jwt.verifyAsync.mockRejectedValue(new Error('jwt expired'));

      await expect(service.verifyToken('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(prisma.adminUser.findUnique).not.toHaveBeenCalled();
    });
  });
});
