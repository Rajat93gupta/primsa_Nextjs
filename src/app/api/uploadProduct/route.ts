/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import cloudinary from "@/lib/cloudinary";
import prisma from "../../../../prisma/db_client";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    console.log("FORM DATA:", [...formData.entries()]);

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<any>(sheet);

    console.log("EXCEL DATA:", data); // 🔥 ADD THIS

    if (!data.length) {
      return NextResponse.json({ error: "Excel is empty" }, { status: 400 });
    }

    const products = [];

    for (const item of data) {
      if (!item.title || !item.price || !item.category || !item.image) {
        console.log("❌ Skipped row:", item);
        continue;
      }

      const uploadRes = await cloudinary.uploader.upload(item.image, {
        folder: "products",
      });
      console.log(item);
      

      products.push({
        title: item.title.trim(),
        price: Number(item.price),
        description: item.description || null,
        category: item.category.trim(),
        image: uploadRes.secure_url,
      });
    }

    await prisma.product.createMany({ data: products, skipDuplicates: true });
    // console.log("PRISMA INSERT RESULT 👉", result);
    console.log("PRODUCTS TO INSERT 👉", products.length);

    return NextResponse.json({
      success: true,
      count: products.length,
    });
  } catch (error: any) {
    console.error("UPLOAD ERROR 👉", error.message);
    return NextResponse.json(
      { error: error.message || "Bulk upload failed" },
      { status: 500 }
    );
  }
}

