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
    const fetchPrices = () => {
      POPULAR_STOCKS.forEach((s) => {
        fetch(`http://127.0.0.1:8000/stocks/${s.symbol}`)
          .then((res) => res.json())
          .then((data: StockPrice) => {
            setPrices((prev) => ({ ...prev, [s.symbol]: data }));
          });
      });
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const symbol = searchInput.trim().toUpperCase();
    if (symbol) {
      router.push(`/hisse/${symbol}`);
    }
  };

  const tickerList = [...POPULAR_STOCKS, ...POPULAR_STOCKS]; // kesintisiz kaymasi icin ikiye katliyoruz

  return (
    <main
      className="min-h-screen text-[#E8E6E0]"
      style={{ backgroundColor: "#0A0E16" }}
    >
      {/* Kayan ticker seridi */}
      <div
        className="overflow-hidden border-b py-2.5"
        style={{ borderColor: "#1E2530", backgroundColor: "#0D1220" }}
      >
        <div className="ticker-track flex w-max gap-10">
          {tickerList.map((s, i) => {
            const p = prices[s.symbol];
            return (
              <span
                key={i}
                className="flex items-center gap-2 whitespace-nowrap font-[family-name:var(--font-mono)] text-xs"
              >
                <span className="text-[#8B93A1]">{s.symbol}</span>
                {p ? (
                  <>
                    <span className="text-[#E8E6E0]">${p.price}</span>
                    <span
                      className={
                        p.change_percent >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    >
                      {p.change_percent >= 0 ? "↑" : "↓"}{" "}
                      {Math.abs(p.change_percent)}%
                    </span>
                  </>
                ) : (
                  <span className="text-[#4A5262]">···</span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Hero alani */}
      <div
        className="border-b px-8 py-20"
        style={{ borderColor: "#1E2530" }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-medium tracking-tight text-[#F3F1EA]">
            Hisse takibi, yapay zekayla
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[#8B93A1]">
            Bir sembol yaz, güncel fiyatı, geçmiş grafiği ve yapay zekanın
            hazırladığı olumlu/olumsuz analizi tek ekranda gör.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-9 flex max-w-md gap-2"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Sembol ara (ör. AAPL, TSLA)"
              className="flex-1 rounded-lg border px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#5A6273] focus:border-[#C9A24B]"
              style={{ borderColor: "#242B38", backgroundColor: "#111826" }}
            />
            <button
              type="submit"
              className="rounded-lg px-5 py-3 text-sm font-medium text-[#0A0E16] transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#C9A24B" }}
            >
              Ara
            </button>
          </form>
        </div>
      </div>

      {/* Populer hisseler */}
      <div className="mx-auto max-w-4xl px-8 py-14">
        <h2 className="mb-6 font-[family-name:var(--font-display)] text-xl font-medium text-[#E8E6E0]">
          Popüler Hisseler
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {POPULAR_STOCKS.map((s) => {
            const p = prices[s.symbol];
            const isUp = p ? p.change_percent >= 0 : true;
            return (
              <Link
                key={s.symbol}
                href={`/hisse/${s.symbol}`}
                className="group rounded-xl border p-5 transition-colors"
                style={{ borderColor: "#1E2530", backgroundColor: "#0D1220" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[15px] font-medium tracking-wide text-[#E8E6E0] group-hover:text-[#C9A24B]">
                      {s.symbol}
                    </p>
                    <p className="mt-0.5 text-sm text-[#6B7280]">{s.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-[family-name:var(--font-mono)] text-[15px] text-[#E8E6E0]">
                      {p ? `$${p.price}` : "···"}
                    </p>
                    {p && (
                      <p
                        className={`mt-0.5 text-xs ${
                          isUp ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {isUp ? "↑" : "↓"} {Math.abs(p.change_percent)}%
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}