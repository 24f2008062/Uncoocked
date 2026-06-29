"use client";

import { motion } from "framer-motion";
import { Users, Calendar, Award, CheckCircle } from "lucide-react";

import CountUp from "../CountUp";

export default function Metrics() {
  const stats = [
    {
      id: 1,
      name: "Students Online",
      value: 1240,
      suffix: "+",
      icon: Users,
      desc: "Active campus students & attendees",
    },
    {
      id: 2,
      name: "Active Events",
      value: 52,
      suffix: "",
      icon: Calendar,
      desc: "Fests, workshops, dandiya nights & hackathons",
    },
    {
      id: 3,
      name: "Clubs Active",
      value: 148,
      suffix: "",
      icon: Award,
      desc: "Student clubs and societies active",
    },
    {
      id: 4,
      name: "Registrations",
      value: 8900,
      suffix: "+",
      icon: CheckCircle,
      desc: "Total bookings & entries saved",
    },
  ];

  return (
    <section className="pt-10 pb-2 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Animated staggered layout */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative bg-zinc-950/40 border border-white/10 rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl hover:border-neon-purple/40 hover:shadow-[0_0_30px_rgba(191,64,255,0.1)] transition-all duration-300 overflow-hidden"
              >
                {/* Decorative border neon gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 to-neon-lavender/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="flex items-center justify-between pb-3">
                  <span className="text-[10px] uppercase font-bold text-gray-500 font-mono tracking-widest">
                    {stat.name}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple group-hover:scale-110 transition-transform">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <div className="text-3xl font-black text-white tracking-tight font-mono">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    {stat.desc}
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
