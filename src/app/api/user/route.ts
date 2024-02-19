import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  const user = await db.user.findUnique({
    where: {
      email: session.user?.email!,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "User not found.",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    success: true,
    user,
    message: "Successfully retrieved user.",
  });
}
