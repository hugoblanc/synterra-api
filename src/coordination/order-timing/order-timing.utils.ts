import { Logger } from '@nestjs/common';
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
      duration: 5,
      preparationType: DishPreparationType.PARALLELIZABLE,
    },
  ], // Burger
  [
    68232,
    {
      duration: 4,
      preparationType: DishPreparationType.SEQUENTIALIZABLE,
    },
  ], // Thai
  [
    68233,
    {
      duration: 4,
      preparationType: DishPreparationType.SEQUENTIALIZABLE,
    },
  ], // Salade
  [
    68234,
    {
      duration: 4,
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

// const CITY_DURATION = new Map<string, number>([
//   ['La Queue-lez-Yvelines', 30],
//   ['Grosrouvre', 30],
//   ['Vicq', 30],
//   ['Mareil-le-Guyon', 30],
//   ['Garancières', 30],
//   ["Montfort-l'Amaury", 30],
//   ['Auteuil', 30],
//   ['Galluis', 30],
//   ['Thoiry', 30],
//   ["Saint-Rémy-l'Honoré", 30],
//   ['Boissy-sans-Avoir', 30],
//   ['Méré', 30],
//   ['Neauphle-le-Château', 30],
//   ['Millemont', 30],
//   ['Orgerus', 30],
//   ['Flexanville', 30],
//   ['Marcq', 30],
//   ['Bazoches-sur-Guyonne', 30],
//   ['Les Mesnuls', 30],
//   ['Le Tremblay-sur-Mauldre', 30],
//   ['Villiers-le-Mahieu', 30],
//   ['Villiers-Saint-Frédéric', 30],
//   ['Neauphle-le-Vieux', 30],
//   ['Jouars-Pontchartrain', 30],
//   ['Saulx-Marchais', 30],
//   ['Autouillet', 30],
// ]);

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

export function calculateMaxDeliveryTime(
  dueDate: string,
  city: string,
): string {
  const logger = new Logger(calculateMaxDeliveryTime.name);
  let durationEstimation = 30;
  if (CITY_DURATION.has(city)) {
    durationEstimation = CITY_DURATION.get(city);
  } else {
    logger.error('CITY NOT FOUND => ' + city);
  }
  const result = subMinutes(new Date(dueDate), durationEstimation);
  return result.toISOString();
}
