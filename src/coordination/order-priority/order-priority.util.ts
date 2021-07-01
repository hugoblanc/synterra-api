import {
  CreateComponent,
  CreatePriority,
} from '../../jira/models/jira-issue-created.dto';
import { DishDTO } from '../../zelty/models/dish';

const TAG_PRIORITIES = new Map<number, string>([
  [68231, '1'],
  [68232, '1'],
  [70806, '1'],
  [68234, '2'],
  [68233, '3'],
  [68236, '4'],
  [68237, '4'],
]);

export function selectPriority(dish: DishDTO): CreatePriority | undefined {
  const priority = dish.tags
    .filter((t) => TAG_PRIORITIES.has(t))
    .map((t) => TAG_PRIORITIES.get(t));

  return priority[0] ? { id: priority[0] } : undefined;
}

// TODO uncomment this
// const TAG_COMPOSANT = new Map<number, string>([
//   [68231, '10006'], //BURGER BURGER
//   [70806, '10006'], //Menu enfant aka cheeseburger
//   [68232, '10009'],
//   [68234, '10007'], // Accompagnement - Friteuse
//   [68233, '10008'], // Salade
//   [80177, '10008'], // Aperitivo
//   // [68236, '4'],
//   // [68237, '4'],
// ]);

const TAG_COMPOSANT = new Map<number, string>([
  [68231, '10013'], //BURGER BURGER
  [70806, '10013'], //Menu enfant aka cheeseburger
  [68232, '10011'],
  [68234, '10014'], // Accompagnement - Friteuse
  [68233, '10012'], // Salade
  [80177, '10012'], // Aperitivo
  // [68236, '4'],
  // [68237, '4'],
]);

export function findJiraComponent(dish: DishDTO): CreateComponent | undefined {
  const component = dish.tags
    .filter((t) => TAG_COMPOSANT.has(t))
    .map((t) => TAG_COMPOSANT.get(t));

  // TODO uncomment this
  // return component[0] ? { id: component[0] } : { id: '10010' };
  return component[0] ? { id: component[0] } : { id: '10015' };
}
