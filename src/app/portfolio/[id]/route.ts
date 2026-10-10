import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// EDIT SHOWROOM ITEM
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, category, description, imageUrlBefore, imageUrlAfter, videoUrl } = body;

    const updatedItem = await db.portfolioItem.update({
      where: { id },
      data: {
        title: title ? title.trim() : undefined,
        category: category || undefined,
        description: description !== undefined ? description.trim() : undefined,
        imageUrlBefore: imageUrlBefore !== undefined ? imageUrlBefore : undefined,
        imageUrlAfter: imageUrlAfter !== undefined ? imageUrlAfter : undefined,
        videoUrl: videoUrl !== undefined ? videoUrl : undefined,
      },
    });

    return NextResponse.json({ success: true, item: updatedItem }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("PORTFOLIO_UPDATE_ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update showroom entry." },
      { status: 500 }
    );
  }
}

// DELETE SHOWROOM ITEM
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.portfolioItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("PORTFOLIO_DELETE_ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete showroom entry." },
      { status: 500 }
    );
  }
}