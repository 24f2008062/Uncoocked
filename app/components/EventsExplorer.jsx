"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Calendar, MapPin, ArrowRight } from "lucide-react";
import { LUCKNOW_ZONES } from "@/app/config/cities";

export const mockEvents = [
  {
    id: "cultural-fest",
    bannerUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60",
    title: "Annual Cultural Fest 2026",
    type: "Fest",
    date: "June 20-22, 2026",
    location: "Main Campus Arena",
    description:
      "Inter-college cultural showcase. Compete in street plays, battle of bands, classical dance, and fashion shows.",
    schedule: `
## Day 1 - Friday, June 20
- **9:00 AM** - Registration & Inauguration Ceremony
- **11:00 AM** - Folk Dance & Street Play Rounds
- **6:00 PM** - Classical Music Solos

## Day 2 - Saturday, June 21
- **10:00 AM** - Choreography & Western Dance Rounds
- **2:00 PM** - Fine Arts & Poetry Slams
- **7:00 PM** - DJ Night & Rock Band Prelims

## Day 3 - Sunday, June 22
- **11:00 AM** - Fashion Show Finale
- **3:00 PM** - Celebrity Guest Performance
- **5:00 PM** - Valedictory & Awards Distribution
    `,
    prizePool: `
## Total Prizes: $20,000 + Trophies
- **🥇 Best Cultural Contingent** - Trophy + $5,000
- **🥈 Runner-up College** - Trophy + $3,000
- **🎭 Best Street Play Crew** - $2,000
- **🎸 Battle of Bands Winner** - $3,000
    `,
    bulletinUpdates: [
      {
        id: "u1",
        date: "2026-06-16",
        title: "Registration Deadline Extended!",
        content: "Contingent registration is open until June 18th.",
      },
      {
        id: "u2",
        date: "2026-06-15",
        title: "Celebrity Guest Confirmed",
        content:
          "Rock star VIP guest lineup is locked for the final night performance!",
      },
    ],
    ticketType: "Paid",
    price: 49.99,
    capacity: 2000,
    waitlistEnabled: true,
  },
  {
    id: "freshers-party",
    bannerUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=60",
    title: "Campus Freshers Welcome Party",
    type: "Party",
    date: "July 15, 2026",
    location: "Campus Green Lawn",
    description:
      "Join us for the official welcome mixer for incoming freshers. Live music, food courts, and network games.",
    schedule: `
## Day 1 - Wednesday, July 15
- **5:00 PM** - Entry & Freshers Identity Kit distribution
- **6:00 PM** - Principal Welcoming Address
- **6:30 PM** - Freshers Talent Hunt & Icebreakers
- **8:00 PM** - DJ Set & Dinner Buffet opens
    `,
    prizePool: `
## Awards & Freshers Titles
- **👑 Mr. & Ms. Fresher 2026** - $1,000 Gift Vouchers + Sash
- **🌟 Best Talent Performer** - $500 Voucher
    `,
    bulletinUpdates: [
      {
        id: "u3",
        date: "2026-06-16",
        title: "Dress Code Announced",
        content: "The theme is Retro Neon. Come dressed in neon colors!",
      },
    ],
    ticketType: "Free",
    capacity: 1500,
    waitlistEnabled: false,
  },
  {
    id: "dandiya-night",
    bannerUrl:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=60",
    title: "Grand Dandiya Festive Night 2026",
    type: "Festive Night",
    date: "October 12, 2026",
    location: "Auditorium Hall, Main Campus",
    description:
      "Celebrate the festive season with traditional Garba, live orchestra, authentic food stalls, and prizes.",
    schedule: `
## Day 1 - Monday, Oct 12
- **6:00 PM** - Entry gates open & Dandiya sticks pickup
- **6:30 PM** - Traditional Aarti & Diya Lighting
- **7:00 PM** - Garba Circle 1 Begins
- **9:00 PM** - Traditional Food Court Open
- **11:00 PM** - Dandiya Dance Awards Ceremony
    `,
    prizePool: `
## Festive Dress & Dance Awards
- **🥇 Best Dancer (Male & Female)** - $1,000 each + Golden Dandiya Stick
- **👗 Best Traditional Dress** - $1,000 Voucher
    `,
    bulletinUpdates: [],
    ticketType: "Paid",
    price: 15.0,
    capacity: 500,
    waitlistEnabled: true,
  },
  {
    id: "ai-workshop",
    bannerUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=60",
    title: "Generative AI & LLM Workshop",
    type: "Workshop",
    date: "July 2, 2026",
    location: "Tech Lab 102, Main Campus",
    description:
      "Learn prompt engineering, vector databases, embeddings, and building active AI agents with PyTorch.",
    schedule: `
## Day 1 - Thursday, July 2
- **10:00 AM** - Introduction to Transformers & LLMs
- **12:00 PM** - Vector Database Setup (Pinecone/Chroma)
- **2:00 PM** - Building an AI Agent from Scratch
- **4:00 PM** - API keys distribution & sandbox trials
    `,
    prizePool: `
## Certificate & Compute Credits
- Certified completion certificates for all registered student attendees.
- $200 in OpenAI sandbox API credits.
    `,
    bulletinUpdates: [],
    ticketType: "Free",
    capacity: 2, // Very low capacity to test waitlist logic easily
    waitlistEnabled: true,
  },
  {
    id: "entrepreneur-meetup",
    bannerUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=60",
    title: "Founder & Startup Meetup",
    type: "Meetup",
    date: "July 18, 2026",
    location: "Incubation Center, Campus",
    description:
      "Connect with startup founders, exchange ideas, and network with active angel mentors and VC investors.",
    schedule: `
## Day 1 - Saturday, July 18
- **2:00 PM** - Networking & Coffee Mixer
- **3:00 PM** - Panel: Fundraising in College
- **4:30 PM** - 60-second Elevator Pitch Round
- **6:00 PM** - Open Networking Mixer
    `,
    prizePool: `
## Incubator Fast-Track & Mentorship
- Top 3 student startup pitches win 6-month free incubator seats.
- Direct mentoring sessions with ecosystem venture capitalists.
    `,
    bulletinUpdates: [],
    ticketType: "Paid",
    price: 5.0,
    capacity: 50,
    waitlistEnabled: false,
  },
  {
    id: "hackathon-2026",
    bannerUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60",
    title: "Campus Innovation Hackathon 2026",
    type: "Hackathon",
    date: "June 20-22, 2026",
    location: "Tech Hub Building, Main Campus",
    description:
      "Build prototypes, join project teams, and pitch ideas for a $50k prize pool. All skill levels welcome.",
    schedule: `
## Day 1 - Friday, June 20
- **9:00 AM** - Registration & Breakfast
- **10:00 AM** - Opening Keynote
- **11:00 AM** - Team Formation & Hackathon Begins

## Day 2 - Saturday, June 21
- **8:00 AM** - Breakfast & Hacking Continues
- **3:00 PM** - Mentor Office Hours

## Day 3 - Sunday, June 22
- **12:00 PM** - Hacking Ends
- **2:00 PM** - Project Presentations
- **4:00 PM** - Judging & Awards Ceremony
    `,
    prizePool: `
## Total Prize Pool: $50,000
- **🥇 First Place** - $15,000
- **🥈 Second Place** - $10,000
- **🥉 Third Place** - $5,000
- **Category Winners** - $5,000 each (Mobile, AI/ML, Design)
    `,
    bulletinUpdates: [
      {
        id: "u4",
        date: "2026-06-16",
        title: "Hackathon Registration Now Open!",
        content: "Team registration is now live. Sign up by June 18th.",
      },
      {
        id: "u5",
        date: "2026-06-15",
        title: "Mentor List Released",
        content: "Meet our amazing panel of mentors from top tech companies.",
      },
    ],
    ticketType: "Free",
    capacity: 300,
    waitlistEnabled: true,
  },
];



export default function EventsExplorer({
  events,
  searchQuery,
  onSearchChange,
  onSelectEvent,
}) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeZone, setActiveZone] = useState("All");

  // Extract unique categories from events
  const categories = useMemo(() => {
    const types = new Set(events.map((e) => e.type));
    return ["All", ...Array.from(types)];
  }, [events]);

  // Filter events based on search query, category, and zone in real-time
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCategory =
        activeCategory === "All" || ev.type === activeCategory;
      const matchZone =
        activeZone === "All" || ev.zone === activeZone;
      const matchText = searchQuery.toLowerCase().trim();
      const matchSearch =
        ev.title.toLowerCase().includes(matchText) ||
        ev.type.toLowerCase().includes(matchText) ||
        ev.description.toLowerCase().includes(matchText) ||
        ev.location.toLowerCase().includes(matchText) ||
        (ev.zone && ev.zone.toLowerCase().includes(matchText));
      return matchCategory && matchZone && matchSearch;
    });
  }, [events, searchQuery, activeCategory, activeZone]);

  // Framer Motion staggered transition configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 15,
      },
    },
  };

  const getTypeStyle = (type) => {
    switch (type.toLowerCase()) {
      case "hackathon":
        return "bg-neon-purple/10 text-neon-lavender border border-neon-purple/30 shadow-neon";
      case "fest":
        return "bg-pink-950/40 text-pink-400 border border-pink-800/40";
      case "party":
        return "bg-purple-950/40 text-purple-400 border border-purple-800/40";
      case "festive night":
        return "bg-yellow-950/40 text-yellow-400 border border-yellow-800/40";
      case "meetup":
        return "bg-blue-950/40 text-blue-400 border border-blue-800/40";
      case "workshop":
        return "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40";
      default:
        return "bg-zinc-800/60 text-zinc-300 border border-dark-border";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-dark-border pb-8">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl neon-text-glow">
            Event Matrix
          </h1>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
            Discover active coding hackathons, security CTF challenges, business
            ideathons, and legislative debates.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Create Event Button */}
          <button
              onClick={() => router.push("/dashboard/organizer/new")}
              className="px-6 py-2 bg-neon-purple text-white text-xs font-bold rounded-lg hover:bg-neon-purple/90 transition-all shadow-neon whitespace-nowrap"
          >
            <span className="text-base leading-none mb-[2px]">+</span> Host
            Event
          </button>

          {/* Integrated Search Bar */}
          <div className="w-full sm:w-80 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search events, types, keywords..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-950/50 border border-dark-border rounded-xl text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple backdrop-blur-md transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filter Row: Categories and Zone Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-xs transition-all whitespace-nowrap ${
                activeCategory === category
                  ? "bg-neon-purple text-white shadow-neon"
                  : "bg-zinc-900/50 text-gray-400 hover:text-white hover:bg-zinc-800 border border-dark-border"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Zone Dropdown */}
        <div className="flex-shrink-0 self-start sm:self-auto relative">
          <select
            value={activeZone}
            onChange={(e) => setActiveZone(e.target.value)}
            className="appearance-none bg-zinc-900/50 text-gray-300 text-xs font-bold pl-4 pr-8 py-2 rounded-full border border-dark-border focus:outline-none focus:border-neon-purple hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <option value="All">All Zones</option>
            {LUCKNOW_ZONES.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
          {/* Custom Dropdown Arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Dynamic Grid of Cards */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-zinc-950/20 border border-dark-border rounded-2xl">
          <p className="text-sm">No campus events match your query.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {filteredEvents.map((ev) => (
            <motion.div
              key={ev.id}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                y: -4,
              }}
              className="group flex flex-col overflow-hidden bg-zinc-950/50 backdrop-blur-md border border-dark-border hover:border-neon-purple hover:shadow-[0_0_20px_rgba(191,64,255,0.3)] rounded-2xl transition-all duration-300 min-h-[340px] shadow-sm"
            >
              {/* Event Card Banner Preview */}
              <div className="relative h-32 w-full overflow-hidden bg-zinc-900 border-b border-dark-border/40">
                {ev.bannerUrl ? (
                  <img
                    src={ev.bannerUrl}
                    alt={ev.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-neon-purple/20 via-zinc-900 to-zinc-950 flex items-center justify-center p-4 text-center">
                    <span className="font-black text-lg text-white/90 neon-text-glow leading-snug line-clamp-2 tracking-wide">
                      {ev.title}
                    </span>
                  </div>
                )}
                {/* Category Tag overlaid on the banner */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${getTypeStyle(ev.type)}`}
                  >
                    {ev.type}
                  </span>
                </div>
              </div>

              {/* Card Content Details */}
              <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center gap-4 text-[10px] text-gray-500 font-mono">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-neon-purple shrink-0" />
                      <span className="truncate max-w-[140px]">
                        {ev.zone ? ev.zone : ev.location.split(",")[0]}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-extrabold text-white group-hover:text-neon-lavender transition-colors duration-200 leading-snug line-clamp-1">
                    {ev.title}
                  </h3>

                  <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                    {ev.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-dark-border/40 pt-4 mt-auto">
                  <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[10px]">
                    <Calendar className="h-3.5 w-3.5 text-neon-purple shrink-0" />
                    <span>{ev.date}</span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectEvent(ev.id);
                    }}
                    className="inline-flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg bg-neon-purple text-white hover:bg-neon-purple/90 font-bold transition-all shadow-neon hover:scale-[1.03] active:scale-[0.97]"
                  >
                    View Details
                    <ArrowRight className="h-3 w-3 shrink-0" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
