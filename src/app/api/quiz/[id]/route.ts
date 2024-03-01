// import { db } from "@/lib/db";

// import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import pdfParser from "pdf-parse";
import { summarize } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "You need to be logged in to perform this action.",
      },
      {
        status: 403,
      }
    );
  }

  const document = await db.document.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });
  if (!document) {
    return NextResponse.json(
      {
        success: false,
        message: "Document not found",
      },
      {
        status: 404,
      }
    );
  }
  const url = document.source;
  const res = await fetch(url);
  const data = await res.arrayBuffer();
  const buffer = Buffer.from(data);
  const parsedPdf = await pdfParser(buffer);
  const parsedText = parsedPdf.text;
  const summary = summarize(parsedText, 3500).replace(/\n/g, " ");

  const prompt = `
    the following is a summary of the document titled "${document.title}":
    ${summary}

    please generate a quiz based on the summary in the following JSON string format:
    [
        {
            "question": "[question releavant to the material]",
            "options":[
                {
                    "text": "[An answer option]",
                    "correct": false
                },
                {
                    "text": "[An answer option]",
                    "correct": true
                }
            ],
            "explanation": "[an explanation of the answer (200 words max)]",
            "difficulty": [a number between 1 and 5 representing the difficulty of the question]
        },
    ]

    Rules:
    1- Only output the JSON string, nothing else.
    2- There should be 4 answer options for each question.
    3- Only one option should be correct.
    4- There should be 10 questions.

  `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  // completion.choices[0].message.content

  await db.quiz.create({
    data: {
      title: new Date().toLocaleString() + " Quiz",
      documentId: document.id,
      questions: completion.choices[0].message.content!,
    },
  });
  // http://localhost:3000/api/quiz/42
  return NextResponse.json({
    success: true,
    message: "Successfully created a quiz.",
  });
}
