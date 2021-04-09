import { Injectable } from '@nestjs/common';
import { HubRepository } from '../../core/framework/hub-service';
import { SpinalService } from '../../core/hub/spinal.service';
import { DishDTO } from '../../../zelty/models/dish';
import { SpinalInterface } from '../../core/framework/spinal-model';

export type DishNode = DishDTO & SpinalInterface;
export type DishListNode = DishNode[] & SpinalInterface & { dishes: any[] };

@Injectable()
export class DishHubRepository extends HubRepository<DishListNode> {
  protected get emptyNode(): SpinalInterface {
    return new (require('../../nodes/dishes-list').DishesListModel)({
      dishes: [],
    });
  }

  readonly NODE_NAME = 'dishes-list';

  constructor(spinal: SpinalService) {
    super(spinal);
  }
}
