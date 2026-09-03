import StockDetail from "@/components/StockDetail";

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-8">
      <StockDetail symbol={symbol.toUpperCase()} />
    </main>
  );
}