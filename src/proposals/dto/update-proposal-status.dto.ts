import { IsEnum } from 'class-validator';
import { InquiryStatus } from '@prisma/client';

export class UpdateProposalStatusDto {
  @IsEnum(InquiryStatus)
  status: InquiryStatus;
}
