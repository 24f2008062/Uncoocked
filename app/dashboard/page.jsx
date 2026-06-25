"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const getInitialHostedEvents = (email) => [
  {
    id: "hosted-ev-1",
    title: "Generative AI & LLM Workshop",
    type: "Workshop",
    date: "July 2, 2026",
    location: "Tech Lab 102, Main Campus",
    description:
      "Learn prompt engineering, vector databases, embeddings, and building active AI agents with PyTorch.",
    hostEmail: email,
    bulletinUpdates: [
      {
        id: "hu-1",
        date: "2026-06-17",
        title: "Speaker Schedule Released",
        content: "The full panel timing is now published.",
      },
    ],
    bannerUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=60",
    ticketType: "Free",
    capacity: 100,
    waitlistEnabled: true,
  },
  {
    id: "hosted-ev-2",
    title: "Grand Dandiya Festive Night 2026",
    type: "Festive Night",
    date: "October 12, 2026",
    location: "Auditorium Hall, Main Campus",
    description:
      "Celebrate the festive season with traditional Garba, live orchestra, authentic food stalls, and prizes.",
    hostEmail: email,
    bulletinUpdates: [],
    bannerUrl:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=60",
    ticketType: "Paid",
    price: 15.0,
    capacity: 50,
    waitlistEnabled: true,
  },
];

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
  const { user } = useUser();
  const [registrations, setRegistrations] = useState([]);
  const [hostedEvents, setHostedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Hackathon");
  const [newDate, setNewDate] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newBannerUrl, setNewBannerUrl] = useState("");
  const [newTicketType, setNewTicketType] = useState("Free");
  const [newPrice, setNewPrice] = useState(0);
  const [newCapacity, setNewCapacity] = useState(100);
  const [newWaitlistEnabled, setNewWaitlistEnabled] = useState(true);

  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedEventForTicket, setSelectedEventForTicket] = useState(null);

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  // Guest List Expansion State
  const [expandedGuestLists, setExpandedGuestLists] = useState({});
  // Announcement Input States
  const [announcementTitles, setAnnouncementTitles] = useState({});
  const [announcementContents, setAnnouncementContents] = useState({});
  const [expandedAnnouncements, setExpandedAnnouncements] = useState({});

  const loadDashboardData = () => {
    if (typeof window !== "undefined" && user) {
      try {
        // 1. Load Hosted Events
        const storedHostedStr = localStorage.getItem("hosted_events");
        let hosted = [];
        if (!storedHostedStr) {
          hosted = getInitialHostedEvents(user);
          localStorage.setItem("hosted_events", JSON.stringify(hosted));
        } else {
          const parsed = JSON.parse(storedHostedStr);
          hosted = parsed.filter((ev) => ev.hostEmail === user);
        }
        setHostedEvents(hosted);

        // 2. Seed default event registrations if not present
        const storedRegs = JSON.parse(
          localStorage.getItem("registrations") || "[]",
        );
        let updatedRegs = [...storedRegs];
        let regSeeded = false;

        hosted.forEach((hEv) => {
          const hasRegs = storedRegs.some((r) => r.eventId === hEv.id);
          if (!hasRegs) {
            regSeeded = true;
            if (hEv.id === "hosted-ev-1") {
              updatedRegs.push(
                {
                  name: "Emily Davis",
                  email: "emily@campus.edu",
                  eventId: hEv.id,
                  ts: Date.now() - 86400000,
                  status: "Confirmed",
                  track: "Fine Arts & Design",
                  team: "Creative Arts Society",
                },
                {
                  name: "Michael Chen",
                  email: "michael@campus.edu",
                  eventId: hEv.id,
                  ts: Date.now() - 43200000,
                  status: "Checked In",
                  track: "Computer Science & Tech",
                  team: "Tech Club",
                },
              );
            } else if (hEv.id === "hosted-ev-2") {
              updatedRegs.push(
                {
                  name: "Sarah Connor",
                  email: "sarah@campus.edu",
                  eventId: hEv.id,
                  ts: Date.now() - 120000000,
                  status: "Confirmed",
                  track: "Engineering & Applied Sciences",
                  team: "Robotics Club",
                },
                {
                  name: "John Connor",
                  email: "john@campus.edu",
                  eventId: hEv.id,
                  ts: Date.now() - 60000000,
                  status: "Confirmed",
                  track: "Natural Sciences",
                  team: "Astronomy Club",
                },
              );
            }
          }
        });

        if (regSeeded) {
          localStorage.setItem("registrations", JSON.stringify(updatedRegs));
        }

        // 3. Set registrations state for current user
        const userRegs = updatedRegs.filter((reg) => reg.email === user);
        setRegistrations(userRegs);

        // 4. Merge mockEvents and all hosted events to resolve event details
        const allHosted = JSON.parse(
          localStorage.getItem("hosted_events") || "[]",
        );
        setAllEvents([...mockEvents, ...allHosted]);
      } catch (err) {
        console.error(err);
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

  const handleCancelRegistration = (eventId) => {
    if (typeof window !== "undefined" && user) {
      try {
        const stored = JSON.parse(
          localStorage.getItem("registrations") || "[]",
        );
        const updated = stored.filter(
          (reg) => !(reg.email === user && reg.eventId === eventId),
        );
        localStorage.setItem("registrations", JSON.stringify(updated));
        loadDashboardData();
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleOpenHostModal = () => {
    setIsEditing(false);
    setEditingEventId(null);
    setNewTitle("");
    setNewType("Hackathon");
    setNewDate("");
    setNewLocation("");
    setNewDescription("");
    setNewBannerUrl("");
    setNewTicketType("Free");
    setNewPrice(0);
    setNewCapacity(100);
    setNewWaitlistEnabled(true);
    setHostModalOpen(true);
  };

  const handleEditHostedEventClick = (e, hev) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditingEventId(hev.id);
    setNewTitle(hev.title);
    setNewType(hev.type);
    setNewDate(hev.date);
    setNewLocation(hev.location);
    setNewDescription(hev.description);
    setNewBannerUrl(hev.bannerUrl || "");
    setNewTicketType(hev.ticketType || "Free");
    setNewPrice(hev.price || 0);
    setNewCapacity(hev.capacity || 100);
    setNewWaitlistEnabled(hev.waitlistEnabled ?? true);
    setHostModalOpen(true);
  };

  const handleHostNewEvent = (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const storedHosted = JSON.parse(
        localStorage.getItem("hosted_events") || "[]",
      );

      if (isEditing && editingEventId) {
        // Edit Mode
        const updated = storedHosted.map((hev) => {
          if (hev.id === editingEventId) {
            return {
              ...hev,
              title: newTitle,
              type: newType,
              date: newDate,
              location: newLocation,
              description: newDescription,
              bannerUrl: newBannerUrl,
              ticketType: newTicketType,
              price: newPrice,
              capacity: newCapacity,
              waitlistEnabled: newWaitlistEnabled,
            };
          }
          return hev;
        });
        localStorage.setItem("hosted_events", JSON.stringify(updated));
        alert(`Successfully updated event: ${newTitle}`);
      } else {
        // Create Mode
        const newEv = {
          id: `hosted-ev-${Date.now()}`,
          title: newTitle,
          type: newType,
          date: newDate,
          location: newLocation,
          description: newDescription,
          hostEmail: user,
          bulletinUpdates: [],
          bannerUrl: newBannerUrl,
          ticketType: newTicketType,
          price: newPrice,
          capacity: newCapacity,
          waitlistEnabled: newWaitlistEnabled,
        };

        storedHosted.push(newEv);
        localStorage.setItem("hosted_events", JSON.stringify(storedHosted));

        // Auto-seed 2 mock registrations for the new hosted event
        const storedRegs = JSON.parse(
          localStorage.getItem("registrations") || "[]",
        );
        storedRegs.push(
          {
            name: "Alice Smith",
            email: "alice@campus.edu",
            eventId: newEv.id,
            ts: Date.now(),
            status: "Confirmed",
            track: "Computer Science & Tech",
            team: "Individual",
          },
          {
            name: "Bob Johnson",
            email: "bob@campus.edu",
            eventId: newEv.id,
            ts: Date.now(),
            status: "Pending",
            track: "Engineering & Applied Sciences",
            team: "Tech Club",
          },
        );
        localStorage.setItem("registrations", JSON.stringify(storedRegs));
        alert(`Successfully launched event: ${newTitle}`);
      }

      loadDashboardData();

      // Reset
      setNewTitle("");
      setNewType("Hackathon");
      setNewDate("");
      setNewLocation("");
      setNewDescription("");
      setNewBannerUrl("");
      setIsEditing(false);
      setEditingEventId(null);
      setHostModalOpen(false);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelHostedEvent = (eventId) => {
    if (typeof window !== "undefined" && user) {
      if (
        !confirm(
          "Are you sure you want to cancel and delete this hosted event? All student bookings will be removed.",
        )
      )
        return;
      try {
        // Remove from hosted events
        const storedHosted = JSON.parse(
          localStorage.getItem("hosted_events") || "[]",
        );
        const updatedHosted = storedHosted.filter((ev) => ev.id !== eventId);
        localStorage.setItem("hosted_events", JSON.stringify(updatedHosted));

        // Remove registrations for this event
        const storedRegs = JSON.parse(
          localStorage.getItem("registrations") || "[]",
        );
        const updatedRegs = storedRegs.filter((reg) => reg.eventId !== eventId);
        localStorage.setItem("registrations", JSON.stringify(updatedRegs));

        loadDashboardData();
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddAnnouncement = (eventId) => {
    const title = announcementTitles[eventId]?.trim();
    const content = announcementContents[eventId]?.trim();
    if (!title || !content) return;

    try {
      const storedHosted = JSON.parse(
        localStorage.getItem("hosted_events") || "[]",
      );
      const updatedHosted = storedHosted.map((ev) => {
        if (ev.id === eventId) {
          const updates = ev.bulletinUpdates || [];
          updates.unshift({
            id: `update-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            title,
            content,
          });
          return { ...ev, bulletinUpdates: updates };
        }
        return ev;
      });
      localStorage.setItem("hosted_events", JSON.stringify(updatedHosted));

      // Reset inputs
      setAnnouncementTitles((prev) => ({ ...prev, [eventId]: "" }));
      setAnnouncementContents((prev) => ({ ...prev, [eventId]: "" }));

      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Check if logged in
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
    if (typeof window !== "undefined") {
      try {
        const storedRegs = JSON.parse(
          localStorage.getItem("registrations") || "[]",
        );
        return storedRegs.filter((reg) => reg.eventId === eventId);
      } catch {
        return [];
      }
    }
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

  const username = user.split("@")[0];

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
              <div className="space-y-4">
                {attendingEvents.map((ev) => {
                  const regDetails = registrations.find(
                    (r) => r.eventId === ev.id,
                  );
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
                          regDetails?.ticketId && (
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
                              setExpandedGuestLists((prev) => ({
                                ...prev,
                                [hev.id]: !prev[hev.id],
                              }))
                            }
                            className={`flex-1 py-1.5 px-2.5 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                              isGuestListExpanded
                                ? "bg-neon-purple/10 border-neon-purple text-neon-lavender"
                                : "bg-neutral-900 border-dark-border text-gray-400 hover:text-white"
                            }`}
                          >
                            <Users className="h-3.5 w-3.5" />
                            <span>Guest List ({guestList.length})</span>
                            {isGuestListExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>

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

                        {/* Expandable Guest List */}
                        {isGuestListExpanded && (
                          <div
                            className="bg-black/30 rounded-lg p-3.5 border border-dark-border/50 animate-fadeIn space-y-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <h4 className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1.5 font-mono">
                              <span>👥</span> Event Guest List
                            </h4>
                            {guestList.length === 0 ? (
                              <p className="text-[10px] text-gray-600 italic">
                                No registrations for this event yet.
                              </p>
                            ) : (
                              <div className="divide-y divide-dark-border/30 max-h-40 overflow-y-auto no-scrollbar">
                                {guestList.map((r, idx) => (
                                  <div
                                    key={idx}
                                    className="py-2 flex items-center justify-between text-[11px] font-mono"
                                  >
                                    <div>
                                      <div className="text-white font-bold">
                                        {r.name}
                                      </div>
                                      <div className="text-[9px] text-gray-500">
                                        {r.email}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[8px] bg-zinc-800 text-zinc-300 border border-dark-border px-1.5 py-0.5 rounded">
                                        {r.track || "Attendee"}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

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

      {/* HOST NEW EVENT MODAL */}
      {hostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-dark-card border border-dark-border p-6 rounded-2xl shadow-neon relative space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>📣</span>{" "}
              {isEditing ? "Edit Campus Event" : "Host New Campus Event"}
            </h2>
            <p className="text-xs text-gray-400">
              {isEditing
                ? "Modify the details of your hosted campus event below."
                : "Fill in the specifics below to add your event to the system and register mock attendees."}
            </p>

            <form onSubmit={handleHostNewEvent} className="space-y-4 font-mono">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-gray-500">
                  Event Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. AI Agents Hackathon 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-dark-border rounded-lg text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-gray-500">
                    Category Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-dark-border rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple font-bold"
                  >
                    <option value="Fest">Fest</option>
                    <option value="Party">Party</option>
                    <option value="Festive Night">Festive Night</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Meetup">Meetup</option>
                    <option value="Hackathon">Hackathon</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-gray-500">
                    Event Date
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. July 24-26, 2026"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-dark-border rounded-lg text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-gray-500">
                  Location Venue
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Seminar Hall, block 2"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-dark-border rounded-lg text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-gray-500">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/... (optional)"
                  value={newBannerUrl}
                  onChange={(e) => setNewBannerUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-dark-border rounded-lg text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
                />

                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {BANNER_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setNewBannerUrl(preset.url)}
                      className={`px-2 py-0.5 rounded text-[9px] border transition-all ${
                        newBannerUrl === preset.url
                          ? "bg-neon-purple/20 border-neon-purple text-neon-lavender"
                          : "bg-zinc-900 border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-700"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-gray-500">
                    Ticket Type
                  </label>
                  <select
                    value={newTicketType}
                    onChange={(e) => {
                      setNewTicketType(e.target.value);
                      if (e.target.value === "Free") setNewPrice(0);
                    }}
                    className="w-full px-3 py-2 bg-black border border-dark-border rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple font-bold"
                  >
                    <option value="Free">Free Entry</option>
                    <option value="Paid">Paid Ticket</option>
                  </select>
                </div>
                {newTicketType === "Paid" && (
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-gray-500">
                      Ticket Price ($)
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      step="0.01"
                      value={newPrice}
                      onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-black border border-dark-border rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-gray-500">
                    Total Capacity
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-black border border-dark-border rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
                  />
                </div>
                <div className="space-y-1 flex items-end">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer h-[38px]">
                    <input
                      type="checkbox"
                      checked={newWaitlistEnabled}
                      onChange={(e) => setNewWaitlistEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-dark-border bg-black text-neon-purple focus:ring-neon-purple accent-neon-purple"
                    />
                    Enable Waitlist
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-gray-500">
                  Brief Description
                </label>
                <textarea
                  required
                  placeholder="Summarize the agenda, targets, and prizes..."
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-dark-border rounded-lg text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2 font-sans">
                <button
                  type="button"
                  onClick={() => setHostModalOpen(false)}
                  className="flex-1 py-2 bg-neutral-900 border border-dark-border text-gray-400 hover:text-white text-xs font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-neon-purple hover:bg-neon-purple/95 text-white text-xs font-bold rounded-lg shadow-neon transition-all hover:scale-102"
                >
                  {isEditing ? "Save Changes" : "Publish & Host"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
