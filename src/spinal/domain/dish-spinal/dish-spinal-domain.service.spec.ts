import { Test, TestingModule } from '@nestjs/testing';
import { DishSpinalDomainService } from './dish-spinal-domain.service';

describe('DishSpinalDomainService', () => {
  let service: DishSpinalDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DishSpinalDomainService],
    }).compile();

    service = module.get<DishSpinalDomainService>(DishSpinalDomainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
