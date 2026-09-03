import Link from "next/link";
import StockDetail from "@/components/StockDetail";

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  return (
    <main className="min-h-screen bg-neutral-950 p-8">
      <div className="mx-auto mb-6 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-green-400"
        >
          ← Ana Sayfa
        </Link>
      </div>

      <div className="flex justify-center">
        <StockDetail symbol={symbol.toUpperCase()} />
      </div>
    </main>
  );
}