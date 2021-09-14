import { Logger } from '@nestjs/common';
import { AvgTimeIntervalDTO } from '@synterra/shared/dist/class/avg-timing';
import {
  COMPOSANT_CAPACITY,
  JIRA_PROGRESS_COLUMN_ID,
} from './static-order-info';

export function findTimePreparationTime(timing: {
  [k: string]: AvgTimeIntervalDTO;
}) {
  const logger = new Logger(findTimePreparationTime.name);
  const avgTimeInterval = timing[JIRA_PROGRESS_COLUMN_ID];
  if (!avgTimeInterval) {
    logger.warn('Pas de timing \n ' + JSON.stringify(timing));
  }
  return avgTimeInterval?.offset;
}

export function findCapacityByComponentId(componentId: string): number {
  return COMPOSANT_CAPACITY.get(componentId);
}
