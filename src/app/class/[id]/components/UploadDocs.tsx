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

interface UploadDocsProps {
  classId: string;
  onUpload: () => void;
}

// const pdfToText = require('pdf-to-text');

// async function convertPdfToText(url) {
//   try {
//     // Fetch the PDF content
//     const response = await fetch(url);

//     // Ensure successful response
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     // Get the PDF data as an array buffer
//     const pdfData = await response.arrayBuffer();

//     // Extract text from the PDF data
//     const text = await pdfToText.pdfToText(pdfData);

//     // Return the extracted text
//     return text;
//   } catch (error) {
//     console.error("Error converting PDF:", error);
//     return null;
//   }
// }

// // Example usage
// const pdfUrl = 'https://example.com/document.pdf'; // Replace with your actual URL

// convertPdfToText(pdfUrl)
//   .then(text => console.log(text))
//   .catch(error => console.error(error));

const UploadDocs: FC<UploadDocsProps> = ({ classId, onUpload }) => {
  const [toggle, setToggle] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    if (!selectedFile) {
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("classId", classId);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Operation successful",
          description: "⬆️ successfully uploaded the document",
        });
        setToggle(false);
        setUploading(false);
        onUpload();
      }
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
            <Input name="title" placeholder="Document title" className="mb-2" />
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
              disabled={uploading || !selectedFile}
              type="submit"
              className="border-2 border-rose-600 w-full mt-2 p-2 bg-rose-600 text-white rounded-md hover:bg-white hover:text-rose-600 transition-colors disabled:bg-zinc-800 disabled:border-none disabled:hover:text-white disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span>Uploading...</span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  {" "}
                  <Icons.upload className="w-4 h-4" /> Upload
                </span>
              )}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadDocs;
