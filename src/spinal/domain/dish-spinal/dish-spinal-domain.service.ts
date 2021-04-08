import { Injectable, Logger } from '@nestjs/common';
import { map, take } from 'rxjs/operators';
import { DishDTO } from '../../../zelty/models/dish';
import { DishHubRepository, DishListNode } from './dish-hub.repository';

// TODO remove dupplication with order-spin-domain
@Injectable()
export class DishSpinalDomainService {
  private logger = new Logger(DishSpinalDomainService.name);
  constructor(private readonly hubRepository: DishHubRepository) {}

  findAll() {
    this.logger.log('Find all dishes');
    return this.hubRepository.load().pipe(
      take(1),
      map((nodes: DishListNode): DishDTO[] => {
        if (nodes.dishes.length === 0) {
          this.logger.log('Empty dish list');
          return [];
        }

        return (nodes.dishes as any).get();
      }),
    );
  }
}
