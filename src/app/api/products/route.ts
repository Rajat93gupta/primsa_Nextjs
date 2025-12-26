import { NextRequest } from "next/server";
import prisma from "../../../../prisma/db_client";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return Response.json(products, { status: 200 });
  } catch (error) {
    console.log(error);
    
    return Response.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        price: body.price,
        description: body.description,
        category: body.category,
        image: body.image,
      },
    });

    return Response.json(newProduct, { status: 201 });
  } catch (error) {
    console.log(error);
    
    return Response.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
