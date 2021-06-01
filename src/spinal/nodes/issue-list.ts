import { Model } from 'spinal-core-connectorjs';
import { SpinalInterface } from '../core/framework/spinal-model';

export class IssueListModel extends Model implements SpinalInterface {
  constructor(attrs: any) {
    super(); // 2
    this.add_attr(attrs);
  }

  addAttr(attrs: any) {
    this.add_attr(attrs);
  }
}
