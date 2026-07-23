import { IsArray, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePopupDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  buttonLabel?: string;

  @IsOptional()
  @IsString()
  buttonUrl?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsIn(['IMAGE_LEFT', 'IMAGE_RIGHT', 'IMAGE_TOP', 'TEXT_ONLY'])
  layout?: 'IMAGE_LEFT' | 'IMAGE_RIGHT' | 'IMAGE_TOP' | 'TEXT_ONLY';

  @IsOptional()
  @IsIn(['ANNOUNCEMENT', 'PROMOTION', 'ALERT', 'INFORMATION'])
  type?: 'ANNOUNCEMENT' | 'PROMOTION' | 'ALERT' | 'INFORMATION';

  @IsOptional()
  @IsIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  placementPages?: string[];

  @IsOptional()
  @IsIn(['ONCE_PER_SESSION', 'ONCE_PER_DAY', 'ALWAYS'])
  frequency?: 'ONCE_PER_SESSION' | 'ONCE_PER_DAY' | 'ALWAYS';

  @IsOptional()
  @IsString()
  startsAt?: string;

  @IsOptional()
  @IsString()
  endsAt?: string;

  @IsOptional()
  @IsInt()
  priority?: number;
}
