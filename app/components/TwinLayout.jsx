"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { Share, Bookmark, Flag, ArrowLeft } from "lucide-react";
import BulletinBoard from "./BulletinBoard";
import RegisterModal from "./RegisterModal";
import RegistrationCard from "./RegistrationCard";
import EventChat from "./EventChat";

// Lazy load heavy components
const EventDescription = dynamic(() => import('./EventDescription'), { ssr: false });
const RecommendedEvents = dynamic(() => import('./RecommendedEvents'), { ssr: false });

export default function TwinLayout({ event, onBack, chatUserData, selectedEventId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState("amenities");
  const [localUserEmail, setLocalUserEmail] = useState(null);
  const router = useRouter();

  const { user } = useUser();

  const [bulletins, setBulletins] = useState(event.bulletinUpdates || []);
  const [registrations, setRegistrations] = useState([]);
  
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchRegistrations = async () => {
      try {
        const res = await fetch(`/api/registrations?eventId=${event.id}`);
        const data = await res.json();
        if (data.success && isMounted) {
          // Flatten user relation
          const formatted = data.registrations.map(r => ({
            ...r,
            email: r.user.email,
            name: r.user.name,
            github: r.user.portfolioUrl,
            ts: new Date(r.registeredAt).getTime(),
          }));
          setRegistrations(formatted);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRegistrations();
    return () => { isMounted = false; };
  }, [event.id]);

  async function handleRegister(payload) {
    setModalOpen(false);
    try {
      const currentTicketsSold = registrations.filter((r) => r.status !== "Waitlisted").length;
      const isFull = event.capacity ? currentTicketsSold >= event.capacity : false;
      const finalStatus = isFull && event.waitlistEnabled ? "Waitlisted" : "Confirmed";

      const res = await fetch(`/api/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          email: user || payload.email,
          eventId: event.id,
          status: finalStatus,
        }),
      });

      if (!res.ok) throw new Error("Failed to register");

      const data = await res.json();
      if (data.success) {
        const newReg = {
          ...data.registration,
          email: data.registration.user.email,
          name: data.registration.user.name,
          ts: new Date(data.registration.registeredAt).getTime(),
        };
        setRegistrations((prev) => [...prev, newReg]);
        setLocalUserEmail(user || payload.email);
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please check logs.");
    }
  }

  const handleCancelRegistration = async (eventId) => {
    try {
      const activeEmail = user || localUserEmail;
      const regToCancel = registrations.find(r => r.email === activeEmail && r.eventId === eventId);
      if (!regToCancel) return;

      const res = await fetch(`/api/registrations/${regToCancel.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to cancel");

      setRegistrations((prev) => prev.filter((r) => r.id !== regToCancel.id));
      if (!user) setLocalUserEmail(null);
    } catch (err) {
      console.error(err);
      alert("Failed to cancel registration.");
    }
  };

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastContent.trim()) return;

    try {
      const res = await fetch(`/api/events/${event.id}/bulletins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle.trim(),
          content: broadcastContent.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add announcement");

      const data = await res.json();
      if (data.success && data.bulletin) {
        // Assume API returns the new bulletin with date and id properly formatted.
        // Or we can just mock the date here if it doesn't return full details formatted exactly
        setBulletins((prev) => [{
          id: data.bulletin.id,
          date: new Date(data.bulletin.postedAt).toISOString().split("T")[0],
          title: data.bulletin.title,
          content: data.bulletin.content,
        }, ...prev]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to post update. Please check logs.");
    }

    setBroadcastTitle("");
    setBroadcastContent("");
  };

  const activeEmail = user || localUserEmail;
  const userRegistration = registrations.find((r) => r.email === activeEmail);
  const isRegistered = !!userRegistration;

  const ticketsSold = registrations.filter((r) => r.status !== "Waitlisted").length;
  const remainingCapacity = event.capacity ? Math.max(0, event.capacity - ticketsSold) : null;
  const isSoldOut = event.capacity ? remainingCapacity === 0 : false;
  const isWaitlistOnly = isSoldOut && event.waitlistEnabled;

  return (
    <div className="w-full bg-black pt-0 pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        {onBack && (
          <button onClick={onBack} className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-neon-purple transition-all group w-fit">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to All Events
          </button>
        )}


        {/* 70/30 Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (70%) - Description, Agenda, Organizer, Venue */}
          <div className="lg:col-span-6 xl:col-span-7 w-full order-2 lg:order-1 flex flex-col gap-8">
            {/* Hero Section */}
            <div className="w-full">
              <div className="w-full h-56 md:h-72 rounded-3xl overflow-hidden border border-dark-border/50 relative mb-6">
                {event.bannerUrl ? (
                  <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-zinc-900 to-black" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
                
                <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-10 max-w-3xl">
                  {event.category && (
                    <span className="text-[10px] font-extrabold text-white tracking-widest uppercase bg-neon-purple/80 backdrop-blur-md border border-neon-purple px-3 py-1 rounded-full mb-4 inline-block shadow-lg shadow-black/50">
                      {event.category}
                    </span>
                  )}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]">
                    {event.title}
                  </h1>
                </div>
              </div>

            </div>

            <EventDescription event={event} />
          </div>

          {/* Right Column (30%) - Registration & Bulletins & Discussion */}
          <div className="lg:col-span-4 xl:col-span-3 w-full order-1 lg:order-2 space-y-6 lg:sticky lg:top-24">
            
            {/* Toggle Switch */}
            <div className="bg-zinc-950 p-1.5 rounded-xl border border-dark-border/50 flex w-full">
              <button
                onClick={() => setActiveSidebarTab("amenities")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeSidebarTab === "amenities"
                    ? "bg-neon-purple text-white shadow-sm"
                    : "text-gray-500 hover:text-white hover:bg-zinc-900"
                }`}
              >
                Amenities
              </button>
              <button
                onClick={() => setActiveSidebarTab("discussion")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeSidebarTab === "discussion"
                    ? "bg-neon-purple text-white shadow-sm"
                    : "text-gray-500 hover:text-white hover:bg-zinc-900"
                }`}
              >
                Discussion
              </button>
            </div>

            {activeSidebarTab === "amenities" ? (
              <div className="space-y-8">
                <RegistrationCard 
                  event={event}
                  user={user}
                  userRegistration={userRegistration}
                  isRegistered={isRegistered}
                  isSoldOut={isSoldOut}
                  isWaitlistOnly={isWaitlistOnly}
                  remainingCapacity={remainingCapacity}
                  ticketsSold={ticketsSold}
                  onRegisterClick={() => setModalOpen(true)}
                  onCancelClick={handleCancelRegistration}
                />

                {/* Organizer Broadcast Tool */}
                {user && (event.organizer?.email === user || event.organizerId === user) && (
                  <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-dark-border pb-3">
                      <span className="text-neon-purple">⚡</span> Broadcast Update
                    </h3>
                    <form onSubmit={handleAddUpdate} className="space-y-3">
                      <input
                        required type="text" placeholder="Update Title"
                        value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)}
                        className="block w-full rounded border border-dark-border bg-black px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple font-mono"
                      />
                      <textarea
                        required rows={3} placeholder="Message content..."
                        value={broadcastContent} onChange={(e) => setBroadcastContent(e.target.value)}
                        className="block w-full rounded border border-dark-border bg-black px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple resize-none font-mono"
                      />
                      <button type="submit" className="w-full py-2 bg-neon-purple text-white text-xs font-bold rounded-lg hover:bg-neon-purple/90 transition-all">
                        Publish Live
                      </button>
                    </form>
                  </div>
                )}

                {/* Announcement Board - Only for Registered Users or Organizers */}
                {(isRegistered || (user && (event.organizer?.email === user || event.organizerId === user))) && (
                  <div className="bg-dark-card rounded-2xl border border-dark-border p-1">
                    <BulletinBoard updates={bulletins} />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[600px]">
                {user ? (
                  <EventChat 
                    eventId={selectedEventId || event.id} 
                    currentUser={chatUserData || {
                      name: "Student",
                      email: user
                    }} 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full max-w-md border border-zinc-800 rounded-xl bg-zinc-900/60 p-6 text-center backdrop-blur-md shadow-xl">
                    <div className="w-12 h-12 rounded-full bg-purple-600/10 flex items-center justify-center mb-4 border border-purple-500/20 text-purple-400 text-xl font-bold">
                      🔒
                    </div>
                    <h3 className="text-zinc-200 font-semibold text-base mb-2">Discussion Locked</h3>
                    <p className="text-zinc-400 text-xs max-w-[240px] mb-6 leading-relaxed">
                      Have questions about this event? Sign in to join the conversation room and connect with other students!
                    </p>
                    <a 
                      href="/login" 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-center text-sm font-medium py-2.5 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-purple-600/20"
                    >
                      Sign In to Access Chat
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Recommended Events */}
        {user && (
          <div className="pt-16 border-t border-dark-border/40">
            <RecommendedEvents userEmail={user} onSelectEvent={(id) => {
              if (onBack) onBack();
              // In real app, push router `/event?id=${id}`
            }} />
          </div>
        )}

      </div>

      <RegisterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleRegister}
        ticketType={event.ticketType}
        price={event.price}
      />
    </div>
  );
}
