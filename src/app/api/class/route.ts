import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const { name } = await request.json();

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }

  const currentUser = await db.user.findUnique({
    where: {
      email: session.user.email!,
    },
  });

  if (currentUser?.role !== "TEACHER") {
    return NextResponse.json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }

  await db.class.create({
    data: {
      name: name,
      teacherId: currentUser.id,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Class created successfully",
  });
}
