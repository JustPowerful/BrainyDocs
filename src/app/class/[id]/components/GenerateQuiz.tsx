import { Icons } from "@/components/Icons";
import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Document } from "@prisma/client";

interface GenerateQuizProps {
  document: Document;
}

const GenerateQuiz: FC<GenerateQuizProps> = ({ document }) => {
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Dialog
        open={toggle}
        onOpenChange={(open) => {
          setToggle(open);
        }}
      >
        <DialogTrigger>
          <button className="bg-white text-yellow-700 p-1 rounded-md hover:bg-yellow-700 hover:text-white">
            <Icons.robot className="w-5 h-5" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="">
              <Icons.robot className="inline-block mr-1" /> AI Quiz Generator
            </DialogTitle>
            <DialogDescription>
              This will generate a quiz based on the document you selected, and
              it will be added to the quiz section.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Link
              href={`/quiz/${document.id}`}
              className="bg-yellow-700 text-white p-2 rounded-md"
            >
              {loading ? (
                <Icons.loading className="w-4 h-4" />
              ) : (
                "Go to quiz section"
              )}
            </Link>
            <button
              onClick={() => {
                setToggle(false);
              }}
              className="bg-white text-yellow-700 p-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateQuiz;
