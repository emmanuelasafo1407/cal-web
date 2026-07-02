"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priceInput = formData.get("price") as string;
  const stockInput = formData.get("stockQuantity") as string;
  const category = formData.get("category") as string;
  const isCustomizableInput = formData.get("isCustomizable") as string;
  const imageUrlInput = formData.get("imageUrl") as string;

  if (!title || !priceInput || !stockInput || !category) {
    throw new Error("Missing required form fields.");
  }

  // Use the provided image name or default to a generic asset placeholder if left blank
  const finalImageUrl = imageUrlInput.trim() ? imageUrlInput.trim() : "/shop-day.jpeg";

  await db.product.create({
    data: {
      title: title.trim(),
      description: description ? description.trim() : "",
      price: parseFloat(priceInput),
      stockQuantity: parseInt(stockInput, 10),
      category: category.trim().toLowerCase(),
      isCustomizable: isCustomizableInput === "true",
      // Inside your src/app/admin/actions.ts file, verify data mapping reads:
      imageUrls: finalImageUrl.toString()
    },
  });

  revalidatePath("/admin");
  revalidatePath("/products");
}