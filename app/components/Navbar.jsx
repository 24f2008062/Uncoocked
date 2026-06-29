"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useUser();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/event" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <header className="w-full max-w-5xl rounded-full border border-white/10 bg-zinc-950/50 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(191,64,255,0.05)] transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-10 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={20} 
                height={20} 
                className="group-hover:scale-110 transition-transform duration-200 object-contain rounded-full overflow-hidden"
              />
              <span className="text-base font-black tracking-tight bg-gradient-to-r from-neon-purple via-neon-lavender to-neon-purple bg-clip-text text-transparent neon-text-glow group-hover:scale-105 transition-transform duration-200 hidden sm:block">
                UNCOOKED
              </span>
            </Link>
          </div>

          {/* Desktop Navigation & Actions aligned to the right */}
          <div className="hidden md:flex items-center gap-8 ml-auto">
            {/* Desktop Navigation */}
            <nav className="flex items-center gap-6">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[10px] uppercase font-extrabold tracking-widest transition-all duration-200 py-1 relative ${
                      isActive
                        ? "text-white neon-text-glow"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-neon-purple to-neon-lavender shadow-[0_0_8px_rgba(191,64,255,0.8)] rounded-full animate-fadeIn" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Auth Profile / Sign In (Desktop Action) */}
            <div className="flex items-center gap-6">
              {mounted && user ? (
                <div className="relative">
                  {/* Profile Trigger button */}
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-full bg-zinc-900/40 border border-dark-border/80 py-1 pl-1.5 pr-2.5 hover:border-neon-purple/40 hover:bg-zinc-900/80 transition-all cursor-pointer focus:outline-none"
                  >
                    {/* Glowing Avatar */}
                    <div className="w-5 h-5 rounded-full bg-neon-purple/15 border border-neon-purple/40 text-[9px] font-black text-neon-lavender flex items-center justify-center uppercase ring-1 ring-neon-purple/20 shadow-[0_0_10px_rgba(191,64,255,0.25)]">
                      {(session?.user?.name || user).substring(0, 2)}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-gray-300 font-bold leading-none truncate max-w-[90px]">
                        {session?.user?.name || user.split("@")[0]}
                      </span>
                      <span className="text-[7.5px] text-neon-lavender font-black uppercase tracking-wider mt-0.5">
                        Account
                      </span>
                    </div>
                    <svg
                      className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${profileOpen ? "rotate-180 text-neon-purple" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Glassmorphic Profile Dropdown Menu */}
                  {profileOpen && (
                    <>
                      {/* Click Shield to close */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileOpen(false)}
                      />

                      <div
                        onMouseLeave={() => setProfileOpen(false)}
                        className="absolute right-0 mt-2.5 w-56 rounded-xl bg-zinc-950/90 border border-dark-border/80 backdrop-blur-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(191,64,255,0.1)] animate-fadeIn z-50 space-y-3.5"
                      >
                        {/* Header */}
                        <div className="border-b border-dark-border/40 pb-2">
                          <span className="text-[8px] text-gray-500 uppercase tracking-widest block font-bold font-mono">
                            Authenticated User
                          </span>
                          <span
                            className="text-[10px] text-white font-bold block truncate mt-0.5"
                            title={session?.user?.name || user}
                          >
                            {session?.user?.name || user}
                          </span>
                        </div>

                        {/* Links */}
                        <div className="flex flex-col gap-1 text-[11px] font-mono">
                          <Link
                            href="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-neon-purple/10 border border-transparent hover:border-dark-border transition-all"
                          >
                            👤 My Profile
                          </Link>
                          <Link
                            href="/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-neon-purple/10 border border-transparent hover:border-dark-border transition-all"
                          >
                            📊 View Dashboard
                          </Link>
                          <Link
                            href="/opportunities"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-neon-purple/10 border border-transparent hover:border-dark-border transition-all"
                          >
                            💼 Opportunities
                          </Link>
                        </div>

                        {/* Action */}
                        <div className="border-t border-dark-border/40 pt-2">
                          <button
                            onClick={() => {
                              setProfileOpen(false);
                              logout();
                              alert("Logged out successfully!");
                            }}
                            className="w-full text-center py-2 border border-red-950/60 bg-red-950/15 hover:bg-red-950/30 text-red-400 hover:text-red-300 text-[10px] font-bold rounded-lg transition-all"
                          >
                            Sign Out Session
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-[10px] font-bold text-white border border-neon-purple/30 hover:border-neon-purple/75 hover:bg-neon-purple/10 rounded-full transition-all shadow-neon"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-neon-purple focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6 text-neon-purple"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-dark-border bg-black/95 backdrop-blur-xl transition-all duration-200">
          <div className="space-y-1 px-4 py-3 sm:px-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-extrabold tracking-wider uppercase ${
                    isActive
                      ? "bg-dark-hover text-white border-l-2 border-neon-purple"
                      : "text-gray-400 hover:bg-dark-hover hover:text-neon-purple"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 pb-4 border-t border-dark-border space-y-4">
              {/* Auth Profile for Mobile */}
              {mounted && user ? (
                <div className="space-y-3 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-xs font-bold text-neon-lavender flex items-center justify-center uppercase">
                      {user.substring(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-white font-medium truncate max-w-[180px]">
                        {user}
                      </span>
                      <span className="text-[10px] text-neon-lavender font-bold uppercase tracking-wider">
                        Campus Account
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 font-mono text-xs">
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 bg-dark-card border border-dark-border rounded text-gray-300"
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 bg-dark-card border border-dark-border rounded text-gray-300"
                    >
                      📊 Dashboard
                    </Link>
                    <Link
                      href="/opportunities"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 bg-dark-card border border-dark-border rounded text-gray-300"
                    >
                      💼 Opportunities
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      alert("Logged out successfully!");
                    }}
                    className="w-full text-center px-4 py-2 border border-red-950 bg-red-950/10 hover:bg-red-950/20 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 text-xs font-bold text-white bg-black border border-neon-purple/40 hover:bg-neon-purple/10 rounded-md transition-all shadow-neon"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
    </div>
  );
}
