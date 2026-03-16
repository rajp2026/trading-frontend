import BuySellPanel from "../features/trading/components/BuySellPanel";
import MarketList from "../features/market/components/MarketList";
import OrderBook from "../features/trading/components/OrderBook";
import TradeHistory from "../features/trading/components/TradeHistory";
import TradingChart from "../features/trading/components/TradingChart";

export default function TradingPage() {
  return (
    <div className="grid grid-cols-12 h-full gap-px bg-white/5">
      <MarketList />

      <TradingChart />

      <OrderBook />

      <TradeHistory />

      <BuySellPanel />
    </div>
  );
}
