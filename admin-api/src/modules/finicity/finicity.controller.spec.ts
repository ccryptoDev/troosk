import { Test, TestingModule } from '@nestjs/testing';
import { FinicityController } from './finicity.controller';

describe('FinicityController', () => {
  let controller: FinicityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinicityController],
    }).compile();

    controller = module.get<FinicityController>(FinicityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
