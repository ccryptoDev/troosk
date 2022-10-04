import { Test, TestingModule } from '@nestjs/testing';
import { TShirtController } from './t-shirt.controller';

describe('TShirtController', () => {
  let controller: TShirtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TShirtController],
    }).compile();

    controller = module.get<TShirtController>(TShirtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
