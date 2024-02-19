import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const { name } = await request.json();
  if (name.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Please provide a name for the class",
      },
      {
        status: 500,
      }
    );
  }

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

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const LIMIT = 2; // two classes per page
  // get query params for pagination
  const page = new URL(request.url).searchParams.get("page");
  const offset = page ? parseInt(page) * LIMIT : 0;

  var pageCount = 0;

  if (!session?.user) {
    return NextResponse.json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }

  const user = await db.user.findUnique({
    where: {
      email: session.user.email!,
    },
  });

  if (user?.role === "TEACHER") {
    const data = await db.class.aggregate({
      _count: true,
      where: {
        teacherId: user.id,
      },
    });
    pageCount = Math.ceil(data._count / LIMIT);
  } else {
    const data = await db.class.aggregate({
      _count: true,
      where: {
        students: {
          some: {
            studentId: user?.id,
          },
        },
      },
    });
    pageCount = Math.ceil(data._count / LIMIT);
  }

  if (user?.role !== "TEACHER") {
    return NextResponse.json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }

  // check if user is a teacher or a student
  // if teacher, return all classes that the teacher is teaching
  // if student, return all classes that the student is enrolled in

  if (user.role === "TEACHER") {
    const classes = await db.class.findMany({
      where: {
        teacherId: user.id,
      },
      take: LIMIT,
      skip: ((page ? parseInt(page) : 1) - 1) * LIMIT,
    });
    return NextResponse.json({
      success: true,
      classes,
      totalPages: pageCount,
    });
  } else {
    const classes = await db.class.findMany({
      where: {
        students: {
          some: {
            studentId: user.id,
          },
        },
      },
    });
    return NextResponse.json({
      success: true,
      classes,
      totalPages: pageCount,
    });
  }

  return NextResponse.json({
    success: false,
    message: "An error occurred",
  });
}
