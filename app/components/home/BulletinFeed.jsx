"use client";

import { motion } from "framer-motion";
import { Bell, Terminal } from "lucide-react";

export default function BulletinFeed() {
  const items = [
    { text: "🤖 AI & LLM Workshop: Student check-in opens in 1 hour",         time: "Just now", type: "system" },
    { text: "🤝 Dandiya Festive Night: Entry gates open at 6:00 PM",           time: "12m ago",  type: "event" },
    { text: "🚀 Cultural Fest: Stage rehearsals scheduled for Main Arena",      time: "35m ago",  type: "active" },
    { text: "📚 Founder Meetup: Networking session registrations closing soon", time: "1h ago",   type: "system" },
    { text: "🏆 Awards Room: Cultural Fest contest winner guest list posted",   time: "2h ago",   type: "event" },
  ];

  const duplicatedItems = [...items, ...items, ...items];

  return (
    <section className="py-12 relative w-full border-t border-white/6">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <span className="section-label">Live Feed</span>
          <h2 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Campus Broadcast Bulletins
          </h2>
          <p className="text-[13px] text-white/45 max-w-md mx-auto leading-relaxed">
            A simulated live-feed of official organizer updates, timeline
            announcements, and log entries as they are broadcasted.
          </p>
        </div>

        {/* Bulletin Window */}
        <div className="relative bg-[#111111] border border-white/8 rounded-xl max-w-2xl mx-auto overflow-hidden h-64 flex flex-col shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-white/6 bg-[#111111] z-10">
            <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-white/60">
              <Bell className="h-3.5 w-3.5 text-white/30" />
              <span>LIVE_BULLETINS.LOG</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
          </div>

          {/* Scrolling area */}
          <div className="flex-1 relative overflow-hidden">
            <motion.div
              animate={{ y: [0, -380] }}
              transition={{ ease: "linear", duration: 28, repeat: Infinity }}
              className="space-y-2 pt-3 pb-12 px-4 cursor-default select-none"
            >
              {duplicatedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/3 border border-white/6 rounded-lg px-3 py-2.5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors duration-150 font-mono text-[11px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Terminal className="h-3 w-3 text-white/25 shrink-0" />
                    <span className="text-white/60 leading-relaxed">{item.text}</span>
                  </div>
                  <span className="text-[10px] text-white/30 shrink-0 font-medium">
                    {item.time}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Fade overlays */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#111111] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 top-[53px] h-8 bg-gradient-to-b from-[#111111] to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
}
