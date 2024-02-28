import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get("page");
  const classId = searchParams.get("classid")!;
  const limit = 5;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "You are unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  if (!classId) {
    return NextResponse.json(
      {
        success: false,
        message: "Class id is required.",
      },
      {
        status: 400,
      }
    );
  }

  // check if current user is a member of the class
  // const user = await db.user.findFirst({
  //   where: {
  //     email: session.user?.email!,
  //   },
  // });

  // const classMember = await db.class.findFirst({
  //   where: {
  //     id: parseInt(classId),
  //     students: {
  //       some: {
  //         id: user?.id,
  //       },
  //     },
  //   },
  // });

  // check if class member or teacher
  // if (!classMember || !(user?.role !== "TEACHER")) {
  //   return NextResponse.json(
  //     {
  //       success: false,
  //       message: "You are unauthorized.",
  //     },
  //     {
  //       status: 401,
  //     }
  //   );
  // }

  const data = await db.document.findMany({
    where: {
      classId: parseInt(classId),
    },
    take: limit,
    skip: ((page ? parseInt(page) : 1) - 1) * limit,
  });

  let count = await db.document.count({
    where: {
      classId: parseInt(classId),
    },
  });

  return NextResponse.json({
    success: true,
    documents: data,
    totalPages: Math.ceil(count / limit),
  });
}
