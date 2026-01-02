/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../../../prisma/db_client";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };

    // Check if user is admin
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    console.log('PATCH /api/orders/[id] request:', { paramsId: params.id, body });

    const { status } = body ?? {};
    const validStatuses = ["PENDING", "PAID", "FAILED", "CANCELLED", "DELIVERED", "DELIVERD"];

    if (typeof status !== 'string') {
      return NextResponse.json({ message: 'Missing or invalid status in request body' }, { status: 400 });
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // params may be undefined in some runtimes; fallback to parsing from URL
    const rawIdFromParams = params?.id;
    const rawIdFromUrl = (() => {
      try {
        const parts = new URL(req.url).pathname.split('/').filter(Boolean);
        return parts[parts.length - 1];
      } catch {
        return undefined;
      }
    })();

    console.log('Order id sources:', { rawIdFromParams, rawIdFromUrl, reqUrl: req.url });

    const orderId = Number(rawIdFromParams ?? rawIdFromUrl);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json({ message: 'Invalid order id' }, { status: 400 });
    }

    let order;
    try {
      order = await prisma.order.update({
        where: { id: orderId },
        data: { status: status as any },
        include: { items: true, user: true },
      });
    } catch (prismaErr: any) {
      console.error('Prisma update error:', prismaErr);
      const isDev = process.env.NODE_ENV !== 'production';
      const message = isDev ? (prismaErr?.message || String(prismaErr)) : 'Failed to update order';
      return NextResponse.json({ message }, { status: 500 });
    }

    console.log('Order updated successfully:', { orderId, status });
    return NextResponse.json({ message: "Order updated", order });
  } catch (err: any) {
    console.error("UPDATE ORDER ERROR:", err);
    const isDev = process.env.NODE_ENV !== "production";
    const payload: any = { message: isDev ? (err?.message || String(err)) : "Internal server error" };
    if (isDev && err?.stack) payload.stack = err.stack;
    return NextResponse.json(payload, { status: 500 });
  }
}