import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";
import "./globals.css";

export const metadata: Metadata = {
  title: "quicknotes - Your Secure Note-Taking App",
  description: "A secure, production-ready note-taking web app with user authentication and rich text editing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <TopLoadingBar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
