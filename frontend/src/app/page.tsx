"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type StockPrice = {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
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
  const router = useRouter();
  const [prices, setPrices] = useState<Record<string, StockPrice>>({});
  const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
    POPULAR_STOCKS.forEach((s) => {
      fetch(`http://127.0.0.1:8000/stocks/${s.symbol}`)
        .then((res) => res.json())
        .then((data: StockPrice) => {
          setPrices((prev) => ({ ...prev, [s.symbol]: data }));
        });
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const symbol = searchInput.trim().toUpperCase();
    if (symbol) {
      router.push(`/hisse/${symbol}`);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Ust hero alani */}
      <div className="border-b border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 px-8 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Hisse Takip <span className="text-green-400">AI</span>
          </h1>
          <p className="mt-3 text-neutral-400">
            Hisseleri takip et, yapay zeka destekli analizleri incele.
          </p>

          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-md gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Sembol ara (ör. AAPL, TSLA)"
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-green-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-400"
            >
              Ara
            </button>
          </form>
        </div>
      </div>

      {/* Populer hisseler */}
      <div className="mx-auto max-w-4xl px-8 py-12">
        <h2 className="mb-6 text-xl font-bold text-neutral-200">
          Popüler Hisseler
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {POPULAR_STOCKS.map((s) => (
            <Link
              key={s.symbol}
              href={`/hisse/${s.symbol}`}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition-all hover:border-green-500/50 hover:bg-neutral-800/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold group-hover:text-green-400">
                    {s.symbol}
                  </p>
                  <p className="text-sm text-neutral-400">{s.name}</p>
                </div>
                                <div className="text-right">
                  <p className="text-xl font-semibold text-green-400">
                    {prices[s.symbol] !== undefined
                      ? `$${prices[s.symbol].price}`
                      : "..."}
                  </p>
                  {prices[s.symbol] !== undefined && (
                    <p
                      className={`text-xs font-medium ${
                        prices[s.symbol].change_percent >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {prices[s.symbol].change_percent >= 0 ? "↑" : "↓"}{" "}
                      {Math.abs(prices[s.symbol].change_percent)}%
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}