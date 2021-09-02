import {
  CreateComponent,
  CreatePriority,
} from '../../jira/models/jira-issue-created.dto';
import { DishDTO } from '../../zelty/models/dish';
import {
  defaultComponent,
  TAG_COMPOSANT,
  TAG_PRIORITIES,
} from '../static-order-info';

export function findJiraComponent(dish: DishDTO): CreateComponent {
  const component = dish?.tags
    .filter((t) => TAG_COMPOSANT.has(t))
    .map((t) => TAG_COMPOSANT.get(t));

  return component[0] ? { id: component[0] } : defaultComponent;
}

export function selectPriority(dish: DishDTO): CreatePriority | undefined {
  const priority = dish?.tags
    .filter((t) => TAG_PRIORITIES.has(t))
    .map((t) => TAG_PRIORITIES.get(t));

  return priority[0] ? { id: priority[0] } : undefined;
}
