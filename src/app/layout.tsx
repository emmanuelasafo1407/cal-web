import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

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
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#001124] antialiased`}>
        <CartProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </CartProvider>

        {/* Cloudinary global upload script */}
        <Script 
          src="https://upload-widget.cloudinary.com/global/all.js" 
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}