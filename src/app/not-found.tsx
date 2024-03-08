"use client";
import { FC } from "react";

import Lottie from "react-lottie";
import notFoundAnimation from "@/lottie/notfound.json";
import Link from "next/link";

interface NotFoundProps {}

const NotFound: FC<NotFoundProps> = ({}) => {
  return (
    <div className="flex flex-col justify-center items-center m-10">
      <Lottie
        options={{
          autoplay: true,
          loop: true,
          animationData: notFoundAnimation,
        }}
        height={300}
      />
      <div className="flex flex-col gap-6 justify-center items-center">
        <div className="text-3xl font-bold mt-6 text-rose-600">
          Uh oh! The page you are looking for does not exist.
        </div>
        <div>
          <Link
            href="/"
            className="font-semibold text-white p-4 bg-rose-600 inline-block rounded-md hover:scale-110 transition-transform"
          >
            Go back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
