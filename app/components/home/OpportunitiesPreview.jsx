"use client";

import { Briefcase, MapPin, DollarSign, ExternalLink } from "lucide-react";

export default function OpportunitiesPreview() {
  const items = [
    {
      badge: "Internship",
      badgeClass: "bg-[#A855F7]/10 text-[#C084FC] border-[#A855F7]/20",
      rate: "₹20/hr",
      title: "Frontend Developer Intern",
      company: "NeonTech Labs",
      location: "Remote",
    },
    {
      badge: "Bounty",
      badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      rate: "₹500 - ₹2000",
      title: "Smart Contract Auditing Bounty",
      company: "DeFi Protocols",
      location: "Remote",
    },
  ];

  return (
    <section className="py-12 relative w-full border-t border-white/6">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-2 max-w-lg mx-auto mb-8">
          <span className="section-label">Career Catalyst</span>
          <h2 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Exclusive Work Opportunities
          </h2>
          <p className="text-[13px] text-white/45 leading-relaxed">
            Access curated internships, high-paying freelance gigs, and project
            bounties directly from top tech partners.
          </p>
        </div>

        {/* Opportunities Board Mockup */}
        <div className="max-w-4xl mx-auto bg-[#111111] border border-white/8 rounded-xl shadow-sm overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0A0A0A] border-b border-white/6">
            <Briefcase className="h-3.5 w-3.5 text-white/30" />
            <span className="text-[11px] font-mono font-semibold text-white/40 tracking-wider">
              OPPORTUNITIES_BOARD
            </span>
          </div>

          <div className="p-4 grid gap-3">
            {items.map((item) => (
              <div
                key={item.title}
                className="bg-[#0A0A0A] border border-white/6 hover:border-white/14 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-150 hover:-translate-y-px hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400/80 flex items-center gap-0.5">
                      <DollarSign className="h-3 w-3" /> {item.rate}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white">{item.title}</h3>
                  <p className="text-[12px] text-white/40 font-medium">{item.company}</p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/35">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <button className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#A855F7] border border-white/10 hover:border-[#A855F7] text-white/70 hover:text-white text-[11px] font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-150">
                    Apply <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
