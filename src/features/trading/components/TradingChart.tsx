import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import { useTradingStore } from "../../market/store/tradingStore";
import { candleService } from "../../../core/api/candleService";
import TimeframeSelector from "./TimeFrameSelector";

export default function TradingChart() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const interval = useTradingStore((s) => s.interval);
  const symbol = useTradingStore((s) => s.selectedSymbol);

  // Create chart (runs once)
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      height: 500,
      layout: {
        background: { color: "#131722" },
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "#1e222d" },
        horzLines: { color: "#1e222d" },
      },
      timeScale: {
        rightBarStaysOnScroll: true,
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 8,
        minBarSpacing: 5,
      },
      crosshair: {
        mode: 0,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
      },
    });
    chart.priceScale("right").applyOptions({
      autoScale: true,
    });
    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    return () => {
      chart.remove();
    };
  }, []);

  // Load candles when symbol changes
  useEffect(() => {
    const loadCandles = async () => {
      if (!candleSeriesRef.current) return;

      const candles = await candleService.getCandles(symbol, interval);

      candleSeriesRef.current.setData(candles);
      chartRef.current?.timeScale().fitContent();
    };

    loadCandles();
  }, [symbol, interval]);

  return (
    <div className="col-span-6 bg-[#131722] flex flex-col">
      <div className="text-white text-sm px-3 py-2 border-b border-[#1e222d]">
        {symbol}
      </div>
      <TimeframeSelector />

      <div ref={chartContainerRef} className="flex-1" />
      {/* <div className="col-span-6 bg-[#131722] flex flex-col">
      </div> */}
    </div>
  );
}
