import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import { useTradingStore } from "../../market/store/tradingStore";
import { candleService } from "../../../core/api/candleService";
import { wsManager } from "../../../core/ws/wsManager";
import TimeframeSelector from "./TimeFrameSelector";

export default function TradingChart() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const interval = useTradingStore((s) => s.interval);
  const symbol = useTradingStore((s) => s.selectedSymbol);

  const candlesRef = useRef<any[]>([]);
  const isFetchingOlderRef = useRef(false);

  // Track previous subscription for cleanup
  const prevSubRef = useRef<{ symbol: string; interval: string } | null>(null);

  // ──────────────────────────────────────────────
  // Create chart (runs once)
  // ──────────────────────────────────────────────
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

    // Scroll-back: load older candles when user scrolls left
    chart.timeScale().subscribeVisibleLogicalRangeChange(async (range) => {
      if (!range || !candlesRef.current.length || isFetchingOlderRef.current)
        return;

      if (range.from < 50) {
        isFetchingOlderRef.current = true;
        try {
          const firstCandle = candlesRef.current[0];
          const currentSymbol = useTradingStore.getState().selectedSymbol;
          const currentInterval = useTradingStore.getState().interval;

          const older = await candleService.getCandles(
            currentSymbol,
            currentInterval,
            firstCandle.time * 1000,
          );

          if (!older || !older.length) return;

          const filteredOlder = older.filter(
            (c: any) => c.time < firstCandle.time,
          );

          if (!filteredOlder.length) return;

          candlesRef.current = [...filteredOlder, ...candlesRef.current];
          candleSeriesRef.current?.setData(candlesRef.current);
        } catch (error) {
          console.error("Failed to fetch older candles:", error);
        } finally {
          isFetchingOlderRef.current = false;
        }
      }
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

  // ──────────────────────────────────────────────
  // Candle WS subscription + handler
  // (re-runs when symbol or interval changes)
  // ──────────────────────────────────────────────
  useEffect(() => {
    // Unsubscribe from previous
    if (prevSubRef.current) {
      wsManager.unsubscribeCandle(
        prevSubRef.current.symbol,
        prevSubRef.current.interval,
      );
    }

    // Subscribe to new
    wsManager.subscribeCandle(symbol, interval);
    prevSubRef.current = { symbol, interval };

    // Handler for candle updates from backend
    const handler = (msg: any) => {
      if (msg.symbol !== symbol || msg.interval !== interval) return;
      if (!candleSeriesRef.current) return;

      const candle = msg.data;
      if (!candle || !candle.time) return;

      // Update the series directly — backend sends correct OHLCV
      candleSeriesRef.current.update({
        time: candle.time as any,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      });

      // Keep candlesRef in sync for scroll-back
      const lastStored = candlesRef.current[candlesRef.current.length - 1];
      if (lastStored && lastStored.time === candle.time) {
        // Update in-place
        candlesRef.current[candlesRef.current.length - 1] = {
          time: candle.time,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        };
      } else if (!lastStored || candle.time > lastStored.time) {
        // New candle
        candlesRef.current.push({
          time: candle.time,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        });
      }
    };

    wsManager.onMessage("candle_update", handler);

    return () => {
      wsManager.offMessage("candle_update", handler);
    };
  }, [symbol, interval]);

  // ──────────────────────────────────────────────
  // Load historical candles via REST
  // (re-runs when symbol or interval changes)
  // ──────────────────────────────────────────────
  useEffect(() => {
    const loadCandles = async () => {
      if (!candleSeriesRef.current) return;

      // Clear current data while loading
      candleSeriesRef.current.setData([]);

      const candles = await candleService.getCandles(symbol, interval);
      candlesRef.current = candles;
      candleSeriesRef.current.setData(candles);
      chartRef.current?.timeScale().fitContent();
    };
    loadCandles();
  }, [symbol, interval]);

  return (
    <div className="flex flex-col h-full w-full bg-[#131722]">
      <div className="text-white text-sm px-3 py-2 border-b border-[#1e222d] flex justify-between items-center">
        <span className="font-semibold">{symbol.replace("_", "/").toUpperCase()}</span>
        <span className="text-xs text-gray-500 uppercase">{interval}</span>
      </div>
      <TimeframeSelector />
      <div ref={chartContainerRef} className="flex-1 min-h-0" />
    </div>
  );
}
