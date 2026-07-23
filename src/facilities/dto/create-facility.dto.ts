import { IsArray, IsOptional, IsString } from 'class-validator';
import { PublishStatus } from '@prisma/client';

export class CreateFacilityDto {
  @IsString()
  key: string;

  @IsString()
  titleEn: string;

  @IsOptional()
  @IsString()
  titleId?: string;

  @IsOptional()
  @IsString()
  eyebrowEn?: string;

  @IsOptional()
  @IsString()
  eyebrowId?: string;

  @IsOptional()
  @IsString()
  summaryEn?: string;

  @IsOptional()
  @IsString()
  summaryId?: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

  @IsOptional()
  @IsString()
  contentId?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  gallery?: unknown;

  @IsArray()
  @IsOptional()
  pointsEn?: string[];

  @IsArray()
  @IsOptional()
  pointsId?: string[];

  @IsString()
  category: string;

  @IsOptional()
  status?: PublishStatus;

  @IsOptional()
  sortOrder?: number;
}
