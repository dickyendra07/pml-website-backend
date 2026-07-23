import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ProposalsService } from './proposals.service';

@Controller('proposals')
export class ProposalsController {
  constructor(
    private readonly proposalsService: ProposalsService,
    private readonly redisService: RedisService,
  ) {}

  @Post()
  async create(@Body() dto: CreateProposalDto, @Ip() ip: string) {
    const safeIp = ip || 'unknown';
    const rateLimitKey = `proposal:rate-limit:${safeIp}`;
    const requestCount = await this.redisService.increment(
      rateLimitKey,
      60 * 10,
    );

    if (requestCount > 5) {
      throw new HttpException(
        'Too many proposal requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const submission = await this.proposalsService.create(dto);

    return {
      success: true,
      message: 'Proposal request submitted successfully.',
      id: submission.id,
    };
  }
}
