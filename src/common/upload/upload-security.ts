import { BadRequestException } from '@nestjs/common';
import type { Express } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { join } from 'path';

const mimeExtensions: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
  'video/mp4': '.mp4',
};

function trimBoundaryHyphens(value: string) {
  let start = 0;
  let end = value.length;

  while (start < end && value.charCodeAt(start) === 45) {
    start += 1;
  }

  while (end > start && value.charCodeAt(end - 1) === 45) {
    end -= 1;
  }

  return value.slice(start, end);
}

export function ensureUploadDirectory(relativeDirectory: string) {
  const directory = join(process.cwd(), relativeDirectory);

  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  return directory;
}

function sanitizeOriginalBaseName(originalName: string) {
  const withoutExtension = originalName.replace(/\.[^/.]+$/, '');

  const normalizedName = withoutExtension
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

  const safeName = trimBoundaryHyphens(normalizedName).slice(0, 60);

  return safeName || 'upload';
}

export function createSafeUploadFilename(file: Express.Multer.File) {
  const extension = mimeExtensions[file.mimetype];

  if (!extension) {
    throw new BadRequestException('Unsupported file type.');
  }

  const safeBaseName = sanitizeOriginalBaseName(file.originalname);
  const uniqueId = randomUUID().slice(0, 12);

  return `${Date.now()}-${uniqueId}-${safeBaseName}${extension}`;
}

export function createSecureDiskStorage(relativeDirectory: string) {
  return diskStorage({
    destination: (_request, _file, callback) => {
      try {
        callback(null, ensureUploadDirectory(relativeDirectory));
      } catch (error) {
        callback(error as Error, '');
      }
    },
    filename: (_request, file, callback) => {
      try {
        callback(null, createSafeUploadFilename(file));
      } catch (error) {
        callback(error as Error, '');
      }
    },
  });
}

export function createMimeTypeFilter(allowedTypes: readonly string[]) {
  return (
    _request: unknown,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!allowedTypes.includes(file.mimetype)) {
      callback(
        new BadRequestException(
          `Unsupported file type. Allowed types: ${allowedTypes.join(', ')}.`,
        ),
        false,
      );
      return;
    }

    callback(null, true);
  };
}

export function requireUploadedFile(
  file: Express.Multer.File | undefined,
  label = 'File',
) {
  if (!file) {
    throw new BadRequestException(`${label} is required.`);
  }

  return file;
}

export function sanitizeMediaFolder(folder?: string) {
  if (!folder) return 'general';

  const normalizedFolder = folder
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-');

  const safeFolder = trimBoundaryHyphens(normalizedFolder).slice(0, 50);

  return safeFolder || 'general';
}
