export interface AvgTiming {
  [k: string]: {
    [k: string]: AvgTimeInterval;
  };
}

export interface AvgTimeInterval {
  offset?: number;
  count: number;
}
