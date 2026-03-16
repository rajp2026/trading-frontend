import type { CandlestickData, Time } from "lightweight-charts";

export const dummyCandles: CandlestickData<Time>[] = [
  { time: 1710000000 as Time, open: 70000, high: 72000, low: 69000, close: 71000 },
  { time: 1710000600 as Time, open: 71000, high: 72500, low: 70500, close: 72000 },
  { time: 1710001200 as Time, open: 72000, high: 73500, low: 71000, close: 73000 },
  { time: 1710001800 as Time, open: 73000, high: 74000, low: 72000, close: 72500 },
  { time: 1710002400 as Time, open: 72500, high: 73500, low: 71000, close: 71500 },
];
