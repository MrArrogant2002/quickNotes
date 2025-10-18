import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TopLoadingBar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
