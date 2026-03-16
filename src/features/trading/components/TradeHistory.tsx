export default function TradeHistory() {
  return (
    <div className="flex flex-col h-full bg-[#131722] text-gray-200">
      <div className="px-4 py-2.5 border-b border-[#1e222d] shrink-0">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Recent Trades
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 px-4 py-1.5 text-[10px] text-gray-500 uppercase">
          <span>Price</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Time</span>
        </div>

        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-3 px-4 py-1 text-xs hover:bg-white/5"
          >
            <span className="text-green-400">67234</span>
            <span className="text-right text-gray-400">0.21</span>
            <span className="text-right text-gray-500">12:22:11</span>
          </div>
        ))}
      </div>
    </div>
  );
}
