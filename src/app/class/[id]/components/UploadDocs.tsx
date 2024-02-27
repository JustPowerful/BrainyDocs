import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/Icons";
import { useToast } from "@/components/ui/use-toast";

interface UploadDocsProps {}

const UploadDocs: FC<UploadDocsProps> = ({}) => {
  const [toggle, setToggle] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      return;
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      //   const data = await response.json();
      //   console.log(data);
    } catch (error: any) {
      toast({
        title: "Error while uploading the course material",
        description: error.message,
      });
      console.log(error);
    }
  };

  return (
    <div>
      <Dialog
        open={toggle}
        onOpenChange={(open) => {
          setToggle(open);
        }}
      >
        <DialogTrigger className="w-full mt-2">
          <button
            className="flex items-center justify-center text-white gap-1 border-2 border-rose-600 w-full p-2 rounded-md bg-rose-600 hover:bg-white hover:text-rose-600 transition-colors"
            onClick={() => setToggle(true)}
          >
            <Icons.upload className="w-4 h-4" /> Upload a document
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="flex items-center gap-1">
            <Icons.upload className="w-4 h-4" /> Upload Docs
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <label htmlFor="">Document title</label>
            <Input placeholder="Document title" className="mb-2" />
            <label htmlFor="file">Upload a file</label>
            <Input
              type="file"
              name="file"
              id="file"
              onChange={handleFileChange}
              className="mb-2 w-full p-2 border-2 border-gray-200 rounded-md"
            />
            {selectedFile && selectedFile.name}
            <button
              type="submit"
              className="border-2 border-rose-600 w-full mt-2 p-2 bg-rose-600 text-white rounded-md hover:bg-white hover:text-rose-600 transition-colors"
            >
              Upload
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadDocs;
