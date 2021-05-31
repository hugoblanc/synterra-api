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
  contents: (ZeltyMenu | DishOrder)[];
  channel: string;
  virtual_brand_name?: any;
  delivery_started: string;
  delivery_ended: string;
  delivery_address?: Deliveryaddress;
}

export interface Deliveryaddress {
  id: number;
  remote_id?: any;
  name: string;
  street: string;
  street_num: string;
  zip_code: string;
  city: string;
  formatted_address: string;
  google_id: string;
  location?: any;
  address_more: string;
  floor: string;
  door: string;
  building: string;
  code: string;
}

export interface ZeltyMenu {
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
  item_id: number;
  contents: Content[];
}

interface Content {
  id: number;
  type: string;
  quantity: number;
  name: string;
}
