"use client";

import { useState } from "react";
import { Trophy, Info, X } from "lucide-react";

export default function DashboardHeader({ username, attendingCount, hostedCount, loading }) {
  const [showRankModal, setShowRankModal] = useState(false);

  const xp = (attendingCount * 10) + (hostedCount * 50);

  const getRankDetails = (currentXp) => {
    if (currentXp < 50)  return { name: "Freshman",      icon: "🥉", color: "text-amber-500",   bg: "bg-amber-500/8",   border: "border-amber-500/15", next: 50 };
    if (currentXp < 100) return { name: "Sophomore",     icon: "🥈", color: "text-zinc-300",    bg: "bg-white/5",       border: "border-white/10",     next: 100 };
    if (currentXp < 250) return { name: "Junior",        icon: "🥇", color: "text-amber-400",   bg: "bg-amber-400/8",   border: "border-amber-400/15", next: 250 };
    if (currentXp < 500) return { name: "Senior",        icon: "🌟", color: "text-[#C084FC]",   bg: "bg-[#A855F7]/8",   border: "border-[#A855F7]/15", next: 500 };
    return               { name: "Campus Legend", icon: "👑", color: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/15", next: null };
  };

  const rank = getRankDetails(xp);
  const progressPercentage = rank.next ? Math.min(100, Math.max(0, (xp / rank.next) * 100)) : 100;

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/6 pb-6">
      <div className="flex-1">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold bg-white/5 text-white/50 border border-white/8">
            Student Console
          </span>
          {!loading && (
            <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${rank.bg} ${rank.color} border ${rank.border}`}>
              <span>{rank.icon}</span> {rank.name}
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl capitalize">
          Welcome back, {username}!
        </h1>
        <p className="text-[13px] text-white/40 mt-2 leading-relaxed max-w-xl">
          Manage your active event bookings, view details for hosted events,
          and post bulletin updates.
        </p>

        {/* Progress Bar */}
        {!loading && (
          <div className="mt-5 max-w-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-medium text-white/40 flex items-center gap-1.5">
                <Trophy className="w-3 h-3 text-white/30" /> Rank Progress
                <button
                  onClick={() => setShowRankModal(true)}
                  className="ml-0.5 text-white/25 hover:text-white/60 transition-colors duration-150 rounded-full p-0.5"
                  title="View Rank Guide"
                >
                  <Info className="w-3 h-3" />
                </button>
              </span>
              <span className="text-[11px] font-mono font-semibold text-white/50">
                {xp} <span className="text-white/25">/ {rank.next || "MAX"} XP</span>
              </span>
            </div>
            <div className="w-full h-1 bg-white/6 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A855F7] transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick Metrics */}
      <div className="flex gap-3">
        {[
          { emoji: "🎓", label: "Attending Events", value: attendingCount },
          { emoji: "📢", label: "Hosted Events",    value: hostedCount },
        ].map(({ emoji, label, value }) => (
          <div key={label} className="bg-[#111111] border border-white/8 px-5 py-4 rounded-xl text-center shrink-0 min-w-[130px]">
            <div className="text-[10px] uppercase font-semibold text-white/35 tracking-wider">
              {emoji} {label}
            </div>
            <div className="text-2xl font-bold text-white mt-1.5">
              {loading ? "—" : value}
            </div>
          </div>
        ))}
      </div>

      {/* Rank Guide Modal */}
      {showRankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-slideUp">
            <button
              onClick={() => setShowRankModal(false)}
              className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors duration-150 p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-[17px] font-bold text-white mb-1 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-white/40" /> Rank System Guide
            </h3>
            <p className="text-[13px] text-white/40 mb-5 leading-relaxed">
              Earn XP by participating in the community. Attending events grants{" "}
              <span className="text-white/70 font-semibold">10 XP</span>, while hosting grants{" "}
              <span className="text-white/70 font-semibold">50 XP</span>.
            </p>

            <div className="space-y-2">
              {[
                { name: "Freshman",      icon: "🥉", range: "0 – 49 XP",    color: "text-amber-500",  bg: "bg-amber-500/6",  border: "border-amber-500/12" },
                { name: "Sophomore",     icon: "🥈", range: "50 – 99 XP",   color: "text-zinc-300",   bg: "bg-white/4",      border: "border-white/8" },
                { name: "Junior",        icon: "🥇", range: "100 – 249 XP", color: "text-amber-400",  bg: "bg-amber-400/6",  border: "border-amber-400/12" },
                { name: "Senior",        icon: "🌟", range: "250 – 499 XP", color: "text-[#C084FC]",  bg: "bg-[#A855F7]/6",  border: "border-[#A855F7]/12" },
                { name: "Campus Legend", icon: "👑", range: "500+ XP",      color: "text-emerald-400",bg: "bg-emerald-500/6",border: "border-emerald-500/12" },
              ].map((r) => (
                <div key={r.name} className={`flex items-center justify-between p-3 rounded-xl border ${r.bg} ${r.border}`}>
                  <div className={`flex items-center gap-2 text-[13px] font-semibold ${r.color}`}>
                    <span className="text-base">{r.icon}</span> {r.name}
                  </div>
                  <span className="text-[12px] font-mono font-medium text-white/50">{r.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
