"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Calendar, Tag, Check, Terminal } from "lucide-react";
import RegisterModal from "../RegisterModal";

const INITIAL_MOCK_EVENTS = [
  {
    id: "cultural-fest",
    title: "Annual Cultural Fest 2026",
    category: "Fests",
    date: "June 20-22, 2026",
    registrations: 412,
    prizePool: "Trophies + $20k",
    desc: "Inter-college cultural showcase. Compete in street plays, battle of bands, classical dance, and fashion shows.",
    bannerUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "freshers-party",
    title: "Campus Freshers Welcome Party",
    category: "Parties",
    date: "July 15, 2026",
    registrations: 184,
    prizePool: "Awards & Sashes",
    desc: "Join us for the official welcome mixer for incoming freshers. Live music, food courts, and network games.",
    bannerUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "dandiya-night",
    title: "Grand Dandiya Festive Night 2026",
    category: "Festive Nights",
    date: "October 12, 2026",
    registrations: 256,
    prizePool: "Golden Dandiya Stick",
    desc: "Celebrate the festive season with traditional Garba, live orchestra, authentic food stalls, and prizes.",
    bannerUrl:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "ai-workshop",
    title: "Generative AI & LLM Workshop",
    category: "Workshops",
    date: "July 2, 2026",
    registrations: 98,
    prizePool: "API Credits",
    desc: "Learn prompt engineering, vector databases, embeddings, and building active AI agents with PyTorch.",
    bannerUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "entrepreneur-meetup",
    title: "Founder & Startup Meetup",
    category: "Meetups",
    date: "July 18, 2026",
    registrations: 74,
    prizePool: "Incubator Seats",
    desc: "Connect with startup founders, exchange ideas, and network with active angel mentors and VC investors.",
    bannerUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "hackathon-2026",
    title: "Campus Innovation Hackathon 2026",
    category: "Hackathons",
    date: "June 20-22, 2026",
    registrations: 145,
    prizePool: "$50,000",
    desc: "Build functional prototypes, join projects teams, and pitch ideas directly to ecosystem VC funds.",
    bannerUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60",
  },
];

export default function EventMatrixPreview() {
  const [events, setEvents] = useState(INITIAL_MOCK_EVENTS);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const categories = [
    "All",
    "Fests",
    "Parties",
    "Festive Nights",
    "Workshops",
    "Meetups",
    "Hackathons",
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchUserRegistrations = async () => {
      const userEmail = localStorage.getItem("user_session") || "";
      if (userEmail) {
        try {
          const res = await fetch(`/api/registrations?email=${userEmail}`);
          const data = await res.json();
          if (data.success && isMounted) {
            setRegisteredEventIds(data.registrations.map(r => r.eventId));
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchUserRegistrations();
    return () => { isMounted = false; };
  }, [modalOpen]);

  const handleOpenRegister = (ev) => {
    setSelectedEvent(ev);
    setModalOpen(true);
  };

  const handleRegisterSubmit = async (payload) => {
    if (!selectedEvent) return;
    try {
      if (registeredEventIds.includes(selectedEvent.id)) {
        alert("You are already registered for this event!");
        setModalOpen(false);
        return;
      }

      const userEmail = payload.email || localStorage.getItem("user_session");
      const res = await fetch(`/api/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          email: userEmail,
          eventId: selectedEvent.id,
          status: "Confirmed",
        }),
      });

      if (!res.ok) throw new Error("Failed to register");

      setEvents((prev) =>
        prev.map((e) =>
          e.id === selectedEvent.id
            ? { ...e, registrations: e.registrations + 1 }
            : e,
        ),
      );

      if (!localStorage.getItem("user_session")) {
        localStorage.setItem("user_session", userEmail);
        window.dispatchEvent(new Event("storage"));
      }

      setRegisteredEventIds((prev) => [...prev, selectedEvent.id]);
      setSuccessMessage(
        `✓ Registered successfully for ${selectedEvent.title}!`,
      );
      setTimeout(() => setSuccessMessage(""), 4000);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please check logs.");
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || ev.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-16 relative w-full border-t border-white/5 bg-zinc-950/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-neon-purple tracking-widest uppercase block neon-text-glow">
              Event Core
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
              Explore the Event Matrix
            </h2>
            <p className="text-xs text-gray-400 max-w-lg leading-normal">
              Browse and checkout tickets for upcoming hackathons, startup pitch
              panels, system dev sprints, and community drives.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 rounded-full border border-white/10 bg-black text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple font-mono"
            />
          </div>
        </div>

        {/* Category Filters row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? "bg-neon-purple text-white shadow-neon"
                  : "bg-zinc-900 text-gray-400 border border-white/5 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Event Booking Success Alert Banner */}
        {successMessage && (
          <div className="bg-green-950/20 border border-green-800/40 text-green-300 font-mono text-xs p-3 rounded-lg animate-fadeIn text-center">
            {successMessage}
          </div>
        )}

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((ev) => {
              const isRegistered = registeredEventIds.includes(ev.id);
              return (
                <motion.div
                  key={ev.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group flex flex-col overflow-hidden bg-zinc-900/40 border border-white/10 rounded-2xl hover:border-neon-purple/40 hover:shadow-[0_0_30px_rgba(191,64,255,0.05)] hover:scale-[1.01] transition-all duration-300 relative min-h-[380px]"
                >
                  {/* Event Card Banner Preview */}
                  <div className="relative h-36 w-full overflow-hidden bg-zinc-900 border-b border-white/5">
                    {ev.bannerUrl ? (
                      <img
                        src={ev.bannerUrl}
                        alt={ev.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-neon-purple/20 via-zinc-900 to-zinc-950 flex items-center justify-center font-mono text-[9px] text-neon-lavender">
                        CAMPUS EVENT PREVIEW
                      </div>
                    )}
                    {/* Category Tag overlaid on the banner */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-950/80 border border-white/10 text-gray-300 font-mono">
                        <Tag className="h-2.5 w-2.5 text-neon-purple" />{" "}
                        {ev.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 shrink-0" /> {ev.date}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-white leading-snug group-hover:text-neon-lavender transition-colors truncate">
                        {ev.title}
                      </h3>

                      <p className="text-[11px] text-gray-400 leading-normal line-clamp-3">
                        {ev.desc}
                      </p>

                      {/* Metadata tags grid */}
                      <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono border-t border-white/5 text-gray-500">
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-gray-600">
                            Prize Pool
                          </span>
                          <span className="text-white font-bold">
                            {ev.prizePool}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-gray-600">
                            Registrations
                          </span>
                          <span className="text-white font-bold">
                            {ev.registrations} secured
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions footer */}
                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5 mt-auto">
                      <Link
                        href={`/event?id=${ev.id}`}
                        className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                      >
                        View Details
                      </Link>

                      {isRegistered ? (
                        <span className="inline-flex items-center gap-1 px-4 py-2 bg-green-950/40 text-green-400 border border-green-800/40 text-[10px] font-extrabold tracking-wider uppercase rounded-full font-mono">
                          <Check className="h-3 w-3" /> Registered
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenRegister(ev)}
                          className="px-4 py-2 bg-neon-purple text-white text-[10px] font-extrabold tracking-wider uppercase rounded-full hover:bg-neon-purple/90 transition-all cursor-pointer"
                        >
                          Secure Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state if nothing matches filters */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-zinc-950/20 border border-white/5 rounded-2xl font-mono text-xs text-gray-500 space-y-2">
            <Terminal className="h-6 w-6 text-neon-purple mx-auto animate-pulse" />
            <p>No active event matching the current queries in matrix space.</p>
          </div>
        )}

        {/* Register Modal instance */}
        <RegisterModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleRegisterSubmit}
        />
      </div>
    </section>
  );
}
