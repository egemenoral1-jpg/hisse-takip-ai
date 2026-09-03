"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type StockPrice = {
  symbol: string;
  price: number;
};

const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "NVDA", name: "Nvidia" },
];

export default function Home() {
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    POPULAR_STOCKS.forEach((s) => {
      fetch(`http://127.0.0.1:8000/stocks/${s.symbol}`)
        .then((res) => res.json())
        .then((data: StockPrice) => {
          setPrices((prev) => ({ ...prev, [s.symbol]: data.price }));
        });
    });
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Popüler Hisseler</h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {POPULAR_STOCKS.map((s) => (
            <Link
              key={s.symbol}
              href={`/hisse/${s.symbol}`}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:border-neutral-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{s.symbol}</p>
                  <p className="text-sm text-neutral-400">{s.name}</p>
                </div>
                <p className="text-xl font-semibold text-green-400">
                  {prices[s.symbol] !== undefined
                    ? `$${prices[s.symbol]}`
                    : "..."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}