"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Please enter your new password below.
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              Your password has been reset successfully! Redirecting to login page...
            </div>
            <Link
              href="/login"
              className="block w-full text-center btn-primary text-[13px] py-2.5 font-bold"
            >
              Sign In Now
            </Link>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-300 mb-1"
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-black/40 border border-dark-border px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple"
                placeholder="At least 8 characters (letters & numbers)"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-gray-300 mb-1"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg bg-black/40 border border-dark-border px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple"
                placeholder="Repeat new password"
              />
            </div>

            {error && (
              <div className="space-y-2">
                <p className="text-xs text-red-400">{error}</p>
                {(error.includes("expired") ||
                  error.includes("invalid") ||
                  error.includes("used")) && (
                  <p className="text-xs text-gray-400">
                    Need a new link?{" "}
                    <Link
                      href="/forgot-password"
                      className="text-neon-purple hover:text-neon-lavender font-semibold underline"
                    >
                      Request another password reset
                    </Link>
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full btn-primary text-[13px] py-2.5 font-bold disabled:opacity-50"
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-500">
          Remembered your password?{" "}
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
