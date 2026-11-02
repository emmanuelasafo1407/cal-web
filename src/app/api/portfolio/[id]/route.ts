import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await req.json();
    const { title, category, description, imageUrlBefore, imageUrlAfter, videoUrl } = body;

    const updatedItem = await db.portfolioItem.update({
      where: { id: resolvedParams.id },
      data: {
        title: title ? title.trim() : undefined,
        category,
        description: description ? description.trim() : undefined,
        imageUrlBefore,
        imageUrlAfter,
        videoUrl,
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

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await db.portfolioItem.delete({
      where: { id: resolvedParams.id },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to delete showroom entry." }, { status: 500 });
  }
}