import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { UserProvider } from "@/app/context/UserContext";
import { NextAuthProvider } from "@/app/context/NextAuthProvider";
import SessionMonitor from "@/app/components/dashboard/SessionMonitor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Uncooked Portal",
  description:
    "The Zero-Noise Operating System for Student Events and Campus Ecosystems",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full subpixel-antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-black text-white transition-colors duration-300">
        <NextAuthProvider>
          <UserProvider>
            <SessionMonitor />
            <Navbar />
            <main className="flex-1 w-full flex flex-col pt-20">{children}</main>
            <Footer />
          </UserProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
