import Link from "next/link";
import StockDetail from "@/components/StockDetail";

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  return (
    <main
      className="relative min-h-screen overflow-hidden p-8"
      style={{ backgroundColor: "#0A0E16" }}
    >
      {/* Arka plan: dev, soluk hisse sembolu */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 select-none font-[family-name:var(--font-display)] text-[280px] font-medium leading-none opacity-[0.04]"
        style={{ color: "#C9A24B" }}
      >
        {upperSymbol}
      </div>

      <div className="relative mx-auto mb-6 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#8B93A1] transition-colors hover:text-[#C9A24B]"
        >
          ← Ana Sayfa
        </Link>
      </div>

      <div className="relative flex justify-center">
        <StockDetail symbol={upperSymbol} />
      </div>
    </main>
  );
}