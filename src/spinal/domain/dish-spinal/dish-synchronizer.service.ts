import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { QuantityCreatedEvent } from '../../../event/quantity.event';
import { DishDTO } from '../../../zelty/models/dish';
import { DishesListModel } from '../../models/dishes/dishes-list';
import { DishHubRepository } from './dish-hub.repository';
import { DishModel } from '../../models/dishes/dish';

@Injectable()
export class DishSynchronizerService implements OnModuleInit {
  logger = new Logger(DishSynchronizerService.name);

  constructor(private readonly dishHubRepository: DishHubRepository) {}

  onModuleInit(): void {
    this.logger.log('Checking dish spinal state');
  }

  @OnEvent(QuantityCreatedEvent.EVENT_NAME)
  handleQuantityCreatedEvent(quantityCreatedEvent: QuantityCreatedEvent) {
    this.dishHubRepository.load().subscribe((dishesListNode) => {
      const dish = dishesListNode.dishes.filter(
        (d: any) => d?.id.get() === quantityCreatedEvent.quantity.dish.id,
      )[0];
      dish.add_attr('quantities', [quantityCreatedEvent.quantity]);
    });
  }

  store(dishes: DishDTO[]): Observable<void> {
    const dishNodeList = nodeFactory(dishes);
    return this.dishHubRepository.store(dishNodeList);
  }
}

function nodeFactory(dishes: DishDTO[] = []): any {
  return new DishesListModel(dishes.map((d) => new DishModel(d)));
}
