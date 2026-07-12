import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    // Execute atomic parent-child table insertion sequence
    const newOrder = await db.$transaction(async (tx) => {
      // 1. Insert master parent record into the Order table
      const order = await tx.order.create({
        data: {
          customerName,
          email,
          phone,
          paymentMethod,
          totalAmount: parseFloat(totalAmount),
          deliveryAddress: deliveryAddress || "N/A",
          status: "PENDING",
        },
      });

      // 2. Prepare and bulk insert entries into your new OrderItem relation table
      const itemInsertions = items.map((item: { id: string; quantity: string | number; price: string | number }) => ({
        orderId: order.id,
        productId: item.id, 
        quantity: parseInt(item.quantity.toString()) || 1,
        price: parseFloat(item.price.toString()),
      }));

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
// Using a word instead of raw symbol for XML-safe comparison operations
  }
}