import { DishPreparationInformation } from '../../../coordination/order-timing/order-timing.utils';
import { ModifyDeep } from '../../../core/typescript/modify-deep';
import {
  CreateComponent,
  CreatePriority,
} from '../../../jira/models/jira-issue-created.dto';
import {
  DishOrder,
  OrderDTO,
  ZeltyMenu,
} from '../../../zelty/models/order.dto';

interface ZeltyMenuOverride extends ZeltyMenu {
  contents: DishOrderEnhance[];
}

type ZeltyMenuEnhanced = ModifyDeep<ZeltyMenu, ZeltyMenuOverride>;

export interface OrderEnhanced extends OrderDTO {
  maxDeliveryDate: Date;
  contents: (ZeltyMenuEnhanced | DishOrderEnhance)[];
}

interface DishOverride {
  priority: CreatePriority | undefined;
  component: CreateComponent;
  preparation: DishPreparationInformation | undefined;
  startPreparation: Date;
}

export interface DishOrderEnhance extends DishOrder, DishOverride {}
