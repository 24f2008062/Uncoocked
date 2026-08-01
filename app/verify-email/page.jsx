"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const status = searchParams?.get("status");
  const error = searchParams?.get("error");
  const notice = searchParams?.get("notice");
  const defaultEmail = searchParams?.get("email") || "";

  const [email, setEmail] = useState(defaultEmail);
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to resend link.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg(
        data.message ||
          "If an unverified account exists with this email, a verification link has been sent."
      );
      setIsLoading(false);
    } catch {
      setFormError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-dark-card border border-dark-border p-8 rounded-2xl shadow-neon relative">
      <div className="text-center">
        <Link href="/" className="inline-block mb-3">
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-neon-purple to-neon-lavender bg-clip-text text-transparent neon-text-glow">
            UNCOOKED
          </span>
        </Link>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Email Verification
        </h2>
      </div>

      {status === "success" && (
        <div className="space-y-6 text-center">
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            🎉 Your email has been verified successfully! Your inbox access is confirmed.
          </div>
          <Link
            href="/login"
            className="block w-full text-center btn-primary text-[13px] py-2.5 font-bold"
          >
            Sign In to Your Account
          </Link>
        </div>
      )}

      {status === "already_verified" && (
        <div className="space-y-6 text-center">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
            ✅ Your email is already verified. You can access all protected features.
          </div>
          <Link
            href="/login"
            className="block w-full text-center btn-primary text-[13px] py-2.5 font-bold"
          >
            Proceed to Sign In
          </Link>
        </div>
      )}

      {!status && (
        <div className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <strong>Verification Error:</strong> {error}
            </div>
          )}

          {notice === "unverified" && !error && (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              ⚠️ You must verify your email address before accessing protected organizer or onboarding features.
            </div>
          )}

          {successMsg ? (
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                {successMsg}
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-left">
                <p className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                  <span>⚠️</span> Don&apos;t see the email?
                </p>
                <p className="text-[11px] text-amber-200/80 mt-1">
                  Please check your <strong className="text-amber-200">Spam</strong>, <strong className="text-amber-200">Junk</strong>, or <strong className="text-amber-200">Promotions</strong> folder!
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-4 text-center">
                  Need a new verification link? Enter your email address below and we&apos;ll send one to your inbox.
                </p>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-black/40 border border-dark-border px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple"
                  placeholder="you@campus.edu"
                />
              </div>

              {formError && <p className="text-xs text-red-400">{formError}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary text-[13px] py-2.5 font-bold disabled:opacity-50"
              >
                {isLoading ? "Sending link..." : "Resend Verification Email"}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-gray-500 pt-2">
            Return to{" "}
            <Link
              href="/login"
              className="text-neon-purple hover:text-neon-lavender font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
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
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
