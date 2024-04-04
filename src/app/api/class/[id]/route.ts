import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authorized!",
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
        message: "You are not authorized!",
      },
      {
        status: 401,
      }
    );
  }

  const classroom = await db.class.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!classroom) {
    return NextResponse.json(
      {
        success: false,
        message: "The class that you're trying to delete doesn't exist!",
      },
      {
        status: 404,
      }
    );
  }

  if (classroom.teacherId !== user.id && user.role !== "TEACHER") {
    return NextResponse.json(
      {
        success: false,
        message:
          "Only the teacher who created the class is authorized to do this action.",
      },
      {
        status: 401,
      }
    );
  }

  await db.class.delete({
    where: {
      id: classroom.id,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Successfully deleted the classroom!",
  });
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authorized!",
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
        message: "You are not authorized!",
      },
      {
        status: 401,
      }
    );
  }

  const classroom = await db.class.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!classroom) {
    return NextResponse.json(
      {
        success: false,
        message: "The class that you're trying to fetch doesn't exist!",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    success: true,
    classroom: classroom,
  });
}

export async function PATCH(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  // get the classroom id from the params
  const classroomId = parseInt(id);
  const { name } = await req.json();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authorized!",
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
  const classroom = await db.class.findUnique({
    where: {
      id: classroomId,
    },
  });
  if (!classroom) {
    return NextResponse.json(
      {
        success: false,
        message: "The class that you're trying to update doesn't exist!",
      },
      {
        status: 404,
      }
    );
  }
  if (classroom.teacherId !== user?.id && user?.role !== "TEACHER") {
    return NextResponse.json(
      {
        success: false,
        message:
          "Only the teacher who created the class is authorized to do this action.",
      },
      {
        status: 401,
      }
    );
  }
  // update the classroom
  const updatedClassroom = await db.class.update({
    where: {
      id: classroom.id,
    },
    data: {
      name: name,
    },
  });

  return NextResponse.json({
    success: true,
    classroom: updatedClassroom,
  });
}
