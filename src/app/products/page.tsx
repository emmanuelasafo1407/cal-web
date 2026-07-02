import { db } from "@/lib/db";
import ProductCatalogFilter from "@/components/ProductCatalogFilter";

export const revalidate = 0; 

export default async function ProductsCatalogPage() {
  // Pull raw entries safely
  const rawProducts = await db.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  // Strict mapping fixes the type error at line 45
  const products = rawProducts.map((p) => ({
    id: String(p.id),
    title: String(p.title),
    description: p.description ? String(p.description) : "",
    price: Number(p.price),
    stockQuantity: Number(p.stockQuantity),
    category: String(p.category),
    imageUrls: p.imageUrls ? String(p.imageUrls) : "",
    isCustomizable: Boolean(p.isCustomizable)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001124] via-[#001a35] to-[#000d1a] py-20 px-6 relative overflow-hidden">
      
      {/* Decorative High-End Blur Orbs */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[-10%] w-[500px] h-[500px] bg-[#002147]/60 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Luxury Page Header */}
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-1.5 rounded-full w-fit border border-[#D4AF37]/20 backdrop-blur-md">
            Constant A. Liberty Ventures
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none mt-2">
            Phones & Its <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3CD59] to-[#FFF4D0]">Accessorize Catalog</span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[#D4AF37] to-transparent mt-5"></div>
        </div>

        {/* Clean Type Boundary Component Injection */}
        <ProductCatalogFilter initialProducts={products} />

      </div>
    </div>
  );
}