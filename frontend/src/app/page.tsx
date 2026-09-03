"use client";

import { useEffect, useState } from "react";
import StockChart from "@/components/StockChart";

type StockPrice = {
  symbol: string;
  price: number;
};

type HistoryPoint = {
  time: string;
  close: number;
};

type RiskData = {
  risk_percentage: number;
  risk_level: string;
  comment: string;
};

const RANGES = [
  { key: "24s", label: "24S" },
  { key: "1h", label: "1H" },
  { key: "1a", label: "1A" },
  { key: "3a", label: "3A" },
  { key: "6a", label: "6A" },
  { key: "12a", label: "12A" },
];

export default function Home() {
  const [stock, setStock] = useState<StockPrice | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [selectedRange, setSelectedRange] = useState("3a");

  // Fiyat sadece bir kere cekilir
  useEffect(() => {
    fetch("http://127.0.0.1:8000/stocks/AAPL")
      .then((res) => res.json())
      .then((data) => setStock(data));
  }, []);

  // Aralik degistikce grafik ve risk yeniden cekilir
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/stocks/AAPL/history?range=${selectedRange}`)
      .then((res) => res.json())
      .then((data) => setHistory(data));

    fetch(`http://127.0.0.1:8000/stocks/AAPL/risk?range=${selectedRange}`)
      .then((res) => res.json())
      .then((data) => setRisk(data));
  }, [selectedRange]);

  const riskColor =
    risk?.risk_level === "Dusuk"
      ? "text-green-400"
      : risk?.risk_level === "Orta"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-8">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-white shadow-lg">
        {stock ? (
          <>
            <h1 className="text-2xl font-bold">{stock.symbol}</h1>
            <p className="mt-2 text-3xl font-semibold text-green-400">
              ${stock.price}
            </p>

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

            <div className="mt-6">
              <StockChart data={history} />
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
          <p>Yukleniyor...</p>
        )}
      </div>
    </main>
  );
}