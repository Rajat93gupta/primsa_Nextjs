import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../../prisma/db_client";

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const token = req.cookies.get("token")?.value;
    console.log(token);
    

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.log("tok",req.cookies.getAll());

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set");
    }

    let decoded: { userId: number };

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as { userId: number };
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const cart = await prisma.cart.upsert({
      where: { userId: decoded.userId },
      update: {},
      create: { userId: decoded.userId },
    });

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: Number(productId),
        },
      },
      update: {
        quantity: { increment: Number(quantity) },
      },
      create: {
        cartId: cart.id,
        productId: Number(productId),
        quantity: Number(quantity),
      },
    });

    return NextResponse.json({
      message: "Product added to cart",
      cartItem,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) return NextResponse.json({ message: "Product ID required" }, { status: 400 });

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    const cart = await prisma.cart.findUnique({ where: { userId: decoded.userId } });
    if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId: Number(productId) },
    });

    return NextResponse.json({ message: "Item removed" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}



export async function PATCH(req: NextRequest) {
  try {
    const { productId, quantity } = await req.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json({ message: "Product ID and quantity required" }, { status: 400 });
    }

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    const cart = await prisma.cart.findUnique({ where: { userId: decoded.userId } });
    if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    const cartItem = await prisma.cartItem.updateMany({
      where: { cartId: cart.id, productId: Number(productId) },
      data: { quantity: Math.max(1, Number(quantity)) },
    });

    return NextResponse.json({ message: "Quantity updated", cartItem });
  } catch (error) {
    console.error("UPDATE QUANTITY ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
