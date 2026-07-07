"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useUser();

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

    if (password.length < 4) {
      setError("Password must contain at least 4 characters.");
      return;
    }

    if (!dob) {
      setError("Please provide your Date of Birth.");
      return;
    }

    setLoading(true);

    try {
      // Simulate network authentication delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      signup(email, selectedRole);
      
      // Save profile data to localStorage for onboarding and profile pages
      if (typeof window !== "undefined") {
        localStorage.setItem(`profile_${email}`, JSON.stringify({
          fullName: name,
          dob: dob
        }));
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

          {/* Helper details for mock authentication */}
          <div className="text-center text-[11px] text-white/25 pt-2 border-t border-white/6">
            Campus Notice: Enter any mock details to complete local sign-up.
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/6" />
            <span className="flex-shrink-0 mx-4 text-white/30 text-[11px] font-medium">Or continue with</span>
            <div className="flex-grow border-t border-white/6" />
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
            className="w-full py-2.5 bg-white text-black font-semibold text-[13px] rounded-lg hover:bg-gray-100 transition-colors duration-150 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Sign up with Google</span>
          </button>

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
