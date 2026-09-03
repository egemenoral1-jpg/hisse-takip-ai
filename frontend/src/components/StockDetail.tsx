"use client";

import { useEffect, useState } from "react";
import StockChart from "@/components/StockChart";

type StockPrice = {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
};

type HistoryPoint = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

type RiskData = {
  risk_percentage: number;
  risk_level: string;
  comment: string;
};

type CommentaryData = {
  symbol: string;
  positive_points: string[];
  negative_points: string[];
  prediction: string;
  prediction_risk: string;
};

const RANGES = [
  { key: "24s", label: "24S" },
  { key: "1h", label: "1H" },
  { key: "1a", label: "1A" },
  { key: "3a", label: "3A" },
  { key: "6a", label: "6A" },
  { key: "12a", label: "12A" },
];

export default function StockDetail({ symbol }: { symbol: string }) {
  const [stock, setStock] = useState<StockPrice | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [commentary, setCommentary] = useState<CommentaryData | null>(null);
  const [selectedRange, setSelectedRange] = useState("3a");
  const [chartType, setChartType] = useState<"line" | "candle">("line");

  useEffect(() => {
    const fetchPrice = () => {
      fetch(`http://127.0.0.1:8000/stocks/${symbol}`)
        .then((res) => res.json())
        .then((data) => setStock(data));
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);

    fetch(`http://127.0.0.1:8000/ai/${symbol}/commentary`)
      .then((res) => res.json())
      .then((data) => {
        if (data.positive_points && data.negative_points) {
          setCommentary(data);
        } else {
          setCommentary(null);
        }
      })
      .catch(() => setCommentary(null));

    return () => clearInterval(interval);
  }, [symbol]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/stocks/${symbol}/history?range=${selectedRange}`)
      .then((res) => res.json())
      .then((data) => setHistory(data));

    fetch(`http://127.0.0.1:8000/stocks/${symbol}/risk?range=${selectedRange}`)
      .then((res) => res.json())
      .then((data) => setRisk(data));
  }, [symbol, selectedRange]);

  const riskColor =
    risk?.risk_level === "Dusuk"
      ? "text-green-400"
      : risk?.risk_level === "Orta"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Sol taraf: grafik + risk (2/3 genislik) */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-white shadow-lg lg:col-span-2">
        {stock ? (
          <>
            <h1 className="text-2xl font-bold">{stock.symbol}</h1>
            <div className="mt-2 flex items-baseline gap-3">
              <p className="text-3xl font-semibold text-green-400">
                ${stock.price}
              </p>
              <p
                className={`text-sm font-medium ${
                  stock.change_percent >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {stock.change_percent >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(stock.change_percent)}%
              </p>
            </div>

            <div className="mt-6 flex gap-2">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setSelectedRange(r.key)}
                  className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                    selectedRange === r.key
                      ? "bg-green-500 text-black"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setChartType("line")}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                  chartType === "line"
                    ? "bg-neutral-100 text-black"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                Çizgi
              </button>
              <button
                onClick={() => setChartType("candle")}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                  chartType === "candle"
                    ? "bg-neutral-100 text-black"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                Mum
              </button>
            </div>

            <div className="mt-6">
              <StockChart data={history} chartType={chartType} />
            </div>

            {risk && (
              <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Risk Seviyesi</span>
                  <span className={`text-lg font-bold ${riskColor}`}>
                    {risk.risk_level} (%{risk.risk_percentage})
                  </span>
                </div>
                <p className="mt-2 text-sm text-neutral-400">{risk.comment}</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-white">Yukleniyor...</p>
        )}
      </div>

      {/* Sag taraf: AI yorumu (1/3 genislik) */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-white shadow-lg">
        <h2 className="mb-4 text-lg font-bold text-neutral-200">
          AI Değerlendirmesi
        </h2>

        {commentary ? (
          <>
            <div className="mb-5">
              <h3 className="mb-2 text-sm font-semibold text-green-400">
                Olumlu Yönler
              </h3>
              <ul className="space-y-1.5">
                {commentary.positive_points.map((point, i) => (
                  <li key={i} className="text-sm text-neutral-300">
                    • {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-5">
              <h3 className="mb-2 text-sm font-semibold text-red-400">
                Olumsuz Yönler
              </h3>
              <ul className="space-y-1.5">
                {commentary.negative_points.map((point, i) => (
                  <li key={i} className="text-sm text-neutral-300">
                    • {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-200">
                  AI Tahmini
                </span>
                <span className="text-xs font-medium text-neutral-400">
                  Risk: {commentary.prediction_risk}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-300">
                {commentary.prediction}
              </p>
              <p className="mt-2 text-xs text-neutral-600">
                Bu bir yatırım tavsiyesi değildir.
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-600 border-t-green-400" />
            AI değerlendirme hazırlanıyor...
          </div>
        )}
      </div>
    </div>
  );
}