import { Icons } from "@/components/Icons";
import { FC, useState } from "react";
import { useTheme } from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface DeleteDocumentProps {
  documentId: number;
  onChange: () => void;
}

const DeleteDocument: FC<DeleteDocumentProps> = ({ documentId, onChange }) => {
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  async function deleteDocument() {
    setLoading(true);
    const res = await fetch(`/api/document/${documentId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      onChange();
      setToggle(false);
    } else {
      toast({
        title: "Error while deleting the document",
        description: data.message,
      });
    }
    setLoading(false);
  }

  return (
    <div>
      <Dialog
        open={toggle}
        onOpenChange={(open) => {
          setToggle(open);
        }}
      >
        <DialogTrigger>
          <button className="bg-white text-rose-600 p-1 rounded-md hover:bg-rose-500 hover:text-white">
            <Icons.delete className="w-5 h-5" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              document.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                deleteDocument();
              }}
              className="bg-rose-600 text-white p-2 rounded-md"
            >
              {loading ? <Icons.loading className="w-4 h-4" /> : "Delete"}
            </button>
            <button
              onClick={() => {
                setToggle(false);
              }}
              className="bg-white text-rose-600 p-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteDocument;
