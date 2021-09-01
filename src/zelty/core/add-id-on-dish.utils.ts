import { OrderDTO } from '../models/order.dto';

export function addUniqueIdOnDishes(order: OrderDTO) {
  for (const content of order.contents) {
    if (content.type === 'menu') {
      for (const dish of content?.contents) {
        dish.item_id = dish.id;
        dish.id = +(content.id + '' + dish.item_id);
      }
    }
  }
}
