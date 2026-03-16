import { apiClient } from "./apiClient";

export const candleService = {
  async getCandles(symbol: string, interval: string) {
    const res = await apiClient.get(
      `/market/candles/${symbol}?interval=${interval}`,
    );
    return res.data;
  },
};
