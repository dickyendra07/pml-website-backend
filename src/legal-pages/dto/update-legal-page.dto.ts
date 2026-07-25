import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum LegalPageTypeDto {
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  COOKIE_POLICY = 'COOKIE_POLICY',
}

export class UpdateLegalPageDto {
  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

  @IsOptional()
  @IsString()
  seoTitleEn?: string;

  @IsOptional()
  @IsString()
  metaDescriptionEn?: string;

  @IsOptional()
  @IsString()
  titleId?: string;

  @IsOptional()
  @IsString()
  contentId?: string;

  @IsOptional()
  @IsString()
  seoTitleId?: string;

  @IsOptional()
  @IsString()
  metaDescriptionId?: string;
}
