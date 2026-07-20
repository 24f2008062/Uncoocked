"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState("organizer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (name.length < 2) {
      setError("Please provide a valid name.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please provide a valid institutional email address.");
      return;
    }

    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must be at least 8 characters and include both letters and numbers.");
      return;
    }

    if (!dob) {
      setError("Please provide your Date of Birth.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName: name }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Auto sign-in with the newly created credentials, then route to onboarding.
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!signInRes?.ok) {
        setError(
          "Account created but sign-in failed. Please sign in manually."
        );
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Delay routing slightly to show success visual state
      setTimeout(() => {
        router.push("/onboarding");
      }, 500);
    } catch (err) {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[85vh] bg-black flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      {/* Subtle radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(168,85,247,0.06),transparent)] pointer-events-none" />

      <div className="max-w-md w-full space-y-7 bg-[#111111] border border-white/8 p-8 rounded-2xl shadow-sm relative">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-4">
            <span className="text-xl font-bold tracking-tight text-white">
              UNCOOKED
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Create your Account
          </h2>
          <p className="mt-2 text-[13px] text-white/40">Join Uncooked today.</p>
        </div>

        {/* Credentials Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Text Inputs */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="block text-[12px] font-medium text-white/50">
                Full Name
              </label>
              <input
                id="signup-name"
                required
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || success}
                className="block w-full rounded-lg border border-white/8 bg-[#0A0A0A] px-3 py-2.5 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#A855F7]/25 focus:border-[#A855F7]/50 transition-all duration-150 disabled:opacity-50"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="block text-[12px] font-medium text-white/50">
                Institutional Email Address
              </label>
              <input
                id="signup-email"
                required
                type="email"
                placeholder="student@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                className="block w-full rounded-lg border border-white/8 bg-[#0A0A0A] px-3 py-2.5 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#A855F7]/25 focus:border-[#A855F7]/50 transition-all duration-150 disabled:opacity-50"
              />
            </div>

            {/* Password Field with show/hide toggle */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="signup-password" className="block text-[12px] font-medium text-white/50">
                  Password
                </label>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-white/35 hover:text-white/70 focus:outline-none transition-colors duration-150"
                >
                  {showPassword ? "Hide password" : "Show password"}
                </button>
              </div>
              <input
                id="signup-password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
                className="block w-full rounded-lg border border-white/8 bg-[#0A0A0A] px-3 py-2.5 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#A855F7]/25 focus:border-[#A855F7]/50 transition-all duration-150 disabled:opacity-50"
              />
            </div>

            {/* DOB Field */}
            <div className="space-y-1.5">
              <label htmlFor="signup-dob" className="block text-[12px] font-medium text-white/50">
                Date of Birth
              </label>
              <input
                id="signup-dob"
                required
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={loading || success}
                className="block w-full rounded-lg border border-white/8 bg-[#0A0A0A] px-3 py-2.5 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#A855F7]/25 focus:border-[#A855F7]/50 transition-all duration-150 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Validation Feedback Messages */}
          {error && (
            <div className="text-[12px] text-red-400 bg-red-500/6 border border-red-500/15 px-3 py-2.5 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="text-[12px] text-emerald-400 bg-emerald-500/6 border border-emerald-500/15 px-3 py-2.5 rounded-lg">
              ✓ Account created successfully. Redirecting to Uncooked...
            </div>
          )}

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-2.5 bg-[#A855F7] text-white font-semibold text-[13px] rounded-lg hover:bg-[#C084FC] hover:-translate-y-px hover:shadow-md transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          {/* Helper details */}
          <div className="text-center text-[11px] text-white/25 pt-2 border-t border-white/6">
            Campus Notice: Use a valid email and a password of at least 8 characters (letters and numbers).
          </div>

          <div className="text-center mt-4">
            <span className="text-[13px] text-white/40">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-[13px] text-[#A855F7] hover:text-[#C084FC] font-semibold transition-colors duration-150"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
