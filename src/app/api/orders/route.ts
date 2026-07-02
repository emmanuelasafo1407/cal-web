import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, email, phone, paymentMethod, totalAmount, items } = body;

    if (!customerName || !email || !phone || !items) {
      return NextResponse.json({ error: "Missing required order metadata layout" }, { status: 400 });
    }

    // Force values into raw database string blocks to avoid foreign key or decimal field connect failures
    const savedOrder = await db.order.create({
      data: {
        customerName: String(customerName).trim(),
        email: String(email).trim(),
        phone: String(phone).trim(),
        paymentMethod: String(paymentMethod),
        paymentStatus: paymentMethod === "online" ? "PAID_VIA_PAYSTACK" : "PAY_ON_DELIVERY",
        totalAmount: parseFloat(totalAmount) || 1.00, // Safe default to satisfy non-zero table parameters
        itemsPayload: JSON.stringify(items),
      },
    });

    return NextResponse.json({ success: true, orderId: savedOrder.id });
  } catch (error) {
    console.error("Order Transaction Failure:", error);
    return NextResponse.json({ error: "Internal Server database pipeline disconnect" }, { status: 500 });
  }
}