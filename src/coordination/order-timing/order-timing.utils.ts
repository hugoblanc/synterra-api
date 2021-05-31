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

const AVG_TIME_ELAPSE = 1000 * 60 * 45;
export function calculateMaxDeliveryTime(dueDate: string): string {
  const maxDeliveryDepartueMs = new Date(dueDate).getTime() - AVG_TIME_ELAPSE;

  return new Date(maxDeliveryDepartueMs).toISOString();
}
