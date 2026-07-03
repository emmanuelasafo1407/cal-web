"use client";

import { useState } from "react";
import Image from "next/image";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  imageUrlBefore: string | null;
  imageUrlAfter: string;
  videoUrl: string | null;
}

interface ShowcaseProps {
  initialItems: PortfolioItem[];
}

export default function PortfolioShowcase({ initialItems }: ShowcaseProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = initialItems.filter(
    (item) => activeTab === "all" || item.category === activeTab
  );

  return (
    <div className="space-y-12">
      {/* Portfolio Filter Controls Row */}
      <div className="flex flex-wrap justify-center gap-3 backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] p-3 rounded-2xl max-w-2xl mx-auto">
        {[
          { id: "all", label: "Complete Showroom" },
          { id: "graphics", label: "Graphic Design" },
          { id: "video", label: "Video Editing" },
          { id: "stickers", label: "Laptop Skins (Before/After)" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition duration-300 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] shadow-lg"
                : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Layout Cards Display */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-3xl text-slate-500 text-xs font-black uppercase tracking-widest">
          No portfolio show items posted here yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 shadow-2xl space-y-4 hover:border-[#D4AF37]/30 transition duration-300 group"
            >
              {/* Special Before/After comparison display module for laptop skins */}
              {item.category === "stickers" && item.imageUrlBefore ? (
                <div className="grid grid-cols-2 gap-2 relative h-48 rounded-xl overflow-hidden">
                  <div className="relative w-full h-full border-r border-black/40">
                    <Image src={item.imageUrlBefore} alt="Before Wrap" fill className="object-cover" />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white font-black text-[8px] uppercase px-1.5 py-0.5 rounded">Before</span>
                  </div>
                  <div className="relative w-full h-full">
                    <Image src={item.imageUrlAfter} alt="After Wrap" fill className="object-cover" />
                    <span className="absolute bottom-2 right-2 bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-[8px] uppercase px-1.5 py-0.5 rounded">After</span>
                  </div>
                </div>
              ) : (
                /* Standard Display for Graphics & Video Thumbnails */
                <div className="relative h-48 rounded-xl overflow-hidden bg-white/[0.01]">
                  <Image src={item.imageUrlAfter} alt={item.title} fill className="object-cover" />
                  {item.category === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition">
                      <span className="text-3xl bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg">▶️</span>
                    </div>
                  )}
                </div>
              )}

              {/* Card Meta Content Info */}
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/5 px-2 py-0.5 rounded border border-[#D4AF37]/10">
                  {item.category === "stickers" ? "Laptop Skin Wrap" : item.category === "video" ? "Video Editing Post" : "Graphic Concept"}
                </span>
                <h4 className="text-base font-black text-white uppercase tracking-tight mt-2 group-hover:text-[#D4AF37] transition duration-300">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-2 mt-1">
                    {item.description}
                  </p>
                )}
              </div>

              {item.category === "video" && item.videoUrl && (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center w-full bg-white/[0.04] text-white font-black text-[9px] uppercase tracking-widest py-2.5 rounded-xl hover:bg-white hover:text-[#002147] transition duration-200"
                >
                  Watch Project Stream
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}