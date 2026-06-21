"use client";

import { motion } from "framer-motion";
import { Volume2, Users, FileCheck, ShieldAlert } from "lucide-react";

export default function FeatureGrid() {
  const features = [
    {
      title: "Zero-Noise Feeds",
      desc: "Only official organizer logistics. No endless spam, no noise. Just direct event updates.",
      icon: Volume2,
      tag: "LOGISTICS",
    },
    {
      title: "Work Opportunities",
      desc: "Find internships, freelance gigs, and project bounties directly from top tech partners and startups.",
      icon: Users,
      tag: "CAREER",
    },
    {
      title: "Instant Registration",
      desc: "Reserve event tickets in seconds with unified local check-in credentials. No external forms or redirections.",
      icon: FileCheck,
      tag: "TICKETING",
    },
    {
      title: "Student Profile Logs",
      desc: "Maintain a persistent student profile carrying your club affiliations, major department, and event history.",
      icon: ShieldAlert,
      tag: "PROFILE",
    },
  ];

  return (
    <section className="py-16 relative w-full border-t border-white/5 bg-zinc-950/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
        {/* Title Block */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-neon-purple tracking-widest uppercase block neon-text-glow">
            Engineered Core
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
            Platform Architecture
          </h2>
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-normal">
            Every feature is designed to cut out administrative friction so you
            can focus on attending activities, joining clubs, and experiencing
            fests.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative bg-zinc-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-neon-purple/40 hover:shadow-[0_0_30px_rgba(191,64,255,0.05)] transition-all duration-300 overflow-hidden"
              >
                {/* Glowing subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="space-y-4">
                  {/* Icon and tag */}
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-neon-purple bg-neon-purple/5 border border-neon-purple/20 px-2.5 py-0.5 rounded-full">
                      {feat.tag}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-neon-purple group-hover:border-neon-purple/30 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-white leading-snug">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                {/* Animated corner decorations */}
                <div className="absolute top-0 right-0 w-8 h-[1px] bg-gradient-to-r from-transparent to-neon-purple/30 group-hover:to-neon-purple/80 transition-all duration-300" />
                <div className="absolute top-0 right-0 w-[1px] h-8 bg-gradient-to-b from-transparent to-neon-purple/30 group-hover:to-neon-purple/80 transition-all duration-300" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
