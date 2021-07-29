import { Injectable } from '@nestjs/common';
import { HubRepository } from '@synterra/spinal-rxjs';
import { DishDTO } from '../../../zelty/models/dish';
// import { HubRepository } from '../../core/framework/hub-repository';
import { SpinalService } from '../../core/hub/spinal.service';
import { DishModel } from '../../models/dishes/dish';
import { DishesListModel } from '../../models/dishes/dishes-list';

@Injectable()
export class DishHubRepository extends HubRepository<DishModel, DishDTO> {
  readonly NODE_NAME = 'dishes-list';

  protected get emptyNode(): DishesListModel {
    return new DishesListModel();
  }

  constructor(spinal: SpinalService) {
    super(spinal);
  }
}
