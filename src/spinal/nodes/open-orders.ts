import { Model } from 'spinal-core-connectorjs_type';

export class OpenOrdersModel extends Model {
  private static emptyNode = { orders: [] };

  constructor(attrs = OpenOrdersModel.emptyNode) {
    super(); // 2
    this.add_attr(attrs);
  }
}
