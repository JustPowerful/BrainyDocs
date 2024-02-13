import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

// session provider
import SessionProvider from "@/components/providers/SessionProvider";

// const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["devanagari"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BrainyDocs",
  description: "Create smart quizzes and learn with BrainyDocs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={poppins.className}>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
