"use client";

import OpportunitiesBoard from "@/app/components/explorer/OpportunitiesBoard";

export default function OpportunitiesPage() {
  return (
    <div className="relative flex-1 bg-black text-white p-4 sm:p-6 flex flex-col min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0A0A] -z-10" />

      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col pt-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Work Opportunities
          </h1>
          <p className="text-[13px] text-white/45 max-w-xl leading-relaxed">
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
