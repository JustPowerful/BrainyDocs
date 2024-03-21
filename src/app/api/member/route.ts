import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { studentEmail, classId } = await req.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const user = await db.user.findFirst({
    where: { email: session.user?.email! },
  });
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  if (user.role !== "TEACHER") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // if the verification passes, add the student to the class
  const student = await db.user.findUnique({
    where: { email: studentEmail },
  });
  if (!student) {
    return NextResponse.json(
      { success: false, message: "Student not found" },
      { status: 404 }
    );
  }
  const classroom = await db.class.findFirst({
    where: { id: parseInt(classId) },
  });
  if (!classroom) {
    return NextResponse.json(
      { success: false, message: "Class not found" },
      { status: 404 }
    );
  }
  const studentInClass = await db.studentInClass.create({
    data: {
      classId: parseInt(classId),
      studentId: student.id,
    },
  });
  return NextResponse.json({
    success: true,
    message: "Successfully added the student to the class.",
  });
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  if (!url.searchParams.has("classId")) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing classId query param. please specify the class ID.",
      },
      { status: 400 }
    );
  }
  const classId = parseInt(url.searchParams.get("classId")!);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 5;

  const totalPages = await db.studentInClass.count({
    where: { classId: classId },
  });
  const TOTAL = Math.ceil(totalPages / limit);

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const user = await db.user.findFirst({
    where: { email: session.user?.email! },
  });
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  if (user.role !== "TEACHER") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const students = await db.studentInClass.findMany({
    where: { classId: classId },
    include: { student: true },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json({ success: true, students, totalPages: TOTAL });
}

export async function DELETE(req: NextRequest) {
  const { studentId, classId } = await req.json();

  if (!studentId || !classId) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Please specifiy the parameteres in the request body to remove the student from the class.",
      },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const user = await db.user.findUnique({
    where: { email: session.user?.email! },
  });
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  if (user.role !== "TEACHER") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const studentInClass = await db.studentInClass.findFirst({
    where: { classId: parseInt(classId), studentId: parseInt(studentId) },
  });

  if (!studentInClass) {
    return NextResponse.json(
      { success: false, message: "Student not found in the class" },
      { status: 404 }
    );
  }

  await db.studentInClass.deleteMany({
    where: {
      classId: parseInt(classId),
      studentId: parseInt(studentId),
    },
  });

  return NextResponse.json({
    success: true,
    message: "Student removed from class successfully 🎉",
  });
}
