const AVG_TIME_ELAPSE = 1000 * 60 * 45;
export function calculateMaxDeliveryTime(dueDate: string): string {
  const maxDeliveryDepartueMs = new Date(dueDate).getTime() - AVG_TIME_ELAPSE;

  return new Date(maxDeliveryDepartueMs).toISOString();
}
