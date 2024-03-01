import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "You are unauthorized.",
      },
      { status: 401 }
    );
  }

  const user = await db.user.findUnique({
    where: {
      email: session.user?.email!,
    },
  });
  if (user?.role !== "TEACHER") {
    return NextResponse.json(
      {
        success: false,
        message: "You are unauthorized.",
      },
      { status: 401 }
    );
  }

  await db.document.delete({
    where: {
      id: parseInt(id),
    },
  });

  return NextResponse.json({
    success: true,
    message: "Document deleted successfully",
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "You are unauthorized.",
      },
      { status: 401 }
    );
  }
  const document = await db.document.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  return NextResponse.json({
    success: true,
    message: "Successfully fetched the document",
    document: document,
  });
}
