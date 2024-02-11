"use client";
import { FC, ReactNode } from "react";

import { SessionProvider as Provider } from "next-auth/react";

interface SessionProviderProps {
  children: ReactNode;
}

const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  return <Provider>{children}</Provider>;
};

export default SessionProvider;
