import BuySellPanel from "../features/trading/components/BuySellPanel";
import MarketList from "../features/market/components/MarketList";
import OrderBook from "../features/trading/components/OrderBook";
import TradeHistory from "../features/trading/components/TradeHistory";
import TradingChart from "../features/trading/components/TradingChart";

export default function TradingPage() {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#0b0e14] text-gray-200 p-3 gap-3">
      {/* Left Column: Market List */}
      <div className="w-[320px] flex flex-col bg-[#131722] shrink-0 rounded-xl border border-[#1e222d] overflow-hidden">
        <MarketList />
      </div>

      {/* Center Column: Chart & Buy/Sell Panel */}
      <div className="flex flex-1 flex-col min-w-0 gap-3">
        {/* Top: Chart Section */}
        <div className="flex-1 min-h-0 flex flex-col bg-[#131722] rounded-xl border border-[#1e222d] overflow-hidden">
          <TradingChart />
        </div>
        
        {/* Bottom: Buy/Sell Panel */}
        <div className="h-[260px] shrink-0 bg-[#131722] rounded-xl border border-[#1e222d] overflow-hidden">
          <BuySellPanel />
        </div>
      </div>

      {/* Right Column: Orderbook & Order History */}
      <div className="w-[320px] flex flex-col shrink-0 gap-3">
        {/* Top: Orderbook */}
        <div className="flex-1 bg-[#131722] rounded-xl border border-[#1e222d] min-h-0 overflow-hidden">
          <OrderBook />
        </div>
        
        {/* Bottom: Order History */}
        <div className="h-[350px] bg-[#131722] rounded-xl border border-[#1e222d] shrink-0 overflow-hidden">
          <TradeHistory />
        </div>
      </div>
    </div>
  );
}

