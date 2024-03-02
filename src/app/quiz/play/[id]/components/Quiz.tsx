"use client";
import { Icons } from "@/components/Icons";
import { QuizType } from "@/lib/types";
import { FC, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Document } from "@prisma/client";

interface QuizProps {
  quiz: QuizType;
}

const Quiz: FC<QuizProps> = ({ quiz }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const [document, setDocument] = useState<Document>();

  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  function handleNextQuestion() {
    if (selectedOption !== null) {
      setSelectedOption(null);
      setShowExplanation(false);
      if (currentQuestion + 1 < quiz.questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowScore(true);
      }
    }
  }

  async function handleSaveProgress() {
    setSaving(true);
    const res = await fetch("/api/progress", {
      method: "POST",
      body: JSON.stringify({ score: score, quizId: quiz.id }),
    });
    const data = await res.json();
    if (res.ok) {
      setDocument(data.document); // if there's a document display saved screen and go back to the document screen
      toast({
        title: "Successfully saved the progress",
        description: data.message,
      });
    } else {
      toast({
        title: "Error while saving the progress",
        description: data.message,
      });
    }
    setSaving(false);
  }

  useEffect(() => {
    if (selectedOption !== null) {
      if (quiz.questions[currentQuestion].options[selectedOption].correct) {
        setScore(score + 1);
      }
    }
  }, [selectedOption]);

  return (
    <div className="p-10">
      {showScore && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-45 z-10 flex justify-center items-center">
          <div className="bg-white w-full max-w-[300px] p-4 rounded-md flex justify-center">
            {!document ? (
              <div className=" text-gray-800 flex flex-col items-center">
                <Icons.robot className="w-10 h-10" />
                <div className="text-2xl font-medium text-gray-800 ">
                  Your score: {score}/{quiz.questions.length}
                </div>
                <div className="text-gray-600 flex items-center gap-1 font-medium">
                  success rate:{" "}
                  {((score / quiz.questions.length) * 100).toFixed(2)}%
                </div>
                {/* message for the who score >= 60% of the quiz */}
                {(score / quiz.questions.length) * 100 >= 60 && (
                  <div className="text-gray-600 text-center">
                    <Icons.star className="w-4 h-4 inline " /> Congratulations!
                    You passed the quiz
                  </div>
                )}
                {(score / quiz.questions.length) * 100 >= 60 ? (
                  <button
                    onClick={handleSaveProgress}
                    className="w-full bg-rose-600 text-white px-4 py-2 rounded-md mt-4 hover:scale-105 transition-transform"
                  >
                    {saving ? (
                      <span>
                        <Icons.loading className="w-5 h-5" />
                      </span>
                    ) : (
                      <span>Save Progress</span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowScore(false);
                      setCurrentQuestion(0);
                      setScore(0);
                    }}
                    className="w-full bg-rose-600 text-white px-4 py-2 rounded-md mt-4 hover:scale-105 transition-transform"
                  >
                    Try Again
                  </button>
                )}
              </div>
            ) : (
              <div className="text-gray-600 flex flex-col items-center">
                <Icons.robot className="w-10 h-10" />
                <div className="text-2xl font-medium text-gray-800 text-center my-2">
                  Successfully saved the progress
                </div>
                <Link
                  className="p-4 bg-rose-600 rounded-md text-white text-center"
                  href={`/quiz/${document.id}`}
                >
                  Go back to the document
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex gap-3 items-center">
        <h1 className="text-3xl font-semibold text-rose-600 flex items-center gap-2">
          {" "}
          <Icons.info className="w-8 h-8" /> {quiz.title}
        </h1>
        <div className="flex items-center gap-1 p-2 bg-rose-600 w-fit text-white rounded-md select-none">
          <Icons.star className="w-5 h-5" /> Score: {score}/
          {quiz.questions.length}
        </div>
      </div>
      <div>{new Date(quiz.createdAt).toLocaleDateString()}</div>

      <div className="mt-5 relative">
        {selectedOption !== null && (
          <div className="absolute top-0 left-0 w-full h-full"></div>
        )}
        {/* Question display */}
        <div className="text-2xl font-medium text-gray-800 ">
          {quiz.questions[currentQuestion].question}
        </div>
        {/* Options */}
        <div className="mt-5">
          {quiz.questions[currentQuestion].options.map(
            (option: { text: string; correct: boolean }, index: number) => {
              return (
                <div
                  key={index}
                  className={`hover:scale-[101%] hover:bg-gray-300 transition-all flex items-center gap-2 cursor-pointer p-4 bg-gray-200 rounded-md my-4 ${
                    selectedOption === index
                      ? option.correct
                        ? "bg-green-200"
                        : "bg-red-200"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedOption(index);
                  }}
                >
                  <div
                    className={`flex items-center justify-center text-white w-6 h-6 rounded-full border-2 ${
                      selectedOption === index
                        ? option.correct
                          ? "border-green-500 bg-green-500"
                          : "border-red-500 bg-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOption === index && (
                      <>
                        {option.correct ? (
                          <Icons.tick className="w-4 h-4" />
                        ) : (
                          <Icons.close className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </div>
                  <div>{option.text}</div>
                </div>
              );
            }
          )}
        </div>
        {showExplanation && (
          <div className="border-2 border-rose-600 p-4 rounded-md border-dashed">
            <div className="text-2xl font-medium text-gray-800 ">
              Explanation
            </div>
            <div className="text-gray-600">
              {quiz.questions[currentQuestion].explanation}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-4">
        {selectedOption !== null && (
          <button
            onClick={() => {
              setShowExplanation(true);
            }}
            className="bg-rose-600 text-white px-4 py-2 rounded-md mt-4 hover:scale-110 transition-transform"
          >
            Show explanation
          </button>
        )}
        {selectedOption !== null && (
          <button
            onClick={handleNextQuestion}
            className="bg-rose-600 text-white px-4 py-2 rounded-md mt-4 hover:scale-110 transition-transform"
          >
            {currentQuestion + 1 === quiz.questions.length
              ? "Finish"
              : "Next Question"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
