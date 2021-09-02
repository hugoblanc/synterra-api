export interface AvgTimingDTO {
  [k: string]: AvgColumnTimingDTO;
}

export interface AvgColumnTimingDTO {
  [k: string]: AvgTimeIntervalDTO;
}
export interface AvgTimeIntervalDTO {
  offset?: number;
  count: number;
}
