import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus, deliveryAddress } = body;

    const updateData: {
      status?: string;
      paymentStatus?: string;
      deliveryAddress?: string;
    } = {};

    if (status !== undefined) updateData.status = String(status);
    if (paymentStatus !== undefined) updateData.paymentStatus = String(paymentStatus);
    if (deliveryAddress !== undefined) updateData.deliveryAddress = String(deliveryAddress);

    const updatedOrder = await db.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("ORDER_UPDATE_ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update order status." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Order deleted." }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("ORDER_DELETE_ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete order." },
      { status: 500 }
    );
  }
}
