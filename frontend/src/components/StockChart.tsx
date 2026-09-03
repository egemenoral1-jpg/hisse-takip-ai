"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  LineSeries,
  CandlestickSeries,
  CrosshairMode,
} from "lightweight-charts";

type HistoryPoint = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

type ChartType = "line" | "candle";

export default function StockChart({
  data,
  chartType,
}: {
  data: HistoryPoint[];
  chartType: ChartType;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#262626" },
        horzLines: { color: "#262626" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
      },
    });

    const timeConvert = (t: string) =>
      Math.floor(new Date(t).getTime() / 1000) as any;

    if (chartType === "line") {
      const lineSeries = chart.addSeries(LineSeries, {
        color: "#4ade80",
        lineWidth: 2,
      });
      lineSeries.setData(
        data.map((p) => ({ time: timeConvert(p.time), value: p.close }))
      );
    } else {
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#4ade80",
        downColor: "#f87171",
        borderVisible: false,
        wickUpColor: "#4ade80",
        wickDownColor: "#f87171",
      });
      candleSeries.setData(
        data.map((p) => ({
          time: timeConvert(p.time),
          open: p.open,
          high: p.high,
          low: p.low,
          close: p.close,
        }))
      );
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => {
      chart.remove();
    };
  }, [data, chartType]);

  return <div ref={containerRef} className="w-full" />;
}