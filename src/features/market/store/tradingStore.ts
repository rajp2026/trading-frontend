import { create } from "zustand";

type TradingState = {
  selectedSymbol: string;
  interval: string;
  setSymbol: (symbol: string) => void;
  setInterval: (interval: string) => void;
};

export const useTradingStore = create<TradingState>((set) => ({
  selectedSymbol: "BTCUSDT",
  interval: "1m",

  setSymbol: (symbol) => set({ selectedSymbol: symbol }),

  setInterval: (interval) => set({ interval }),
}));
