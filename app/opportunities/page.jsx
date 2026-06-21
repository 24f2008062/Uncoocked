"use client";

import OpportunitiesBoard from "@/app/components/OpportunitiesBoard";

export default function OpportunitiesPage() {
  return (
    <div className="relative flex-1 bg-black text-white p-4 sm:p-6 flex flex-col min-h-screen overflow-hidden">
      {/* Dynamic ambient neon glows */}
      <div
        className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl opacity-10 animate-pulse"
        aria-hidden="true"
      >
        <div
          className="relative left-[45%] top-[15%] aspect-[1155/678] w-[32rem] bg-gradient-to-tr from-neon-purple to-neon-lavender"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col pt-12 space-y-12">
        {/* Header Section */}
        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl neon-text-glow">
            Work Opportunities
          </h1>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed font-mono">
            Discover internships, freelance gigs, full-time roles, and bounties
            posted directly by our tech partners and startups.
          </p>
        </div>

        {/* Board Wrapper */}
        <div className="flex-1">
          <OpportunitiesBoard />
        </div>
      </div>
    </div>
  );
}
