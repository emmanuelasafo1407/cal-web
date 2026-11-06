import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Product deleted." }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("PRODUCT_DELETE_ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, price, stockQuantity, category, imageUrl, imageUrls, isCustomizable } = body;

    const updateData: {
      title?: string;
      description?: string;
      price?: number;
      stockQuantity?: number;
      category?: string;
      imageUrls?: string;
      isCustomizable?: boolean;
    } = {};

    if (title !== undefined) updateData.title = String(title).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity, 10);
    if (category !== undefined) updateData.category = String(category);
    if (imageUrl !== undefined) updateData.imageUrls = JSON.stringify([imageUrl]);
    else if (imageUrls !== undefined) {
      updateData.imageUrls = typeof imageUrls === "string" ? imageUrls : JSON.stringify(imageUrls);
    }
    if (isCustomizable !== undefined) updateData.isCustomizable = Boolean(isCustomizable);

    const updatedProduct = await db.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("PRODUCT_UPDATE_ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update product." },
      { status: 500 }
    );
  }
}
