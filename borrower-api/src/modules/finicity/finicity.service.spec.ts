import { Test, TestingModule } from '@nestjs/testing';
import { FinicityService } from './finicity.service';

describe('FinicityService', () => {
  let service: FinicityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinicityService],
    }).compile();

    service = module.get<FinicityService>(FinicityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
