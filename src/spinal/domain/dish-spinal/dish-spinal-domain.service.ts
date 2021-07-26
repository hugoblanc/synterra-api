import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DishDTO } from '../../../zelty/models/dish';
import { DishHubRepository } from './dish-hub.repository';

// TODO remove dupplication with order-spin-domain
@Injectable()
export class DishSpinalDomainService {
  private logger = new Logger(DishSpinalDomainService.name);
  constructor(private readonly hubRepository: DishHubRepository) {}

  findAll(): Observable<DishDTO[]> {
    this.logger.log('Find all dishes');
    return this.hubRepository.findAll();
  }
}
