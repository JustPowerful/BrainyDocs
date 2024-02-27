import cloudinary from "cloudinary";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authenticated!",
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
        message: "User are not authorized!",
      },
      {
        status: 401,
      }
    );
  }

  if (user.role !== "TEACHER") {
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

  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json(
      {
        success: false,
        message: "No file found!",
      },
      {
        status: 400,
      }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  //   const uploadResponse = await
  const result = (await new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream({}, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      })
      .end(buffer);
  })) as cloudinary.UploadApiResponse | undefined;

  if (!result) {
    return NextResponse.json(
      {
        success: false,
        message: "Error while uploading the file!",
      },
      {
        status: 500,
      }
    );
  }

  // create a new document in the database
  // save the url in the document data that we just created
  // create a reference to the document in the classroom
  // return the document that we just created
  await db.document.create({
    data: {
      title: data.get("title") as string,
      source: result.secure_url,
      classId: parseInt(data.get("classId") as string),
    },
  });

  return NextResponse.json({
    success: true,
    message: "Successfully uploaded the file!",
    // url: uploadResponse.secure_url,
  });
}
