import { useEffect } from "react";
import { useMarketStore } from "../store/marketStore";

export const useMarketStream = () => {
  const updatePrice = useMarketStore((s) => s.updatePrice);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/market");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "market_batch") {
        msg.data.forEach((ticker: any) => {
          updatePrice(ticker.symbol, ticker.price);
        });
      }
    };

    return () => ws.close();
  }, []);
};
