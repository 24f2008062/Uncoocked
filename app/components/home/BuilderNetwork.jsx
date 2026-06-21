"use client";

import { motion } from "framer-motion";
import { Cpu, Layout, Server, Brain, Palette, Briefcase } from "lucide-react";

export default function BuilderNetwork() {
  const leftNodes = [
    {
      name: "CS & Tech",
      count: 340,
      icon: Layout,
      color: "text-blue-400",
      desc: "Computers, Coding, IT",
    },
    {
      name: "Engineering",
      count: 290,
      icon: Server,
      color: "text-green-400",
      desc: "Mechanical, EEE, Applied",
    },
    {
      name: "Business",
      count: 420,
      icon: Cpu,
      color: "text-neon-purple",
      desc: "Finance, Marketing, Econ",
    },
  ];

  const rightNodes = [
    {
      name: "Liberal Arts",
      count: 210,
      icon: Brain,
      color: "text-yellow-400",
      desc: "Humanities, Literature",
    },
    {
      name: "Fine Arts",
      count: 180,
      icon: Palette,
      color: "text-pink-400",
      desc: "Design, Painting, Music",
    },
    {
      name: "Natural Sciences",
      count: 120,
      icon: Briefcase,
      color: "text-cyan-400",
      desc: "Physics, Chemistry, Bio",
    },
  ];

  return (
    <section className="py-16 relative w-full border-t border-white/5 bg-zinc-950/20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12 text-center relative">
        {/* Title */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold text-neon-purple tracking-widest uppercase block neon-text-glow">
            Campus Ecosystem
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
            The Unified Network
          </h2>
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-normal">
            We connect student attendees across active majors and branches of
            study to help societies discover talent, organize fests, and balance
            event check-ins.
          </p>
        </div>

        {/* Graphical Ecosystem Map */}
        <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 py-8">
          {/* Animated Flow Lines (Desktop Only) */}
          <div className="absolute inset-0 hidden md:block pointer-events-none -z-10">
            <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
              {/* Left connections */}
              <motion.path
                d="M 180 80 L 400 200"
                stroke="rgba(191, 64, 255, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                animate={{ strokeDashoffset: [-20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              <motion.path
                d="M 180 200 L 400 200"
                stroke="rgba(191, 64, 255, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                animate={{ strokeDashoffset: [-20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              <motion.path
                d="M 180 320 L 400 200"
                stroke="rgba(191, 64, 255, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                animate={{ strokeDashoffset: [-20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              {/* Right connections */}
              <motion.path
                d="M 620 80 L 400 200"
                stroke="rgba(191, 64, 255, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                animate={{ strokeDashoffset: [20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              <motion.path
                d="M 620 200 L 400 200"
                stroke="rgba(191, 64, 255, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                animate={{ strokeDashoffset: [20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              <motion.path
                d="M 620 320 L 400 200"
                stroke="rgba(191, 64, 255, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                animate={{ strokeDashoffset: [20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </div>

          {/* Left Column Nodes */}
          <div className="flex flex-col gap-6 w-full md:w-52 text-left z-10">
            {leftNodes.map((node, i) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.name}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5 hover:border-neon-purple/40 shadow-md group transition-all font-mono"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 ${node.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-extrabold text-white uppercase">
                      {node.name}
                    </span>
                    <span className="text-[9px] text-gray-500">
                      {node.count} students
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Central Hub Node */}
          <div className="relative flex items-center justify-center py-6">
            {/* Pulsing glow rings */}
            <div className="absolute w-36 h-36 rounded-full bg-neon-purple/5 border border-neon-purple/20 animate-ping opacity-70" />
            <div className="absolute w-44 h-44 rounded-full bg-neon-purple/5 border border-neon-purple/10 animate-pulse opacity-40" />

            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-32 h-32 rounded-full bg-black border-2 border-neon-purple flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(191,64,255,0.25)] select-none z-10"
            >
              <span className="text-xl">⚡</span>
              <span className="text-[10px] font-black tracking-widest text-white uppercase font-mono mt-1 leading-none">
                Campus
              </span>
              <span className="text-[10px] font-black tracking-widest text-white uppercase font-mono leading-none">
                Students
              </span>
              <span className="text-[8px] font-bold text-neon-lavender font-mono mt-1">
                1,240 CORE
              </span>
            </motion.div>
          </div>

          {/* Right Column Nodes */}
          <div className="flex flex-col gap-6 w-full md:w-52 text-left md:text-right z-10">
            {rightNodes.map((node, i) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.name}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 flex flex-row md:flex-row-reverse items-center gap-3.5 hover:border-neon-purple/40 shadow-md group transition-all font-mono"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 ${node.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-extrabold text-white uppercase">
                      {node.name}
                    </span>
                    <span className="text-[9px] text-gray-500">
                      {node.count} students
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
