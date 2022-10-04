import { Test, TestingModule } from '@nestjs/testing';
import { TShirtService } from './t-shirt.service';

describe('TShirtService', () => {
  let service: TShirtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TShirtService],
    }).compile();

    service = module.get<TShirtService>(TShirtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
