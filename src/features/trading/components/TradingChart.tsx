export default function TradingChart() {
  const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D"];

  return (
    <div className="col-span-12 md:col-span-9 lg:col-span-7 bg-[#0d0d14] flex flex-col border h-[55vh]">

      <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">

        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-white">BTC/USDT</h3>
          <span className="text-lg font-bold text-green-400">$67,234</span>
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
            +3.24%
          </span>
        </div>

        <div className="flex items-center gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              {tf}
            </button>
          ))}
        </div>

      </div>

      <div className="flex-1 flex items-center justify-center text-gray-600">
        <p className="text-sm">Chart will load here</p>
      </div>

    </div>
  );
}