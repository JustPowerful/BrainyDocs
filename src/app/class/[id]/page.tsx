"use client";

import { FC, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Class } from "@prisma/client";
import { Icons } from "@/components/Icons";
import UploadDocs from "./components/UploadDocs";

interface pageProps {
  params: { id: string };
}

const page: FC<pageProps> = ({ params }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState<Class>();

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

  useEffect(() => {
    fetchClass();
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
              <h1 className="text-3xl font-semibold flex items-center gap-1">
                <Icons.class className="w-8 h-8" />
                {classroom.name}
              </h1>
              <UploadDocs />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default page;
