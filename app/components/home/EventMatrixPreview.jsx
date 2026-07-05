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
    prizePool: "Trophies + ₹20k",
    desc: "Inter-college cultural showcase. Compete in street plays, battle of bands, classical dance, and fashion shows.",
    bannerUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "freshers-party",
    title: "Campus Freshers Welcome Party",
    category: "Parties",
    date: "July 15, 2026",
    registrations: 184,
    prizePool: "Awards & Sashes",
    desc: "Join us for the official welcome mixer for incoming freshers. Live music, food courts, and network games.",
    bannerUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "dandiya-night",
    title: "Grand Dandiya Festive Night 2026",
    category: "Festive Nights",
    date: "October 12, 2026",
    registrations: 256,
    prizePool: "Golden Dandiya Stick",
    desc: "Celebrate the festive season with traditional Garba, live orchestra, authentic food stalls, and prizes.",
    bannerUrl: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "ai-workshop",
    title: "Generative AI & LLM Workshop",
    category: "Workshops",
    date: "July 2, 2026",
    registrations: 98,
    prizePool: "API Credits",
    desc: "Learn prompt engineering, vector databases, embeddings, and building active AI agents with PyTorch.",
    bannerUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "entrepreneur-meetup",
    title: "Founder & Startup Meetup",
    category: "Meetups",
    date: "July 18, 2026",
    registrations: 74,
    prizePool: "Incubator Seats",
    desc: "Connect with startup founders, exchange ideas, and network with active angel mentors and VC investors.",
    bannerUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "hackathon-2026",
    title: "Campus Innovation Hackathon 2026",
    category: "Hackathons",
    date: "June 20-22, 2026",
    registrations: 145,
    prizePool: "₹50,000",
    desc: "Build functional prototypes, join projects teams, and pitch ideas directly to ecosystem VC funds.",
    bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60",
  },
];

export default function EventMatrixPreview() {
  const [events, setEvents] = useState(INITIAL_MOCK_EVENTS);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const categories = ["All", "Fests", "Parties", "Festive Nights", "Workshops", "Meetups", "Hackathons"];

  useEffect(() => {
    let isMounted = true;
    const fetchUserRegistrations = async () => {
      const userEmail = localStorage.getItem("user_session") || "";
      if (userEmail) {
        try {
          const res = await fetch(`/api/registrations?email=${userEmail}`);
          const data = await res.json();
          if (data.success && isMounted) {
            setRegisteredEventIds(data.registrations.map((r) => r.eventId));
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
        body: JSON.stringify({ ...payload, email: userEmail, eventId: selectedEvent.id, status: "Confirmed" }),
      });

      if (!res.ok) throw new Error("Failed to register");

      setEvents((prev) =>
        prev.map((e) => e.id === selectedEvent.id ? { ...e, registrations: e.registrations + 1 } : e)
      );

      if (!localStorage.getItem("user_session")) {
        localStorage.setItem("user_session", userEmail);
        window.dispatchEvent(new Event("storage"));
      }

      setRegisteredEventIds((prev) => [...prev, selectedEvent.id]);
      setSuccessMessage(`✓ Registered successfully for ${selectedEvent.title}!`);
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
    const matchesCategory = activeCategory === "All" || ev.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
              Browse and checkout tickets for upcoming hackathons, startup pitch
              panels, system dev sprints, and community drives.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              suppressHydrationWarning
              className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/8 bg-[#111111] text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#A855F7]/30 focus:border-[#A855F7]/50 transition-all duration-150"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              suppressHydrationWarning
              className={`px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#A855F7] text-white"
                  : "bg-[#111111] text-white/50 border border-white/8 hover:text-white/80 hover:border-white/16"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 text-[12px] p-3 rounded-xl animate-fadeIn text-center font-medium">
            {successMessage}
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((ev) => {
              const isRegistered = registeredEventIds.includes(ev.id);
              return (
                <motion.div
                  key={ev.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
                  className="group flex flex-col overflow-hidden bg-[#111111] border border-white/8 rounded-xl hover:border-white/16 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 min-h-[320px]"
                >
                  {/* Banner */}
                  <div className="relative h-32 w-full overflow-hidden bg-[#0A0A0A]">
                    {ev.bannerUrl ? (
                      <img
                        src={ev.bannerUrl}
                        alt={ev.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center p-4 text-center">
                        <span className="font-bold text-base text-white/60 leading-snug line-clamp-2">{ev.title}</span>
                      </div>
                    )}
                    {/* Category tag */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/70 border border-white/10 text-white/70">
                        <Tag className="h-2.5 w-2.5 text-white/40" /> {ev.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center text-[11px] text-white/35 font-mono">
                        <Calendar className="h-3 w-3 mr-1.5 shrink-0" /> {ev.date}
                      </div>

                      <h3 className="text-[15px] font-semibold text-white leading-snug group-hover:text-white/80 transition-colors duration-150 truncate">
                        {ev.title}
                      </h3>

                      <p className="text-[12px] text-white/45 leading-relaxed line-clamp-3">
                        {ev.desc}
                      </p>

                      {/* Metadata */}
                      <div className="grid grid-cols-2 gap-2 pt-3 text-[11px] border-t border-white/6 text-white/40">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider pb-1 text-white/25">Prize Pool</span>
                          <span className="text-white/70 font-semibold text-[12px]">{ev.prizePool}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider pb-1 text-white/25">Registrations</span>
                          <span className="text-white/70 font-semibold text-[12px]">{ev.registrations} secured</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/6 mt-auto">
                      <Link
                        href={`/event?id=${ev.id}`}
                        className="text-[11px] font-medium text-white/40 hover:text-white/70 transition-colors duration-150"
                      >
                        View Details
                      </Link>

                      {isRegistered ? (
                        <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-emerald-500/8 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold rounded-full">
                          <Check className="h-3 w-3" /> Registered
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenRegister(ev)}
                          suppressHydrationWarning={true}
                          className="px-4 py-1.5 bg-[#A855F7] text-white text-[11px] font-semibold rounded-full hover:bg-[#C084FC] hover:-translate-y-px hover:shadow-md transition-all duration-150 cursor-pointer"
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

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-[#111111] border border-white/6 rounded-xl text-[12px] text-white/30 space-y-2">
            <Terminal className="h-5 w-5 text-white/20 mx-auto" />
            <p>No events matching the current filter.</p>
          </div>
        )}

        <RegisterModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleRegisterSubmit}
        />
      </div>
    </section>
  );
}
