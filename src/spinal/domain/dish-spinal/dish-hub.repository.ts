import { Injectable } from '@nestjs/common';
import { SpinalService } from '@synterra/shared';
import { ListHubRepository } from '@synterra/spinal-rxjs';
import { DishDTO } from '../../../zelty/models/dish';
import { DishModel } from '../../models/dishes/dish';
import { DishesListModel } from '../../models/dishes/dishes-list';

@Injectable()
export class DishHubRepository extends ListHubRepository<DishModel, DishDTO> {
  readonly NODE_NAME = 'dishes-list';

  protected get emptyNode(): DishesListModel {
    return new DishesListModel();
  }

  constructor(spinal: SpinalService) {
    super(spinal);
  }
}
