"use client";
import { Icons } from "@/components/Icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FC, useState } from "react";

interface CreateClassProps {
  onCreate?: () => void;
}

const CreateClass: FC<CreateClassProps> = ({ onCreate }) => {
  const [classTitle, setClassTile] = useState("");
  const [toggleCreate, setToggleCreate] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  async function createClass() {
    setLoading(true);
    const response = await fetch("/api/class", {
      method: "POST",
      body: JSON.stringify({
        name: classTitle,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      toast({
        title: "Class created successfully",
        description: "You have successfully created a class!",
      });
      if (onCreate) {
        onCreate();
      }
      setToggleCreate(false);
    } else {
      toast({
        title: "An error occurred",
        description: data.message,
      });
    }
    setLoading(false);
  }
  return (
    <Dialog
      open={toggleCreate}
      onOpenChange={(open) => {
        setToggleCreate(open);
      }}
    >
      <DialogTrigger>
        <button className="flex items-center gap-1 bg-rose-600 text-white p-2 rounded-md hover:bg-rose-700">
          <Icons.plus className="w-4 h-4" />
          Add Class
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="flex items-center">
          <Icons.class className="w-4 h-4" /> Create a class
        </DialogTitle>
        <DialogDescription>
          Fill the input fields and create your class.
        </DialogDescription>
        <div className="">
          <label>
            Class Title <span className="text-red-600">*</span>
          </label>
          <Input
            onChange={(event) => {
              setClassTile(event.target.value);
            }}
            value={classTitle}
            placeholder="class title"
          />
        </div>
        <div className="flex justify-end">
          <button
            disabled={classTitle.length === 0}
            onClick={() => {
              createClass();
            }}
            className="bg-rose-600 disabled:bg-zinc-600 text-white p-2 rounded-md hover:bg-rose-700  "
          >
            {loading ? (
              <span>
                <Icons.loading className="w-4 h-4 text-white" />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Icons.tick className="w-4 h-4" /> Create
              </span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClass;
