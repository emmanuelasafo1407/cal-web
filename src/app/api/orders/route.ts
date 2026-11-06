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
      paymentReference,
      totalAmount,
      deliveryAddress,
      items,
    } = body;

    // Validate required fields
    if (!customerName || !email || !phone || !totalAmount || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Please fill in all required customer details and make sure your cart is not empty." },
        { status: 400 }
      );
    }

    // Collect all unique product IDs from incoming items
    const rawProductIds = items
      .map((item: IncomingOrderItem) => item.productId || item.id || "")
      .filter(Boolean);

    // Fetch matching products from database
    const existingProducts = await db.product.findMany({
      where: { id: { in: rawProductIds } },
      select: { id: true, stockQuantity: true, title: true },
    });

    // Fallback product in case item is a custom service without a direct product row
    const fallbackProduct = await db.product.findFirst({ select: { id: true } });
    if (!fallbackProduct) {
      return NextResponse.json(
        { error: "No products exist in the store catalog. Please contact support." },
        { status: 400 }
      );
    }

    const productMap = new Map(existingProducts.map((p) => [p.id, p]));

    // Calculate total requested quantity per actual physical product
    const requestedQtyByProduct = new Map<string, number>();
    for (const item of items as IncomingOrderItem[]) {
      const rawId = item.productId || item.id || "";
      if (productMap.has(rawId)) {
        const qty = parseInt(item.quantity?.toString(), 10) || 1;
        const current = requestedQtyByProduct.get(rawId) || 0;
        requestedQtyByProduct.set(rawId, current + qty);
      }
    }

    // CONSTRAINT CHECK: Ensure customer cannot order more than available stock
    for (const [productId, requestedQty] of requestedQtyByProduct.entries()) {
      const product = productMap.get(productId)!;
      if (product.stockQuantity <= 0) {
        return NextResponse.json(
          {
            error: `"${product.title}" is currently out of stock. Please remove it from your cart to proceed.`,
          },
          { status: 400 }
        );
      }

      if (product.stockQuantity < requestedQty) {
        return NextResponse.json(
          {
            error: `Only ${product.stockQuantity} unit(s) of "${product.title}" are available in stock. You tried to order ${requestedQty}. Please reduce your quantity.`,
          },
          { status: 400 }
        );
      }
    }

    // Determine payment status
    const isOnlinePayment = typeof paymentMethod === "string" && paymentMethod.toUpperCase().includes("PAYSTACK");
    const paymentStatus = isOnlinePayment ? "PAID" : "PENDING";

    // Atomic transaction: Create order, create items, and deduct stock
    const newOrder = await db.$transaction(async (tx) => {
      // 1. Create the master order record
      const order = await tx.order.create({
        data: {
          customerName: customerName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          paymentMethod: isOnlinePayment ? "PAYSTACK" : "PAY_ON_DELIVERY",
          paymentReference: paymentReference || null,
          paymentStatus,
          totalAmount: parseFloat(totalAmount),
          deliveryAddress: deliveryAddress ? deliveryAddress.trim() : "Pick up at store",
          status: "PENDING",
        },
      });

      // 2. Prepare and insert order items
      const itemInsertions = (items as IncomingOrderItem[]).map((item) => {
        const rawId = item.productId || item.id || "";
        const cleanProductId = productMap.has(rawId) ? rawId : fallbackProduct.id;

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

      await tx.orderItem.createMany({
        data: itemInsertions,
      });

      // 3. CONSTRAINT: Deduct purchased quantities from product stock
      for (const [productId, qtyToDeduct] of requestedQtyByProduct.entries()) {
        await tx.product.update({
          where: { id: productId },
          data: {
            stockQuantity: {
              decrement: qtyToDeduct,
            },
          },
        });
      }

      return order;
    });

    return NextResponse.json(
      {
        success: true,
        orderId: newOrder.id,
        message: "Your order has been placed successfully!",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("ORDER_CREATION_ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Could not complete your order. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err?.message || "Failed to load orders." },
      { status: 500 }
    );
  }
}
