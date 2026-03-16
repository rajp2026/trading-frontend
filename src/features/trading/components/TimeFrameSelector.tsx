import { useTradingStore } from "../../market/store/tradingStore";

const intervals = ["1m", "5m", "15m", "1h", "4h", "1d", "1w"];

export default function TimeframeSelector() {
  const interval = useTradingStore((s) => s.interval);
  const setInterval = useTradingStore((s) => s.setInterval);

  return (
    <div className="flex gap-3 text-xs text-gray-400 px-3 py-2 border-b border-[#1e222d]">
      {intervals.map((i) => (
        <button
          key={i}
          onClick={() => setInterval(i)}
          className={`px-2 py-1 rounded ${
            interval === i ? "bg-[#1e222d] text-white" : "hover:text-white"
          }`}
        >
          {i}
        </button>
      ))}
    </div>
  );
}
