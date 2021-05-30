import { format } from 'date-fns';
export function createSummaryFromDate(date: string | Date | number): string {
  if (date == null) {
    throw new Error('Cannot convert empty date');
  }

  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }

  const dateString = format(date, 'yyyy-MM-dd');
  const prefix = determinePrefix(date);

  return `${prefix} ${dateString}`;
}

function determinePrefix(date: Date) {
  const currentHour = date.getHours();
  let prefix = '';

  if (currentHour < 14) {
    prefix = 'Midi';
  } else {
    prefix = 'Soir';
  }

  return prefix;
}
