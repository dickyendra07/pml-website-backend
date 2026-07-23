import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateMediaAssetDto {
  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @IsIn(['IMAGE', 'DOCUMENT', 'VIDEO', 'OTHER'])
  type?: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'OTHER';
}
