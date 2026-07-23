import { Injectable } from '@nestjs/common';
import { Prisma, SiteSetting } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { defaultSettings } from '../../prisma/default-settings';

export { defaultSettings };
export type { SettingInput } from '../../prisma/default-settings';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async seedDefaults(): Promise<SiteSetting[]> {
    const results: SiteSetting[] = [];

    for (const setting of defaultSettings) {
      const result = await this.prisma.siteSetting.upsert({
        where: {
          key: setting.key,
        },
        update: {},
        create: {
          key: setting.key,
          label: setting.label,
          value: setting.value,
          group: setting.group || 'general',
          description: setting.description || null,
          isPublic: setting.isPublic ?? true,
        },
      });

      results.push(result);
    }

    return results;
  }

  async findPublic() {
    const settings = await this.prisma.siteSetting.findMany({
      where: {
        isPublic: true,
      },
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });

    return this.toKeyValue(settings);
  }

  async findAll() {
    return this.prisma.siteSetting.findMany({
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });
  }

  async updateMany(
    items: Array<{ key: string; value: Prisma.InputJsonValue }>,
  ) {
    const updates: SiteSetting[] = [];

    for (const item of items) {
      const updated = await this.prisma.siteSetting.update({
        where: {
          key: item.key,
        },
        data: {
          value: item.value,
        },
      });

      updates.push(updated);
    }

    return updates;
  }

  private toKeyValue(
    settings: Array<{ key: string; value: Prisma.JsonValue }>,
  ) {
    return settings.reduce<Record<string, Prisma.JsonValue>>(
      (result, setting) => {
        result[setting.key] = setting.value;
        return result;
      },
      {},
    );
  }
}
