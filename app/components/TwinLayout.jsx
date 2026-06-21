"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BulletinBoard from "./BulletinBoard";
import RegisterModal from "./RegisterModal";
import { useUser } from "@/app/context/UserContext";

export default function TwinLayout({ event, onBack }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [localUserEmail, setLocalUserEmail] = useState(null);
  const router = useRouter();

  // Broadcast states
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");

  // User context
  const { user, role } = useUser();

  // Dynamic board updates & registration states
  const [bulletins, setBulletins] = useState(event.bulletinUpdates);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(
          localStorage.getItem("registrations") || "[]",
        );
        const filtered = stored.filter((r) => r.eventId === event.id);
        const timer = setTimeout(() => setRegistrations(filtered), 0);
        return () => clearTimeout(timer);
      } catch {
        // ignore
      }
    }
  }, [event.id]);

  async function handleRegister(payload) {
    // Simulate network call / record submission. Replace with real API call later.
    await new Promise((r) => setTimeout(r, 700));
    setModalOpen(false);
    setJustRegistered(true);
    setTimeout(() => setJustRegistered(false), 4000);
    // Optionally, persist to localStorage or fire analytics here.
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(
          localStorage.getItem("registrations") || "[]",
        );
        // Check capacity again right before insert
        const currentTicketsSold = stored.filter(
          (r) => r.eventId === event.id && r.status !== "Waitlisted",
        ).length;
        const isFull = event.capacity
          ? currentTicketsSold >= event.capacity
          : false;
        const finalStatus =
          isFull && event.waitlistEnabled ? "Waitlisted" : "Confirmed";
        const ticketId =
          "TKT-" + Math.random().toString(36).substr(2, 9).toUpperCase();

        const newReg = {
          ...payload,
          email: user || payload.email, // Force binding to logged in user so it shows in dashboard
          eventId: event.id,
          ts: Date.now(),
          status: finalStatus,
          ticketId: finalStatus === "Confirmed" ? ticketId : undefined,
        };
        stored.push(newReg);
        localStorage.setItem("registrations", JSON.stringify(stored));
        // update guest list state
        setRegistrations((prev) => [...prev, newReg]);
        setLocalUserEmail(payload.email);
        window.dispatchEvent(new Event("storage"));
      } catch {
        // ignore
      }
    }
  }

  const handleCancelRegistration = (eventId) => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(
          localStorage.getItem("registrations") || "[]",
        );
        const activeEmail =
          user ||
          localUserEmail ||
          (userRegistration && userRegistration.email);
        if (activeEmail) {
          const updated = stored.filter(
            (reg) => !(reg.email === activeEmail && reg.eventId === eventId),
          );
          localStorage.setItem("registrations", JSON.stringify(updated));
          // update state
          setRegistrations((prev) =>
            prev.filter((r) => r.email !== activeEmail),
          );
          if (!user) {
            setLocalUserEmail(null);
          }
          window.dispatchEvent(new Event("storage"));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddUpdate = (newUpdate) => {
    const fresh = {
      id: `update-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title: newUpdate.title,
      content: newUpdate.content,
    };
    setBulletins((prev) => [fresh, ...prev]);

    // Also persist update if it is a custom hosted event
    if (typeof window !== "undefined") {
      try {
        const storedHostedStr = localStorage.getItem("hosted_events");
        if (storedHostedStr) {
          const hosted = JSON.parse(storedHostedStr);
          const updated = hosted.map((hEv) => {
            if (hEv.id === event.id) {
              const updates = hEv.bulletinUpdates || [];
              updates.unshift(fresh);
              return { ...hEv, bulletinUpdates: updates };
            }
            return hEv;
          });
          localStorage.setItem("hosted_events", JSON.stringify(updated));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastContent.trim()) return;

    handleAddUpdate({
      title: broadcastTitle.trim(),
      content: broadcastContent.trim(),
    });

    setBroadcastTitle("");
    setBroadcastContent("");
  };

  const activeEmail = user || localUserEmail;
  const userRegistration = registrations.find((r) => r.email === activeEmail);
  const isRegistered = !!userRegistration;

  // Capacity calculations
  const ticketsSold = registrations.filter(
    (r) => r.status !== "Waitlisted",
  ).length;
  const remainingCapacity = event.capacity
    ? Math.max(0, event.capacity - ticketsSold)
    : null;
  const isSoldOut = event.capacity ? remainingCapacity === 0 : false;
  const isWaitlistOnly = isSoldOut && event.waitlistEnabled;

  return (
    <div className="w-full bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-neon-purple transition-all"
          >
            ← Back to All Events
          </button>
        )}
        {/* Event Banner Image */}
        {event.bannerUrl && (
          <div className="mb-8 w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-dark-border shadow-[0_0_30px_rgba(191,64,255,0.15)] relative">
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>
        )}
        {/* Event Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-dark-border/40 pb-8">
          {/* Left Column (Category, Title, Timings) */}
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-extrabold text-neon-purple tracking-wider uppercase block neon-text-glow">
              📅 Campus Showcase & Event Hub
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 text-gray-400 font-mono text-xs pt-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neon-purple">📅</span>
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neon-purple">📍</span>
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Right Column (Description) */}
          {event.description && (
            <div className="max-w-md bg-dark-card border border-dark-border/40 p-4 rounded-xl shadow-sm text-left md:self-end">
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* Three-Column Layout: Left (Details) + Middle (Bulletins) + Right (Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 1. Left Column: Event Details (5/12 width) */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-start">
            {/* Schedule Section */}
            {event.schedule && (
              <div className="bg-dark-card rounded-lg p-6 border border-dark-border shadow-neon">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-neon-purple">📋</span> Schedule
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h3: ({ node: _node, ...props }) => (
                        <h3
                          className="text-xs font-bold uppercase tracking-wider text-white mt-4 mb-2 font-mono"
                          {...props}
                        />
                      ),
                      p: ({ node: _node, ...props }) => (
                        <p
                          className="text-gray-300 text-[11px] mb-2"
                          {...props}
                        />
                      ),
                      ul: ({ node: _node, ...props }) => (
                        <ul
                          className="list-disc list-inside text-gray-300 text-[11px] space-y-1 ml-2"
                          {...props}
                        />
                      ),
                      li: ({ node: _node, ...props }) => (
                        <li className="text-gray-300 text-[11px]" {...props} />
                      ),
                      strong: ({ node: _node, ...props }) => (
                        <strong
                          className="font-bold text-neon-purple font-mono"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {event.schedule}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Prize Pool Section */}
            {event.prizePool && (
              <div className="bg-dark-card rounded-lg p-6 border border-dark-border shadow-neon">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-neon-purple">🏆</span> Prize Pool
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h3: ({ node: _node, ...props }) => (
                        <h3
                          className="text-xs font-bold uppercase tracking-wider text-white mt-4 mb-2 font-mono"
                          {...props}
                        />
                      ),
                      p: ({ node: _node, ...props }) => (
                        <p
                          className="text-gray-300 text-[11px] mb-2"
                          {...props}
                        />
                      ),
                      ul: ({ node: _node, ...props }) => (
                        <ul
                          className="list-disc list-inside text-gray-300 text-[11px] space-y-1 ml-2"
                          {...props}
                        />
                      ),
                      li: ({ node: _node, ...props }) => (
                        <li className="text-gray-300 text-[11px]" {...props} />
                      ),
                      strong: ({ node: _node, ...props }) => (
                        <strong
                          className="font-bold text-neon-purple font-mono"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {event.prizePool}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {/* 2. Middle Column: Bulletin Board (4/12 width) */}
          <div className="lg:col-span-4 h-full">
            <BulletinBoard updates={bulletins} onAddUpdate={undefined} />
          </div>

          {/* 3. Right Column: Action Console (3/12 width) */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Attendee Booking Panel */}
              <div className="flex flex-col rounded-lg bg-dark-card border border-dark-border p-6 space-y-4 shadow-neon">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-dark-border pb-3">
                  <span>🎫</span> Booking Console
                </h3>

                {isRegistered ? (
                  <div className="space-y-4">
                    <div
                      className={`p-4 border rounded-lg space-y-2 ${userRegistration.status === "Waitlisted" ? "bg-yellow-950/20 border-yellow-800/40" : "bg-emerald-950/20 border-emerald-800/40"}`}
                    >
                      <div
                        className={`flex items-center gap-2 text-xs font-bold uppercase ${userRegistration.status === "Waitlisted" ? "text-yellow-400" : "text-emerald-400"}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full animate-pulse ${userRegistration.status === "Waitlisted" ? "bg-yellow-500" : "bg-emerald-500"}`}
                        />
                        {userRegistration.status === "Waitlisted"
                          ? "On Waitlist"
                          : "Ticket Secured"}
                      </div>
                      <div className="text-[11px] text-gray-300 font-mono space-y-1 leading-normal pt-1">
                        <div>
                          <span className="text-gray-500">Name:</span>{" "}
                          {userRegistration.name}
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>{" "}
                          {userRegistration.email}
                        </div>
                        {userRegistration.ticketId && (
                          <div>
                            <span className="text-gray-500">Ticket ID:</span>{" "}
                            {userRegistration.ticketId}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelRegistration(event.id)}
                      className="w-full py-2.5 bg-neutral-900 border border-red-950/60 hover:bg-red-950/10 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg transition-all"
                    >
                      {userRegistration.status === "Waitlisted"
                        ? "Leave Waitlist"
                        : "Cancel Booking"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {isWaitlistOnly
                        ? "This event is currently sold out. Join the waitlist to be notified if spots open up."
                        : "Register your spot and invite teammates for this campus event."}
                    </p>

                    {event.capacity && !isSoldOut && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                          <span>Capacity</span>
                          <span>{remainingCapacity} left</span>
                        </div>
                        <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-dark-border">
                          <div
                            className="h-full bg-neon-purple shadow-neon rounded-full"
                            style={{
                              width: `${(ticketsSold / event.capacity) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {!isSoldOut || isWaitlistOnly ? (
                      user ? (
                        <button
                          onClick={() => setModalOpen(true)}
                          className="w-full py-3 bg-neon-purple text-white font-extrabold text-xs uppercase tracking-wider rounded-md hover:bg-neon-purple/90 transition-all shadow-neon hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {isWaitlistOnly
                            ? "🕒 Join Waitlist"
                            : event.ticketType === "Paid"
                              ? `🛒 Buy Ticket - $${event.price}`
                              : "🎫 Secure Free Ticket"}
                        </button>
                      ) : (
                        <button
                          onClick={() => router.push("/login")}
                          className="w-full py-3 bg-neutral-900 border border-dark-border text-gray-400 font-extrabold text-xs uppercase tracking-wider rounded-md hover:text-white transition-all hover:border-gray-500"
                        >
                          Sign in to Register
                        </button>
                      )
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 bg-zinc-900 text-gray-500 font-extrabold text-xs uppercase tracking-wider rounded-md border border-dark-border cursor-not-allowed"
                      >
                        🚫 Sold Out
                      </button>
                    )}

                    {justRegistered && (
                      <div className="text-[10px] text-green-300 bg-green-950/40 border border-green-800/60 p-2.5 rounded text-center">
                        ✓ Booking submitted! Check your student inbox.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Event Organizer Access Area */}
              {user && role === "organizer" && event.hostEmail === user && (
                <div className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4 shadow-neon">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-dark-border pb-3">
                    <span className="text-neon-purple">⚡</span> Organizer
                    Shortcuts
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Student booking guest lists, check-in sheets, and hosted
                    activities are managed inside the console.
                  </p>
                  <Link
                    href="/dashboard"
                    className="w-full block text-center py-2.5 bg-neutral-900 border border-dark-border hover:border-neon-purple/40 text-white hover:text-neon-purple text-xs font-bold rounded-lg transition-all mb-4"
                  >
                    Go to Dashboard
                  </Link>

                  {/* Broadcast Composer Form (Shifted to the Right Action Rail) */}
                  <form
                    onSubmit={handleFormSubmit}
                    className="pt-4 border-t border-dark-border/40 space-y-3"
                  >
                    <h4 className="text-[10px] font-bold text-neon-purple uppercase tracking-wider">
                      Broadcast New Update
                    </h4>

                    <div className="space-y-1">
                      <label
                        htmlFor="right-broadcast-title"
                        className="block text-[9px] font-semibold text-gray-400"
                      >
                        Update Title
                      </label>
                      <input
                        id="right-broadcast-title"
                        required
                        type="text"
                        placeholder="e.g. Venue Change / Schedule Update"
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        className="block w-full rounded border border-dark-border bg-black px-2 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="right-broadcast-content"
                        className="block text-[9px] font-semibold text-gray-400"
                      >
                        Message Content
                      </label>
                      <textarea
                        id="right-broadcast-content"
                        required
                        rows={3}
                        placeholder="Provide details..."
                        value={broadcastContent}
                        onChange={(e) => setBroadcastContent(e.target.value)}
                        className="block w-full rounded border border-dark-border bg-black px-2 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple resize-none font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-neon-purple text-white text-xs font-bold rounded-lg hover:bg-neon-purple/90 transition-all shadow-neon"
                    >
                      Publish Live Update
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
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
