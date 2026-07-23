import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { defaultSettings } from './default-settings';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL || 'admin@pharmametriclabs.com';
  const name = process.env.ADMIN_SEED_NAME || 'PML Admin';
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!password) {
    throw new Error('ADMIN_SEED_PASSWORD is required to run database seed.');
  }
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: {
      email,
    },
    update: {
      name,
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
    create: {
      name,
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
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
  }

  console.log('Seeded default site settings:', defaultSettings.length);

  console.log('Seeded admin user:', {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
