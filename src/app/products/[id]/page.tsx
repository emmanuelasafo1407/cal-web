import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 0;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  let mainImage = "/shop-day.jpeg";
  try {
    const parsed = typeof product.imageUrls === "string" ? JSON.parse(product.imageUrls) : product.imageUrls;
    if (Array.isArray(parsed) && parsed.length > 0) mainImage = parsed[0];
    else if (typeof parsed === "string" && parsed.trim().length > 0) mainImage = parsed;
  } catch {
    mainImage = typeof product.imageUrls === "string" ? product.imageUrls : "/shop-day.jpeg";
  }

  const formattedProduct = {
    id: product.id,
    title: product.title,
    description: product.description || "",
    price: Number(product.price),
    category: product.category,
    stockQuantity: product.stockQuantity,
    imageUrl: mainImage,
    isCustomizable: product.isCustomizable || product.category.toLowerCase() === "apparel",
  };

  return (
    <div className="min-h-screen bg-[#001124] text-[#ffffff] p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#D4AF37] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store Catalog
        </Link>

        <ProductDetailClient product={formattedProduct} />
      </div>
    </div>
  );
}