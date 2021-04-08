import { Test, TestingModule } from '@nestjs/testing';
import { DishZeltyService } from './dish-zelty.service';

describe('DishZeltyService', () => {
  let service: DishZeltyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DishZeltyService],
    }).compile();

    service = module.get<DishZeltyService>(DishZeltyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
