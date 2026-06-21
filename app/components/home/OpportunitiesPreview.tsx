'use client';

import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, ExternalLink } from 'lucide-react';

export default function OpportunitiesPreview() {
  return (
    <section className="py-24 relative w-full overflow-hidden flex flex-col items-center border-t border-white/5 bg-zinc-950/40">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-extrabold text-neon-purple tracking-widest uppercase block neon-text-glow">
            Career Catalyst
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
            Exclusive Work Opportunities
          </h2>
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
            Access curated internships, high-paying freelance gigs, and project bounties directly from top tech partners.
          </p>
        </div>

        {/* Opportunities Mockup */}
        <div className="max-w-4xl mx-auto bg-black border border-dark-border rounded-2xl shadow-[0_0_40px_rgba(191,64,255,0.1)] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-950 border-b border-dark-border">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <div className="ml-4 flex items-center gap-2 text-[10px] font-mono text-gray-400 font-bold tracking-wider">
              <Briefcase className="h-3 w-3 text-neon-purple" />
              <span>OPPORTUNITIES_BOARD.EXE</span>
            </div>
          </div>

          <div className="p-6 grid gap-4 bg-zinc-950/50">
            {/* Mock Item 1 */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-black border border-dark-border hover:border-neon-purple/50 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-lavender border border-neon-purple/30">
                    Internship
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> $20/hr
                  </span>
                </div>
                <h3 className="text-sm font-black text-white">Frontend Developer Intern</h3>
                <p className="text-xs text-neon-purple font-bold">NeonTech Labs</p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>Remote</span>
                </div>
                <button className="px-4 py-1.5 bg-dark-hover hover:bg-neon-purple border border-dark-border hover:border-neon-purple text-white text-[10px] font-bold rounded flex items-center gap-1.5 transition-all">
                  Apply <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </motion.div>

            {/* Mock Item 2 */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-black border border-dark-border hover:border-neon-purple/50 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-950/40 text-yellow-400 border border-yellow-800/40">
                    Bounty
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> $500 - $2000
                  </span>
                </div>
                <h3 className="text-sm font-black text-white">Smart Contract Auditing Bounty</h3>
                <p className="text-xs text-neon-purple font-bold">DeFi Protocols</p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>Remote</span>
                </div>
                <button className="px-4 py-1.5 bg-dark-hover hover:bg-neon-purple border border-dark-border hover:border-neon-purple text-white text-[10px] font-bold rounded flex items-center gap-1.5 transition-all">
                  Apply <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
