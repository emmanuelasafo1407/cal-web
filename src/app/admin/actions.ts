"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getQueuedServices() {
  try {
    return await db.order.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function uploadProduct(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const imageUrls = formData.get("imageUrls") as string || "/shop-day.jpeg";
    const isCustomizable = formData.get("isCustomizable") === "true";

    await db.product.create({
      data: {
        title,
        description,
        price,
        category,
        imageUrls,
        stockQuantity: 99,
        isCustomizable
      }
    });

    revalidatePath("/products");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to post item.";
    return { success: false, error: msg };
  }
}

export async function uploadPortfolioItem(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const imageUrlBefore = formData.get("imageUrlBefore") as string || null;
    const imageUrlAfter = formData.get("imageUrlAfter") as string;
    const videoUrl = formData.get("videoUrl") as string || null;

    await db.portfolioItem.create({
      data: {
        title,
        description,
        category,
        imageUrlBefore,
        imageUrlAfter,
        videoUrl
      }
    });

    revalidatePath("/portfolio");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to populate showroom.";
    return { success: false, error: msg };
  }
}

export async function clearProcessedOrder(id: string) {
  try {
    await db.order.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false };
  }
}