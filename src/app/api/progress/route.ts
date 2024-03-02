import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { score, quizId } = data;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authorized to perform this action",
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
        message: "You are not authorized to perform this action",
      },
      {
        status: 401,
      }
    );
  }

  // save it the database
  const newScore = user.xp + score;
  // update the user
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      xp: newScore,
    },
  });

  const quiz = await db.quiz.findUnique({
    where: {
      id: quizId,
    },
  });
  const document = await db.document.findUnique({
    where: {
      id: quiz?.documentId,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Score updated successfully",
    document: document,
  });
}
