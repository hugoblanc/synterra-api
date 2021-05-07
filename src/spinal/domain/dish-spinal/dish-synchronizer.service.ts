import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { QuantityCreatedEvent } from '../../../event/quantity.event';
import { DishDTO } from '../../../zelty/models/dish';
import { DishHubRepository, DishListNode } from './dish-hub.repository';

@Injectable()
export class DishSynchronizerService {
  constructor(private readonly dishHubRepository: DishHubRepository) {}

  @OnEvent(QuantityCreatedEvent.EVENT_NAME)
  handleQuantityCreatedEvent(quantityCreatedEvent: QuantityCreatedEvent) {
    this.dishHubRepository
      .load()
      .pipe(take(1))
      .subscribe((dishesListNode: DishListNode) => {
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
  return new (require('../../nodes/dishes-list').DishesListModel)({
    dishes,
  });
}
