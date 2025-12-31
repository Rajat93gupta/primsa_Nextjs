import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "../../../../prisma/db_client";


export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;


  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("JWT ERROR", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
