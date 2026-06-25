import { Activity } from "lucide-react";

export default function DashboardHeader({ username, attendingCount, hostedCount, loading }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-dark-border pb-8">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold bg-neon-purple/10 text-neon-lavender border border-neon-purple/30 shadow-neon">
          <Activity className="h-3 w-3 animate-pulse" /> Student Console
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl mt-3 capitalize">
          Welcome back, {username}!
        </h1>
        <p className="text-xs text-gray-400 mt-1 leading-normal">
          Manage your active event bookings, view details for hosted events,
          and post bulletin updates.
        </p>
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
    </div>
  );
}
