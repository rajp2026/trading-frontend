import { useEffect, useRef } from "react";
import { useMarketStore } from "../store/marketStore";

export const useMarketStream = (symbols: string[]) => {
  const updateTickersBatch = useMarketStore((s) => s.updateTickersBatch);
  const wsRef = useRef<WebSocket | null>(null);
  const lastSubscribedSymbolsRef = useRef<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/market");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Market Stream Connected ✅");
      if (symbols.length > 0) {
        const symbolsStr = JSON.stringify(symbols.sort());
        ws.send(
          JSON.stringify({
            type: "subscribe",
            symbols: symbols,
          })
        );
        lastSubscribedSymbolsRef.current = symbolsStr;
      }
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "market_batch") {
        updateTickersBatch(msg.data);
      }
    };

    ws.onerror = (err) => {
      console.error("Market Stream Error:", err);
    };

    ws.onclose = () => {
      console.log("Market Stream Closed ❌");
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  // Handle Dynamic Subscriptions (only if symbols actually changed)
  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN && symbols.length > 0) {
      const symbolsStr = JSON.stringify(symbols.sort());
      
      // Only send if the set of symbols has actually changed
      if (symbolsStr !== lastSubscribedSymbolsRef.current) {
        wsRef.current.send(
          JSON.stringify({
            type: "subscribe",
            symbols: symbols,
          })
        );
        lastSubscribedSymbolsRef.current = symbolsStr;
      }
    }
  }, [symbols]);
};
