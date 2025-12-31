import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/db_client";

export async function GET(
  req: Request,
  context: { params: Promise<{ category: string }> }
) {
//   const params = await context.params;
  try {
     const { category } = await context.params;
    // const category = decodeURIComponent(params.category);
    // console.log(category,"kdk");
    

    const products = await prisma.product.findMany({
      where: {
        category: {
          equals: category,
        //   mode: "insensitive", 
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
