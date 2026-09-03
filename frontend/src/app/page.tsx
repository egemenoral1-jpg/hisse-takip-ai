"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sparkline from "@/components/Sparkline";
import { STOCK_LIST } from "@/lib/stockList";

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
  const [sparklines, setSparklines] = useState<Record<string, number[]>>({});
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

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

    const fetchSparklines = () => {
      POPULAR_STOCKS.forEach((s) => {
        fetch(`http://127.0.0.1:8000/stocks/${s.symbol}/history?range=1a`)
          .then((res) => res.json())
          .then((data: { close: number }[]) => {
            setSparklines((prev) => ({
              ...prev,
              [s.symbol]: data.map((point) => point.close),
            }));
          });
      });
    };

    fetchPrices();
    fetchSparklines();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredSuggestions =
    searchInput.trim().length > 0
      ? STOCK_LIST.filter(
          (s) =>
            s.symbol.toLowerCase().startsWith(searchInput.trim().toLowerCase()) ||
            s.name.toLowerCase().includes(searchInput.trim().toLowerCase())
        ).slice(0, 6)
      : [];

  const goToSymbol = (apiSym: string) => {
    setSearchInput("");
    setShowSuggestions(false);
    router.push(`/hisse/${apiSym}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = searchInput.trim().toUpperCase();
    if (!raw) return;

    const match = STOCK_LIST.find(
      (s) => s.symbol.toUpperCase() === raw || s.name.toUpperCase() === raw
    );

    const target = match ? match.apiSymbol : raw;
    setSearchInput("");
    setShowSuggestions(false);
    router.push(`/hisse/${target}`);
  };

  const tickerList = [...POPULAR_STOCKS, ...POPULAR_STOCKS];

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
      <div className="relative overflow-hidden border-b px-8 py-20" style={{ borderColor: "#1E2530" }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#1A2130 1px, transparent 1px), linear-gradient(90deg, #1A2130 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 60% 60% at 50% 40%, black 0%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 40%, black 0%, transparent 75%)",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "#C9A24B" }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="fade-in font-[family-name:var(--font-display)] text-5xl font-medium tracking-tight text-[#F3F1EA]">
            Hisse takibi, yapay zekayla
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[#8B93A1]">
            Bir sembol yaz, güncel fiyatı, geçmiş grafiği ve yapay zekanın
            hazırladığı olumlu/olumsuz analizi tek ekranda gör.
          </p>

          <div className="relative mx-auto mt-9 max-w-md">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Sembol ara (ör. AAPL, ASELS)"
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

            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-lg border text-left shadow-xl"
                style={{ borderColor: "#242B38", backgroundColor: "#111826" }}
              >
                {filteredSuggestions.map((s) => (
                  <button
                    key={s.symbol}
                    onClick={() => goToSymbol(s.apiSymbol)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-[#1A2130]"
                  >
                    <span className="font-[family-name:var(--font-mono)] text-sm text-[#E8E6E0]">
                      {s.symbol}
                    </span>
                    <span className="text-xs text-[#6B7280]">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
                className="group fade-in rounded-xl border p-5 transition-colors"
                style={{
                  borderColor: "#1E2530",
                  backgroundColor: "#0D1220",
                  animationDelay: `${POPULAR_STOCKS.indexOf(s) * 60}ms`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[15px] font-medium tracking-wide text-[#E8E6E0] group-hover:text-[#C9A24B]">
                      {s.symbol}
                    </p>
                    <p className="mt-0.5 text-sm text-[#6B7280]">{s.name}</p>
                  </div>

                  {sparklines[s.symbol] ? (
                    <Sparkline data={sparklines[s.symbol]} isUp={isUp} />
                  ) : (
                    <div className="skeleton h-8 w-[100px]" />
                  )}

                  <div className="text-right">
                    {p ? (
                      <>
                        <p className="font-[family-name:var(--font-mono)] text-[15px] text-[#E8E6E0]">
                          ${p.price}
                        </p>
                        <p
                          className={`mt-0.5 text-xs ${
                            isUp ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {isUp ? "↑" : "↓"} {Math.abs(p.change_percent)}%
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <div className="skeleton h-4 w-14" />
                        <div className="skeleton h-3 w-10" />
                      </div>
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