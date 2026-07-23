import { HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';

describe('ProposalsController', () => {
  const dto: CreateProposalDto = {
    name: 'Dicky Endra',
    company: 'Kara Digital',
    email: 'dicky@example.com',
    phone: '+628123456789',
    country: 'Indonesia',
    serviceType: 'Clinical Trial',
    projectNeeds: 'Clinical trial support for a pharmaceutical project.',
    sourcePage: '/contact',
  };

  const proposalsService = {
    create: jest.fn(),
  };

  const redisService = {
    increment: jest.fn(),
  };

  let controller: ProposalsController;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new ProposalsController(
      proposalsService as unknown as ProposalsService,
      redisService as unknown as RedisService,
    );
  });

  it('creates a proposal when the rate limit has not been exceeded', async () => {
    redisService.increment.mockResolvedValue(1);
    proposalsService.create.mockResolvedValue({
      id: 'proposal-1',
    });

    await expect(controller.create(dto, '127.0.0.1')).resolves.toEqual({
      success: true,
      message: 'Proposal request submitted successfully.',
      id: 'proposal-1',
    });

    expect(redisService.increment).toHaveBeenCalledWith(
      'proposal:rate-limit:127.0.0.1',
      60 * 10,
    );
    expect(proposalsService.create).toHaveBeenCalledWith(dto);
  });

  it('uses an unknown identifier when the IP address is empty', async () => {
    redisService.increment.mockResolvedValue(1);
    proposalsService.create.mockResolvedValue({
      id: 'proposal-2',
    });

    await controller.create(dto, '');

    expect(redisService.increment).toHaveBeenCalledWith(
      'proposal:rate-limit:unknown',
      60 * 10,
    );
  });

  it('allows the fifth request within the rate-limit window', async () => {
    redisService.increment.mockResolvedValue(5);
    proposalsService.create.mockResolvedValue({
      id: 'proposal-5',
    });

    await expect(controller.create(dto, '127.0.0.1')).resolves.toEqual({
      success: true,
      message: 'Proposal request submitted successfully.',
      id: 'proposal-5',
    });

    expect(proposalsService.create).toHaveBeenCalledWith(dto);
  });

  it('rejects requests after the limit has been exceeded', async () => {
    redisService.increment.mockResolvedValue(6);

    let thrownError: unknown;

    try {
      await controller.create(dto, '127.0.0.1');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(HttpException);

    const httpError = thrownError as HttpException;

    expect(httpError.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
    expect(httpError.message).toBe(
      'Too many proposal requests. Please try again later.',
    );
    expect(proposalsService.create).not.toHaveBeenCalled();
  });
});
