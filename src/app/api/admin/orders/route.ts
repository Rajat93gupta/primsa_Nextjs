/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../../../prisma/db_client";

export async function GET(req: NextRequest) {
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

    const orders = await prisma.order.findMany({
      include: { items: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("FETCH ADMIN ORDERS ERROR:", err);
    const isDev = process.env.NODE_ENV !== "production";
    const payload: any = { message: isDev ? (err?.message || String(err)) : "Internal server error" };
    if (isDev && err?.stack) payload.stack = err.stack;
    return NextResponse.json(payload, { status: 500 });
  }
}