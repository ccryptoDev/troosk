import { Test, TestingModule } from '@nestjs/testing';
import { RepayController } from './repay.controller';

describe('RepayController', () => {
  let controller: RepayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepayController],
    }).compile();

    controller = module.get<RepayController>(RepayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
