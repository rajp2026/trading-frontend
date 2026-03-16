import { create } from "zustand";

interface Ticker {
  symbol: string;
  price: string;
  change_24h?: number;
  volume_24h?: number;
}

interface MarketState {
  tickers: Record<string, Ticker>;

  setTickers: (data: Record<string, Ticker>) => void;

  updatePrice: (symbol: string, price: string) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  tickers: {},

  setTickers: (data) => set({ tickers: data }),

  updatePrice: (symbol, price) =>
    set((state) => ({
      tickers: {
        ...state.tickers,
        [symbol]: {
          ...state.tickers[symbol],
          price,
        },
      },
    })),
}));

// backend ticker -> Store
// WebSocket update -> update price
// UI -> susbribe to Store
