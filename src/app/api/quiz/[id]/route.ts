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
    5- IMPORTANT! The options should be shuffled.
    

  `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  // completion.choices[0].message.content

  function shuffle(array: any[]) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
  // shuffle all the questions options and then save the result in the database
  const questions = JSON.parse(completion.choices[0].message.content!);
  questions.forEach((question: any) => {
    const shuffledOptions = shuffle(question.options);
    question.options = shuffledOptions;
  });

  await db.quiz.create({
    data: {
      title: new Date().toLocaleString() + " Quiz",
      documentId: document.id,
      questions: JSON.stringify(questions),
    },
  });

  // await db.quiz.create({
  //   data: {
  //     title: new Date().toLocaleString() + " Quiz",
  //     documentId: document.id,
  //     questions: completion.choices[0].message.content!,
  //   },
  // });
  // http://localhost:3000/api/quiz/42
  return NextResponse.json({
    success: true,
    message: "Successfully created a quiz.",
  });
}
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params; // gettting the document id from the url
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get("page");
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

  const quiz = await db.quiz.findMany({
    where: {
      documentId: parseInt(id),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: ((page ? parseInt(page) : 1) - 1) * limit,
  });

  const count = await db.quiz.count({
    where: {
      documentId: parseInt(id),
    },
  });

  return NextResponse.json({
    success: true,
    quizzes: quiz,
    totalPages: Math.ceil(count / limit),
  });
}
