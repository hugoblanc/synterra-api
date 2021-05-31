import { DishDTO } from '../models/dish';
import { DishOrder, OrderDTO, ZeltyMenu } from '../models/order.dto';

export function dishFinder(order: OrderDTO): DishOrder[] {
  return findDishInContentRecursively(order.contents);
}

function findDishInContentRecursively(
  contents: (ZeltyMenu | DishOrder)[],
): DishOrder[] {
  const dishes = [];
  if (!contents) {
    return dishes;
  }

  for (const content of contents) {
    if (content.type === 'dish' && !isDeliveryFees(content)) {
      dishes.push(content as DishOrder);
    } else {
      const menu: ZeltyMenu = content as ZeltyMenu;
      dishes.push(...findDishInContentRecursively(menu.contents));
    }
  }
  return dishes;
}

function isDeliveryFees(content) {
  return content?.item_id === 527933;
}
