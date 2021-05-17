import { OrderDTO, DishOrder, ZeltyMenu } from '../models/order';

export function dishFinder(order: OrderDTO) {
  const dishes: DishOrder[] = [];
  for (const content of order.contents) {
    if (content.type === 'dish') {
      dishes.push(content as DishOrder);
    } else {
      const menu: ZeltyMenu = content as ZeltyMenu;
      for (const content of menu.contents) {
        if (content.type === 'dish') {
          dishes.push(content as DishOrder);
        }
      }
    }
  }

  return dishes;
}
