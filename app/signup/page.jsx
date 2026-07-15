"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create account.");
        setIsLoading(false);
        return;
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError("Account created, but sign-in failed. Please log in.");
        setIsLoading(false);
        router.push("/login");
        return;
      }

      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] bg-black flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(168,85,247,0.06),transparent)] pointer-events-none" />

      <div className="max-w-md w-full space-y-7 bg-[#111111] border border-white/8 p-8 rounded-2xl shadow-sm relative">
        <Link href="/" className="inline-block mb-4">
          <span className="text-xl font-bold tracking-tight text-white">
            UNCOOKED
          </span>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Create your Account
          </h2>
          <p className="mt-2 text-[13px] text-white/40">
            Join Uncooked to discover and manage campus events.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-semibold text-white/70 mb-1"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#A855F7]"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-white/70 mb-1"
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
              className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#A855F7]"
              placeholder="you@campus.edu"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-white/70 mb-1"
            >
              Password
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
              className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#A855F7]"
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#A855F7] hover:bg-[#C084FC] text-white text-[13px] py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-white/40">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#A855F7] hover:text-[#C084FC] font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
