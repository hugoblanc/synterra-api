import { Injectable } from '@nestjs/common';
import { SpinalInterface } from 'src/spinal/core/framework/spinal-model';
import { HubRepository } from '../../core/framework/hub-service';
import { SpinalService } from '../../core/hub/spinal.service';
import { DishDTO } from '../../../zelty/models/dish';

export type DishNode = DishDTO & SpinalInterface;
export type DishListNode = DishNode[] & SpinalInterface & { orders: any[] };

@Injectable()
export class DishHubRepository extends HubRepository<DishListNode> {
  protected get emptyNode(): SpinalInterface {
    return new (require('../../nodes/dishes-list').DishesListModel)({
      orders: [],
    });
  }

  readonly NODE_NAME = 'dishes-list';

  constructor(spinal: SpinalService) {
    super(spinal);
  }
}
