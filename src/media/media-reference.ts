import { Prisma } from '@prisma/client';

export type MediaReferenceInput = Record<string, unknown> | null;

export function toMediaReferenceJson(value: MediaReferenceInput) {
  return value === null ? Prisma.DbNull : (value as Prisma.InputJsonObject);
}
