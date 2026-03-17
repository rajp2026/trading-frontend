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

          // Multiply by 1000 because lightweight-charts uses seconds but Binance expects milliseconds
          const older = await candleService.getCandles(
            currentSymbol,
            currentInterval,
            firstCandle.time * 1000,
          );

          if (!older || !older.length) return;

          // Filter out overlapping candle (Binance endTime is inclusive)
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

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/market");

    ws.onopen = () => {
      console.log("WS Connected ✅");
      ws.send(
        JSON.stringify({
          type: "subscribe",
          symbols: [symbol],
        }),
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log(`[WS DEBUG] Received message type:`, msg.type);
      
      if (msg.type !== "market_batch") return;

      // Try fuzzy matching in case backend sends BTCUSDT instead of BTC_USDT (or vice versa)
      const update = msg.data.find((d: any) => 
        d.symbol === symbol || 
        d.symbol.replace(/_|-/g, "").toUpperCase() === symbol.replace(/_|-/g, "").toUpperCase()
      );
      
      if (!update) {
        return;
      }
      
      if (!lastCandleRef.current || !candleSeriesRef.current || !candlesRef.current) {
        return;
      }

      const price = Number(update.price);
      
      let currentCandle = { ...lastCandleRef.current };

      // Temporarily disabled new candle formation for debugging
      // Update existing candle
      currentCandle.close = price;
      currentCandle.high = Math.max(currentCandle.high, price);
      currentCandle.low = Math.min(currentCandle.low, price);

      console.log(`[WS] Updating candle ${currentCandle.time} - Close: ${currentCandle.close}, High: ${currentCandle.high}, Low: ${currentCandle.low}`);

      // lightweight-charts requires the exact same time value to update an existing candle
      candleSeriesRef.current.update(currentCandle);
      lastCandleRef.current = currentCandle;
    };

    ws.onclose = () => {
      console.log("WS Closed ❌");
    };

    return () => ws.close();
  }, [symbol]);

  // Load candles when symbol changes
  useEffect(() => {
    const loadCandles = async () => {
      if (!candleSeriesRef.current) return;
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
      <div className="text-white text-sm px-3 py-2 border-b border-[#1e222d]">
        {symbol}
      </div>
      <TimeframeSelector />
      <div ref={chartContainerRef} className="flex-1 min-h-0" />
    </div>
  );
}

// logic behind how infinit candles loads when user scroll towards left, side means loading older data
// user scroll left -> chart detects near beginninr of data -> frontend charts request older candles, -> backed fetches candles using endtime -> then prepends to candles to chart
//
