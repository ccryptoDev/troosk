import { Test, TestingModule } from '@nestjs/testing';
import { RepayService } from './repay.service';

describe('RepayService', () => {
  let service: RepayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepayService],
    }).compile();

    service = module.get<RepayService>(RepayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
