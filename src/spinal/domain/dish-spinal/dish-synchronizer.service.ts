import { Injectable } from '@nestjs/common';
import { DishHubRepository } from './dish-hub.repository';
import { DishDTO } from '../../../zelty/models/dish';
import { Observable } from 'rxjs';

@Injectable()
export class DishSynchronizerService {
  constructor(private readonly dishHubRepository: DishHubRepository) {}

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
