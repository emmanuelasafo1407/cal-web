"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ExternalLink, MessageCircle, Play } from "lucide-react";

export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  imageUrlBefore: string | null;
  imageUrlAfter: string;
  videoUrl: string | null;
}

export interface ShowcaseProps {
  initialItems: PortfolioItem[];
}

export default function PortfolioShowcase({ initialItems }: ShowcaseProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems = (initialItems || []).filter(
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
              onClick={() => setSelectedItem(item)}
              className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 shadow-2xl space-y-4 hover:border-[#D4AF37]/40 transition duration-300 group cursor-pointer hover:-translate-y-1"
            >
              {/* Media Preview */}
              {item.category === "stickers" && item.imageUrlBefore ? (
                <div className="grid grid-cols-2 gap-2 relative h-48 rounded-xl overflow-hidden">
                  <div className="relative w-full h-full border-r border-black/40">
                    <Image src={item.imageUrlBefore} alt="Before Wrap" fill className="object-cover group-hover:scale-105 transition duration-500" />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white font-black text-[8px] uppercase px-1.5 py-0.5 rounded">Before</span>
                  </div>
                  <div className="relative w-full h-full">
                    <Image src={item.imageUrlAfter} alt="After Wrap" fill className="object-cover group-hover:scale-105 transition duration-500" />
                    <span className="absolute bottom-2 right-2 bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-[8px] uppercase px-1.5 py-0.5 rounded">After</span>
                  </div>
                </div>
              ) : (
                <div className="relative h-48 rounded-xl overflow-hidden bg-white/[0.01]">
                  <Image src={item.imageUrlAfter} alt={item.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                  {item.category === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition">
                      <span className="text-3xl bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg">▶️</span>
                    </div>
                  )}
                </div>
              )}

              {/* Card Meta Content */}
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
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

              <div className="pt-2 border-t border-white/[0.05] flex justify-between items-center text-[10px] text-slate-500 uppercase font-black">
                <span>View Full Details</span>
                <span className="text-[#D4AF37] group-hover:translate-x-1 transition">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL VIEW LIGHTBOX MODAL */}
      {selectedItem && (
        <div 
          onClick={() => setSelectedItem(null)} 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#001124] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 md:p-8 relative text-left"
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">
                {selectedItem.category === "stickers" ? "Laptop Skin Wrap" : selectedItem.category === "video" ? "Video Production" : "Graphic Design"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-3">
                {selectedItem.title}
              </h2>
            </div>

            {/* Media Presentation */}
            {selectedItem.category === "stickers" && selectedItem.imageUrlBefore ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Before Wrap / Decal</span>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                    <Image src={selectedItem.imageUrlBefore} alt="Before wrap" fill className="object-contain bg-black/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">After Custom Wrap</span>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#D4AF37]/30">
                    <Image src={selectedItem.imageUrlAfter} alt="After wrap" fill className="object-contain bg-black/50" />
                  </div>
                </div>
              </div>
            ) : selectedItem.category === "video" && selectedItem.videoUrl ? (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
                  <video src={selectedItem.videoUrl} controls autoPlay className="w-full h-full object-contain" />
                </div>
              </div>
            ) : (
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/50 border border-white/10">
                <Image src={selectedItem.imageUrlAfter} alt={selectedItem.title} fill className="object-contain" priority />
              </div>
            )}

            {/* Full Information & Details */}
            {selectedItem.description && (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">Project Overview & Scope</p>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                  {selectedItem.description}
                </p>
              </div>
            )}

            {/* Inquiry / Action Footer */}
            <div className="pt-2 flex flex-wrap justify-between items-center gap-4 border-t border-white/[0.06]">
              <a 
                href={selectedItem.imageUrlAfter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Full Resolution Media
              </a>

              <a
                href={`https://wa.me/233557334886?text=Hello%20Constant%20A.%20Liberty%20Ventures,%20I'm%20interested%20in%20a%20project%20similar%20to%20"${encodeURIComponent(selectedItem.title)}"!`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-xs uppercase px-6 py-3.5 rounded-xl hover:opacity-90 transition flex items-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" /> Request Similar Project On WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}