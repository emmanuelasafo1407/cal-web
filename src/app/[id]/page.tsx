interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DynamicDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold text-brand-blue">Detail Resource Entry</h1>
      <p className="text-slate-600 mt-2">Checking identification metric: <span className="font-mono bg-slate-100 p-1 rounded">{id}</span></p>
    </div>
  );
}