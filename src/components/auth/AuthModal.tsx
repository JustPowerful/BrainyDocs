"use client";
import { FC } from "react";
import { Icons } from "../Icons";
import { useState } from "react";
import { useToast } from "../ui/use-toast";

import { ZodError, z } from "zod";
import { signIn } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface AuthModalProps {
  isSignIn: boolean;
}

interface UserData {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  confirmPassword?: string;
}

const AuthModal: FC<AuthModalProps> = ({ isSignIn }) => {
  const [data, setData] = useState<UserData>({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);

  const Register = z
    .object({
      email: z.string().email({ message: "Please provide a valid email" }),
      firstname: z
        .string()
        .min(3, { message: "firstname must have 3 characters at minimum" }),
      lastname: z
        .string()
        .min(3, { message: "lastname must have 3 characters at minimum" }),
      password: z
        .string()
        .min(8, { message: "password must have 8 characters at minimum" }),
      confirmPassword: z.string().min(8, {
        message: "password confirmation must have 8 characters at minimum",
      }),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords do not match",
        });
      }
    });

  const { toast } = useToast();

  const handleSignup = async () => {
    setLoading(true);
    try {
      // verify the data before sending it to the server
      const parsedData = Register.safeParse(data);
      let issues: string[] = [];
      if (!parsedData.success) {
        parsedData.error.issues.map((issue) => {
          issues.push(issue.message);
        });
        setIssues(issues);
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Account created!",
          description: "You have successfully created an account",
        });

        setData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to create account!",
          description: result.message,
        });
      }

      setLoading(false);
    } catch (error: any) {
      toast({
        title: "There was an error!",
        description: error.message,
      });
    }
  };

  const Login = z.object({
    email: z.string().email({ message: "Please provide a valid email" }),
    password: z.string().min(8, {
      message: "password must have 8 characters at minimum",
    }),
  });

  const handleSignin = async () => {
    setLoading(true);
    try {
      Login.safeParse({
        email: data.email,
        password: data.password,
      });
      signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        setIssues(error.issues.map((issue) => issue.message));
      }
    }
    setLoading(false);
  };
  return (
    <Dialog>
      <DialogTrigger>
        {isSignIn ? (
          <span className="flex gap-1 items-center justify-center border-2 border-rose-600 box-border text-rose-600 px-4 py-1 rounded-md hover:bg-rose-600 hover:text-white transition-colors">
            <Icons.login className="w-4 h-4" /> sign in
          </span>
        ) : (
          <span className="flex gap-1 items-center justify-center bg-rose-600 border-2 border-rose-600 text-white px-4 py-1 rounded-md hover:bg-rose-400  transition-colors">
            <Icons.register className="w-4 h-4" /> sign up
          </span>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="">
          <div className="font-bold text-3xl text-rose-600 text-center mb-2">
            {isSignIn ? "Sign In" : "Sign Up"}
          </div>
          <form className="flex flex-col gap-2">
            {!isSignIn && (
              <div className="grid grid-cols-2 gap-2 w-full">
                <div>
                  <label>firstname</label>
                  <Input
                    value={data.firstname}
                    onChange={(event) => {
                      setData({ ...data, firstname: event.target.value });
                    }}
                    placeholder="Firstname"
                  />
                </div>
                <div>
                  <label>lastname</label>
                  <Input
                    value={data.lastname}
                    onChange={(event) => {
                      setData({ ...data, lastname: event.target.value });
                    }}
                    placeholder="Lastname"
                  />
                </div>
              </div>
            )}
            <div>
              <label>email</label>
              <Input
                value={data?.email}
                onChange={(event) => {
                  setData({ ...data, email: event.target.value });
                }}
                placeholder="Email"
                type="email"
              />
            </div>
            <div className={`${isSignIn && "mb-4"}`}>
              <label>password</label>
              <Input
                value={data?.password}
                onChange={(event) => {
                  setData({ ...data, password: event.target.value });
                }}
                placeholder="Password"
                type="password"
                className=""
              />
            </div>
            {!isSignIn && (
              <div className="mb-4">
                <label>confirm password</label>
                <Input
                  value={data?.confirmPassword}
                  onChange={(event) => {
                    setData({ ...data, confirmPassword: event.target.value });
                  }}
                  placeholder="Confirm password"
                  type="password"
                  className=""
                />
              </div>
            )}
            {issues.map((issue) => (
              <div className="text-sm font-semibold text-red-700 text-center">
                {issue}
              </div>
            ))}
            <button
              onClick={(event) => {
                event.preventDefault();
                if (!isSignIn) {
                  handleSignup();
                } else {
                  handleSignin();
                }
              }}
              className="bg-rose-600 text-white p-2 rounded-md w-full hover:bg-rose-500"
            >
              {loading ? (
                <Icons.loading className="w-4 h-4" />
              ) : isSignIn ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
