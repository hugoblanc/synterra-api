import { Injectable } from '@nestjs/common';
import { DishDTO } from '../../../zelty/models/dish';
import { HubRepository } from '../../core/framework/hub-service';
import { SpinalInterface } from '../../core/framework/spinal-model';
import { SpinalService } from '../../core/hub/spinal.service';

export type DishNode = DishDTO & SpinalInterface;
export type DishListNode = DishNode[] & SpinalInterface & { dishes: any[] };

@Injectable()
export class DishHubRepository extends HubRepository<DishListNode> {
  protected readonly ROOT_NAME = 'dishes';
  readonly NODE_NAME = 'dishes-list';

  protected get emptyNode(): SpinalInterface {
    return new (require('../../nodes/dishes-list').DishesListModel)({
      dishes: [],
    });
  }

  constructor(spinal: SpinalService) {
    super(spinal);
  }
}
