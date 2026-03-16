import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, ColorType } from "lightweight-charts";
import { dummyCandles } from "../data/dummyCandles";

export default function TradingChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = createChart(chartRef.current!, {
      height: 500,
      layout: {
        background: { type: ColorType.Solid, color: "#0f172a" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries);

    candleSeries.setData(dummyCandles);

    return () => chart.remove();
  }, []);

  return (
    <div className="col-span-7 bg-black p-2">
      <div ref={chartRef} />
    </div>
  );
}
