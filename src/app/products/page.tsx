import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

// Force Next.js to bypass caching and query the database live on every single page view
export const revalidate = 0;

export default async function ProductsPage() {
  // Query all active assets from your XAMPP MySQL database table using Prisma
  const databaseProducts = await db.product.findMany({
    orderBy: {
      id: "desc", // Puts your newest uploads at the top of the grid
    },
  });

  return (
    <div className="min-h-screen text-white bg-[#001124] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back To Hub
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">Store Catalog</h1>
            <p className="text-sm text-slate-400 mt-1">Browse available hardware equipment and accessories.</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-3.5 flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-300">
              ACTIVE INDEX: {databaseProducts.length} ITEMS
            </span>
          </div>
        </div>

        {/* DYNAMIC PRODUCTS LIVE FEED GRID */}
        {databaseProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-sm font-black uppercase text-slate-500 tracking-wider">No catalog items found in database storage.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {databaseProducts.map((product) => {
              // Cast the union type explicitly to unknown then string to satisfy the compiler safely
              const rawImgUrls = product.imageUrls as unknown;
              const imgString = typeof rawImgUrls === "string" ? rawImgUrls : "";
              
              let displayImage = "/placeholder-box.jpg";
              try {
                if (imgString) {
                  const parsed = JSON.parse(imgString);
                  displayImage = Array.isArray(parsed) ? parsed[0] : imgString;
                }
              } catch {
                if (imgString) displayImage = imgString;
              }

              return (
                <div key={product.id} className="bg-black/20 border border-white/[0.04] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-white/[0.1] transition-all duration-300">
                  <div className="relative aspect-square w-full bg-black/40 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={displayImage} 
                      alt={product.title} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-[9px] font-black uppercase tracking-wider text-[#D4AF37] px-2.5 py-1 rounded-md border border-white/[0.06]">
                      {product.category}
                    </span>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-black uppercase text-sm tracking-tight text-white group-hover:text-[#D4AF37] transition">
                        {product.title}
                      </h3>
                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-white/[0.05] flex justify-between items-center">
                      <span className="font-mono font-black text-sm text-white">
                        GH₵ {Number(product.price).toFixed(2)}
                      </span>
                      <Link href={`/products/${product.id}`} className="bg-white text-[#002147] font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded-lg hover:bg-[#D4AF37] transition">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}