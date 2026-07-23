import { Prisma, SiteSetting } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { defaultSettings, SettingsService } from './settings.service';

describe('SettingsService', () => {
  const publicSetting: SiteSetting = {
    id: 'setting-1',
    key: 'company.name',
    label: 'Company Name',
    value: 'Pharma Metric Labs',
    group: 'company',
    description: 'Official company name.',
    isPublic: true,
    createdAt: new Date('2026-07-11T03:00:00.000Z'),
    updatedAt: new Date('2026-07-11T03:00:00.000Z'),
  };

  const privateSetting: SiteSetting = {
    id: 'setting-2',
    key: 'proposal.recipientEmail',
    label: 'Proposal Recipient Email',
    value: 'info@pharmametriclabs.com',
    group: 'proposal',
    description: 'Internal proposal recipient.',
    isPublic: false,
    createdAt: new Date('2026-07-11T03:00:00.000Z'),
    updatedAt: new Date('2026-07-11T03:00:00.000Z'),
  };

  const prisma = {
    siteSetting: {
      upsert: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  let service: SettingsService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new SettingsService(prisma as unknown as PrismaService);
  });

  describe('seedDefaults', () => {
    it('upserts every default setting and returns the results', async () => {
      const seededSettings = defaultSettings.map(
        (setting, index): SiteSetting => ({
          id: `setting-${index + 1}`,
          key: setting.key,
          label: setting.label,
          value: setting.value as Prisma.JsonValue,
          group: setting.group || 'general',
          description: setting.description || null,
          isPublic: setting.isPublic ?? true,
          createdAt: new Date('2026-07-11T03:00:00.000Z'),
          updatedAt: new Date('2026-07-11T03:00:00.000Z'),
        }),
      );

      for (const setting of seededSettings) {
        prisma.siteSetting.upsert.mockResolvedValueOnce(setting);
      }

      await expect(service.seedDefaults()).resolves.toEqual(seededSettings);

      expect(prisma.siteSetting.upsert).toHaveBeenCalledTimes(
        defaultSettings.length,
      );

      expect(prisma.siteSetting.upsert).toHaveBeenNthCalledWith(1, {
        where: {
          key: defaultSettings[0].key,
        },
        update: {},
        create: {
          key: defaultSettings[0].key,
          label: defaultSettings[0].label,
          value: defaultSettings[0].value,
          group: defaultSettings[0].group || 'general',
          description: defaultSettings[0].description || null,
          isPublic: defaultSettings[0].isPublic ?? true,
        },
      });
    });
  });

  describe('findPublic', () => {
    it('returns public settings as a key-value object', async () => {
      prisma.siteSetting.findMany.mockResolvedValue([
        publicSetting,
        {
          ...publicSetting,
          id: 'setting-3',
          key: 'contact.email',
          value: 'info@pharmametriclabs.com',
        },
      ]);

      await expect(service.findPublic()).resolves.toEqual({
        'company.name': 'Pharma Metric Labs',
        'contact.email': 'info@pharmametriclabs.com',
      });

      expect(prisma.siteSetting.findMany).toHaveBeenCalledWith({
        where: {
          isPublic: true,
        },
        orderBy: [{ group: 'asc' }, { key: 'asc' }],
      });
    });

    it('returns an empty object when no public settings exist', async () => {
      prisma.siteSetting.findMany.mockResolvedValue([]);

      await expect(service.findPublic()).resolves.toEqual({});
    });
  });

  describe('findAll', () => {
    it('returns all settings in group and key order', async () => {
      prisma.siteSetting.findMany.mockResolvedValue([
        publicSetting,
        privateSetting,
      ]);

      await expect(service.findAll()).resolves.toEqual([
        publicSetting,
        privateSetting,
      ]);

      expect(prisma.siteSetting.findMany).toHaveBeenCalledWith({
        orderBy: [{ group: 'asc' }, { key: 'asc' }],
      });
    });
  });

  describe('updateMany', () => {
    it('updates every requested setting and returns the results', async () => {
      const items: Array<{
        key: string;
        value: Prisma.InputJsonValue;
      }> = [
        {
          key: 'company.name',
          value: 'PML Indonesia',
        },
        {
          key: 'contact.email',
          value: 'contact@pharmametriclabs.com',
        },
      ];

      const firstUpdated: SiteSetting = {
        ...publicSetting,
        value: 'PML Indonesia',
      };

      const secondUpdated: SiteSetting = {
        ...publicSetting,
        id: 'setting-3',
        key: 'contact.email',
        label: 'Primary Email',
        value: 'contact@pharmametriclabs.com',
        group: 'contact',
      };

      prisma.siteSetting.update
        .mockResolvedValueOnce(firstUpdated)
        .mockResolvedValueOnce(secondUpdated);

      await expect(service.updateMany(items)).resolves.toEqual([
        firstUpdated,
        secondUpdated,
      ]);

      expect(prisma.siteSetting.update).toHaveBeenNthCalledWith(1, {
        where: {
          key: 'company.name',
        },
        data: {
          value: 'PML Indonesia',
        },
      });

      expect(prisma.siteSetting.update).toHaveBeenNthCalledWith(2, {
        where: {
          key: 'contact.email',
        },
        data: {
          value: 'contact@pharmametriclabs.com',
        },
      });
    });

    it('returns an empty array when there are no settings to update', async () => {
      await expect(service.updateMany([])).resolves.toEqual([]);

      expect(prisma.siteSetting.update).not.toHaveBeenCalled();
    });
  });
});
