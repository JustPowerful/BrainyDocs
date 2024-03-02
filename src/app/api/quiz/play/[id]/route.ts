import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const quiz = await db.quiz.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!quiz) {
    return NextResponse.json(
      {
        success: false,
        message: "Quiz not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Quiz fetched successfully",
    quiz: {
      id: quiz.id,
      title: quiz.title,
      questions: JSON.parse(quiz.questions),
      createdAt: quiz.createdAt,
    },
  });
}
