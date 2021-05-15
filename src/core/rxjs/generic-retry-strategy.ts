import { Logger } from '@nestjs/common';
import { Observable, throwError, timer } from 'rxjs';
import { finalize, mergeMap } from 'rxjs/operators';

export const genericRetryStrategy = ({
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = [],
  includedStatusCodes,
}: {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
  includedStatusCodes?: number[];
} = {}) => (attempts: Observable<any>) => {
  const logger = new Logger('genericRetryStrategy');
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      if (
        retryAttempt > maxRetryAttempts ||
        (includedStatusCodes != null &&
          !includedStatusCodes.some((c) => c === error.status)) ||
        excludedStatusCodes.find((e) => e === error.status)
      ) {
        return throwError(error);
      }
      logger.log(
        `Attempt ${retryAttempt}: retrying in ${
          retryAttempt * scalingDuration
        }ms`,
      );
      return timer(retryAttempt * scalingDuration);
    }),
    finalize(() => logger.log('retry finished')),
  );
};
