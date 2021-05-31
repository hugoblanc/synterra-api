import { subMinutes } from 'date-fns';

export enum DishPreparationType {
  PARALLELIZABLE,
  SEQUENTIALIZABLE,
}
export interface DishPreparationInformation {
  duration: number;
  preparationType: DishPreparationType;
}

const TAG_PREPARATION_TYPE = new Map<number, DishPreparationInformation>([
  [
    68231,
    {
      duration: 30,
      preparationType: DishPreparationType.PARALLELIZABLE,
    },
  ], // Burger
  [
    68232,
    {
      duration: 30,
      preparationType: DishPreparationType.SEQUENTIALIZABLE,
    },
  ], // Thai
  [
    68233,
    {
      duration: 20,
      preparationType: DishPreparationType.SEQUENTIALIZABLE,
    },
  ], // Salade
  [
    68234,
    {
      duration: 20,
      preparationType: DishPreparationType.PARALLELIZABLE,
    },
  ], // Accompagnement
  [
    68236,
    {
      duration: 1,
      preparationType: DishPreparationType.PARALLELIZABLE,
    },
  ], // Boissons
  [
    68237,
    {
      duration: 1,
      preparationType: DishPreparationType.PARALLELIZABLE,
    },
  ], // Dessert
]);

export function getPreparationInformationsByDish(
  tagId: number,
): DishPreparationInformation | undefined {
  return TAG_PREPARATION_TYPE.get(tagId);
}

const CITY_DURATION = new Map<string, number>([
  ['La Queue-lez-Yvelines', 30],
  ['Grosrouvre', 30],
  ['Vicq', 30],
  ['Mareil-le-Guyon', 30],
  ['Garancières', 30],
  ["Montfort-l'Amaury", 30],
  ['Auteuil', 30],
  ['Galluis', 30],
  ['Thoiry', 30],
  ["Saint-Rémy-l'Honoré", 30],
  ['Boissy-sans-Avoir', 30],
  ['Méré', 30],
  ['Neauphle-le-Château', 30],
  ['Millemont', 30],
  ['Orgerus', 30],
  ['Flexanville', 30],
  ['Marcq', 30],
  ['Bazoches-sur-Guyonne', 30],
  ['Les Mesnuls', 30],
  ['Le Tremblay-sur-Mauldre', 30],
  ['Villiers-le-Mahieu', 30],
  ['Villiers-Saint-Frédéric', 30],
  ['Neauphle-le-Vieux', 30],
  ['Jouars-Pontchartrain', 30],
  ['Saulx-Marchais', 30],
  ['Autouillet', 30],
]);

export function calculateMaxDeliveryTime(
  dueDate: string,
  city: string,
): string {
  const durationEstimation = CITY_DURATION.get(city) ?? 30;
  const result = subMinutes(new Date(dueDate), durationEstimation);
  return result.toISOString();
}
