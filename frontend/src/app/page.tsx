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

export default function Home() {
  const [stock, setStock] = useState<StockPrice | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/stocks/AAPL")
      .then((res) => res.json())
      .then((data) => setStock(data));

    fetch("http://127.0.0.1:8000/stocks/AAPL/history?range=3a")
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-8">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-white shadow-lg">
        {stock ? (
          <>
            <h1 className="text-2xl font-bold">{stock.symbol}</h1>
            <p className="mt-2 text-3xl font-semibold text-green-400">
              ${stock.price}
            </p>
            <div className="mt-6">
              <StockChart data={history} />
            </div>
          </>
        ) : (
          <p>Yukleniyor...</p>
        )}
      </div>
    </main>
  );
}