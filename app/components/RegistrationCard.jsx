"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatDistanceToNow, isPast } from "date-fns";

export default function RegistrationCard({ 
  event, 
  user, 
  userRegistration, 
  isRegistered, 
  isSoldOut, 
  isWaitlistOnly, 
  remainingCapacity, 
  ticketsSold, 
  onRegisterClick,
  onCancelClick 
}) {
  const [timeLeft, setTimeLeft] = useState("");
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    // Countdown timer logic
    if (!event.date) return;
    
    const calculateTimeLeft = () => {
      const eventDate = new Date(event.date);
      if (isPast(eventDate)) {
        return "Event Started";
      }
      return formatDistanceToNow(eventDate, { addSuffix: true });
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // update every minute
    
    return () => clearInterval(timer);
  }, [event.date]);

  const handleDownloadTicket = () => {
    window.print(); // Simple trick to download as PDF
  };

  const handleAddToCalendar = () => {
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.date.replace(/-|:|\.\d\d\d/g,"")}/${event.date.replace(/-|:|\.\d\d\d/g,"")}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col rounded-2xl bg-dark-card border border-dark-border p-6 shadow-neon relative overflow-hidden group">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 blur-[50px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
      
      {/* Timer */}
      {timeLeft && (
        <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-lavender text-[10px] font-mono font-bold self-start w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
          {timeLeft === "Event Started" ? "Happening Now" : `Starts ${timeLeft}`}
        </div>
      )}

      {isRegistered ? (
        <div className="space-y-5 z-10">
          <div className={`p-4 border rounded-xl space-y-3 ${userRegistration.status === "Waitlisted" ? "bg-yellow-950/20 border-yellow-800/40" : "bg-emerald-950/20 border-emerald-800/40"}`}>
            <div className={`flex items-center gap-2 text-xs font-bold uppercase ${userRegistration.status === "Waitlisted" ? "text-yellow-400" : "text-emerald-400"}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${userRegistration.status === "Waitlisted" ? "bg-yellow-500" : "bg-emerald-500"}`} />
              {userRegistration.status === "Waitlisted" ? "On Waitlist" : "Ticket Confirmed"}
            </div>
            
            {userRegistration.status === "Confirmed" && userRegistration.ticketId && (
              <div className="bg-white p-3 rounded-lg flex items-center justify-center my-4 w-full">
                <QRCodeSVG value={userRegistration.ticketId} size={150} />
              </div>
            )}
            
            <div className="text-[11px] text-gray-300 font-mono space-y-1.5 leading-normal">
              <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-500">Name:</span> <span>{userRegistration.name}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-500">Email:</span> <span>{userRegistration.email}</span></div>
              {userRegistration.ticketId && (
                <div className="flex justify-between pt-1"><span className="text-gray-500">Ticket ID:</span> <span className="font-bold text-white">{userRegistration.ticketId}</span></div>
              )}
            </div>
          </div>

          {userRegistration.status === "Confirmed" && (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleDownloadTicket} className="py-2.5 bg-zinc-900 border border-dark-border hover:border-gray-500 text-white text-[10px] font-bold rounded-lg transition-all text-center">
                Download Ticket
              </button>
              <button onClick={handleAddToCalendar} className="py-2.5 bg-zinc-900 border border-dark-border hover:border-gray-500 text-white text-[10px] font-bold rounded-lg transition-all text-center">
                Add to Calendar
              </button>
            </div>
          )}

          <button onClick={() => onCancelClick(event.id)} className="w-full py-2.5 bg-neutral-900 border border-red-950/60 hover:bg-red-950/10 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg transition-all">
            {userRegistration.status === "Waitlisted" ? "Leave Waitlist" : "Cancel Booking"}
          </button>
        </div>
      ) : (
        <div className="space-y-6 z-10">
          <div className="pb-4 border-b border-dark-border">
            <h3 className="text-2xl font-black text-white">
              {event.ticketType === "Paid" ? `$${event.price}` : "Free"}
            </h3>
            <p className="text-xs text-gray-400 mt-1">General Admission</p>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
            {isWaitlistOnly ? "This event is currently sold out. Join the waitlist." : "Register your spot now before it's too late."}
          </p>

          {event.capacity && !isSoldOut && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>Registration Limit</span>
                <span className="text-white font-bold">{remainingCapacity} seats left</span>
              </div>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-dark-border">
                <div className="h-full bg-gradient-to-r from-neon-purple to-neon-lavender shadow-neon rounded-full" style={{ width: `${(ticketsSold / event.capacity) * 100}%` }} />
              </div>
            </div>
          )}

          {!isSoldOut || isWaitlistOnly ? (
            user ? (
              <button onClick={onRegisterClick} className="w-full py-3.5 bg-neon-purple text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-neon-purple/90 transition-all shadow-neon hover:scale-[1.02] active:scale-[0.98]">
                {isWaitlistOnly ? "Join Waitlist" : "Register Now"}
              </button>
            ) : (
              <button onClick={onRegisterClick} className="w-full py-3.5 bg-neutral-900 border border-dark-border text-gray-400 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:text-white transition-all hover:border-gray-500">
                Sign in to Register
              </button>
            )
          ) : (
            <button disabled className="w-full py-3.5 bg-zinc-900 text-gray-500 font-extrabold text-xs uppercase tracking-wider rounded-xl border border-dark-border cursor-not-allowed">
              🚫 Sold Out
            </button>
          )}
        </div>
      )}
    </div>
  );
}
