"use client";

import { useEffect, useState } from "react";

type StockPrice = {
  symbol: string;
  price: number;
};

export default function Home() {
  const [stock, setStock] = useState<StockPrice | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/stocks/AAPL")
      .then((res) => res.json())
      .then((data) => setStock(data));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-white shadow-lg">
        {stock ? (
          <>
            <h1 className="text-2xl font-bold">{stock.symbol}</h1>
            <p className="mt-2 text-3xl font-semibold text-green-400">
              ${stock.price}
            </p>
          </>
        ) : (
          <p>Yukleniyor...</p>
        )}
      </div>
    </main>
  );
}