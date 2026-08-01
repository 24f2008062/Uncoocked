"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Award, CheckCircle } from "lucide-react";
import CountUp from "@/app/components/ui/CountUp";

export default function Metrics() {
  const [counts, setCounts] = useState({
    students: 0,
    activeEvents: 0,
    clubs: 0,
    registrations: 0,
  });

  useEffect(() => {
    let isMounted = true;
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats && isMounted) {
          setCounts(data.stats);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      id: 1,
      name: "Students Registered",
      value: counts.students,
      suffix: "",
      icon: Users,
      desc: "Verified campus students",
    },
    {
      id: 2,
      name: "Active Events",
      value: counts.activeEvents,
      suffix: "",
      icon: Calendar,
      desc: "Upcoming fests, workshops & hackathons",
    },
    {
      id: 3,
      name: "Clubs & Societies",
      value: counts.clubs,
      suffix: "",
      icon: Award,
      desc: "Active student clubs & organizations",
    },
    {
      id: 4,
      name: "Total Registrations",
      value: counts.registrations,
      suffix: "",
      icon: CheckCircle,
      desc: "Verified event registrations",
    },
  ];

  return (
    <section className="pt-12 pb-4 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: [0, 0, 0.2, 1] }}
                className="group relative bg-[#111111] border border-white/8 rounded-xl p-6 shadow-sm hover:border-white/16 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
              >
                <div className="flex items-center justify-between pb-3">
                  <span className="text-[11px] uppercase font-semibold text-white/40 tracking-wider">
                    {stat.name}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/30">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="space-y-1 mt-1">
                  <div className="text-3xl font-bold text-white tracking-tight">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-[12px] text-white/40 leading-normal">
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
