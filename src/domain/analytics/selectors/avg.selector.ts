import { AvgTimingModel } from '@synterra/shared';

import { JIRA_PROGRESS_COLUMN_ID } from '../../../coordination/static-order-info';

export function isPreparationTimeUpdated(avgTiming: AvgTimingModel) {
  const componentIds = Object.keys(avgTiming);
  for (const id of componentIds) {
    const compAvg = avgTiming[id];
    const preparationTime: spinal.Model = compAvg[JIRA_PROGRESS_COLUMN_ID];
    if (
      preparationTime != null &&
      preparationTime.has_been_directly_modified()
    ) {
      return true;
    }
  }
  return false;
}
