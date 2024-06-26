export class ArrayHelper {
  static arrayAverage(array: number[]) {
    array = array.filter((n) => !isNaN(n));
    let total = 0;
    for (const val of array) {
      total += val;
    }
    const avg = total / array.length;
    const trunkedAvg = Math.trunc(avg);
    return trunkedAvg;
  }

  static groupBy<T, K extends keyof T, J extends keyof T[K]>(
    array: T[],
    key: K,
    childKey?: J,
  ) {
    return array.reduce((acc, value) => {
      if (childKey) {
        (acc[value[key][childKey]] = acc[value[key][childKey]] || []).push(
          value,
        );
      } else {
        (acc[value[key]] = acc[value[key]] || []).push(value);
      }
      return acc;
    }, {} as any);
  }
}
