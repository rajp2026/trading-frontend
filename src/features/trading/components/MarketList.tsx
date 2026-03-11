export default function MarketList() {
  const markets = [
    "BTC/USDT",
    "ETH/USDT",
    "SOL/USDT",
    "BNB/USDT",
    "XRP/USDT",
    "ADA/USDT",
    "DOGE/USDT",
    "AVAX/USDT",
  ];

  return (
    <div className="col-span-12 md:col-span-3 lg:col-span-2 row-span-2 bg-[#0d0d14] flex flex-col border">

      <div className="px-3 py-2.5 border-b border-white/5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Markets
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {markets.map((pair) => (
          <div
            key={pair}
            className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          >
            <span className="text-sm text-white font-medium">{pair}</span>
            <span className="text-xs text-green-400">+2.4%</span>
          </div>
        ))}
      </div>

    </div>
  );
}