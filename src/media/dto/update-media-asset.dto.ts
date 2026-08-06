import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateMediaAssetDto {
  @IsOptional()
  @IsString()
  filename?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @IsIn(['IMAGE', 'DOCUMENT', 'VIDEO', 'OTHER'])
  type?: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'OTHER';
}
