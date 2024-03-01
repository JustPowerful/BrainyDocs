"use client";
import { Document } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

import Lottie from "react-lottie";
import thinkingAnimation from "@/lottie/thinking.json";

import "@react-pdf-viewer/core/lib/styles/index.css";
import { Icons } from "@/components/Icons";

interface pageProps {
  params: { id: string };
}

const page: FC<pageProps> = ({ params }) => {
  const [document, setDocument] = useState<Document>();
  const [thinking, setThinking] = useState(false);
  const { toast } = useToast();
  async function getDocument() {
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
  }

  async function generateQuiz() {
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
    } else {
      toast({
        title: "There was an error while generating the quiz",
        description: data.message,
      });
    }
    setThinking(false);
  }

  useEffect(() => {
    getDocument();
  }, []);

  return (
    <div className="p-10">
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
                  <div>I am thinking please leave me alone ...</div>
                </div>
              ) : (
                <>
                  <Icons.robot className="w-4 h-4" /> Let AI Generate an another
                  Quiz
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
