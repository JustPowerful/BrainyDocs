import { Icons } from "@/components/Icons";
import { Document } from "@prisma/client";
import { FC } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteDocument from "./DeleteDocument";

interface DocumentProps {
  document: Document;
  fetchDocuments: () => void;
}

const Document: FC<DocumentProps> = ({ document, fetchDocuments }) => {
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
              <button className="bg-white text-yellow-700 p-1 rounded-md hover:bg-yellow-700 hover:text-white">
                <Icons.robot className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate quiz</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <DeleteDocument
                onChange={fetchDocuments}
                documentId={document.id}
              />
            </TooltipTrigger>
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
