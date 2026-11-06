import { db } from "@/lib/db";
import Link from "next/link";
import { Package, ArrowRight, AlertTriangle } from "lucide-react";

export const revalidate = 0;

export default async function ProductsCatalogPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts = products.map((p) => {
    let mainImage = "/shop-day.jpeg";
    if (p.imageUrls) {
      try {
        const parsed = typeof p.imageUrls === "string" ? JSON.parse(p.imageUrls) : p.imageUrls;
        if (Array.isArray(parsed) && parsed.length > 0) mainImage = parsed[0];
        else if (typeof parsed === "string" && parsed.trim().length > 0) mainImage = parsed;
      } catch {
        mainImage = typeof p.imageUrls === "string" ? p.imageUrls : "/shop-day.jpeg";
      }
    }

    return {
      id: p.id,
      title: p.title,
      description: p.description,
      price: Number(p.price),
      category: p.category,
      stockQuantity: p.stockQuantity,
      imageUrl: mainImage,
    };
  });

  return (
    <div className="min-h-screen bg-[#001124] text-white p-4 sm:p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* HEADER */}
        <div className="border-b border-white/[0.06] pb-5 sm:pb-6">
          <p className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
            Online Store
          </p>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
            Our Products
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Browse our collection of electronic accessories, chargers, and custom jerseys.
          </p>
        </div>

        {/* PRODUCTS GRID */}
        {formattedProducts.length === 0 ? (
          <div className="text-center py-20 bg-black/30 border border-white/5 rounded-3xl space-y-3">
            <Package className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-slate-400">
              No products found in the store catalog right now. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {formattedProducts.map((product) => {
              const isOutOfStock = product.stockQuantity <= 0;

              return (
                <div 
                  key={product.id} 
                  className={`bg-black/40 border border-white/[0.06] rounded-3xl p-4 flex flex-col justify-between space-y-4 backdrop-blur-2xl transition hover:border-white/20 ${
                    isOutOfStock ? "opacity-75" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/60 border border-white/10">
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-black/80 text-[#D4AF37] border border-white/10">
                        {product.category}
                      </span>
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-2">
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-black uppercase text-white truncate">{product.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-mono font-bold text-[#D4AF37]">
                          GH₵ {product.price.toFixed(2)}
                        </p>
                        <span className={`text-[10px] font-bold ${isOutOfStock ? "text-red-400" : "text-slate-400"}`}>
                          {isOutOfStock ? "Out of stock" : `${product.stockQuantity} in stock`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link 
                    href={`/products/${product.id}`}
                    className="w-full bg-white/5 hover:bg-[#D4AF37] text-white hover:text-[#002147] py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
