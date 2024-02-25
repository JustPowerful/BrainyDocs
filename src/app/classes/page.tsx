"use client";

import { Pagination } from "@mui/material";

import { User } from "@/lib/types";

import { Icons } from "@/components/Icons";
import { FC, useEffect, useState } from "react";
import CreateClass from "./components/CreateClass";
import { Class } from "@prisma/client";
import ClassPreview from "./components/ClassPreview";

interface pageProps {}

const Classes: FC<pageProps> = ({}) => {
  const [user, setUser] = useState<User>();
  const [classes, setClasses] = useState<Class[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // to count the total number of pages

  async function fetchUser() {
    const res = await fetch("/api/user");
    const data = await res.json();
    setUser(data.user);
  }

  async function fetchClasses() {
    const res = await fetch(`/api/class?page=${page}`);
    const data = await res.json();

    console.log(data);

    if (res.ok) {
      setClasses(data.classes);
      setTotalPages(data.totalPages);
    } else {
      console.error(data.message);
    }
  }

  useEffect(() => {
    fetchClasses();
  }, [page]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="p-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-4xl font-bold text-rose-600">
            <Icons.class className="w-8 h-8" /> Classes
          </h1>
          {user?.role === "TEACHER" && (
            <p>Here you can find all the classes that you're teaching</p>
          )}
          {user?.role === "STUDENT" && (
            <p>Here you can find all the classes you have access to</p>
          )}
        </div>
        <div>
          {user && user.role === "TEACHER" && (
            <CreateClass
              onCreate={() => {
                fetchClasses();
              }}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-10">
        {/* classes */}
        {classes.map((c) => (
          <ClassPreview classData={c} isTeacher={user?.role === "TEACHER"} />
        ))}
      </div>
      <div className="flex justify-center pt-10">
        <Pagination
          count={totalPages}
          onChange={(event, page) => {
            setPage(page);
          }}
          color="standard"
        />
      </div>
    </div>
  );
};

export default Classes;
