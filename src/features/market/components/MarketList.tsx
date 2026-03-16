import { useEffect, useState } from "react";
import { marketService } from "../api/marketService";
import { useMarketStore } from "../store/marketStore";
import MarketRow from "./MarketRow";
import { useMarketStream } from "../hooks/useMarketStream";
import { useTradingStore } from "../store/tradingStore";

export default function MarketList() {
  const [searchQuery, setSearchQuery] = useState("");
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
  }, [setTickers]);

  const filteredTickers = Object.entries(tickers).filter(([symbol]) =>
    symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#131722] text-gray-200">
      <div className="p-3 border-b border-[#1e222d] shrink-0">
        <input
          type="text"
          placeholder="Search coin..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0b0e14] border border-[#1e222d] rounded px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
      <div className="grid grid-cols-3 px-3 py-2 text-xs font-semibold text-gray-400 border-b border-[#1e222d] shrink-0">
        <div>Symbol</div>
        <div>Price</div>
        <div>24h</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredTickers.map(([symbol, ticker]: any) => (
          <MarketRow
            key={symbol}
            symbol={symbol}
            price={ticker.price}
            change={ticker.change_24h}
            onClick={() => setSymbol(symbol)}
          />
        ))}
      </div>
    </div>
  );
}
