import { useEffect } from "react";
import { marketService } from "../api/marketService";
import { useMarketStore } from "../store/marketStore";
import MarketRow from "./MarketRow";
import { useMarketStream } from "../hooks/useMarketStream";

export default function MarketList() {
  const tickers = useMarketStore((s) => s.tickers);
  debugger;
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
    <div className="col-span-2 bg-black text-white overflow-y-auto">
      <div className="grid grid-cols-3 px-3 py-2 text-xs text-gray-400 border-b border-white/10">
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
        />
      ))}
    </div>
  );
}
