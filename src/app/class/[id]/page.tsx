"use client";

import { FC, useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { Class, Document as DocType } from "@prisma/client";
import { Icons } from "@/components/Icons";
import UploadDocs from "./components/UploadDocs";
import { User } from "@/lib/types";
import { Pagination } from "@mui/material";
import Document from "./components/Document";

interface pageProps {
  params: { id: string };
}

const page: FC<pageProps> = ({ params }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState<Class>();

  const [user, setUser] = useState<User>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [documents, setDocuments] = useState<DocType[]>([]);

  const fetchDocuments = async () => {
    const res = await fetch(`/api/document?page=${page}&classid=${params.id}`);
    const data = await res.json();
    if (res.ok) {
      setDocuments(data.documents);
      setTotalPages(data.totalPages);
    } else {
      toast({
        title: "Error while fetching the documents",
        description: data.message,
      });
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [page]);

  const fetchClass = async () => {
    setLoading(true);
    const res = await fetch(`/api/class/${params.id}`);
    const data = await res.json();
    if (res.ok) {
      setClassroom(data.classroom);
    } else {
      toast({
        title: "Error while fetching the classroom",
        description: data.message,
      });
    }
    setLoading(false);
  };

  const getUser = async () => {
    const res = await fetch("/api/user");
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
    } else {
      toast({
        title: "Error while fetching the user",
        description: data.message,
      });
    }
  };

  useEffect(() => {
    fetchClass();
    getUser();
  }, []);
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen w-full">
          <div className="text-rose-600 bg-white p-8 shadow-lg">
            <Icons.loading className="w-10 h-10" />
          </div>
        </div>
      ) : (
        <div>
          {classroom && (
            <div className="pt-6 px-6 text-rose-600">
              <div className="flex gap-2 items-end">
                <h1 className="text-3xl font-semibold flex items-center gap-1">
                  <Icons.class className="w-8 h-8" />
                  classroom
                </h1>
                <small className="font-normal text-lg">{classroom.name}</small>
              </div>
              {user && user.role === "TEACHER" && (
                <UploadDocs
                  onUpload={() => {
                    fetchDocuments();
                  }}
                  classId={params.id}
                />
              )}
              <h1 className="mt-4 text-2xl font-normal flex items-center gap-1">
                {" "}
                <Icons.document className="w-6 h-6" /> Documents{" "}
              </h1>
              <div className="flex flex-col gap-2 mt-4">
                {documents.map((document) => (
                  <Document
                    fetchDocuments={fetchDocuments}
                    document={document}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          onChange={(event, page) => {
            setPage(page);
          }}
        />
      </div>
    </>
  );
};

export default page;
