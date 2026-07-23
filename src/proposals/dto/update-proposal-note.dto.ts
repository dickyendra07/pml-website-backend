import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProposalNoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  internalNote?: string;
}
