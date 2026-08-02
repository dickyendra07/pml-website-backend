import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CropMediaDto {
  @IsString()
  ratio: string;

  @IsNumber()
  @Min(1)
  width: number;

  @IsNumber()
  @Min(1)
  height: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  x?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  y?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  cropWidth?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  cropHeight?: number;
}
