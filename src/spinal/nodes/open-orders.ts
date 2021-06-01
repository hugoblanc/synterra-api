require('spinal-core-connectorjs');

export class OpenOrdersModel extends Model {
  private static emptyNode = { orders: [] };

  constructor(attrs = OpenOrdersModel.emptyNode) {
    super(); // 2
    this.add_attr(attrs);
  }
}
