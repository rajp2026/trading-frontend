export default function BuySellPanel() {
  return (
    <div className="col-span-12 lg:col-span-3 bg-[#0d0d14] flex flex-col border h-[35vh]">

      <div className="px-3 py-2.5 border-b border-white/5 flex gap-1">
        <button className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
          Buy
        </button>

        <button className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-gray-400 hover:bg-white/5">
          Sell
        </button>
      </div>

      <div className="flex-1 p-3 space-y-3">

        <input
          placeholder="Price"
          className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white"
        />

        <input
          placeholder="Amount"
          className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white"
        />

        <button className="w-full py-2 rounded-xl bg-green-500 text-black font-semibold">
          Buy BTC
        </button>

      </div>

    </div>
  );
}