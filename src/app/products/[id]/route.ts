import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await db.product.delete({
      where: { id: resolvedParams.id },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("PRODUCT_DELETE_ERROR:", error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await req.json();
    
    const updatedProduct = await db.product.update({
      where: { id: resolvedParams.id },
      data: body, // Ensure your frontend only sends editable fields
    });

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error: unknown) {
    console.error("PRODUCT_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}