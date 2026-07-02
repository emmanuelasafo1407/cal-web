import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductOrderForm from "@/components/ProductOrderForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Grab exact unique product item matching path parameters from your local XAMPP database
  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Safely cast decimal fields to float variables to prevent string translation errors
  const serializedProduct = {
    id: product.id,
    title: product.title,
    price: Number(product.price),
    category: product.category,
    isCustomizable: product.isCustomizable,
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link href="/products" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#D4AF37] transition inline-flex items-center gap-1 mb-8">
        &larr; Back to Catalog
      </Link>

      <div className="grid md:grid-cols-12 gap-12 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
        {/* Left Aspect Asset Visualizer Panel */}
        <div className="md:col-span-5 bg-[#002147]/5 rounded-2xl flex flex-col items-center justify-center p-12 min-h-[300px]">
          <span className="text-7xl">
            {product.category === "apparel" ? "👕" : "📱"}
          </span>
        </div>

        {/* Right Aspect Form Controller Wrapper */}
        <div className="md:col-span-7 flex flex-col justify-between py-2">
          <div>
            <span className="text-xs uppercase tracking-widest font-black text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded border border-[#D4AF37]/20">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#002147] mt-4 uppercase tracking-tight">
              {product.title}
            </h1>
            <p className="text-slate-600 text-sm mt-4 font-medium leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#002147]">
                GH₵ {Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ({product.stockQuantity} items in stock)
              </span>
            </div>
          </div>

          {/* Interactive Form Component Processing Thread */}
          <ProductOrderForm product={serializedProduct} />
        </div>
      </div>
    </div>
  );
}