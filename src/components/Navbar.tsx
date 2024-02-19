"use client";

import Image from "next/image";
import { FC, useEffect, useState } from "react";

import logo from "@/../public/logo.png";
import AuthModal from "./auth/AuthModal";

import { useSession } from "next-auth/react";
import { Icons } from "./Icons";
import Link from "next/link";
import NavMenu from "./NavMenu";
import { usePathname } from "next/navigation";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  const { data: session, status } = useSession();
  const [toggleMenu, setToggleMenu] = useState(false);

  const pathname = usePathname();
  useEffect(() => {
    setToggleMenu(false);
  }, [pathname]);

  return (
    <>
      {toggleMenu && (
        <NavMenu
          onClose={() => {
            setToggleMenu(false);
          }}
        />
      )}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between px-4 bg-white shadow-md shadow-zinc-400 h-16 backdrop-blur-md">
        <div>
          <Image src={logo} alt="navbar logo" className="h-10 w-auto" />
        </div>
        <div>
          {/* <button className="flex gap-1 items-center justify-center border-2 border-rose-600 box-border text-rose-600 px-4 py-1 rounded-md hover:bg-rose-600 hover:text-white transition-colors">
          <Icons.login className="w-4 h-4" /> sign in
        </button> */}

          {status === "loading" ? (
            <div className="text-rose-600">
              <Icons.loading className="animate-spin w-5 h-5" />
            </div>
          ) : (
            <>
              {session?.user ? (
                <div className="flex gap-1">
                  <Link
                    href="/profile"
                    className="bg-rose-600 p-2 rounded-md text-white flex justify-center items-center"
                  >
                    <Icons.user className="w-4 h-4" /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      setToggleMenu((prev) => !prev);
                    }}
                    className="bg-rose-600 p-2 rounded-md text-white"
                  >
                    <Icons.menu className="w-5 h-5" />
                  </button>

                  {/* <button
              onClick={() => {
                signOut();
              }}
              className="border-2 border-rose-600 px-2 py-1 rounded-md text-rose-600 hover:bg-rose-600 hover:text-white"
            >
              Sign Out
            </button> */}
                </div>
              ) : (
                <div className="flex gap-2">
                  <AuthModal isSignIn={true} />
                  <AuthModal isSignIn={false} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
