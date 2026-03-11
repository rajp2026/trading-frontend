export default function OrderBook() {
  return (
    <div className="col-span-12 md:col-span-3 lg:col-span-3 bg-[#0d0d14] flex flex-col border h-[55vh]">

      <div className="px-3 py-2.5 border-b border-white/5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Order Book
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">

        <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] text-gray-500 uppercase">
          <span>Price</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Total</span>
        </div>

        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-3 px-3 py-1 text-xs hover:bg-white/5"
          >
            <span className="text-red-400">67234</span>
            <span className="text-right text-gray-400">0.45</span>
            <span className="text-right text-gray-500">3020</span>
          </div>
        ))}

      </div>

    </div>
  );
}