import { Icons } from "@/components/Icons";
import { Document, User } from "@prisma/client";
import { FC } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteDocument from "./DeleteDocument";
import GenerateQuiz from "./GenerateQuiz";

interface DocumentProps {
  document: Document;
  fetchDocuments: () => void;
  user: User;
}

const Document: FC<DocumentProps> = ({ document, fetchDocuments, user }) => {
  return (
    <div className="bg-rose-600 text-white flex justify-between p-4 items-center rounded-md">
      <div>
        <a
          className="font-semibold flex gap-1"
          href={`${document.source}`}
          target="_blank"
        >
          <Icons.document /> {document.title}
        </a>
      </div>
      <div className="flex gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <GenerateQuiz document={document} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate quiz</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            {user.role === "TEACHER" && (
              <TooltipTrigger>
                <DeleteDocument
                  onChange={fetchDocuments}
                  documentId={document.id}
                />
              </TooltipTrigger>
            )}
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Document;
