"use client";

import { useState } from "react";
import { useCart } from "@/store/useCart";

interface ProductOrderFormProps {
  product: {
    id: string;
    title: string;
    price: number;
    category: string;
    isCustomizable: boolean;
  };
}

export default function ProductOrderForm({ product }: ProductOrderFormProps) {
  const addItem = useCart((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  // --- Dynamic Apparel State Management ---
  const [teamName, setTeamName] = useState("");
  const [jerseySeason, setJerseySeason] = useState("");
  const [kitType, setKitType] = useState("Home");
  const [printName, setPrintName] = useState("");
  const [printNumber, setPrintNumber] = useState("");
  const [apparelCustomDetails, setApparelCustomDetails] = useState("");

  // --- General Electronics & Hardware State Management ---
  const [hardwareSpecification, setHardwareSpecification] = useState("");

  const handleAddToCart = () => {
    const customData: Record<string, string | number | boolean> = {};

    // 1. Process Metadata for Apparel / Jerseys
    if (product.category === "apparel") {
      customData.teamName = teamName.trim() || "Generic / National";
      customData.jerseySeason = jerseySeason.trim() || "Current Season";
      customData.kitType = kitType;
      
      if (product.isCustomizable) {
        customData.printName = printName.trim().toUpperCase() || "NO NAME";
        customData.printNumber = printNumber.trim() || "00";
      }
      
      if (apparelCustomDetails.trim()) {
        customData.customSpecifications = apparelCustomDetails.trim();
      }
    }

    // 2. Process Metadata for Electronic Hardware / Accessories
    if (product.category === "hardware" || product.category === "electronics") {
      customData.hardwareRequestDetails = hardwareSpecification.trim() || "Standard Retail Specification";
    }

    // Fire data payload directly into your global Zustand store pipeline
    addItem({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      quantity: quantity,
      type: "product",
      customData: Object.keys(customData).length > 0 ? customData : undefined,
    });

    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-100">
      
      {/* ================= CATEGORY: APPAREL / JERSEY INTERACTIVE OVERLAY ================= */}
      {product.category === "apparel" && (
        <div className="space-y-4 mb-6 animate-fadeIn">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-2">
                Football Club / National Team
              </label>
              <input 
                type="text" 
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Manchester City, Hearts of Oak" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:border-[#D4AF37] transition text-[#002147]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-2">
                Jersey Season
              </label>
              <input 
                type="text" 
                value={jerseySeason}
                onChange={(e) => setJerseySeason(e.target.value)}
                placeholder="e.g. 2026/2027" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:border-[#D4AF37] transition text-[#002147]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-2">
              Kit Selection Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["Home", "Away", "Third Kit", "Others"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setKitType(type)}
                  className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-xl border transition duration-200 ${
                    kitType === type 
                      ? "bg-[#002147] text-white border-[#002147]" 
                      : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Custom Name and Number Print block */}
          {product.isCustomizable && (
            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-dashed border-slate-200">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-2">
                  Custom Print Name
                </label>
                <input 
                  type="text" 
                  value={printName}
                  onChange={(e) => setPrintName(e.target.value)}
                  placeholder="e.g. AKPORNORSOR" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:border-[#D4AF37] transition text-[#002147]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-2">
                  Custom Print Number
                </label>
                <input 
                  type="text" 
                  maxLength={3}
                  value={printNumber}
                  onChange={(e) => setPrintNumber(e.target.value)}
                  placeholder="e.g. 10" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono font-bold text-sm focus:outline-none focus:border-[#D4AF37] transition text-[#002147]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-2">
              Other Custom Requirements / Description
            </label>
            <textarea 
              rows={2}
              value={apparelCustomDetails}
              onChange={(e) => setApparelCustomDetails(e.target.value)}
              placeholder="Describe details if 'Others' is picked (e.g. long sleeves, specific training kit details, custom logo additions)..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-xs focus:outline-none focus:border-[#D4AF37] transition text-[#002147] resize-none"
            />
          </div>
        </div>
      )}

      {/* ================= CATEGORY: HARDWARE & ELECTRONICS OVERLAY ================= */}
      {(product.category === "hardware" || product.category === "electronics") && (
        <div className="space-y-4 mb-6 animate-fadeIn">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-2">
              Hardware Specifications / Model Requests
            </label>
            <textarea 
              rows={3}
              value={hardwareSpecification}
              onChange={(e) => setHardwareSpecification(e.target.value)}
              placeholder="Specify structural details (e.g. Brand Preference, Color Variant, LED Bulb Wattage capacity configurations, Phone Storage size variants)..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-xs focus:outline-none focus:border-[#D4AF37] transition text-[#002147] resize-none"
            />
          </div>
        </div>
      )}

      {/* ================= CORE QUANTITY MANAGEMENT BLOCK ================= */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
            Quantity
          </label>
          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
            <button 
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 font-black text-slate-500 hover:text-[#002147] transition text-base"
            >
              -
            </button>
            <span className="px-4 font-mono font-bold text-sm text-[#002147]">
              {quantity}
            </span>
            <button 
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 font-black text-slate-500 hover:text-[#002147] transition text-base"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Core Execution Add Trigger */}
      <button 
        type="button"
        onClick={handleAddToCart}
        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-md hover:from-[#002147] hover:to-[#002147] hover:text-white transition duration-300 transform active:scale-95"
      >
        Add to Terminal Cart
      </button>

      {/* Immediate Toast Alert Feedback */}
      {addedMessage && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[10px] font-black text-center uppercase tracking-wider">
          ✓ Context added to checkout payload terminal successfully!
        </div>
      )}
    </div>
  );
}