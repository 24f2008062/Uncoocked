import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { UserProvider } from "@/app/context/UserContext";
import { NextAuthProvider } from "@/app/context/NextAuthProvider";
import SessionMonitor from "@/app/components/dashboard/SessionMonitor";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import Script from "next/script";

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
        <Toaster theme="dark" position="bottom-right" richColors />
        <SpeedInsights />
        
        {/* Safely injects the Razorpay Checkout SDK globally without slowing down initial page loads */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}