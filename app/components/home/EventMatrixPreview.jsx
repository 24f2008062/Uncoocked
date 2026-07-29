"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const getTypeStyle = (type) => {
  switch (type?.toLowerCase()) {
    case "hackathon":
      return "bg-[#A855F7]/10 text-[#C084FC] border border-[#A855F7]/20";
    case "fest":
      return "bg-pink-500/10 text-pink-400 border border-pink-500/20";
    case "party":
      return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    case "festive night":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "meetup":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "workshop":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    default:
      return "bg-white/5 text-white/50 border border-white/10";
  }
};

export default function EventMatrixPreview() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadEvents = async () => {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        const data = await res.json();
        if (data.success && isMounted) {
          setEvents(
            (data.events || []).map((e) => ({
              ...e,
              desc: e.description || e.desc || "",
              date: fmtDate(e.date),
            }))
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadEvents();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="py-12 relative w-full border-t border-white/6">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-6">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="section-label">Event Core</span>
            <h2 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
              Explore the Event Matrix
            </h2>
            <p className="text-[13px] text-white/45 max-w-lg leading-relaxed">
              A quick glance at the upcoming hackathons, fests, workshops, and
              community drives happening around campus.
            </p>
          </div>

          <Link
            href="/event"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#A855F7] text-white text-[12px] font-semibold hover:bg-[#C084FC] hover:-translate-y-px transition-all duration-150 whitespace-nowrap"
          >
            View all events <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Events Grid — same card style as the Events page */}
        {events.length === 0 ? (
          <div className="text-center py-16 bg-[#111111] border border-white/6 rounded-xl text-[12px] text-white/30">
            No upcoming events right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((ev) => (
              <Link
                key={ev.id}
                href={`/event?id=${ev.id}`}
                className="group flex flex-col overflow-hidden bg-[#111111] border border-white/8 hover:border-white/16 rounded-xl transition-all duration-150 min-h-[300px] shadow-sm cursor-pointer"
              >
                {/* Banner */}
                <div className="relative h-28 w-full overflow-hidden bg-[#0A0A0A] border-b border-white/6">
                  {ev.bannerUrl ? (
                    <Image
                      src={ev.bannerUrl}
                      alt={ev.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center p-4 text-center">
                      <span className="font-bold text-sm text-white/50 leading-snug line-clamp-2">
                        {ev.title}
                      </span>
                    </div>
                  )}
                  {/* Type tag */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getTypeStyle(ev.type)}`}
                    >
                      {ev.type}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[140px]">
                        {ev.zone ? ev.zone : (ev.location || "").split(",")[0]}
                      </span>
                    </div>

                    <h3 className="text-[15px] font-bold text-white group-hover:text-white/80 transition-colors duration-150 leading-snug line-clamp-1">
                      {ev.title}
                    </h3>

                    <p className="text-[12px] text-white/45 leading-relaxed line-clamp-2">
                      {ev.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/6 pt-3 mt-auto">
                    <div className="flex items-center gap-1.5 text-white/40 font-mono text-[10px]">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span>{ev.date}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/60 group-hover:text-white transition-colors">
                      Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
