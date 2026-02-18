import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Recipe Generator",
  description: "AI Recipe Generator is a web application that generates recipes based on user input. It uses OpenAI's GPT-3.5-turbo model to create recipes from a list of ingredients provided by the user.",
};

export default function RootLayout({ children }) {
  return (
     <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}`}
      >
      <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-100 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} AI Recipe Generator. All rights
              reserved.
            </p>
            <p className="text-sm text-gray-500">
              Built with Next.js, Tailwind CSS, and OpenAI API.
            </p>
          </div>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
