import { Model } from 'spinal-core-connectorjs_type';
import { OrderDTO } from '../../../zelty/models/order.dto';

export class OpenOrderModel extends Model {
  id: spinal.Val;
  uuid: spinal.Str;
  comment?: any;
  device_id?: any;
  remote_id?: any;
  ref: spinal.Val;
  loyalty: spinal.Val;
  covers: spinal.Val;
  table: spinal.Val;
  id_restaurant: spinal.Val;
  created_at: spinal.Str;
  due_date: spinal.Str;
  mode: spinal.Val;
  source: spinal.Val;
  status: spinal.Val;
  total_discount: spinal.Val;
  price: spinal.Val;
  contents: (ZeltyMenu | DishOrder)[];
  channel: spinal.Str;
  virtual_brand_name?: any;
  delivery_started: spinal.Str;
  delivery_ended: spinal.Str;
  delivery_address?: DeliveryAddressModel;

  constructor(attrs: OrderDTO) {
    super();
    this.add_attr(attrs);
  }
}

export class DeliveryAddressModel extends Model {
  id: spinal.Val;
  remote_id?: any;
  name: spinal.Str;
  street: spinal.Str;
  street_num: spinal.Str;
  zip_code: spinal.Str;
  city: spinal.Str;
  formatted_address: spinal.Str;
  google_id: spinal.Str;
  location?: any;
  address_more: spinal.Str;
  floor: spinal.Str;
  door: spinal.Str;
  building: spinal.Str;
  code: spinal.Str;
}

export class ZeltyMenu extends Model {
  id: spinal.Val;
  name: spinal.Str;
  type: spinal.Str;
  item_id: spinal.Val;
  price: spinal.Val;
  contents: DishOrder[];
}

export interface DishOrder {
  id: spinal.Val;
  type: spinal.Str;
  name: spinal.Str;
  item_id: number;
  contents: Content[];
}

interface Content {
  id: number;
  type: spinal.Str;
  quantity: number;
  name: spinal.Str;
}
