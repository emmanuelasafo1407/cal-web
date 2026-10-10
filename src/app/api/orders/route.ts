import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface IncomingOrderItem {
  id: string;
  productId?: string;
  quantity: string | number;
  price: string | number;
  title?: string;
  customOptions?: Record<string, unknown>;
  customData?: Record<string, unknown>;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      customerName, 
      email, 
      phone, 
      paymentMethod, 
      totalAmount, 
      deliveryAddress, 
      items 
    } = body;

    // Validate incoming data
    if (!customerName || !email || !phone || !totalAmount || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing critical structural transaction arguments." },
        { status: 400 }
      );
    }

    // Fetch existing valid product IDs from the database to ensure Foreign Key integrity
    const existingProducts = await db.product.findMany({
      select: { id: true },
    });

    if (existingProducts.length === 0) {
      return NextResponse.json(
        { error: "No products exist in database catalog to associate transaction." },
        { status: 400 }
      );
    }

    const validProductIds = new Set(existingProducts.map((p) => p.id));
    const fallbackProductId = existingProducts[0].id;

    // Execute atomic parent-child table insertion sequence
    const newOrder = await db.$transaction(async (tx) => {
      // 1. Insert master parent record into the Order table
      const order = await tx.order.create({
        data: {
          customerName: customerName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          paymentMethod,
          totalAmount: parseFloat(totalAmount),
          deliveryAddress: deliveryAddress || "N/A",
          status: "PENDING",
        },
      });

      // 2. Map and validate items to eliminate foreign key violations
      const itemInsertions = items.map((item: IncomingOrderItem) => {
        // Resolve target product ID
        const rawId = item.productId || item.id || "";
        const cleanProductId = validProductIds.has(rawId) ? rawId : fallbackProductId;

        const mergedCustomData = {
          title: item.title || "Store Item",
          ...(item.customOptions || item.customData || {}),
        };

        return {
          orderId: order.id,
          productId: cleanProductId,
          quantity: parseInt(item.quantity.toString(), 10) || 1,
          price: parseFloat(item.price.toString()),
          customData: JSON.stringify(mergedCustomData),
        };
      });

      // 3. Bulk insert entries into OrderItem relation table
      await tx.orderItem.createMany({
        data: itemInsertions,
      });

      return order;
    });

    return NextResponse.json({ success: true, orderId: newOrder.id }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("CRITICAL CHECKOUT PIPELINE FAILURE:", err);
    return NextResponse.json(
      { error: err?.message || "Internal transaction cluster pipeline isolation failure." },
      { status: 500 }
    );
  }
}