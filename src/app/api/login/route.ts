import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../prisma/db_client";
import jwt from "jsonwebtoken";


export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
   if (!process.env.JWT_SECRET) {
    return NextResponse.json({ message: "JWT_SECRET not set" }, { status: 500 });
  }

  const token = jwt.sign(
    { userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
  console.log(token);
  

  const res = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
   // Set role cookie (accessible in frontend/middleware)
  res.cookies.set("role", user.role, {
    httpOnly: false, // frontend/middleware needs to read it
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res;
}
