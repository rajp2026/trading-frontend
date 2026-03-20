import { useEffect, useRef } from "react";
import { useMarketStore } from "../store/marketStore";
import { wsManager } from "../../../core/ws/wsManager";

export const useMarketStream = (symbols: string[]) => {
  const updateTickersBatch = useMarketStore((s) => s.updateTickersBatch);
  const lastSubscribedSymbolsRef = useRef<string>("");

  // Register the market_batch handler once
  useEffect(() => {
    const handler = (msg: any) => {
      updateTickersBatch(msg.data);
    };

    wsManager.onMessage("market_batch", handler);

    return () => {
      wsManager.offMessage("market_batch", handler);
    };
  }, [updateTickersBatch]);

  // Send subscription when symbols change
  useEffect(() => {
    if (symbols.length === 0) return;

    const symbolsStr = JSON.stringify(symbols.sort());

    if (symbolsStr !== lastSubscribedSymbolsRef.current) {
      wsManager.subscribeMarket(symbols);
      lastSubscribedSymbolsRef.current = symbolsStr;
    }
  }, [symbols]);
};
