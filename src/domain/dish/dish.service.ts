import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DishSynchronizerService } from '../../spinal/domain/dish-spinal/dish-synchronizer.service';
import { DishZeltyService } from '../../zelty/services/dish-zelty.service';
import { DishEntity } from './entities/dish.entity';

@Injectable()
export class DishService implements OnModuleInit {
  private logger = new Logger(DishService.name);

  constructor(
    @InjectRepository(DishEntity)
    private repository: Repository<DishEntity>,
    private readonly dishZeltyService: DishZeltyService,
    private readonly dishSynchronizer: DishSynchronizerService,
  ) {}

  async onModuleInit() {
    setTimeout(async () => {
      await this.synchronize();
    }, 1000);
  }

  async synchronize(): Promise<void> {
    const dishesDTO = await this.dishZeltyService.getAll().toPromise();
    const dishesEntity = dishesDTO.map((d) => new DishEntity(d.id, d.name));
    this.logger.log(`${dishesEntity.length} dishes entities will be saved`);
    await this.repository.save(dishesEntity);
    this.logger.log(`${dishesEntity.length} dishes nodes will be saved`);
    await this.dishSynchronizer.store(dishesDTO).toPromise();
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const dish = await this.dishZeltyService.getById(id).toPromise();
    const recipe = await this.repository.findOne(id, {
      relations: ['quantities', 'quantities.ingredient'],
    });
    return Object.assign(dish, recipe);
  }
}
