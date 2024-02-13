import { Icons } from "@/components/Icons";
import { FC } from "react";

interface pageProps {}

const Classes: FC<pageProps> = ({}) => {
  return (
    <div className="p-12">
      <h1 className="flex items-center text-4xl font-bold text-rose-600">
        <Icons.class className="w-8 h-8" /> Classes
      </h1>
      <p>Here you can find all the classes you have access to.</p>
    </div>
  );
};

export default Classes;
