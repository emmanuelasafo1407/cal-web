"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductRow {
  id: string;
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrls: string;
  isCustomizable: boolean;
}

interface FilterProps {
  initialProducts: ProductRow[];
}

export default function ProductCatalogFilter({ initialProducts }: FilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = initialProducts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Helper mapping to transform raw category database tokens into premium readable badges
  const getCategoryLabel = (category: string) => {
    const maps: Record<string, string> = {
      hardware: "Phones & Devices",
      electronics: "Accessories & Chargers",
      acoustics: "Sound Systems",
      lighting: "Smart LED Lighting",
      apparel: "Custom Jerseys",
      fabrics: "Corporate Fabrics"
    };
    return maps[category.toLowerCase()] || category;
  };

  return (
    <div className="space-y-12">
      
      {/* Search & Glassmorphism Filter Controls Card */}
      <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)] space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search our premium inventory assets by title name, brands, or tech specifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-6 pr-12 py-4 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:bg-white/[0.05] transition duration-300"
          />
          <span className="absolute right-5 top-4.5 text-slate-400 text-sm">🔍</span>
        </div>

        {/* Categories Selector Tabs Row */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.05]">
          {[
            { id: "all", label: "All Assets" },
            { id: "hardware", label: "Phones & Devices" },
            { id: "electronics", label: "Accessories & Chargers" },
            { id: "acoustics", label: "Sound Systems" },
            { id: "lighting", label: "LED Lighting" },
            { id: "apparel", label: "Custom Jerseys" },
            { id: "fabrics", label: "Wear Fabrics" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition duration-300 transform active:scale-95 ${
                selectedCategory === tab.id
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] shadow-lg shadow-[#D4AF37]/10 font-black border border-[#D4AF37]/20"
                  : "bg-white/[0.03] text-slate-400 border border-white/[0.05] hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Display Grid Matrix */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-3xl space-y-3">
          <span className="text-4xl block">📦</span>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            No matching commercial inventory units found.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const rawImg = product.imageUrls;
            let validImg = "/shop-day.jpeg";

            if (rawImg && typeof rawImg === "string" && rawImg.trim() !== "" && rawImg !== "undefined" && rawImg !== "null") {
              const cleaned = rawImg.trim();
              validImg = cleaned.startsWith("/") || cleaned.startsWith("http") ? cleaned : `/${cleaned}`;
            }

            return (
              <div
                key={product.id}
                className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl hover:border-[#D4AF37]/30 transition duration-500 flex flex-col justify-between group hover:shadow-[0_0_40px_rgba(212,175,55,0.03)]"
              >
                {/* Product Image Section */}
                <div className="relative w-full h-56 bg-white/[0.01] overflow-hidden border-b border-white/[0.04]">
                  <Image
                    src={validImg}
                    alt={product.title || "Catalog Stock"}
                    fill
                    sizes="(max-w-7xl) 25vw, 33vw"
                    className="object-cover group-hover:scale-105 transition duration-700 opacity-90 group-hover:opacity-100"
                  />
                  {product.isCustomizable && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg border border-white/10 animate-pulse">
                      Print Ready
                    </span>
                  )}
                </div>

                {/* Details Section */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/5 px-2 py-0.5 rounded border border-[#D4AF37]/10">
                      {getCategoryLabel(product.category)}
                    </span>
                    <h3 className="text-base font-black text-white uppercase tracking-tight mt-3 mb-1.5 line-clamp-1 group-hover:text-[#D4AF37] transition duration-300">
                      {product.title}
                    </h3>
                    <p className="text-slate-400 text-xs font-medium line-clamp-2 leading-relaxed">
                      {product.description || "Premium retail inventory catalog specification option."}
                    </p>
                  </div>

                  {/* Footer Pricing & Interactive Button block */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Unit Price</span>
                      <span className="text-base font-mono font-black text-white tracking-tight">
                        GH₵ {Number(product.price).toFixed(2)}
                      </span>
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="bg-white text-[#002147] font-black text-[9px] uppercase tracking-widest px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#F3CD59] hover:text-[#002147] transition duration-300 shadow-md transform active:scale-95"
                    >
                      Configure
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}