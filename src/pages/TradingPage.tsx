// export default function TradingPage() {
//   return (
//     <div className="grid grid-cols-12 h-full gap-px bg-white/5">
//       {/* Market List — left sidebar */}
//       <div className="col-span-2 row-span-2 bg-[#0d0d14] flex flex-col border">
//         <div className="px-3 py-2.5 border-b border-white/5">
//           <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
//             Markets
//           </h3>
//         </div>
//         <div className="flex-1 overflow-y-auto p-3">
//           {/* Placeholder market items */}
//           {["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "XRP/USDT", "ADA/USDT", "DOGE/USDT", "AVAX/USDT"].map(
//             (pair) => (
//               <div
//                 key={pair}
//                 className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
//               >
//                 <span className="text-sm text-white font-medium">{pair}</span>
//                 <span className="text-xs text-green-400">+2.4%</span>
//               </div>
//             )
//           )}
//         </div>
//       </div>

import BuySellPanel from "../features/trading/components/BuySellPanel";
import MarketList from "../features/trading/components/MarketList";
import OrderBook from "../features/trading/components/OrderBook";
import TradeHistory from "../features/trading/components/TradeHistory";
import TradingChart from "../features/trading/components/TradingChart";

//       {/* Trading Chart — center main area */}
//       <div className="col-span-7 row-span-1 bg-[#0d0d14] flex flex-col border" style={{ height: "60vh" }}>
//         <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <h3 className="text-sm font-semibold text-white">BTC/USDT</h3>
//             <span className="text-lg font-bold text-green-400">$67,234.50</span>
//             <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
//               +3.24%
//             </span>
//           </div>
//           <div className="flex items-center gap-1">
//             {["1m", "5m", "15m", "1H", "4H", "1D"].map((tf) => (
//               <button
//                 key={tf}
//                 className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
//               >
//                 {tf}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="flex-1 flex items-center justify-center text-gray-600">
//           <div className="text-center">
//             <svg className="w-12 h-12 mx-auto mb-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
//             </svg>
//             <p className="text-sm">Chart will load here</p>
//           </div>
//         </div>
//       </div>

//       {/* Order Book — right sidebar top */}
//       <div className="col-span-3 row-span-1 bg-[#0d0d14] flex flex-col border" style={{ height: "60vh" }}>
//         <div className="px-3 py-2.5 border-b border-white/5">
//           <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
//             Order Book
//           </h3>
//         </div>
//         <div className="flex-1 overflow-y-auto">
//           {/* Header */}
//           <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] text-gray-500 uppercase">
//             <span>Price</span>
//             <span className="text-right">Amount</span>
//             <span className="text-right">Total</span>
//           </div>
//           {/* Ask orders (red) */}
//           {Array.from({ length: 8 }, (_, i) => (
//             <div key={`ask-${i}`} className="grid grid-cols-3 px-3 py-1 text-xs hover:bg-white/5 transition-colors">
//               <span className="text-red-400">
//                 {(67250 - i * 12).toLocaleString()}
//               </span>
//               <span className="text-right text-gray-400">
//                 {(0.1 + Math.random() * 2).toFixed(4)}
//               </span>
//               <span className="text-right text-gray-500">
//                 {(1000 + Math.random() * 5000).toFixed(0)}
//               </span>
//             </div>
//           ))}
//           {/* Spread */}
//           <div className="px-3 py-1.5 text-center text-xs text-green-400 font-medium border-y border-white/5">
//             67,234.50
//           </div>
//           {/* Bid orders (green) */}
//           {Array.from({ length: 8 }, (_, i) => (
//             <div key={`bid-${i}`} className="grid grid-cols-3 px-3 py-1 text-xs hover:bg-white/5 transition-colors">
//               <span className="text-green-400">
//                 {(67230 - i * 12).toLocaleString()}
//               </span>
//               <span className="text-right text-gray-400">
//                 {(0.1 + Math.random() * 2).toFixed(4)}
//               </span>
//               <span className="text-right text-gray-500">
//                 {(1000 + Math.random() * 5000).toFixed(0)}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Trade History — bottom left */}
//       <div className="col-span-7 row-span-1 bg-[#0d0d14] flex flex-col border" style={{ height: "calc(40vh - 56px)" }}>
//         <div className="px-4 py-2.5 border-b border-white/5">
//           <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
//             Recent Trades
//           </h3>
//         </div>
//         <div className="flex-1 overflow-y-auto">
//           <div className="grid grid-cols-3 px-4 py-1.5 text-[10px] text-gray-500 uppercase">
//             <span>Price</span>
//             <span className="text-right">Amount</span>
//             <span className="text-right">Time</span>
//           </div>
//           {Array.from({ length: 12 }, (_, i) => {
//             const isBuy = Math.random() > 0.5;
//             return (
//               <div key={i} className="grid grid-cols-3 px-4 py-1 text-xs transition-colors hover:bg-white/5">
//                 <span className={isBuy ? "text-green-400" : "text-red-400"}>
//                   {(67200 + Math.random() * 80).toFixed(2)}
//                 </span>
//                 <span className="text-right text-gray-400">
//                   {(Math.random() * 2).toFixed(4)}
//                 </span>
//                 <span className="text-right text-gray-500">
//                   {`${String(12 + Math.floor(Math.random() * 12)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Buy / Sell Panel — bottom right */}
//       <div className="col-span-3 row-span-1 bg-[#0d0d14] flex flex-col border" style={{ height: "calc(40vh - 56px)" }}>
//         <div className="px-3 py-2.5 border-b border-white/5 flex gap-1">
//           <button className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 cursor-pointer transition-colors hover:bg-green-500/20">
//             Buy
//           </button>
//           <button className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-gray-400 hover:bg-white/5 cursor-pointer transition-colors">
//             Sell
//           </button>
//         </div>
//         <div className="flex-1 p-3 space-y-3 overflow-y-auto">
//           <div>
//             <label className="block text-[10px] text-gray-500 uppercase mb-1">
//               Price (USDT)
//             </label>
//             <input
//               type="text"
//               value="67,234.50"
//               readOnly
//               className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-[10px] text-gray-500 uppercase mb-1">
//               Amount (BTC)
//             </label>
//             <input
//               type="text"
//               placeholder="0.00"
//               className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/30"
//             />
//           </div>
//           <div className="flex gap-1">
//             {["25%", "50%", "75%", "100%"].map((pct) => (
//               <button
//                 key={pct}
//                 className="flex-1 py-1 text-[10px] text-gray-400 bg-white/5 rounded hover:bg-white/10 cursor-pointer transition-colors"
//               >
//                 {pct}
//               </button>
//             ))}
//           </div>
//           <div>
//             <label className="block text-[10px] text-gray-500 uppercase mb-1">
//               Total (USDT)
//             </label>
//             <input
//               type="text"
//               placeholder="0.00"
//               readOnly
//               className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-gray-400 focus:outline-none"
//             />
//           </div>
//           <button className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-semibold text-sm transition-colors cursor-pointer">
//             Buy BTC
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// import MarketList from "./features/trading/components/MarketList";
// import TradingChart from "../features/trading/components/TradingChart";
// import OrderBook from "../features/trading/components/OrderBook";
// import TradeHistory from "../features/trading/components/TradeHistory";
// import BuySellPanel from "../features/trading/components/BuySellPanel";

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
