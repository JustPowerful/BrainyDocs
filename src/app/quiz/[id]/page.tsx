"use client";
import { Document, Quiz } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

import Lottie from "react-lottie";
import thinkingAnimation from "@/lottie/thinking.json";
import aistudent from "@/lottie/aiplusstudent.json";

import "@react-pdf-viewer/core/lib/styles/index.css";
import { Icons } from "@/components/Icons";
import { Pagination } from "@mui/material";
import Link from "next/link";

interface pageProps {
  params: { id: string };
}

const page: FC<pageProps> = ({ params }) => {
  const [document, setDocument] = useState<Document>();
  const [thinking, setThinking] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // button punchlines
  const punchlines = [
    "Generating quiz... hold on, gotta think really hard for a robot",
    "Calculating trivia... results may surprise even me",
    "Thinking like a human... which is hard, trust me",
    "Uh oh, user clicked... must generate quiz rapidly",
    "Boop. Beep. Boop. Quiz on its way",
    "Cooking up a quiz... hope you like it spicy",
    "Shhh, I'm thinking... (mostly about snacks, but also the quiz)",
  ];

  const [punchline, setPunchline] = useState(punchlines[0]);

  async function getDocument() {
    setLoading(true);
    const res = await fetch(`/api/document/${params.id}`);
    const data = await res.json();
    if (res.ok) {
      setDocument(data.document);
    } else {
      toast({
        title: "There was as error while fetching the document",
        description: data.message,
      });
    }
    // timeout the loading
    setTimeout(() => {
      setLoading(false);
    }, 6000);
  }

  async function generateQuiz() {
    // Randomize the punchline
    const randomIndex = Math.floor(Math.random() * punchlines.length);
    setPunchline(punchlines[randomIndex]);
    setThinking(true);
    const res = await fetch(`/api/quiz/${params.id}`, {
      method: "POST",
    });
    const data = await res.json();
    if (res.ok) {
      toast({
        title: "Quiz generated successfully",
        description: data.message,
      });
      fetchQuizzes();
    } else {
      toast({
        title: "There was an error while generating the quiz",
        description: data.message,
      });
    }
    setThinking(false);
  }

  async function fetchQuizzes() {
    const res = await fetch(`/api/quiz/${params.id}?page=${page}`);
    const data = await res.json();
    if (res.ok) {
      setTotalPages(data.totalPages);
      setQuizzes(data.quizzes);
    } else {
      toast({
        title: "There was an error while fetching the quizzes",
        description: data.message,
      });
    }
  }

  useEffect(() => {
    getDocument();
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [page]);

  return (
    <div className="p-10">
      {loading ? (
        <div className="flex flex-col items-center">
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: aistudent,
            }}
            width={400}
          />
          <div className="font-semibold text-3xl text-rose-600 animate-pulse">
            Loading the quiz generator...
          </div>
          <p
            className="
            text-gray-600
            text-center
            max-w-md
            mt-4
          "
          >
            Don't close the tab, the AI generator is create an environment for
            the document
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-semibold text-rose-600 flex items-center gap-1">
            <Icons.robot className="w-8 h-8" /> Quiz Generator
          </h1>
          <p className="mb-4 ">
            You are about to generate a quiz from the following document:{" "}
            <span>
              <Icons.document className="w-4 h-4 inline" />{" "}
              <span className="font-semibold">{document?.title}</span>
            </span>
          </p>

          {document && (
            <div className="grid grid-cols-2">
              <div className="box-border pr-10 ">
                <h2 className="text-xl font-semibold text-rose-500 flex items-center gap-1">
                  <Icons.eye /> Document Preview
                </h2>

                <iframe
                  className="border-2 border-rose-500 rounded-md w-full h-[600px]"
                  src={document.source}
                />
              </div>
              <div>
                <button
                  disabled={thinking}
                  className="bg-rose-600 text-white px-4 py-2 rounded-md w-full flex gap-1 items-center justify-center hover:scale-105 transition-transform shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
                  onClick={generateQuiz}
                >
                  {thinking ? (
                    <div className="flex items-center gap-1">
                      <Lottie
                        style={{ display: "inline-block" }}
                        options={{
                          loop: true,
                          autoplay: true,
                          animationData: thinkingAnimation,
                          rendererSettings: {
                            preserveAspectRatio: "xMidYMid slice",
                          },
                        }}
                        width={30}
                        height={30}
                      />{" "}
                      {/* A funny and comedic loading text about AI is thinking */}
                      <div>{punchline}</div>
                    </div>
                  ) : (
                    <>
                      <Icons.robot className="w-4 h-4" /> Let AI Generate an
                      another Quiz
                    </>
                  )}
                </button>
                <h2 className="text-xl font-semibold text-rose-500 flex items-center gap-1 mt-4 mb-3">
                  <Icons.info /> Quizzes
                </h2>
                <div>
                  <div className="flex flex-col gap-2">
                    {quizzes.map((quiz) => (
                      <div className="bg-rose-600 text-white p-4 rounded-md">
                        <Link href={`/quiz/play/${quiz.id}`}>
                          <h3 className="text-lg font-semibold">
                            {quiz.title}
                          </h3>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center items-center p-5">
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(event, value) => {
                        setPage(value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default page;
