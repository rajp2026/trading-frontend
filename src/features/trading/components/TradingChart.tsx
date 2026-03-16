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
      autoSize: true,
      layout: {
        background: { color: "#131722" },
        textColor: "#d1d4dc",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "#1e222d" },
        horzLines: { color: "#1e222d" },
      },
      rightPriceScale: {
        autoScale: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        borderColor: "#485c7b",
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
      autoscaleInfoProvider: (original: any) => {
        const res = original?.();
        if (!res) return null;
        return {
          priceRange: {
            minValue: res.priceRange.minValue * 0.995,
            maxValue: res.priceRange.maxValue * 1.005,
          },
        };
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
    <div className="flex flex-col h-full w-full bg-[#131722]">
      <div className="text-white text-sm px-3 py-2 border-b border-[#1e222d]">
        {symbol}
      </div>
      <TimeframeSelector />
      <div ref={chartContainerRef} className="flex-1 min-h-0" />
    </div>
  );
}
