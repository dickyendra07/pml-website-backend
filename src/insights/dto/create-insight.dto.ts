import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateInsightDto {
  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  slugEn?: string;

  @IsOptional()
  @IsString()
  excerptEn?: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagsEn?: string[];

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
  slugId?: string;

  @IsOptional()
  @IsString()
  excerptId?: string;

  @IsOptional()
  @IsString()
  contentId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagsId?: string[];

  @IsOptional()
  @IsString()
  seoTitleId?: string;

  @IsOptional()
  @IsString()
  metaDescriptionId?: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  publishedAt?: string;
}
