import { Logger } from '@nestjs/common';
import { subMinutes } from 'date-fns';
import { CITY_DURATION } from '../static-order-info';

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
