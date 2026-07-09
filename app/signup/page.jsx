"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="relative min-h-[85vh] bg-black flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      {/* Subtle radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(168,85,247,0.06),transparent)] pointer-events-none" />

      <div className="max-w-md w-full space-y-7 bg-[#111111] border border-white/8 p-8 rounded-2xl shadow-sm relative text-center">
        <Link href="/" className="inline-block mb-4">
          <span className="text-xl font-bold tracking-tight text-white">
            UNCOOKED
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Create your Account
        </h2>
        <p className="mt-4 text-[13px] text-white/40 leading-relaxed">
          Account sign-up is temporarily disabled while we switch
          authentication providers. A new way to join will be available soon.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="text-[13px] text-[#A855F7] hover:text-[#C084FC] font-semibold transition-colors duration-150"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
