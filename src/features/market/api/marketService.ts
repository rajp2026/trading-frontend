import { apiClient } from "../../../core/api/apiClient";

export const marketService = {
  async getTickers() {
    const res = await apiClient.get("market/tickers");
    debugger;
    return res.data;
  },

  async getTicker(symbol: string) {
    const res = await apiClient.get(`/ticker/${symbol}`);
    return res.data;
  },
};
