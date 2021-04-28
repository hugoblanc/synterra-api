export class ArrayHelper {
  static arrayAverage(array: number[]) {
    array = array.filter((n) => !isNaN(n));
    let total = 0;
    for (const val of array) {
      total += val;
    }
    console.log(total);
    const avg = total / array.length;
    console.log(avg);
    const trunkedAvg = Math.trunc(avg);
    console.log(trunkedAvg);
    return trunkedAvg;
  }
}
