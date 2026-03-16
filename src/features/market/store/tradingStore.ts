import { create } from "zustand";

type TradingState = {
  selectedSymbol: string;
  setSymbol: (symbol: string) => void;
};

export const useTradingStore = create<TradingState>((set) => ({
  selectedSymbol: "BTCUSDT",

  setSymbol: (symbol) => {
    console.log("Setting symbol:", symbol); // DEBUG
    set({ selectedSymbol: symbol });
  },
}));
