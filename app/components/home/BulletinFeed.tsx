'use client';

import { motion } from 'framer-motion';
import { Bell, Terminal } from 'lucide-react';

export default function BulletinFeed() {
  const items = [
    { text: "🤖 AI & LLM Workshop: Student check-in opens in 1 hour", time: "Just now", type: "system" },
    { text: "🤝 Dandiya Festive Night: Entry gates open at 6:00 PM", time: "12m ago", type: "event" },
    { text: "🚀 Cultural Fest: Stage rehearsals scheduled for Main Arena", time: "35m ago", type: "active" },
    { text: "📚 Founder Meetup: Networking session registrations closing soon", time: "1h ago", type: "system" },
    { text: "🏆 Awards Room: Cultural Fest contest winner guest list posted", time: "2h ago", type: "event" },
  ];

  // Duplicate the list twice to create a seamless infinite scrolling list
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <section className="py-16 relative w-full border-t border-white/5 bg-zinc-950/20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-neon-purple tracking-widest uppercase block neon-text-glow">Live Feed</span>
          <h2 className="text-3xl font-black text-white tracking-tight sm:text-4xl">Campus Broadcast Bulletins</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-normal">
            A simulated live-feed of official organizer updates, timeline announcements, and log entries as they are broadcasted.
          </p>
        </div>

        {/* Scrolling Window Glass Container */}
        <div className="relative bg-zinc-950/60 border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(191,64,255,0.02)] backdrop-blur-xl max-w-2xl mx-auto overflow-hidden h-72 flex flex-col">
          
          {/* Header controls */}
          <div className="flex justify-between items-center pb-4 border-b border-white/5 z-10 bg-zinc-950/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
              <Bell className="h-4 w-4 text-neon-purple animate-pulse" />
              <span>LIVE_BULLETINS.LOG</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>

          {/* Scrolling area */}
          <div className="flex-1 relative mt-4 overflow-hidden mask-vertical-gradient">
            <motion.div
              animate={{ y: [0, -380] }} // Adjust value based on list items height to match scroll loop
              transition={{
                ease: "linear",
                duration: 25,
                repeat: Infinity
              }}
              className="space-y-4 pt-2 pb-12 cursor-default select-none"
            >
              {duplicatedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-neon-purple/20 hover:bg-white/10 transition-all font-mono text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Terminal className="h-3.5 w-3.5 text-neon-purple shrink-0" />
                    <span className="text-gray-300 tracking-tight leading-relaxed">{item.text}</span>
                  </div>
                  <span className="text-[9px] text-gray-500 shrink-0 font-bold uppercase">{item.time}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Vertical fading gradients overlay */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 top-14 h-10 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-10" />

        </div>

      </div>
    </section>
  );
}
