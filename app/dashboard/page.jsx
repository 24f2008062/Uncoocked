"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import TicketModal from "@/app/components/TicketModal";
import { mockEvents } from "@/app/components/EventsExplorer";
import {
  Calendar,
  MapPin,
  Briefcase,
  XCircle,
  Activity,
  Users,
  Megaphone,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";

// getInitialHostedEvents is obsolete, handled by seed or empty start

const BANNER_PRESETS = [
  {
    name: "Hackathon",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Workshop",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Festive Night",
    url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Concert/Party",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Meetup",
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=60",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { data: session } = useSession();
  const [registrations, setRegistrations] = useState([]);
  const [hostedEvents, setHostedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedEventForTicket, setSelectedEventForTicket] = useState(null);

  // Guest List Expansion State
  const [expandedGuestLists, setExpandedGuestLists] = useState({});
  // Announcement Input States
  const [announcementTitles, setAnnouncementTitles] = useState({});
  const [announcementContents, setAnnouncementContents] = useState({});
  const [expandedAnnouncements, setExpandedAnnouncements] = useState({});

  const loadDashboardData = async () => {
    if (typeof window !== "undefined" && user) {
      try {
        setLoading(true);
        // 1. Fetch Events from Backend
        const res = await fetch("/api/events?includeArchived=true");
        const data = await res.json();
        
        let fetchedEvents = [];
        if (data.success) {
          fetchedEvents = data.events;
        }

        // Format dates for display
        fetchedEvents = fetchedEvents.map(ev => ({
          ...ev,
          dateStr: ev.date, // keep original date string
          date: new Date(ev.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
          ts: new Date(ev.date).getTime()
        }));

        setAllEvents(fetchedEvents);

        // Filter Hosted Events
        const hosted = fetchedEvents.filter((ev) => ev.organizer?.email === user || ev.organizerId === user);
        setHostedEvents(hosted);

        // 2. Fetch user's registrations from API
        const resReg = await fetch(`/api/registrations?email=${user}`);
        const regData = await resReg.json();
        if (regData.success) {
          setRegistrations(regData.registrations.map(r => ({
            ...r,
            email: r.user.email,
            name: r.user.name,
            ts: new Date(r.registeredAt).getTime()
          })));
        }

      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
      const handleStorageChange = () => {
        loadDashboardData();
      };
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCancelRegistration = async (eventId) => {
    if (typeof window !== "undefined" && user) {
      try {
        const regToCancel = registrations.find(r => r.email === user && r.eventId === eventId);
        if (!regToCancel) return;
        const res = await fetch(`/api/registrations/${regToCancel.id}`, { method: "DELETE" });
        if (res.ok) {
          await loadDashboardData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenHostModal = () => {
    router.push("/dashboard/organizer/new");
  };

  const handleEditHostedEventClick = (e, hev) => {
    e.stopPropagation();
    router.push(`/dashboard/organizer/new?edit=${hev.id}`);
  };

  const handleCancelHostedEvent = async (eventId) => {
    if (typeof window !== "undefined" && user) {
      if (
        !confirm(
          "Are you sure you want to cancel and delete this hosted event? All student bookings will be removed.",
        )
      )
        return;
      try {
        const res = await fetch(`/api/events/${eventId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete event from database");



        await loadDashboardData();
      } catch (err) {
        console.error(err);
        alert("Failed to delete event. Please check the logs.");
      }
    }
  };

  const handleAddAnnouncement = async (eventId) => {
    const title = announcementTitles[eventId]?.trim();
    const content = announcementContents[eventId]?.trim();
    if (!title || !content) return;

    try {
      const res = await fetch(`/api/events/${eventId}/bulletins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Failed to add announcement");

      // Reset inputs
      setAnnouncementTitles((prev) => ({ ...prev, [eventId]: "" }));
      setAnnouncementContents((prev) => ({ ...prev, [eventId]: "" }));

      await loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to post announcement. Please check logs.");
    }
  };

  // Check if logged in
  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-black flex items-center justify-center py-12 px-4">
        <div className="w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-dark-card border border-dark-border p-8 rounded-2xl text-center shadow-neon">
          <span className="text-4xl block">🚫</span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Access Denied
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Please sign in to your campus account to access this dashboard.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-2 bg-neon-purple text-white text-xs font-bold rounded hover:bg-neon-purple/95 transition-all shadow-neon"
            >
              Sign In to Campus Account
            </Link>
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter campus events the user is attending (registered for)
  const attendingEvents = allEvents.filter((ev) =>
    registrations.some((reg) => reg.eventId === ev.id),
  );

  const getGuestList = (eventId) => {
    // Note: getGuestList logic moved to API. But to keep the synchronous render working,
    // we should ideally fetch guest lists for hosted events and store them.
    // For now, it will be empty in this view until they open the organizer console.
    // Let's rely on registrations state if it had all registrations. But registrations state only has user's regs.
    // Better to fetch guest lists for all hosted events if we want them here, or redirect to organizer dashboard.
    // We will just return [] here and let them use the Organizer Console for accurate lists.
    return [];
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Checked In":
        return "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40";
      case "Confirmed":
        return "bg-neon-purple/10 text-neon-lavender border border-neon-purple/30 shadow-neon";
      case "Pending":
      default:
        return "bg-amber-950/40 text-amber-400 border border-amber-800/40";
    }
  };

  const username = session?.user?.name || (user ? user.split("@")[0] : "Guest");

  const now = new Date().getTime();
  const upcomingEvents = attendingEvents.filter(ev => ev.ts > now + 86400000); // More than 24 hours in future
  const ongoingEvents = attendingEvents.filter(ev => Math.abs(ev.ts - now) <= 86400000); // Within 24 hours
  const completedEvents = attendingEvents.filter(ev => ev.ts < now - 86400000); // More than 24 hours in past

  const renderEventGroup = (groupTitle, events, emptyMessage) => {
    if (events.length === 0) return null;
    return (
      <div className="space-y-4 mb-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{groupTitle} ({events.length})</h3>
        <div className="space-y-4">
          {events.map((ev) => {
            const regDetails = registrations.find((r) => r.eventId === ev.id);
            return (
              <div
                key={ev.id}
                className="bg-dark-card border border-dark-border hover:border-neon-purple/30 rounded-xl p-5 shadow-sm transition-all duration-300 flex flex-col justify-between min-h-[180px] group cursor-pointer hover:border-neon-purple/50 hover:shadow-neon hover:scale-[1.01]"
                onClick={() => router.push(`/event?id=${ev.id}`)}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-neon-purple/10 text-neon-lavender border border-neon-purple/20 rounded-full">
                      {ev.type}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getStatusStyle(regDetails?.status)}`}
                    >
                      {regDetails?.status || "Confirmed"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug group-hover:text-neon-lavender transition-colors">
                    {ev.title}
                  </h3>
                  <div className="flex flex-col gap-1 text-[10px] text-gray-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-neon-purple shrink-0" />
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-neon-purple shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Users className="h-3.5 w-3.5 text-neon-purple shrink-0" />
                      <span className="truncate">Organizer: {ev.organizer?.name || ev.organizer?.email.split('@')[0] || ev.organizerId}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="flex items-center gap-3 pt-3 border-t border-dark-border/40 mt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href="/opportunities"
                    className="flex-1 py-2 bg-neutral-900 border border-dark-border hover:border-neon-purple/40 text-white hover:text-neon-purple text-[10px] sm:text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Briefcase className="h-3.5 w-3.5 hidden sm:block" />
                    <span>
                      Opportunit
                      <span className="hidden sm:inline">ies</span>
                    </span>
                  </Link>

                  {(regDetails?.status === "Confirmed" ||
                    regDetails?.status === "Checked In") &&
                    regDetails?.id && (
                      <button
                        onClick={() => {
                          setSelectedTicket(regDetails);
                          setSelectedEventForTicket(ev);
                          setTicketModalOpen(true);
                        }}
                        className="flex-1 py-2 bg-neon-purple text-white hover:bg-neon-purple/90 text-[10px] sm:text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-neon"
                      >
                        <span>View Ticket</span>
                      </button>
                    )}

                  <button
                    onClick={() => handleCancelRegistration(ev.id)}
                    className="px-3 py-2 border border-red-950/60 bg-red-950/10 hover:bg-red-950/20 text-red-400 hover:text-red-300 text-[10px] sm:text-xs font-bold rounded-lg flex items-center justify-center transition-all hover:border-red-500/40"
                    title={
                      regDetails?.status === "Waitlisted"
                        ? "Leave Waitlist"
                        : "Cancel"
                    }
                  >
                    <XCircle className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative isolate overflow-hidden bg-black w-full min-h-[85vh] py-12 sm:py-16">
      {/* Background decorations */}
      <div
        className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl opacity-20"
        aria-hidden="true"
      >
        <div
          className="relative left-[50%] top-[10%] aspect-1155/678 w-[45rem] -translate-x-1/2 bg-gradient-to-tr from-neon-purple to-neon-lavender"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Block */}
        <DashboardHeader 
          username={username}
          attendingCount={attendingEvents.length}
          hostedCount={hostedEvents.length}
          loading={loading}
        />

        {/* Side-by-Side Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* LEFT COLUMN: ATTENDING EVENTS */}
          <div className="space-y-6">
            <div className="bg-dark-card border border-dark-border rounded-xl p-5 shadow-neon">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2 font-mono">
                <span className="text-neon-purple">🎫</span> Events You Are
                Attending
              </h2>
              <p className="text-xs text-gray-400">
                Official bookings and timelines for your registered fests,
                parties, and workshops.
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="bg-dark-card border border-dark-border rounded-xl p-6 animate-pulse h-36"
                  />
                ))}
              </div>
            ) : attendingEvents.length === 0 ? (
              <div className="bg-dark-card/40 border border-dark-border border-dashed rounded-xl p-10 text-center space-y-4">
                <span className="text-3xl block">🎟️</span>
                <p className="text-xs text-gray-400 leading-normal">
                  You aren't registered for any campus events yet.
                </p>
                <Link
                  href="/event"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-neon-purple text-white text-xs font-bold rounded-lg hover:bg-neon-purple/90 transition-all shadow-neon"
                >
                  Browse Event Matrix <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div>
                {renderEventGroup("Ongoing Events", ongoingEvents, "")}
                {renderEventGroup("Upcoming Events", upcomingEvents, "")}
                {renderEventGroup("Completed Events", completedEvents, "")}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: HOSTED EVENTS */}
          <div className="space-y-6">
            <div className="bg-dark-card border border-dark-border rounded-xl p-5 shadow-neon flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2 font-mono">
                  <span className="text-neon-purple">📢</span> Events You Are
                  Hosting
                </h2>
                <p className="text-xs text-gray-400">
                  Manage guest lists, edit descriptions, and publish event
                  announcements.
                </p>
              </div>
              <button
                onClick={handleOpenHostModal}
                className="p-2 bg-neon-purple hover:bg-neon-purple/90 text-white rounded-lg shadow-neon flex items-center justify-center gap-1 text-xs font-bold shrink-0 transition-all hover:scale-105"
                title="Host New Event"
              >
                <Plus className="h-4 w-4" />{" "}
                <span className="hidden sm:inline">Host Event</span>
              </button>
            </div>

            {hostedEvents.length === 0 ? (
              <div className="bg-dark-card/40 border border-dark-border border-dashed rounded-xl p-10 text-center space-y-4">
                <span className="text-3xl block">📣</span>
                <p className="text-xs text-gray-400 leading-normal">
                  You aren't hosting any events yet.
                </p>
                <button
                  onClick={handleOpenHostModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-neon-purple text-white text-xs font-bold rounded-lg hover:bg-neon-purple/90 transition-all shadow-neon"
                >
                  Create First Event <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {hostedEvents.map((hev) => {
                  const guestList = getGuestList(hev.id);
                  const isGuestListExpanded = !!expandedGuestLists[hev.id];
                  const isAnnounceExpanded = !!expandedAnnouncements[hev.id];

                  return (
                    <div
                      key={hev.id}
                      className="bg-dark-card border border-dark-border hover:border-neon-purple/20 rounded-xl p-0 overflow-hidden shadow-sm transition-all duration-300 cursor-pointer hover:border-neon-purple/50 hover:shadow-neon hover:scale-[1.01] flex flex-col group"
                      onClick={() => router.push(`/dashboard/organizer/${hev.id}`)}
                    >
                      {/* Event Card Banner Preview */}
                      <div className="relative h-28 w-full overflow-hidden bg-zinc-900 border-b border-dark-border/40">
                        {hev.bannerUrl ? (
                          <img
                            src={hev.bannerUrl}
                            alt={hev.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-neon-purple/20 via-zinc-900 to-zinc-950 flex items-center justify-center font-mono text-[9px] text-neon-lavender">
                            CAMPUS EVENT PREVIEW
                          </div>
                        )}
                        {/* Category Tag overlaid on the banner */}
                        <div className="absolute top-3 left-3">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-zinc-950/90 border border-dark-border/40 text-neon-lavender rounded-full shadow-md">
                            {hev.type}
                          </span>
                        </div>
                      </div>

                      {/* Card Content with original padding and space-y-4 */}
                      <div className="p-5 space-y-4">
                        {/* Event Header details */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h3 className="text-sm font-black text-white group-hover:text-neon-lavender transition-colors pt-1">
                              {hev.title}
                            </h3>
                          </div>
                          <div
                            className="flex items-center gap-1 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) =>
                                handleEditHostedEventClick(e, hev)
                              }
                              className="text-gray-500 hover:text-neon-lavender p-1.5 hover:bg-neon-purple/10 border border-transparent hover:border-neon-purple/30 rounded-lg transition-all"
                              title="Edit Event"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => handleCancelHostedEvent(hev.id)}
                              className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 rounded-lg transition-all"
                              title="Cancel Event"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 font-mono">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-neon-purple shrink-0" />
                            <span>{hev.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-neon-purple shrink-0" />
                            <span className="truncate">{hev.location}</span>
                          </div>
                        </div>

                        {/* Row of Action Toggles */}
                        <div
                          className="flex items-center gap-2 pt-2 border-t border-dark-border/40"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              setExpandedAnnouncements((prev) => ({
                                ...prev,
                                [hev.id]: !prev[hev.id],
                              }))
                            }
                            className={`flex-1 py-1.5 px-2.5 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                              isAnnounceExpanded
                                ? "bg-neon-purple/10 border-neon-purple text-neon-lavender"
                                : "bg-neutral-900 border-dark-border text-gray-400 hover:text-white"
                            }`}
                          >
                            <Megaphone className="h-3.5 w-3.5" />
                            <span>Announce</span>
                            {isAnnounceExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                        </div>


                        {/* Expandable Announcements / Bulletins Area */}
                        {isAnnounceExpanded && (
                          <div
                            className="bg-black/30 rounded-lg p-3.5 border border-dark-border/50 animate-fadeIn space-y-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <h4 className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1.5 font-mono">
                              <span>📢</span> Post Event Bulletin Update
                            </h4>

                            {/* Create Form */}
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Announcement Title"
                                value={announcementTitles[hev.id] || ""}
                                onChange={(e) =>
                                  setAnnouncementTitles((prev) => ({
                                    ...prev,
                                    [hev.id]: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 bg-zinc-950 border border-dark-border rounded text-[11px] text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple font-mono"
                              />

                              <textarea
                                placeholder="Announcement details..."
                                rows={2}
                                value={announcementContents[hev.id] || ""}
                                onChange={(e) =>
                                  setAnnouncementContents((prev) => ({
                                    ...prev,
                                    [hev.id]: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 bg-zinc-950 border border-dark-border rounded text-[11px] text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple font-mono resize-none"
                              />

                              <button
                                onClick={() => handleAddAnnouncement(hev.id)}
                                className="w-full py-1.5 bg-neon-purple hover:bg-neon-purple/95 text-white text-[10px] font-bold rounded shadow-neon transition-all"
                              >
                                Publish Bulletin announcement
                              </button>
                            </div>

                            {/* Existing Updates List */}
                            <div className="space-y-2 pt-2 border-t border-dark-border/30">
                              <span className="text-[9px] uppercase font-bold text-gray-500 block">
                                Announcement History
                              </span>
                              {!hev.bulletinUpdates ||
                              hev.bulletinUpdates.length === 0 ? (
                                <p className="text-[10px] text-gray-600 italic">
                                  No announcements published yet.
                                </p>
                              ) : (
                                <div className="space-y-2 max-h-36 overflow-y-auto no-scrollbar">
                                  {hev.bulletinUpdates.map((up) => (
                                    <div
                                      key={up.id}
                                      className="bg-dark-card/50 border border-dark-border/30 p-2.5 rounded text-[10px]"
                                    >
                                      <div className="flex justify-between items-center text-[8.5px] text-neon-lavender font-mono font-bold mb-1">
                                        <span>{up.title}</span>
                                        <span>{up.date}</span>
                                      </div>
                                      <p className="text-gray-400 font-mono leading-normal">
                                        {up.content}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTicket && selectedEventForTicket && (
        <TicketModal
          open={ticketModalOpen}
          onClose={() => setTicketModalOpen(false)}
          eventTitle={selectedEventForTicket.title}
          eventDate={selectedEventForTicket.date}
          eventLocation={selectedEventForTicket.location}
          attendeeName={selectedTicket.name}
          ticketId={selectedTicket.ticketId || "TKT-000000"}
          ticketType={selectedEventForTicket.ticketType || "Free"}
        />
      )}
    </div>
  );
}
