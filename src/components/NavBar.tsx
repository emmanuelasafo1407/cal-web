"use client";

import Link from "next/link";
import { useCart } from "@/store/useCart";
import { ShoppingBag, PhoneCall } from "lucide-react";

export default function NavBar() {
  const items = useCart((state) => state.items);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#002147] border-b border-[#D4AF37]/30 shadow-2xl py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Side: Brand Logo Core Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="border-2 border-[#D4AF37] bg-[#001530] px-3.5 py-1 rounded font-serif text-xl tracking-widest text-[#D4AF37] font-black shadow-md group-hover:bg-[#D4AF37] group-hover:text-[#002147] transition duration-300">
            CAL
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-wider text-xs sm:text-sm text-white uppercase">
              CONSTANT A. LIBERTY
            </span>
            <span className="text-[9px] tracking-widest font-black text-[#D4AF37] uppercase -mt-1">
              VENTURES
            </span>
          </div>
        </Link>
        
        {/* Right Side: Glass Container Housing Links, Contact & Cart Pills */}
        <div className="flex items-center gap-3 bg-white/[0.04] backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-lg">
          
          {/* Inner Nav Links */}
          <nav className="hidden md:flex items-center gap-6 font-black text-[11px] uppercase tracking-widest text-slate-200 px-2">
            <Link href="/" className="hover:text-[#D4AF37] transition duration-200">
              Home
            </Link>
            <Link href="/services" className="hover:text-[#D4AF37] transition duration-200">
              Services
            </Link>
            <Link href="/products" className="hover:text-[#D4AF37] transition duration-200">
              Products
            </Link>
          </nav>

          {/* Vertical Divider for Desktop */}
          <div className="hidden md:block h-4 w-[1px] bg-white/20 mx-1"></div>

          {/* Interactive Contact Action Shortcut */}
          <a 
            href="https://wa.me/233544208963"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full hover:bg-white/20 hover:border-[#D4AF37]/40 transition duration-200"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Contact</span>
          </a>

          {/* Premium Pill-Shaped Glass Cart Capsule */}
          <Link 
            href="/checkout" 
            className="relative flex items-center gap-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] px-5 py-2 rounded-full font-black text-[11px] uppercase tracking-widest hover:from-white hover:to-white transition duration-300 shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="bg-[#002147]/10 w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs text-[#002147]">
              {totalQuantity}
            </span>
          </Link>

        </div>

      </div>
    </header>
  );
}