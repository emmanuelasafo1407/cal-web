"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import { ShoppingBag, PhoneCall, Menu, X, Shield } from "lucide-react";

export default function NavBar() {
  const items = useCart((state) => state.items);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "Showroom", href: "/portfolio" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#002147] border-b border-[#D4AF37]/30 shadow-2xl px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="border-2 border-[#D4AF37] bg-[#001530] px-2.5 py-0.5 rounded font-serif text-sm text-[#D4AF37]">
            CAL
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-wider text-[10px] sm:text-xs text-white uppercase leading-tight">
              CONSTANT A. LIBERTY
            </span>
            <span className="text-[8px] tracking-widest font-black text-[#D4AF37] uppercase">
              VENTURES
            </span>
          </div>
        </Link>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 bg-white/[0.04] backdrop-blur-xl border border-white/10 p-1.5 rounded-xl">
          
          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-5 font-black text-[10px] uppercase tracking-wider text-white px-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-[#D4AF37] transition duration-200">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Vertical Divider for Desktop */}
          <div className="hidden md:block h-4 w-[1px] bg-white/20 mx-1"></div>

          {/* Contact Button */}
          <a
            href="https://wa.me/233544208963"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/10 border border-white/10 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg hover:bg-white hover:text-[#002147] transition duration-200"
          >
            <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Cart Button */}
          <Link
            href="/checkout"
            className="relative flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg hover:shadow-[#D4AF37]/20 transition duration-200"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="bg-[#002147]/15 w-4 h-4 rounded-full flex items-center justify-center font-mono text-[10px]">
              {totalQuantity}
            </span>
          </Link>

          {/* Mobile Menu Action Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-white hover:text-[#D4AF37] transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Slide-down Mobile Menu Panel Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/10 text-center space-y-2">
          <nav className="flex flex-col gap-1 font-black text-xs uppercase tracking-wider text-white">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-4 hover:bg-white/[0.08] rounded-xl hover:text-[#D4AF37] transition"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-4 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition flex items-center justify-center gap-1.5 text-[11px]"
            >
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" /> Admin Portal
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
