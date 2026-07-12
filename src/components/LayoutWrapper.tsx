"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";
import Link from "next/link"; // Added the missing framework import link anchor

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Checks if the active browser viewport path sits within the admin module boundaries
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <NavBar />}
      <main className="grow">{children}</main>
      {!isAdminRoute && (
        <footer className="bg-[#001530] text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-bold text-base mb-4">CONSTANT A. LIBERTY VENTURES</h4>
              <p className="text-sm leading-relaxed max-w-xs">
                Off Likpe Road Bungalow - Hohoe. Providing high-conversion agency banking, premium graphics design, and digital solutions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {/* Fixed internal routing utilizing safe Next.js framework link wrappers */}
                <li><Link href="/services" className="hover:text-white transition">Agency Banking Hub</Link></li>
                <li><Link href="/products" className="hover:text-white transition">Phones & Gear Catalog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-4">Immediate Contact</h4>
              <p className="text-sm mb-2">WhatsApp / Call Terminal:</p>
              <p className="text-lg font-mono font-bold text-[#D4AF37]">0544208963</p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Constant A. Liberty Ventures. All Rights Reserved.
          </div>
        </footer>
      )}
    </>
  );
}