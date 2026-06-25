"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Terminal, Zap, Users } from "lucide-react";
import CountUp from "../CountUp";

export default function Hero() {
  return (
    <section className="relative overflow-hidden w-full py-16 sm:py-24">
      {/* Visual background grids & lights */}
      <motion.div 
        animate={{ backgroundPosition: ["0px 0px", "64px 64px"] }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#0f0f15_1px,transparent_1px),linear-gradient(to_bottom,#0f0f15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" 
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text / Actions Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-neon-purple/10 text-neon-lavender border border-neon-purple/30 shadow-neon">
                ⚡ The Event Discovery Platform for Lucknow
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-none">
                Discover{" "}
                <span className="bg-gradient-to-r from-neon-purple via-neon-lavender to-neon-purple bg-clip-text text-transparent neon-text-glow">
                  Fests
                </span>
                . Attend{" "}
                <span className="bg-gradient-to-r from-neon-purple via-neon-lavender to-neon-purple bg-clip-text text-transparent neon-text-glow">
                  Parties
                </span>
                . Host{" "}
                <span className="bg-gradient-to-r from-neon-purple via-neon-lavender to-neon-purple bg-clip-text text-transparent neon-text-glow">
                  Workshops
                </span>
                .
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-gray-400 max-w-2xl mx-auto lg:mx-0">
                Join campus fests, hackathons, startup meetups, and cultural events exclusively in Lucknow. Coordinate in noise-free channels and book tickets instantly.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0px 0px 0px 0px rgba(191,64,255,0.7)",
                    "0px 0px 30px 15px rgba(191,64,255,0)",
                  ]
                }}
                transition={{ boxShadow: { repeat: Infinity, duration: 2 }, scale: { duration: 0.2 } }}
                className="w-full sm:w-auto rounded-full"
              >
                <Link
                  href="/event"
                  className="block w-full text-center rounded-full bg-neon-purple text-white px-8 py-4 text-xs font-extrabold tracking-wider uppercase transition-colors"
                >
                  Explore Events
                </Link>
              </motion.div>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto text-center rounded-full border border-white/10 bg-zinc-900/40 hover:bg-white/5 text-white px-8 py-4 text-xs font-extrabold tracking-wider uppercase transition-all"
              >
                Launch Event
              </Link>
            </motion.div>

            {/* Micro Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-6 border-t border-white/5 flex flex-wrap justify-center lg:justify-start gap-8 text-xs font-mono text-gray-500"
            >
              <div>
                <span className="block text-white font-extrabold text-lg">
                  <CountUp end={8900} suffix="+" />
                </span>
                Registrations
              </div>
              <div className="w-[1px] bg-white/10 self-stretch" />
              <div>
                <span className="block text-white font-extrabold text-lg">
                  <CountUp end={1200} suffix="+" />
                </span>
                Students Active
              </div>
              <div className="w-[1px] bg-white/10 self-stretch" />
              <div>
                <span className="block text-white font-extrabold text-lg">
                  <CountUp end={50} suffix="+" />
                </span>
                Campus Events
              </div>
            </motion.div>
          </div>

          {/* Right Floating Dashboard Column */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-sm"
            >
              {/* Decorative background glows */}
              <div className="absolute inset-0 bg-neon-purple/10 rounded-3xl filter blur-3xl opacity-50 -z-10" />

              {/* Main glass frame wrapper */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full bg-zinc-950/80 border border-white/10 rounded-3xl p-5 shadow-[0_0_40px_rgba(191,64,255,0.08)] backdrop-blur-xl font-mono text-[10px] space-y-4 text-left"
              >
                {/* Header controls bar */}
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">
                    CAMPUS_CONSOLE_v1.0
                  </span>
                </div>

                {/* Grid values */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Card: Active Students */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-1 hover:border-neon-purple/30 transition-colors">
                    <div className="flex items-center justify-between text-gray-500">
                      <span>ACTIVE_STUDENTS</span>
                      <Users className="h-3.5 w-3.5 text-neon-purple" />
                    </div>
                    <div className="text-base font-black text-white">
                      <CountUp end={482} />{" "}
                      <span className="text-[8px] text-green-400 font-normal">
                        ● LIVE
                      </span>
                    </div>
                  </div>

                  {/* Card: Upcoming Events */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-1 hover:border-neon-purple/30 transition-colors">
                    <div className="flex items-center justify-between text-gray-500">
                      <span>UPCOMING_EVENTS</span>
                      <Zap className="h-3.5 w-3.5 text-neon-purple" />
                    </div>
                    <div className="text-base font-black text-white">
                      <CountUp end={12} />{" "}
                      <span className="text-[8px] text-gray-400 font-normal">
                        RUNNING
                      </span>
                    </div>
                  </div>

                  {/* Card: Clubs Active */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-1 hover:border-neon-purple/30 transition-colors">
                    <div className="flex items-center justify-between text-gray-500">
                      <span>CLUBS_ACTIVE</span>
                      <Play className="h-3.5 w-3.5 text-neon-purple" />
                    </div>
                    <div className="text-base font-black text-white">
                      <CountUp end={34} />{" "}
                      <span className="text-[8px] text-neon-lavender font-normal">
                        ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Card: Live Registrations */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-1 hover:border-neon-purple/30 transition-colors">
                    <div className="flex items-center justify-between text-gray-500">
                      <span>REGISTRATIONS</span>
                      <Terminal className="h-3.5 w-3.5 text-neon-purple" />
                    </div>
                    <div className="text-base font-black text-white">
                      <CountUp end={2842} />{" "}
                      <span className="text-[8px] text-neon-purple font-normal">
                        TOTAL
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub log printout terminal window */}
                <div className="bg-black/60 border border-white/5 rounded-xl p-3.5 h-24 overflow-hidden flex flex-col justify-end space-y-1 text-gray-400">
                  <div className="text-neon-lavender">
                    &gt;&gt; Loading campus sync pipeline...
                  </div>
                  <div>
                    &gt;&gt; 👤 student_mikey registered for Dandiya Night
                  </div>
                  <div>&gt;&gt; 🚀 Cultural Club registered Annual Fest</div>
                  <div className="text-green-400">
                    &gt;&gt; ✓ Synchronization successful. State persisted.
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
