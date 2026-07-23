import {
  Allow,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';

class UpdateSettingItemDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @Allow()
  value: Prisma.InputJsonValue;
}

export class UpdateSettingsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSettingItemDto)
  items: UpdateSettingItemDto[];
}
