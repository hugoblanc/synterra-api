export interface OrderReponse {
  orders: OrderDTO[];
}

export interface OrderDTO {
  id: number;
  uuid: string;
  comment?: any;
  device_id?: any;
  remote_id?: any;
  ref: number;
  loyalty: number;
  covers: number;
  table: number;
  id_restaurant: number;
  created_at: string;
  due_date: string;
  mode: number;
  source: number;
  status: number;
  total_discount: number;
  price: number;
  contents: Menu[];
  channel: string;
  virtual_brand_name?: any;
  delivery_started: string;
  delivery_ended: string;
}

interface Menu {
  id: number;
  name: string;
  type: string;
  item_id: number;
  price: number;
  contents: DishOrder[];
}

export interface DishOrder {
  id: number;
  type: string;
  name: string;
  contents: Content[];
}

interface Content {
  id: number;
  type: string;
  quantity: number;
  name: string;
}
