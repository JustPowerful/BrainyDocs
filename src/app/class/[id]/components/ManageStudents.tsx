"use client";
import { FC, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/ui/input";
import { StudentInClass, User } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { Pagination } from "@mui/material";

interface ManageStudentsProps {
  classId: string;
}

const StudentPreview: FC<{
  student: User;
  getStudents: () => void;
  classId: string;
}> = ({ student, getStudents, classId }) => {
  const [toggle, setToggle] = useState(false);
  const { toast } = useToast();

  async function removeStudent() {
    const res = await fetch(`/api/member`, {
      method: "DELETE",
      body: JSON.stringify({
        studentId: student.id,
        classId: classId,
      }),
    });

    const data = await res.json();
    if (data.success) {
      getStudents();
      toast({
        title: "Student removed",
        description: "The student has been removed from the class.",
      });
    } else {
      toast({
        title: "Error",
        description: data.message,
      });
    }
  }

  return (
    <div
      className="
      
      box-border
    bg-white
    rounded-md
    p-2
    flex
    items-center
    justify-between
    gap-2
  "
    >
      <div className="flex gap-2 items-center">
        <div>
          <h3 className="font-semibold text-gray-800">
            {student.firstname} {student.lastname}
          </h3>
        </div>
      </div>
      <Dialog
        onOpenChange={(open) => {
          setToggle(open);
        }}
        open={toggle}
      >
        <DialogTrigger>
          <button
            className="
      bg-rose-600
      hover:bg-rose-700
      text-white
      rounded-md
      flex
      justify-center
      items-center
      p-2
      "
          >
            <Icons.delete className="w-4 h-4" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex gap-1">
              <Icons.delete className="w-4 h-4" /> Remove student from class?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {student.firstname} from the
              class?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-1 justify-end">
            <button
              onClick={() => {
                removeStudent();
              }}
              className="
          bg-rose-600
          hover:bg-rose-700
          text-white
          gap-1
          rounded-md
          flex
          justify-center
          items-center
          p-2
          "
            >
              <Icons.delete className="w-4 h-4" />
              <span>Remove</span>
            </button>
            <button
              onClick={() => {
                setToggle(false);
              }}
              className="bg-gray-600 text-white hover:bg-gray-700 rounded-md p-2"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ManageStudents: FC<ManageStudentsProps> = ({ classId }) => {
  const [toggle, setToggle] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [students, setStudents] = useState<any[]>([]);

  async function addStudent() {
    const res = await fetch(`/api/member`, {
      method: "POST",
      body: JSON.stringify({ studentEmail: email, classId: classId }),
    });

    const data = await res.json();
    if (data.success) {
      getStudents();
      toast({
        title: "Student added",
        description: "The student has been added to the class.",
      });
    } else {
      toast({
        title: "Error",
        description: data.message,
      });
    }
  }

  async function getStudents() {
    const res = await fetch(`/api/member?page=${page}&classId=${classId}`);
    const data = await res.json();
    if (res.ok) {
      setStudents(data.students);
      setTotalPages(data.totalPages);
    } else {
      toast({
        title: "Error while fetching the students",
        description: data.message,
      });
    }
  }

  useEffect(() => {
    getStudents();
  }, [page]);

  return (
    <div className="box-border">
      <Dialog>
        <DialogTrigger>
          <button className="bg-rose-600 p-2 border-2 border-rose-600 text-white rounded-md hover:text-rose-600 hover:bg-white transition-colors flex items-center gap-1">
            <Icons.adduser className="w-4 h-4" /> Manage Students
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex gap-1">
              <Icons.adduser className="w-4 h-4" /> Manage Students
            </DialogTitle>
            <DialogDescription>
              Add or remove students from the classroom by adding their email
              addresses.
            </DialogDescription>
          </DialogHeader>
          <form>
            <label>email</label>
            <div className="grid grid-cols-[4fr_1fr] gap-1">
              <Input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="johndoe@mail.com"
                type="email"
              />
              <button
                onClick={(event) => {
                  event.preventDefault();
                  addStudent();
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-md flex justify-center items-center"
              >
                <Icons.plus className="w-5 h-5" />
              </button>
            </div>
          </form>
          <div className="bg-gray-300 rounded-md p-2 flex flex-col gap-2">
            {/* <StudentPreview student={{ firstname: "John", lastname: "Doe" }} /> */}
            {students.map((student) => (
              <StudentPreview
                classId={classId}
                getStudents={getStudents}
                key={student.id}
                student={student.student}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => {
                setPage(value);
              }}
              color="standard"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageStudents;
