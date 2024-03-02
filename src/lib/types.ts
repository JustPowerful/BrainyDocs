import { Role, Class, StudentInClass, Quiz } from "@prisma/client";

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;
  teacherClasses: Class[];
  studentClasses: StudentInClass[];
}

export interface QuizType extends Quiz {
  questions: any;
}
