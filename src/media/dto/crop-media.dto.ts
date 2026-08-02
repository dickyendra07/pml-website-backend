import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CropMediaDto {

  @IsString()
  ratio: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsOptional()
  @IsNumber()
  x?: number;

  @IsOptional()
  @IsNumber()
  y?: number;

}
