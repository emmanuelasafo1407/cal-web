import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, stockQuantity, category, imageUrl } = body;

    if (!title || price === undefined || price === null || price === "") {
      return NextResponse.json(
        { error: "Product title and price are required." },
        { status: 400 }
      );
    }

    const cleanImage = imageUrl && typeof imageUrl === "string" && imageUrl.trim().length > 0
      ? imageUrl.trim()
      : "/shop-day.jpeg";

    const product = await db.product.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : "",
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity, 10) || 0,
        category: category || "electronics",
        imageUrls: JSON.stringify([cleanImage]),
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("PRODUCT_CREATION_ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create product." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err?.message || "Failed to fetch products." },
      { status: 500 }
    );
  }
}
