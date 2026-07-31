"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";

  return (
    <div className="max-w-md w-full space-y-8 bg-dark-card border border-dark-border p-8 rounded-2xl shadow-neon relative text-center">
      <Link href="/" className="inline-block mb-3">
        <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-neon-purple to-neon-lavender bg-clip-text text-transparent neon-text-glow">
          UNCOOKED
        </span>
      </Link>
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Check Your Email
        </h2>
        <p className="mt-3 text-sm text-gray-300">
          We sent a verification email to:
        </p>
        {email && (
          <p className="mt-1 font-bold text-neon-purple bg-black/40 py-2 px-3 rounded-lg border border-dark-border text-sm inline-block">
            {email}
          </p>
        )}
        <p className="mt-4 text-xs text-gray-400 leading-relaxed">
          Please click the link in that email to confirm your inbox access and complete your account setup. This link will expire in 24 hours.
        </p>
        <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-left">
          <p className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
            <span>⚠️</span> Don&apos;t see the email?
          </p>
          <p className="text-[11px] text-amber-200/80 mt-1">
            Please check your <strong className="text-amber-200">Spam</strong>, <strong className="text-amber-200">Junk</strong>, or <strong className="text-amber-200">Promotions</strong> folder!
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Link
          href="/login"
          className="block w-full btn-primary text-[13px] py-2.5 font-bold"
        >
          Proceed to Sign In
        </Link>
        <Link
          href="/verify-email"
          className="block w-full text-center text-xs text-gray-400 hover:text-white transition-colors"
        >
          Didn&apos;t receive it? Request another link
        </Link>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <div className="relative isolate min-h-[85vh] bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl opacity-20"
        aria-hidden="true"
      >
        <div
          className="relative left-[50%] top-[20%] aspect-1155/678 w-[40rem] -translate-x-1/2 bg-gradient-to-tr from-neon-purple to-neon-lavender"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <CheckEmailContent />
      </Suspense>
    </div>
  );
}
