import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, description, imageUrlBefore, imageUrlAfter, videoUrl } = body;

    const item = await db.portfolioItem.create({
      data: {
        title: title.trim(),
        category: category || "graphics",
        description: description ? description.trim() : undefined,
        imageUrlBefore: imageUrlBefore || undefined,
        imageUrlAfter: imageUrlAfter || "/bg-evening.jpeg",
        videoUrl: videoUrl || undefined,
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("PORTFOLIO_CREATION_ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create showroom item." },
      { status: 500 }
    );
  }
}