import { Logger } from '@nestjs/common';
import { subMinutes } from 'date-fns';
import { DishDTO } from '../../zelty/models/dish';

export enum DishPreparationType {
  PARALLELIZABLE,
  SEQUENTIALIZABLE,
}
export interface DishPreparationInformation {
  duration: number;
  preparationType: DishPreparationType;
  label: string;
}

const TAG_PREPARATION_TYPE = new Map<number, DishPreparationInformation>([
  [
    68231,
    {
      duration: 5,
      preparationType: DishPreparationType.PARALLELIZABLE,
      label: 'burger',
    },
  ], // Burger
  [
    68232,
    {
      duration: 4,
      preparationType: DishPreparationType.SEQUENTIALIZABLE,
      label: 'thai',
    },
  ], // Thai
  [
    68233,
    {
      duration: 4,
      preparationType: DishPreparationType.SEQUENTIALIZABLE,
      label: 'salade',
    },
  ], // Salade
  [
    68234,
    {
      duration: 4,
      preparationType: DishPreparationType.PARALLELIZABLE,
      label: 'other',
    },
  ], // Accompagnement
  [
    68236,
    {
      duration: 1,
      preparationType: DishPreparationType.PARALLELIZABLE,
      label: 'other',
    },
  ], // Boissons
  [
    68237,
    {
      duration: 1,
      preparationType: DishPreparationType.PARALLELIZABLE,
      label: 'other',
    },
  ], // Dessert
]);

export function findPreparationTime(
  dish: DishDTO,
): DishPreparationInformation | undefined {
  const preparation = dish?.tags
    .filter((t) => TAG_PREPARATION_TYPE.has(t))
    .map((t) => TAG_PREPARATION_TYPE.get(t));
  return preparation[0] ?? undefined;
}

const CITY_DURATION = new Map<string, number>([
  ['Galluis', 11],
  ['Vicq', 10],
  ['Méré', 11],
  ['Boissy-sans-Avoir', 10],
  ['Auteuil-le-Roi', 12],
  ['Gambais', 16],
  ['La Queue-lez-Yvelines', 13],
  ["Montfort-l'Amaury", 14],
  ['Neauphle-le-Vieux', 13],
  ['Saulx-Marchais', 15],
  ['Mareil-le-Guyon', 14],
  ['Bazoches-sur-Guyonne', 16],
  ['Grosrouvre', 16],
  ['Millemont', 14],
  ['Garancières', 15],
  ['Autouillet', 14],
  ['Tremblay-sur-Mauldre', 20],
  ['Villiers-Saint-Frédéric', 16],
  ['Les Mesnuls', 17],
  ['Marcq', 15],
  ['Thoiry', 15],
  ['Jouars-Pontchartrain', 18],
  ['Villiers-le-Mahieu', 18],
  ["Saint-Remy-l'Honoré", 22],
  ['Flexanville', 20],
  ['Béhoust', 18],
  ['Orgerus', 21],
  ['Neauphle-le-Château', 18],
]);

export function calculateMaxDeliveryTime(dueDate: string, city: string): Date {
  const logger = new Logger(calculateMaxDeliveryTime.name);
  let durationEstimation = 30;
  if (CITY_DURATION.has(city)) {
    durationEstimation = CITY_DURATION.get(city);
  } else {
    logger.error('CITY NOT FOUND => ' + city);
  }
  const result = subMinutes(new Date(dueDate), durationEstimation);
  return result;
}
