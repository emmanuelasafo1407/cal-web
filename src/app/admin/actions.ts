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
    const rawStock = formData.get("stockQuantity") as string;
    const stockQuantity = rawStock ? parseInt(rawStock, 10) : 10;
    const imageUrls = (formData.get("imageUrls") as string) || "/shop-day.jpeg";
    const isCustomizable = formData.get("isCustomizable") === "true";

    await db.product.create({
      data: {
        title,
        description,
        price,
        category,
        imageUrls: JSON.stringify([imageUrls]),
        stockQuantity,
        isCustomizable,
      },
    });

    revalidatePath("/products");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to add product.";
    return { success: false, error: msg };
  }
}

export async function uploadPortfolioItem(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const imageUrlBefore = (formData.get("imageUrlBefore") as string) || null;
    const imageUrlAfter = formData.get("imageUrlAfter") as string;
    const videoUrl = (formData.get("videoUrl") as string) || null;

    await db.portfolioItem.create({
      data: {
        title,
        description,
        category,
        imageUrlBefore,
        imageUrlAfter,
        videoUrl,
      },
    });

    revalidatePath("/portfolio");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to add showroom item.";
    return { success: false, error: msg };
  }
}

export async function clearProcessedOrder(id: string) {
  try {
    await db.order.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete order.";
    return { success: false, error: msg };
  }
}

// UPDATE PRODUCT STOCK STATUS OR DETAILS
export async function updateProductDetails(
  id: string,
  data: {
    title?: string;
    price?: number;
    stockQuantity?: number;
    category?: string;
    imageUrls?: string;
  }
) {
  try {
    await db.product.update({
      where: { id },
      data,
    });
    revalidatePath("/admin");
    revalidatePath("/products");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update product details";
    return { success: false, error: message };
  }
}

// TOGGLE STOCK AVAILABILITY (0 vs 10)
export async function toggleStockStatus(id: string, currentQty: number) {
  try {
    const newQty = currentQty > 0 ? 0 : 10;
    await db.product.update({
      where: { id },
      data: { stockQuantity: newQty },
    });
    revalidatePath("/admin");
    revalidatePath("/products");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle stock status";
    return { success: false, error: message };
  }
}

// DELETE A PRODUCT FROM CATALOG
export async function deleteProduct(id: string) {
  try {
    await db.product.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/products");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete product";
    return { success: false, error: message };
  }
}

// DELETE A PORTFOLIO ITEM FROM SHOWROOM
export async function deletePortfolioItem(id: string) {
  try {
    await db.portfolioItem.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/portfolio");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete showroom item";
    return { success: false, error: message };
  }
}

// UPDATE ORDER STATUS (PENDING -> PROCESSING -> COMPLETED -> CANCELLED)
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await db.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update order status";
    return { success: false, error: msg };
  }
}

// UPDATE PAYMENT STATUS (PENDING -> PAID)
export async function updateOrderPaymentStatus(orderId: string, paymentStatus: string) {
  try {
    await db.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update payment status";
    return { success: false, error: msg };
  }
}
