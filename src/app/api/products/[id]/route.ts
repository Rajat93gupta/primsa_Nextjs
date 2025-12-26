// Put


import { NextRequest } from "next/server";
import prisma from "../../../../../prisma/db_client";


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 1. Await params if using Next.js 15
        const { id } = await params; 
        
        // 2. Parse the body
        const body = await req.json();
        const { price, title,description,category,image } = body;

        // 3. Ensure the ID is a valid number
        const productId = parseInt(id);
        // for validation
        if (isNaN(productId)) {
            return Response.json({ error: "Invalid ID format" }, { status: 400 });
        }

        const updateResult = await prisma.product.update({ 
            where: { 
                id: productId 
            },
            data: {
                price: price,
                title:title,
                description:description,
                category:category,
                image:image

            },
        });

        return Response.json(updateResult, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Update failed" }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const productId = parseInt(id);

        // 2. Validate the ID
        if (isNaN(productId)) {
            return Response.json({ error: "Invalid ID format" }, { status: 400 });
        }

        // 3. Delete from Database using Prisma
        const deletedProduct = await prisma.product.delete({
            where: {
                id: productId,
            },
        });

        return Response.json({ 
            message: "Product deleted successfully",
            deletedProduct 
        }, { status: 200 });

    } catch (error: unknown) {
        // Handle case where product doesn't exist
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            return Response.json({ error: "Product not found" }, { status: 404 });
        }
        
        return Response.json({ error: "An error occurred during deletion" }, { status: 500 });
    }
}