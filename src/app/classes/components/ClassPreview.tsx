import { Icons } from "@/components/Icons";
import { Class } from "@prisma/client";
import { FC, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Link from "next/link";

interface ClassPreviewProps {
  classData: Class;
  isTeacher: boolean;
  onChange: () => void;
}

const ClassPreview: FC<ClassPreviewProps> = ({
  classData,
  onChange,
  isTeacher,
}) => {
  const [toggleDelete, setToggleDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { toast } = useToast();

  async function deleteClass() {
    setDeleteLoading(true);
    const response = await fetch(`/api/class/${classData.id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    if (response.ok) {
      setToggleDelete(false);
      toast({
        title: "Successfully deleted the classroom",
        description: data.message,
      });
      onChange();
    } else {
      toast({
        title: "There was en error",
        description: data.message,
      });
    }

    setDeleteLoading(false);
  }

  return (
    <div className="bg-rose-600 text-white p-4 rounded-md flex justify-between items-center">
      <Link href={`/class/${classData.id}`}>{classData.name}</Link>

      <div className="flex gap-1">
        {isTeacher ? (
          <>
            <Dialog
              open={toggleDelete}
              onOpenChange={(value) => {
                setToggleDelete(value);
              }}
            >
              <DialogTrigger>
                <button className="text-rose-600 bg-white p-1.5 rounded-sm hover:bg-rose-400 hover:text-white">
                  <Icons.delete className="w-4 h-4" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setToggleDelete(false);
                    }}
                    className="bg-zinc-600 hover:bg-zinc-700 flex items-center justify-center gap-1 text-white w-fit p-2 rounded-md"
                  >
                    <Icons.close className="w-4 h-4 " />
                    Cancel
                  </button>
                  <button
                    onClick={deleteClass}
                    className="bg-rose-600 hover:bg-rose-700 flex items-center justify-center gap-1 text-white w-fit p-2 rounded-md"
                  >
                    {deleteLoading ? (
                      <Icons.loading className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Icons.delete className="w-4 h-4 " />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            <button className="text-blue-600 bg-white p-1.5 rounded-sm hover:bg-blue-400 hover:text-white">
              <Icons.edit className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button className="text-blue-600 bg-white p-1.5 rounded-sm hover:bg-blue-400 hover:text-white">
            <Icons.logout className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ClassPreview;
