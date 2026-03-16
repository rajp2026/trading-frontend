import { apiClient } from "../../../core/api/apiClient";

export const marketService = {
  async getTickers() {
    const res = await apiClient.get("market/tickers");
    return res.data;
  },

  async getTicker(symbol: string) {
    const res = await apiClient.get(`/ticker/${symbol}`);
    return res.data;
  },
};
