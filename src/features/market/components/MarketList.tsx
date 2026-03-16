import { useEffect } from "react";
import { marketService } from "../api/marketService";
import { useMarketStore } from "../store/marketStore";
import MarketRow from "./MarketRow";
import { useMarketStream } from "../hooks/useMarketStream";
import { useTradingStore } from "../store/tradingStore";

export default function MarketList() {
  const tickers = useMarketStore((s) => s.tickers);
  const setSymbol = useTradingStore((state) => state.setSymbol);
  const setTickers = useMarketStore((s) => s.setTickers);

  useMarketStream();

  useEffect(() => {
    const load = async () => {
      const data = await marketService.getTickers();

      setTickers(data);
    };

    load();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#131722] text-gray-200 overflow-y-auto">
      <div className="grid grid-cols-3 px-3 py-2 text-xs font-semibold text-gray-400 border-b border-[#1e222d] shrink-0">
        <div>Symbol</div>
        <div>Price</div>
        <div>24h</div>
      </div>

      {Object.entries(tickers).map(([symbol, ticker]: any) => (
        <MarketRow
          key={symbol}
          symbol={symbol}
          price={ticker.price}
          change={ticker.change_24h}
          onClick={() => setSymbol(symbol)}
        />
      ))}
    </div>
  );
}
