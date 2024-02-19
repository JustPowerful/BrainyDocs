import { Role, Class, StudentInClass } from "@prisma/client";

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;
  teacherClasses: Class[];
  studentClasses: StudentInClass[];
}
