import { Test, TestingModule } from '@nestjs/testing';
import { LoanContractService } from './loan-contract.service';

describe('LoanContractPageService', () => {
  let service: LoanContractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanContractService],
    }).compile();

    service = module.get<LoanContractService>(LoanContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
