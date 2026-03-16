import { apiClient } from "./apiClient";

export const candleService = {
  async getCandles(symbol: string, interval: string, endTime?: number) {
    const res = await apiClient.get("/market/candles/" + symbol, {
      params: {
        interval,
        end_time: endTime,
      },
    });

    return res.data;
  },
};
