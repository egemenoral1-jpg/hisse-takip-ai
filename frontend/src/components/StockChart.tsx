"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, LineSeries } from "lightweight-charts";

type HistoryPoint = {
  time: string;
  close: number;
};

export default function StockChart({ data }: { data: HistoryPoint[] }) {
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
    });

    const lineSeries = chart.addSeries(LineSeries, {
    color: "#4ade80",
    lineWidth: 2,
});

    const formatted = data.map((point) => ({
      time: point.time.split("T")[0],
      value: point.close,
    }));

    lineSeries.setData(formatted);
    chart.timeScale().fitContent();

    chartRef.current = chart;

    return () => {
      chart.remove();
    };
  }, [data]);

  return <div ref={containerRef} className="w-full" />;
}