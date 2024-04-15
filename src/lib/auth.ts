import { DefaultUser, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
    };
  }
  interface User extends DefaultUser {
    id: number;
    firstname: string;
    lastname: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "j.doe@email.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        // check if the typed email and password are valid
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // check to see if user exists
        const user = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) {
          return null;
        }

        // check if password is matching
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordsMatch) {
          return null;
        }

        // if everything is alright and none of the conditions worked

        return {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        } as any; // do not return the full user data (dangerous)
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // authorize --> token --> session
    async jwt({ token, account, user }) {
      if (account) {
        token.id = user.id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
      }
      return token;
    },
    async session({ session, token }) {
      session.user!.id = token.id as unknown as string;
      session.user!.firstname = token.firstname as unknown as string;
      session.user!.lastname = token.lastname as unknown as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
