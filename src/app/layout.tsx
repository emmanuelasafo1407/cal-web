import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link"; // Added this missing import
import NavBar from "@/components/NavBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Constant A. Liberty Ventures",
  description: "Premium Agency Banking & Digital Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en" suppressHydrationWarning>
    <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Universal Header */}
        <NavBar />

        {/* Dynamic Inner Route Page */}
        <main className="grow">
          {children}
        </main>

        {/* Universal Footer */}
        <footer className="bg-brand-slate text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-bold text-base mb-4">CONSTANT A. LIBERTY VENTURES</h4>
              <p className="text-sm leading-relaxed max-w-xs">
                Off Likpe Road Bangalow – Hohoe. Providing high-conversion agency banking, premium graphics architecture, and professional retail hardware options.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/services" className="hover:text-white transition">Agency Banking Hub</Link></li>
                <li><Link href="/products" className="hover:text-white transition">Phones & Gear Catalog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-4">Immediate Contact</h4>
              <p className="text-sm mb-2">WhatsApp / Call Terminal:</p>
              <p className="text-lg font-mono font-bold text-brand-gold">0544208963</p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-slate-800 text-center text-xs">
            &copy; {new Date().getFullYear()} Constant A. Liberty Ventures. All Rights Reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}