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
  const [localTicketsSold, setLocalTicketsSold] = useState(event._count?.registrations || 0);
  
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchRegistrations = async () => {
      try {
        let userRegs = [];
        if (user) {
          const userRes = await fetch(`/api/registrations?email=${encodeURIComponent(user)}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData.success) {
              userRegs = userData.registrations.filter(r => r.eventId === event.id).map(r => ({
                ...r,
                email: r.user?.email || "",
                name: r.user?.name || "",
                github: r.user?.portfolioUrl || "",
                ts: new Date(r.registeredAt).getTime(),
              }));
            }
          }
        }

        let allRegs = [];
        if (user && (event.organizer?.email === user || event.organizerId === user)) {
          const res = await fetch(`/api/registrations?eventId=${event.id}&requesterEmail=${encodeURIComponent(user)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              allRegs = data.registrations.map(r => ({
                ...r,
                email: r.user?.email || "",
                name: r.user?.name || "",
                github: r.user?.portfolioUrl || "",
                ts: new Date(r.registeredAt).getTime(),
              }));
            }
          }
        }

        if (isMounted) {
          setRegistrations(allRegs.length > 0 ? allRegs : userRegs);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRegistrations();
    return () => { isMounted = false; };
  }, [event.id, user, event.organizer, event.organizerId]);

  async function handleRegister(payload) {
    setModalOpen(false);
    try {
      const isFull = event.capacity ? localTicketsSold >= event.capacity : false;
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
        if (finalStatus !== "Waitlisted") {
          setLocalTicketsSold(prev => prev + 1);
        }
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
      if (regToCancel.status !== "Waitlisted") {
        setLocalTicketsSold(prev => Math.max(0, prev - 1));
      }
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

  const ticketsSold = localTicketsSold;
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
              <div className="w-full h-56 md:h-64 rounded-2xl overflow-hidden border border-white/6 relative mb-6">
                {event.bannerUrl ? (
                  <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#1a1a1a]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10 max-w-2xl">
                  {event.category && (
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase bg-[#A855F7]/20 border border-[#A855F7]/30 px-2 py-0.5 rounded mb-3 inline-block">
                      {event.category}
                    </span>
                  )}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
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
            <div className="bg-[#111111] p-1 rounded-lg border border-white/8 flex w-full">
              <button
                onClick={() => setActiveSidebarTab("amenities")}
                className={`flex-1 py-1.5 text-[12px] font-semibold rounded-md transition-all ${
                  activeSidebarTab === "amenities"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                Amenities
              </button>
              <button
                onClick={() => setActiveSidebarTab("discussion")}
                className={`flex-1 py-1.5 text-[12px] font-semibold rounded-md transition-all ${
                  activeSidebarTab === "discussion"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
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
                  <div className="bg-[#111111] border border-white/8 rounded-xl p-4 space-y-3 shadow-sm">
                    <h3 className="text-[12px] font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/6 pb-2">
                      <span className="text-[#A855F7]">⚡</span> Broadcast Update
                    </h3>
                    <form onSubmit={handleAddUpdate} className="space-y-2">
                      <input
                        required type="text" placeholder="Update Title"
                        value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)}
                        className="input"
                      />
                      <textarea
                        required rows={3} placeholder="Message content..."
                        value={broadcastContent} onChange={(e) => setBroadcastContent(e.target.value)}
                        className="input resize-none"
                      />
                      <button type="submit" className="btn-primary w-full text-[12px]">
                        Publish Live
                      </button>
                    </form>
                  </div>
                )}

                {/* Announcement Board - Only for Registered Users or Organizers */}
                {(isRegistered || (user && (event.organizer?.email === user || event.organizerId === user))) && (
                  <div className="bg-[#111111] rounded-xl border border-white/8 p-1 shadow-sm">
                    <BulletinBoard updates={bulletins} />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[400px]">
                {user ? (
                  <EventChat 
                    eventId={selectedEventId || event.id} 
                    currentUser={chatUserData || {
                      name: "Student",
                      email: user
                    }} 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full max-w-md border border-white/8 rounded-xl bg-[#111111] p-6 text-center shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 text-white/50">
                      <Flag className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-semibold text-[14px] mb-1">Discussion Locked</h3>
                    <p className="text-white/40 text-[12px] max-w-[200px] mb-4 leading-relaxed">
                      Sign in to join the conversation and connect with others.
                    </p>
                    <a 
                      href="/login" 
                      className="btn-primary text-[12px] px-6"
                    >
                      Sign In
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
