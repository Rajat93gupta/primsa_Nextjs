import { NextResponse } from "next/server";
import prisma from "../../../../prisma/db_client";



export async function GET() {
    try {
        const users = await prisma.user.findMany({
            // orderBy: {
            //     createdAt: 'desc'
            // },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                // createdAt: true
            }
        })
        return NextResponse.json(
            {
                success: true,
                data: users
            },
            { status: 200 }
        );

    }
    catch (error) {
        console.log("Error fetching user:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch users",
            },
            { status: 500 }
        );
    }
}