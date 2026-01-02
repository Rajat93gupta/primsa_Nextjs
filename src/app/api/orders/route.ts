/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../../prisma/db_client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };

    const orders = await prisma.order.findMany({
      where: { userId: decoded.userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("FETCH ORDERS ERROR:", err);
    const isDev = process.env.NODE_ENV !== "production";
    const payload: any = { message: isDev ? (err?.message || String(err)) : "Internal server error" };
    if (isDev && err?.stack) payload.stack = err.stack;
    return NextResponse.json(payload, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };

    const cart = await prisma.cart.findUnique({
      where: { userId: decoded.userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const totalPaise = Math.round(
      cart.items.reduce((s, it) => s + (it.product.price * it.quantity), 0) * 100
    );

    const body = await req.json().catch(() => ({}));
    const stripePaymentId = body?.stripePaymentId ?? null;
    const stripeSessionId = body?.stripeSessionId ?? null;

    const order = await prisma.order.create({
      data: {
        userId: decoded.userId,
        totalAmount: totalPaise,
        currency: "INR",
        status: "PAID",
        stripePaymentId,
        stripeSessionId,
        items: {
          create: cart.items.map((it) => ({
            productId: it.productId,
            title: it.product.title,
            price: Math.round(it.product.price * 100),
            image: it.product.image,
            quantity: it.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // clear cart items
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({ message: "Order created", order });
  } catch (err: any) {
    console.error("CREATE ORDER ERROR:", err);
    const isDev = process.env.NODE_ENV !== "production";
    const payload: any = { message: isDev ? (err?.message || String(err)) : "Internal server error" };
    if (isDev && err?.stack) payload.stack = err.stack;
    return NextResponse.json(payload, { status: 500 });
  }
}

