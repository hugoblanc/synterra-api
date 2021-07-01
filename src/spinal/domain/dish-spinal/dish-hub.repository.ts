import { Injectable } from '@nestjs/common';
import { DishDTO } from '../../../zelty/models/dish';
import { HubRepository } from '../../core/framework/hub-service';
import { SpinalService } from '../../core/hub/spinal.service';

export type DishNode = DishDTO & spinal.Model;
export type DishListNode = DishNode[] & spinal.Model & { dishes: any[] };

@Injectable()
export class DishHubRepository extends HubRepository<DishListNode> {
  protected readonly ROOT_NAME = 'dishes';
  readonly NODE_NAME = 'dishes-list';

  protected get emptyNode(): spinal.Model {
    return new (require('../../nodes/dishes-list').DishesListModel)({
      dishes: [],
    });
  }

  constructor(spinal: SpinalService) {
    super(spinal);
    console.log(
      'Spinal repository ------------------------------------------------',
    );
    console.log(spinal);
  }
}
