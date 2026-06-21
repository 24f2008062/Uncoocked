"use client";

import React from "react";
import { X, Calendar, MapPin, Hash } from "lucide-react";

export default function TicketModal({
  open,
  onClose,
  eventTitle,
  eventDate,
  eventLocation,
  attendeeName,
  ticketId,
  ticketType,
}) {
  if (!open) return null;

  // We use api.qrserver.com to generate a quick QR code based on the ticketId
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticketId)}&color=bf40ff&bgcolor=000000`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Ticket Container */}
      <div className="relative w-full max-w-sm mx-auto animate-fadeIn">
        {/* Ticket Header (Stub) */}
        <div className="bg-neon-purple text-white p-4 rounded-t-2xl relative overflow-hidden flex items-center justify-between shadow-[0_0_40px_rgba(191,64,255,0.4)]">
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase opacity-80 block">
              Admit One
            </span>
            <span className="text-xl font-black uppercase tracking-wider">
              {ticketType} Ticket
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-black" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-black" />
        </div>

        {/* Ticket Body */}
        <div className="bg-zinc-950 border-x border-b border-dark-border p-6 rounded-b-2xl relative shadow-neon-thick">
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-black border-r border-b border-dark-border" />
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black border-l border-b border-dark-border" />

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white leading-tight mb-3">
                {eventTitle}
              </h2>
              <div className="space-y-1.5 text-xs text-gray-400 font-mono">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-neon-purple" />
                  <span>{eventDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-neon-purple" />
                  <span className="truncate">{eventLocation}</span>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center p-4 border-y border-dashed border-dark-border">
              <div className="bg-black p-2 rounded-xl border border-neon-purple/40 shadow-neon">
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="w-32 h-32 rounded-lg"
                />
              </div>
              <p className="mt-3 text-[10px] text-gray-500 font-mono text-center uppercase tracking-widest">
                Scan at entrance
              </p>
            </div>

            {/* Attendee Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-1">
                  Attendee
                </span>
                <span
                  className="text-xs text-white font-mono truncate block"
                  title={attendeeName}
                >
                  {attendeeName}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-1">
                  Ticket ID
                </span>
                <div className="flex items-center gap-1 text-xs text-neon-lavender font-mono">
                  <Hash className="h-3 w-3" />
                  <span>{ticketId.replace("TKT-", "")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
