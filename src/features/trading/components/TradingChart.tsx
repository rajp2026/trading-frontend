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

  const candlesRef = useRef<any[]>([]);
  const isFetchingOlderRef = useRef(false);
  const lastCandleRef = useRef<any>(false);
  const wsRef = useRef<WebSocket | null>(null);

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

  // Handle WebSocket Connection and Data Updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/market");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Chart WS Connected ✅");
      // Initial subscribe
      ws.send(
        JSON.stringify({
          type: "subscribe",
          symbols: [useTradingStore.getState().selectedSymbol],
        }),
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type !== "market_batch") return;

      const currentSymbol = useTradingStore.getState().selectedSymbol;

      const update = msg.data.find((d: any) => 
        d.symbol === currentSymbol || 
        d.symbol.replace(/_|-/g, "").toUpperCase() === currentSymbol.replace(/_|-/g, "").toUpperCase()
      );
      
      if (!update) return;
      if (!lastCandleRef.current || !candleSeriesRef.current || !candlesRef.current) return;

      const price = Number(update.price);
      
      const getIntervalSeconds = (intv: string) => {
        if (!intv) return 60;
        const value = parseInt(intv);
        const unit = intv.slice(-1);
        if (unit === "m") return value * 60;
        if (unit === "h") return value * 3600;
        if (unit === "d") return value * 86400;
        return 60;
      };

      const currentTimeSeconds = Math.floor(Date.now() / 1000);
      const intervalSeconds = getIntervalSeconds(useTradingStore.getState().interval);
      let currentCandle = { ...lastCandleRef.current };
      const candleTime = Number(currentCandle.time);

      if (!isNaN(candleTime) && currentTimeSeconds >= candleTime + intervalSeconds) {
        const nextTime = candleTime + intervalSeconds;
        currentCandle = {
          time: nextTime as any,
          open: currentCandle.close,
          high: price,
          low: price,
          close: price,
        };
        candlesRef.current.push(currentCandle);
      } else {
        currentCandle.close = price;
        currentCandle.high = Math.max(currentCandle.high, price);
        currentCandle.low = Math.min(currentCandle.low, price);
      }

      candleSeriesRef.current.update(currentCandle);
      lastCandleRef.current = currentCandle;
    };

    ws.onerror = (err) => console.error("Chart WS Error:", err);
    ws.onclose = () => console.log("Chart WS Closed ❌");

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  // Update backend subscription when symbol changes
  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log(`[Chart] Switching subscription to: ${symbol}`);
      wsRef.current.send(
        JSON.stringify({
          type: "subscribe",
          symbols: [symbol],
        }),
      );
    }
  }, [symbol]);

  // Load Initial Candles when symbol changes
  useEffect(() => {
    const loadCandles = async () => {
      if (!candleSeriesRef.current) return;
      
      // Clear current data while loading
      candleSeriesRef.current.setData([]);
      
      const candles = await candleService.getCandles(symbol, interval);
      candlesRef.current = candles;
      lastCandleRef.current = candles[candles.length - 1];
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
