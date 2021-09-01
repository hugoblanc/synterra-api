import { Injectable } from '@nestjs/common';
import { AbstractList, HubRepository } from '@synterra/spinal-rxjs';
import { map } from 'rxjs';
import { Bool, Lst, Model, Str, Val } from 'spinal-core-connectorjs_type';
import { PartialDeep } from 'type-fest';
import { OrderDTO } from '../../../zelty/models/order.dto';
import { SpinalService } from '../../core/hub/spinal.service';
import { OpenOrderModel } from '../../models/open-orders/open-order';
import { OpenOrdersListModel } from '../../models/open-orders/open-orders-list';
// TODO faire dépendre le repository d'une definition externe du metier => l'entité

@Injectable()
export class OpenOrdersHubRepository extends HubRepository<
  OpenOrderModel,
  OrderDTO
> {
  protected get emptyNode(): OpenOrdersListModel {
    return new OpenOrdersListModel();
  }

  protected readonly NODE_NAME = 'open-orders';

  constructor(spinal: SpinalService) {
    super(spinal);
  }

  public findChild(where: PartialDeep<OrderDTO>) {
    return this.load().pipe(
      map((nodes: AbstractList<OpenOrderModel>) => {
        for (let i = 0; i < nodes.list.length; i++) {
          const orderModel = nodes.list[i];
          const matchingResult = this.findPartial(where, orderModel);
          if (matchingResult) {
            return matchingResult;
          }
        }
        return;
      }),
    );
  }

  private findPartial(partial: PartialDeep<OrderDTO>, root: spinal.Model) {
    let isObjKeyvalid = false;
    for (const key in partial) {
      if (Object.prototype.hasOwnProperty.call(partial, key)) {
        const newRoot = root[key];
        const newPartial = partial[key];
        if (newRoot instanceof Lst) {
          for (let i = 0; i < newRoot.length; i++) {
            const childRoot = newRoot[i];
            const matchingResult = this.findPartial(newPartial[0], childRoot);
            if (matchingResult) {
              return matchingResult;
            }
          }
        } else if (
          newRoot instanceof Val ||
          newRoot instanceof Str ||
          newRoot instanceof Bool
        ) {
          const nodeValue = newRoot?.get();
          if (nodeValue !== newPartial) {
            return;
          }
          isObjKeyvalid = true;
        } else if (newRoot instanceof Model) {
          return this.findPartial(newPartial, newRoot as any);
        } else {
          throw new Error("We don't do that here");
        }
      }
    }
    if (isObjKeyvalid) {
      return root;
    }
  }
}
