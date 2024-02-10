import Image from "next/image";
import { FC } from "react";

import logo from "@/../public/logo.png";
import { Icons } from "./Icons";
import AuthModal from "./auth/AuthModal";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-between px-4 bg-white shadow-md h-16">
      <div>
        <Image src={logo} alt="navbar logo" className="h-10 w-auto" />
      </div>
      <div className="flex gap-2">
        {/* <button className="flex gap-1 items-center justify-center border-2 border-rose-600 box-border text-rose-600 px-4 py-1 rounded-md hover:bg-rose-600 hover:text-white transition-colors">
          <Icons.login className="w-4 h-4" /> sign in
        </button> */}
        <AuthModal isSignIn={true} />
        <AuthModal isSignIn={false} />
      </div>
    </div>
  );
};

export default Navbar;
