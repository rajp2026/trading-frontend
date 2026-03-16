import { apiClient } from "./apiClient";

export const candleService = {
  async getCandles(symbol: string) {
    const res = await apiClient.get(`/market/candles/${symbol}`);
    return res.data;
  },
};
