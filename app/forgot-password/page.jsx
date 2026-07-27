"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit request.");
        setIsLoading(false);
        return;
      }

      setSuccess(
        data.message ||
          "If an account with that email exists, a password reset link has been sent."
      );
      setIsLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

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

      <div className="max-w-md w-full space-y-8 bg-dark-card border border-dark-border p-8 rounded-2xl shadow-neon relative">
        <Link href="/" className="inline-block mb-3">
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-neon-purple to-neon-lavender bg-clip-text text-transparent neon-text-glow">
            UNCOOKED
          </span>
        </Link>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your email address and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                {success}
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
            <Link
              href="/login"
              className="block w-full text-center btn-primary text-[13px] py-2.5 font-bold"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-300 mb-1"
              >
                Email
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

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-[13px] py-2.5 font-bold disabled:opacity-50"
            >
              {isLoading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-500">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-neon-purple hover:text-neon-lavender font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
