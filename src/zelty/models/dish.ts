/* eslint-disable prettier/prettier */
export interface ZeltyDishesResponse {
  dishes: Dish[];
  errno: number;
}
export interface ZeltyDishResponse {
  dish: Dish;
  errno: number;
}

export interface Dish {
  id: number;
  remote_id?: any;
  id_restaurant: number;
  sku?: any;
  name: string;
  description?: any;
  image: string;
  thumb: string;
  price: number;
  price_togo?: any;
  price_delivery?: any;
  happy_price?: any;
  cost_price?: any;
  tva: number;
  tvat?: any;
  tvad?: any;
  tax: number;
  tax_takeaway?: any;
  tax_delivery?: any;
  tags: number[];
  options: any[];
  id_fabrication_place: number;
  fab_name?: any;
  color?: any;
  loyalty_points: number;
  loyalty_points_discount?: any;
  earn_loyalty: number;
  price_to_define: boolean;
  weight_for_price?: any;
  disable: boolean;
  disable_takeaway: boolean;
  disable_delivery: boolean;
  disable_before?: any;
  disable_after?: any;
  o: number;
  zc_only: boolean;
}
