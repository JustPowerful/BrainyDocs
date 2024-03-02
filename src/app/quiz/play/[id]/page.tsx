"use client";
import { useToast } from "@/components/ui/use-toast";
import { QuizType } from "@/lib/types";
import { FC, useEffect, useState } from "react";
import Quiz from "./components/Quiz";

interface pageProps {
  params: { id: string };
}

const page: FC<pageProps> = ({ params }) => {
  const [quiz, setQuiz] = useState<QuizType>();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const { toast } = useToast();
  const { id } = params;

  async function getQuiz() {
    const res = await fetch(`/api/quiz/play/${id}`);
    const data = await res.json();
    if (res.ok) {
      setQuiz(data.quiz);
      setTotalQuestions(data.quiz.questions.length);
    } else {
      toast({
        title: "Error",
        description: data.message,
      });
    }
  }

  useEffect(() => {
    getQuiz();
  }, []);
  return (
    <div>
      {quiz && (
        <div>
          {/* <div>
            {quiz.questions.map((question: any, index: number) => (
              <div key={index} className="my-4">
                <h3>
                  {question.question} {question.difficulty}
                </h3>
                {question.options.map(
                  (option: { text: string; correct: boolean }) => {
                    return (
                      <div>
                        -- {option.text}{" "}
                        {option.correct && " == Correct answer"}
                      </div>
                    );
                  }
                )}
              </div>
            ))}
          </div> */}
          {quiz && <Quiz quiz={quiz} />}
        </div>
      )}
    </div>
  );
};

export default page;
