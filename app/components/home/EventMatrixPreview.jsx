"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Calendar, Tag, Check, Terminal } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import RegisterModal from "@/app/components/event/RegisterModal";
import { useUser } from "@/app/context/UserContext";
import { toast } from "sonner";

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function EventMatrixPreview() {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
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
              registrations: e._count?.registrations ?? e.registrations ?? 0,
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

  const handleOpenRegister = (ev) => {
    if (!user) {
      if (typeof window !== 'undefined') window.location.assign('/login');
      return;
    }
    setSelectedEvent(ev);
    setModalOpen(true);
  };

  const handleRegisterSubmit = async (payload) => {
    if (!selectedEvent) return;
    try {
      if (registeredEventIds.includes(selectedEvent.id)) {
        toast("You are already registered for this event!");
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
      toast.error("Registration failed. Please check logs.");
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
                      <Image
                        src={ev.bannerUrl}
                        alt={ev.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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
                          {ev.prizePool ? (
                            <div className="text-white/70 text-[12px] leading-relaxed prose-invert max-w-none prose-p:mb-0.5 prose-li:my-0">
                              <ReactMarkdown
                                components={{
                                  h2: ({ node: _node, ...props }) => <h2 className="text-[12px] font-semibold text-white mb-1" {...props} />,
                                  h3: ({ node: _node, ...props }) => <h3 className="text-[11px] font-semibold uppercase tracking-wider text-white mb-0.5" {...props} />,
                                  p: ({ node: _node, ...props }) => <p className="text-white/70 text-[12px] mb-0.5 leading-relaxed" {...props} />,
                                  ul: ({ node: _node, ...props }) => <ul className="list-disc list-inside text-white/70 text-[12px] space-y-0.5 ml-1" {...props} />,
                                  li: ({ node: _node, ...props }) => <li className="text-white/70 text-[12px]" {...props} />,
                                  strong: ({ node: _node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                                }}
                              >
                                {ev.prizePool}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <span className="text-white/40 font-normal text-[12px]">No prize pool listed</span>
                          )}
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
                      ) : user ? (
                        <button
                          onClick={() => handleOpenRegister(ev)}
                          suppressHydrationWarning={true}
                          className="px-4 py-1.5 bg-[#A855F7] text-white text-[11px] font-semibold rounded-full hover:bg-[#C084FC] hover:-translate-y-px hover:shadow-md transition-all duration-150 cursor-pointer"
                        >
                          Secure Ticket
                        </button>
                      ) : (
                        <button
                          onClick={() => {
      if (typeof window !== 'undefined') window.location.assign('/login');
                          }}
                          suppressHydrationWarning={true}
                          className="px-4 py-1.5 bg-neutral-900 border border-dark-border text-gray-400 font-semibold text-[11px] rounded-full hover:text-white transition-all hover:border-gray-500 cursor-pointer"
                        >
                          Sign in to Register
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
