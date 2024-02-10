import bcrypt from "bcrypt";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
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

  const existingUser = await User.findOne({ email: email });
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
  const user = new User({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: hashedPassword,
  });
  await user.save();

  return NextResponse.json({
    success: true,
    message: "User successfully created!",
  });
}
