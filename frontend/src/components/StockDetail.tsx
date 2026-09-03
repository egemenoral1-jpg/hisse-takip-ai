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
  daily_risk_percentage: number;
  annual_risk_percentage: number;
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
      ? "text-emerald-400"
      : risk?.risk_level === "Orta"
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="fade-in grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Sol taraf: grafik + risk (2/3 genislik) */}
      <div
        className="rounded-xl border p-8 text-[#E8E6E0] shadow-lg lg:col-span-2"
        style={{ borderColor: "#1E2530", backgroundColor: "#0D1220" }}
      >
        {stock ? (
          <>
            <h1 className="font-[family-name:var(--font-mono)] text-2xl font-medium tracking-wide">
              {stock.symbol}
            </h1>
            <div className="mt-2 flex items-baseline gap-3">
              <p className="font-[family-name:var(--font-mono)] text-3xl font-medium text-[#F3F1EA]">
                ${stock.price}
              </p>
              <p
                className={`text-sm font-medium ${
                  stock.change_percent >= 0 ? "text-emerald-400" : "text-red-400"
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
                  className="rounded-lg px-3 py-1 text-sm font-medium transition-colors"
                  style={
                    selectedRange === r.key
                      ? { backgroundColor: "#C9A24B", color: "#0A0E16" }
                      : { backgroundColor: "#111826", color: "#8B93A1" }
                  }
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setChartType("line")}
                className="rounded-lg px-3 py-1 text-sm font-medium transition-colors"
                style={
                  chartType === "line"
                    ? { backgroundColor: "#E8E6E0", color: "#0A0E16" }
                    : { backgroundColor: "#111826", color: "#8B93A1" }
                }
              >
                Çizgi
              </button>
              <button
                onClick={() => setChartType("candle")}
                className="rounded-lg px-3 py-1 text-sm font-medium transition-colors"
                style={
                  chartType === "candle"
                    ? { backgroundColor: "#E8E6E0", color: "#0A0E16" }
                    : { backgroundColor: "#111826", color: "#8B93A1" }
                }
              >
                Mum
              </button>
            </div>

            <div className="mt-6">
              <StockChart data={history} chartType={chartType} />
            </div>

                        {risk && (
              <div
                className="mt-6 rounded-xl border p-4"
                style={{ borderColor: "#1E2530", backgroundColor: "#0A0E16" }}
              >
                                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-[#B8BFC9]">
                    Risk Seviyesi
                  </span>
                  <span className={`text-xl font-bold ${riskColor}`}>
                    {risk.risk_level}
                  </span>
                </div>
                <div className="mt-3 flex gap-3">
                  <div
                    className="flex-1 rounded-lg border px-3 py-2"
                    style={{ borderColor: "#1E2530", backgroundColor: "#0D1220" }}
                  >
                    <p className="text-xs text-[#6B7280]">Günlük Oynaklık</p>
                    <p className="mt-0.5 font-[family-name:var(--font-mono)] text-base text-[#E8E6E0]">
                      %{risk.daily_risk_percentage}
                    </p>
                  </div>
                  <div
                    className="flex-1 rounded-lg border px-3 py-2"
                    style={{ borderColor: "#1E2530", backgroundColor: "#0D1220" }}
                  >
                    <p className="text-xs text-[#6B7280]">Yıllık Oynaklık</p>
                    <p className="mt-0.5 font-[family-name:var(--font-mono)] text-base text-[#E8E6E0]">
                      %{risk.annual_risk_percentage}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#8B93A1]">{risk.comment}</p>
              </div>
            )}
          </>
                ) : (
          <div className="space-y-4">
            <div className="skeleton h-7 w-20" />
            <div className="skeleton h-9 w-32" />
            <div className="skeleton h-64 w-full" />
          </div>
        )}
      </div>

      {/* Sag taraf: AI yorumu (1/3 genislik) */}
      <div
        className="rounded-xl border p-6 text-[#E8E6E0] shadow-lg"
        style={{ borderColor: "#1E2530", backgroundColor: "#0D1220" }}
      >
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-medium">
          AI Değerlendirmesi
        </h2>

        {commentary ? (
          <>
            <div className="mb-5">
              <h3 className="mb-2 text-sm font-semibold text-emerald-400">
                Olumlu Yönler
              </h3>
              <ul className="space-y-1.5">
                {commentary.positive_points.map((point, i) => (
                  <li key={i} className="text-sm text-[#B8BFC9]">
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
                  <li key={i} className="text-sm text-[#B8BFC9]">
                    • {point}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-xl border p-4"
              style={{ borderColor: "#1E2530", backgroundColor: "#0A0E16" }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#E8E6E0]">
                  AI Tahmini
                </span>
                <span className="text-xs font-medium text-[#8B93A1]">
                  Risk: {commentary.prediction_risk}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#B8BFC9]">
                {commentary.prediction}
              </p>
              <p className="mt-2 text-xs text-[#5A6273]">
                Bu bir yatırım tavsiyesi değildir.
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-[#5A6273]">
            <div
              className="h-3 w-3 animate-spin rounded-full border-2"
              style={{ borderColor: "#242B38", borderTopColor: "#C9A24B" }}
            />
            AI değerlendirme hazırlanıyor...
          </div>
        )}
      </div>
    </div>
  );
}