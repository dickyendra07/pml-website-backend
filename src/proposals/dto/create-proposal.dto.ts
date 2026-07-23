import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProposalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  company: string;

  @IsEmail()
  @MaxLength(180)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  serviceType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3000)
  projectNeeds: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  sourcePage?: string;
}
