import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../prisma/db_client";


export async function POST(req: Request) {
  const { name, email, password, confirmPassword } = await req.json();

  // 1️⃣ Validate fields
  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  // 2️⃣ Check password match
  if (password !== confirmPassword) {
    return NextResponse.json(
      { message: "Passwords do not match" },
      { status: 400 }
    );
  }

  // 3️⃣ Check user exists
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return NextResponse.json(
      { message: "Email already registered" },
      { status: 409 }
    );
  }

  // 4️⃣ Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5️⃣ Save user
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json(
    { message: "Signup successful" },
    { status: 201 }
  );
}
