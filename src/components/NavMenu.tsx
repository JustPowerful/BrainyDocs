import Link from "next/link";
import { FC } from "react";
import { Icons } from "./Icons";
import { signOut } from "next-auth/react";

interface NavMenuProps {
  onClose: () => void;
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="border-2 border-rose-600 text-rose-600 text-center p-1 rounded-md hover:bg-rose-600 hover:text-white transition-colors flex justify-center items-center"
    >
      {children}
    </Link>
  );
}

const NavMenu: FC<NavMenuProps> = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-md w-[300px] max-md:w-full p-6 m-4 flex flex-col gap-1">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white p-2 rounded-md text-rose-600 hover:bg-rose-600 hover:text-white"
        >
          <Icons.close className="w-5 h-5" />
        </button>

        <NavLink href="/profile">
          <Icons.user className="w-4 h-4" /> Profile
        </NavLink>
        <NavLink href="/classes">
          <Icons.class className="w-4 h-4" /> Classes
        </NavLink>
        <button
          onClick={() => {
            signOut();
          }}
          className="border-2 border-rose-600 text-white bg-rose-600 text-center p-1 rounded-md hover:bg-rose-700 hover:text-white transition-colors flex justify-center items-center"
        >
          <Icons.logout className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
};

export default NavMenu;
