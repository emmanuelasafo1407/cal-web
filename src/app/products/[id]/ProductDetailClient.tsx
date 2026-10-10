"use client";

import { useState } from "react";
import { useCart } from "@/store/useCart";
import { ShoppingBag, CheckCircle, AlertTriangle, ShieldCheck, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imageUrl: string;
  isCustomizable: boolean;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);

  // Customization state
  const [quantity, setQuantity] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [season, setSeason] = useState("");
  const [kitType, setKitType] = useState("Home");
  const [size, setSize] = useState("L");
  
  // Custom printing choice (Yes / No)
  const [wantsCustomization, setWantsCustomization] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stockQuantity === 0;
  const isApparel = product.category.toLowerCase() === "apparel" || product.isCustomizable;

  // Calculate dynamic price (+ GH₵ 50 if customized)
  const customizationFee = wantsCustomization ? 50 : 0;
  const unitPrice = product.price + customizationFee;

  // Dynamic title based on inputs
  const displayTitle = teamName.trim() 
    ? `${teamName.trim()} Jersey (${kitType}${season.trim() ? ` - ${season.trim()}` : ""})` 
    : product.title;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      title: displayTitle,
      price: unitPrice,
      quantity,
      imageUrl: product.imageUrl,
      customOptions: isApparel ? {
        teamName: teamName || "Featured Kit",
        season: season || "Current Season",
        kitType,
        size,
        customized: wantsCustomization ? "Yes (+GH₵ 50)" : "No",
        printedName: wantsCustomization ? (customName || "N/A") : "None",
        printedNumber: wantsCustomization ? (customNumber || "N/A") : "None",
      } : undefined,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 bg-black/40 border border-white/[0.06] rounded-3xl p-6 lg:p-8 backdrop-blur-2xl">
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/60">
        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
            <span className="bg-red-500/20 border border-red-500/40 text-red-400 font-black text-xs uppercase px-4 py-2 rounded-full flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* DETAILS & OPTIONS */}
      <div className="flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-white/5 text-[#D4AF37] border border-white/10">
              {product.category}
            </span>
            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${isOutOfStock ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
              {isOutOfStock ? "Unavailable" : `${product.stockQuantity} In Stock`}
            </span>
          </div>

          <h1 className="text-2xl font-black uppercase text-white">{displayTitle}</h1>
          
          <div className="flex items-baseline gap-3">
            <p className="text-2xl font-mono font-black text-[#D4AF37]">
              GH₵ {unitPrice.toFixed(2)}
            </p>
            {wantsCustomization && (
              <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                +GH₵ 50.00 Customization Fee Included
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{product.description}</p>

          {/* CUSTOM APPAREL / JERSEY OPTIONS */}
          {isApparel && !isOutOfStock && (
            <div className="space-y-4 p-4 bg-white/[0.02] border border-white/10 rounded-2xl pt-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">Jersey Order Specifications</p>
              
              {/* TEAM NAME */}
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400">Team / Country Name</label>
                <input 
                  type="text" 
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Real Madrid, Ghana, Arsenal, Barcelona" 
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* SEASON EDITION (TEXT INPUT) & KIT TYPE */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400">Season Edition</label>
                  <input 
                    type="text"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    placeholder="e.g. 2026/2027 or Retro 2008"
                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400">Kit Type</label>
                  <select 
                    value={kitType}
                    onChange={(e) => setKitType(e.target.value)}
                    className="w-full mt-1 bg-[#001124] border border-white/10 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="Home">Home Kit</option>
                    <option value="Away">Away Kit</option>
                    <option value="Third">Third Kit</option>
                    <option value="Fourth">Fourth / Special Edition</option>
                  </select>
                </div>
              </div>

              {/* SIZE & QUANTITY */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400">Select Size</label>
                  <select 
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full mt-1 bg-[#001124] border border-white/10 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">Extra Large (XL)</option>
                    <option value="XXL">2XL</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-slate-400">Quantity</label>
                  <div className="flex items-center mt-1 bg-black/40 border border-white/10 rounded-xl p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="flex-1 text-center font-mono font-bold text-xs">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* CUSTOM NAME & NUMBER PRINTING CHOICE */}
              <div className="border-t border-white/10 pt-3 space-y-3">
                <label className="text-[9px] uppercase font-bold text-[#D4AF37] block">
                  Add Custom Name & Number Printing? (+ GH₵ 50.00)
                </label>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWantsCustomization(false)}
                    className={`py-2 rounded-xl text-xs font-black uppercase transition border ${
                      !wantsCustomization 
                        ? "bg-white text-[#002147] border-white" 
                        : "bg-black/30 text-slate-400 border-white/10 hover:text-white"
                    }`}
                  >
                    No Thanks
                  </button>
                  <button
                    type="button"
                    onClick={() => setWantsCustomization(true)}
                    className={`py-2 rounded-xl text-xs font-black uppercase transition border ${
                      wantsCustomization 
                        ? "bg-[#D4AF37] text-[#002147] border-[#D4AF37]" 
                        : "bg-black/30 text-slate-400 border-white/10 hover:text-white"
                    }`}
                  >
                    Yes (+ GH₵ 50)
                  </button>
                </div>

                {/* EXPANDABLE INPUT FIELDS IF YES */}
                {wantsCustomization && (
                  <div className="grid grid-cols-2 gap-3 pt-2 animate-fadeIn">
                    <div>
                      <label className="text-[9px] uppercase font-bold text-slate-400">Printed Name</label>
                      <input 
                        type="text" 
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. MAKAFUI" 
                        className="w-full mt-1 bg-black/40 border border-[#D4AF37]/50 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-slate-400">Shirt Number</label>
                      <input 
                        type="text" 
                        value={customNumber}
                        onChange={(e) => setCustomNumber(e.target.value)}
                        placeholder="e.g. 10" 
                        className="w-full mt-1 bg-black/40 border border-[#D4AF37]/50 rounded-xl p-2.5 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* ADD TO CART ACTION */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition ${
              isOutOfStock 
                ? "bg-red-500/20 text-red-400 border border-red-500/30 cursor-not-allowed" 
                : added
                ? "bg-green-500 text-white shadow-xl"
                : "bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] hover:opacity-90 shadow-xl"
            }`}
          >
            {added ? (
              <>
                <CheckCircle className="w-4 h-4 animate-bounce" /> Added to Shopping Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> {isOutOfStock ? "Product Out of Stock" : `Add to Cart • GH₵ ${(unitPrice * quantity).toFixed(2)}`}
              </>
            )}
          </button>

          {added && (
            <Link 
              href="/checkout"
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider text-center block transition flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
            <span>Verified Mobile Money & Paystack Clearance</span>
          </div>
        </div>
      </div>
    </div>
  );
}