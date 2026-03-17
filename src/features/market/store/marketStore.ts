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
  updateTickersBatch: (updates: { symbol: string; price: string; change_24h?: number }[]) => void;
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

  updateTickersBatch: (updates) =>
    set((state) => {
      const newTickers = { ...state.tickers };
      let changed = false;

      updates.forEach(({ symbol, price, change_24h }) => {
        if (newTickers[symbol]) {
          newTickers[symbol] = {
            ...newTickers[symbol],
            price,
            change_24h: change_24h !== undefined ? change_24h : newTickers[symbol].change_24h,
          };
          changed = true;
        }
      });

      return changed ? { tickers: newTickers } : state;
    }),
}));

// backend ticker -> Store
// WebSocket update -> update price
// UI -> susbribe to Store
