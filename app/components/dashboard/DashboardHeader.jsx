"use client";

import { useState } from "react";
import { Activity, Trophy, Info, X } from "lucide-react";

export default function DashboardHeader({ username, attendingCount, hostedCount, loading }) {
  const [showRankModal, setShowRankModal] = useState(false);
  // 1. Calculate XP
  const xp = (attendingCount * 10) + (hostedCount * 50);

  // 2. Determine Rank & Progress
  const getRankDetails = (currentXp) => {
    if (currentXp < 50) return { name: "Freshman", icon: "🥉", color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/30", next: 50 };
    if (currentXp < 100) return { name: "Sophomore", icon: "🥈", color: "text-zinc-300", bg: "bg-zinc-400/10", border: "border-zinc-400/30", next: 100 };
    if (currentXp < 250) return { name: "Junior", icon: "🥇", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30", next: 250 };
    if (currentXp < 500) return { name: "Senior", icon: "🌟", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30", next: 500 };
    return { name: "Campus Legend", icon: "👑", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30", next: null };
  };

  const rank = getRankDetails(xp);
  
  let progressPercentage = 100;
  if (rank.next) {
    progressPercentage = Math.min(100, Math.max(0, (xp / rank.next) * 100));
  }

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 border-b border-dark-border pb-8">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold bg-neon-purple/10 text-neon-lavender border border-neon-purple/30 shadow-neon">
            <Activity className="h-3 w-3 animate-pulse" /> Student Console
          </span>
          {!loading && (
            <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${rank.bg} ${rank.color} border ${rank.border}`}>
              <span>{rank.icon}</span> {rank.name}
            </div>
          )}
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl capitalize">
          Welcome back, {username}!
        </h1>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-xl">
          Manage your active event bookings, view details for hosted events,
          and post bulletin updates.
        </p>

        {/* Progress Bar */}
        {!loading && (
          <div className="mt-5 max-w-sm">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3 text-neon-purple"/> Rank Progress
                <button 
                  onClick={() => setShowRankModal(true)} 
                  className="ml-1 text-gray-500 hover:text-neon-lavender transition-colors rounded-full p-0.5 hover:bg-neon-purple/10"
                  title="View Rank Guide"
                >
                  <Info className="w-3 h-3" />
                </button>
              </span>
              <span className="text-[10px] font-mono font-bold text-neon-purple">
                {xp} <span className="text-gray-600">/ {rank.next || 'MAX'} XP</span>
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-dark-border">
              <div 
                className="h-full bg-neon-purple shadow-[0_0_10px_rgba(191,64,255,0.5)] transition-all duration-1000 ease-out relative overflow-hidden" 
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Metrics */}
      <div className="flex gap-4">
        <div className="bg-dark-card border border-dark-border px-5 py-3 rounded-xl text-center shadow-neon shrink-0 min-w-[140px]">
          <div className="text-[9px] uppercase font-bold text-gray-500 tracking-wider flex items-center justify-center gap-1">
            <span>🎓</span> Attending Events
          </div>
          <div className="text-2xl font-black text-neon-purple neon-text-glow mt-1">
            {loading ? "..." : attendingCount}
          </div>
        </div>
        <div className="bg-dark-card border border-dark-border px-5 py-3 rounded-xl text-center shadow-neon shrink-0 min-w-[140px]">
          <div className="text-[9px] uppercase font-bold text-gray-500 tracking-wider flex items-center justify-center gap-1">
            <span>📢</span> Hosted Events
          </div>
          <div className="text-2xl font-black text-neon-purple neon-text-glow mt-1">
            {loading ? "..." : hostedCount}
          </div>
        </div>
      </div>

      {/* Rank Guide Modal */}
      {showRankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-md p-6 shadow-neon relative animate-fadeIn text-left">
            <button 
              onClick={() => setShowRankModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-neon-purple" /> Rank System Guide
            </h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Earn XP by participating in the community! Attending events grants <span className="text-neon-purple font-bold">10 XP</span>, while hosting grants <span className="text-neon-purple font-bold">50 XP</span>.
            </p>
            
            <div className="space-y-3">
              {[
                { name: "Freshman", icon: "🥉", range: "0 - 49 XP", color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/30" },
                { name: "Sophomore", icon: "🥈", range: "50 - 99 XP", color: "text-zinc-300", bg: "bg-zinc-400/10", border: "border-zinc-400/30" },
                { name: "Junior", icon: "🥇", range: "100 - 249 XP", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
                { name: "Senior", icon: "🌟", range: "250 - 499 XP", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30" },
                { name: "Campus Legend", icon: "👑", range: "500+ XP", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" },
              ].map(r => (
                <div key={r.name} className={`flex items-center justify-between p-3 rounded-xl border ${r.bg} ${r.border}`}>
                  <div className={`flex items-center gap-2 text-sm font-black uppercase tracking-wider ${r.color}`}>
                    <span className="text-lg">{r.icon}</span> {r.name}
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-300">{r.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
