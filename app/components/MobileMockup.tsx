'use client';

export default function MobileMockup() {
  return (
    <div className="relative mx-auto w-[280px] h-[560px] sm:w-[300px] sm:h-[600px] bg-black rounded-[40px] border-[8px] border-dark-border shadow-neon-thick overflow-hidden animate-fadeIn shrink-0">
      {/* Smartphone Speaker & Camera Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-12 h-1 bg-neutral-900 rounded-full mb-1" />
        <div className="w-2.5 h-2.5 bg-neutral-950 rounded-full border border-neutral-900 mb-1 ml-3" />
      </div>

      {/* Screen Content */}
      <div className="w-full h-full bg-[#050508] pt-8 px-4 flex flex-col justify-between overflow-y-auto no-scrollbar text-left select-none">
        
        {/* App Header */}
        <div className="flex items-center justify-between border-b border-dark-border pb-3 pt-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neon-purple">UNCOOKED MOBILE</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-gray-400">Mainnet v1.6</span>
            </div>
          </div>
          <span className="text-sm">⚡</span>
        </div>

        {/* Dynamic Card Widget 1: Event Info */}
        <div className="space-y-3 mt-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-3.5 space-y-2.5 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neon-purple/20 text-neon-lavender rounded">Cultural Fest</span>
              <span className="text-[8px] text-gray-500">2 min ago</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-normal">Annual Cultural Fest 2026</h4>
              <p className="text-[9px] text-gray-400 mt-1">Main Campus Arena • $20k Trophies</p>
            </div>
            <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-dark-border">
              <div className="h-full w-4/5 bg-neon-purple shadow-neon rounded-full" />
            </div>
            <div className="flex justify-between text-[8px] text-gray-500">
              <span>Guest List: 80% Full</span>
              <span className="text-neon-lavender font-bold">1,200 Attending</span>
            </div>
          </div>

          {/* Dynamic Card Widget 2: Opportunities Feed */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-3.5 space-y-2.5 shadow-sm">
            <span className="text-[8px] font-bold uppercase tracking-wider text-gray-500 block">💼 Work Opportunities</span>
            <div className="space-y-2">
              <div className="flex flex-col gap-1.5">
                <div className="flex-1 bg-black/60 p-2 rounded-lg border border-dark-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-bold text-neon-purple block">Frontend Intern</span>
                    <span className="text-[7px] text-emerald-400 font-mono">$20/hr</span>
                  </div>
                  <p className="text-[8px] text-gray-300">NeonTech Labs • Remote</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex-1 bg-black/60 p-2 rounded-lg border border-dark-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-bold text-neon-purple block">Smart Contract Bounty</span>
                    <span className="text-[7px] text-emerald-400 font-mono">$500+</span>
                  </div>
                  <p className="text-[8px] text-gray-300">DeFi Protocols • Remote</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Card Widget 3: Platform Metrics */}
        <div className="mt-4 mb-6">
          <div className="bg-dark-card border border-dark-border rounded-xl p-3 flex justify-around items-center text-center shadow-sm">
            <div>
              <div className="text-[8px] uppercase tracking-wider text-gray-500">Ticketing</div>
              <div className="text-sm font-black text-neon-purple leading-tight mt-0.5">Instant</div>
            </div>
            <div className="h-6 w-px bg-dark-border" />
            <div>
              <div className="text-[8px] uppercase tracking-wider text-gray-500">Total Events</div>
              <div className="text-sm font-black text-neon-purple leading-tight mt-0.5">50+</div>
            </div>
            <div className="h-6 w-px bg-dark-border" />
            <div>
              <div className="text-[8px] uppercase tracking-wider text-gray-500">Student Reach</div>
              <div className="text-sm font-black text-neon-purple leading-tight mt-0.5">15K+</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
