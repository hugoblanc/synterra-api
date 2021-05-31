import { QuantityEntity } from '../../domain/quantity/entities/quantity.entity';
export interface GetDishesZeltyDTO {
  dishes: DishDTO[];
  errno: number;
}

export interface GetDishByIdZeltyDTO {
  dish: DishDTO[];
  errno: number;
}

export interface DishDTO {
  id: number;
  remote_id?: any;
  id_restaurant: number;
  sku?: any;
  name: string;
  description?: string;
  image: string;
  thumb: string;
  price: number;
  price_togo?: any;
  price_delivery?: any;
  happy_price?: any;
  cost_price?: any;
  tva: number;
  tvat?: any;
  tvad?: number;
  tax: number;
  tax_takeaway?: any;
  tax_delivery?: number;
  tags: number[];
  options: number[];
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
  // meta: MetaDTO;
  quantities?: QuantityEntity[];
}

// interface MetaDTO {}
