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
    <div className="relative isolate min-h-[85vh] bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Dynamic neon gradient background */}
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
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-3">
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-neon-purple to-neon-lavender bg-clip-text text-transparent neon-text-glow">
              UNCOOKED
            </span>
          </Link>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Create your Account
          </h2>
          <p className="mt-2 text-xs text-gray-400">Join Campus OS today.</p>
        </div>

        {/* Credentials Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Text Inputs */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
              <label
                htmlFor="signup-name"
                className="block text-xs font-semibold text-gray-400"
              >
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
                className="block w-full rounded-md border border-dark-border bg-black px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple disabled:opacity-50"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="signup-email"
                className="block text-xs font-semibold text-gray-400"
              >
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
                className="block w-full rounded-md border border-dark-border bg-black px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple disabled:opacity-50"
              />
            </div>

            {/* Password Field with show/hide toggle */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-semibold text-gray-400"
                >
                  Password
                </label>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-neon-purple hover:text-neon-lavender focus:outline-none"
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
                className="block w-full rounded-md border border-dark-border bg-black px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple disabled:opacity-50"
              />
            </div>

            {/* DOB Field */}
            <div className="space-y-1">
              <label
                htmlFor="signup-dob"
                className="block text-xs font-semibold text-gray-400"
              >
                Date of Birth
              </label>
              <input
                id="signup-dob"
                required
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={loading || success}
                className="block w-full rounded-md border border-dark-border bg-black px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple disabled:opacity-50"
              />
            </div>
          </div>

          {/* Validation Feedback Messages */}
          {error && (
            <div className="text-[10px] text-red-400 bg-red-950/20 border border-red-800/40 p-2.5 rounded-md">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="text-[10px] text-green-300 bg-green-950/20 border border-green-800/40 p-2.5 rounded-md">
              ✓ Account created successfully. Redirecting to Campus OS...
            </div>
          )}

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-2.5 bg-neon-purple text-white font-bold text-xs rounded-md hover:bg-neon-purple/95 transition-all shadow-neon hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          {/* Helper details for mock authentication */}
          <div className="text-center text-[10px] text-gray-500 font-mono leading-normal pt-2 border-t border-dark-border/40">
            Campus Notice: Enter any mock details to complete local sign-up.
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-dark-border/40"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-[10px] uppercase font-bold">Or continue with</span>
            <div className="flex-grow border-t border-dark-border/40"></div>
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
            className="w-full py-2.5 bg-white text-black font-bold text-xs rounded-md hover:bg-gray-100 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
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
            <span className="text-xs text-gray-400">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-xs text-neon-purple hover:text-neon-lavender font-semibold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
