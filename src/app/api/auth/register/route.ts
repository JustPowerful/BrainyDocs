import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { firstname, lastname, email, password, confirmPassword } = body;

  if (!firstname || !lastname || !email || !password || !confirmPassword) {
    return NextResponse.json(
      {
        succes: false,
        message: "Please fill in the fields!",
      },
      {
        status: 400,
      }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      {
        success: false,
        message: "Passwords do not match!",
      },
      {
        status: 400,
      }
    );
  }

  const existingUser = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    return NextResponse.json(
      {
        success: false,
        message: "User already exists!",
      },
      {
        status: 400,
      }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({
    success: true,
    message: "User successfully created!",
  });
}
