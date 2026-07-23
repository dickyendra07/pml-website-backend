import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCatalogueRequestDto {
  @IsOptional()
  @IsString()
  catalogueId?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
