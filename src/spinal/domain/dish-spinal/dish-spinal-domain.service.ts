import { Injectable, Logger } from '@nestjs/common';
import { DishHubRepository } from './dish-hub.repository';

// TODO remove dupplication with order-spin-domain
@Injectable()
export class DishSpinalDomainService {
  private logger = new Logger(DishSpinalDomainService.name);
  constructor(private readonly hubRepository: DishHubRepository) {}

  private watchDish;

  findAll() {
    this.logger.log('Find all dishes');
    return this.hubRepository.findAll();
  }
}
