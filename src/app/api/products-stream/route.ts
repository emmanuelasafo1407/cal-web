import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, stockQuantity, category, imageUrl } = body;

    const product = await db.product.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : "",
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity, 10),
        category: category || "electronics",
        imageUrls: imageUrl || "/bg-evening.jpeg",
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("PRODUCT_CREATION_ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to persist product." },
      { status: 500 }
    );
  }
}