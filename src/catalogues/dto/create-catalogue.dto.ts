import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCatalogueDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsIn(['PUBLIC_DOWNLOAD', 'REQUEST_REQUIRED'])
  downloadMode?: 'PUBLIC_DOWNLOAD' | 'REQUEST_REQUIRED';

  @IsOptional()
  @IsIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
