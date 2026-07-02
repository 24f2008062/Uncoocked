"use client";

import { motion } from "framer-motion";
import { Volume2, Users, FileCheck, ShieldAlert } from "lucide-react";

export default function FeatureGrid() {
  const features = [
    {
      title: "Zero-Noise Feeds",
      desc: "Only official organizer logistics. No endless spam, no noise. Just direct event updates.",
      icon: Volume2,
      tag: "Logistics",
    },
    {
      title: "Work Opportunities",
      desc: "Find internships, freelance gigs, and project bounties directly from top tech partners and startups.",
      icon: Users,
      tag: "Career",
    },
    {
      title: "Instant Registration",
      desc: "Reserve event tickets in seconds with unified local check-in credentials. No external forms or redirections.",
      icon: FileCheck,
      tag: "Ticketing",
    },
    {
      title: "Student Profile Logs",
      desc: "Maintain a persistent student profile carrying your club affiliations, major department, and event history.",
      icon: ShieldAlert,
      tag: "Profile",
    },
  ];

  return (
    <section className="py-12 relative w-full border-t border-white/6">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-8">
        {/* Title Block */}
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <span className="section-label">Engineered Core</span>
          <h2 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Platform Architecture
          </h2>
          <p className="text-[13px] text-white/45 leading-relaxed">
            Every feature is designed to cut out administrative friction so you
            can focus on attending activities, joining clubs, and experiencing
            fests.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-[#111111] border border-white/8 rounded-xl p-5 flex flex-col justify-between hover:border-white/16 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
              >
                <div className="space-y-3">
                  {/* Tag and icon */}
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium tracking-wide text-white/40 bg-white/5 border border-white/8 px-2.5 py-0.5 rounded-full">
                      {feat.tag}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/6 flex items-center justify-center text-white/35">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  <h3 className="text-[16px] font-semibold text-white leading-snug">
                    {feat.title}
                  </h3>

                  <p className="text-[12px] text-white/45 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
