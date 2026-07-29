"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Calendar, MapPin, Hash, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import { createPortal } from "react-dom";
import { toast } from "sonner";

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
  const ticketRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  const handleDownload = async () => {
    if (!ticketRef.current) {
      toast.error("Ticket is not ready to download yet.");
      return;
    }
    
    try {
      setIsDownloading(true);
      
      // Wait for any React re-renders to flush
      await new Promise(resolve => setTimeout(resolve, 150));

      const dataUrl = await toPng(ticketRef.current, {
        backgroundColor: "#000000",
        pixelRatio: 2, // High resolution
        cacheBust: true,
      });

      if (!dataUrl || dataUrl === "data:,") {
        throw new Error("Generated image is empty.");
      }

      const link = document.createElement("a");
      link.download = `${(eventTitle || "event").replace(/[^a-z0-9]/gi, '_').toLowerCase()}-ticket.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("Download Error:", err);
      toast.error(`Failed to download ticket: ${err.message || "Unknown error"}. Please try again or take a screenshot.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Wrapper to handle centering independently from the captured element */}
      <div className="relative w-full max-w-sm mx-auto animate-fadeIn flex flex-col gap-4">
        
        {/* The Capture Target (No fixed positioning, no backdrop filters, raw hex colors) */}
        <div ref={ticketRef} className="w-full relative overflow-hidden rounded-2xl bg-black">
          
          {/* Ticket Header */}
          <div className="bg-[#A855F7] text-white p-4 relative flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase opacity-80 block">
                Admit One
              </span>
              <span className="text-xl font-black uppercase tracking-wider">
                {ticketType || "Free"} Ticket
              </span>
            </div>
            
            {/* We hide this button during download via a boolean */}
            {!isDownloading && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-black/20 rounded-full transition-colors"
                data-html2canvas-ignore="true"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            {/* Ticket punches */}
            <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-black" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-black" />
          </div>

          {/* Ticket Body */}
          <div className="bg-[#111111] border-x border-b border-white/10 p-6 relative">
            <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-black border-r border-b border-white/10" />
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black border-l border-b border-white/10" />

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white leading-tight mb-3">
                  {eventTitle}
                </h2>
                <div className="space-y-1.5 text-xs text-gray-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#A855F7]" />
                    <span>{eventDate ? new Date(eventDate).toLocaleString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : "TBA"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#A855F7]" />
                    <span className="text-gray-300 leading-relaxed">{eventLocation}</span>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center p-4 border-y border-dashed border-white/10">
                <div className="bg-white p-2 rounded-xl flex items-center justify-center">
                  <QRCodeCanvas 
                    value={ticketId || "TKT-000000"} 
                    size={120} 
                    fgColor="#000000"
                    bgColor="#ffffff"
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
                  <div className="flex items-center gap-1 text-xs text-[#C084FC] font-mono">
                    <Hash className="h-3 w-3" />
                    <span>{(ticketId || "TKT-000000").replace("TKT-", "")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Action */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full py-3 bg-[#A855F7] hover:bg-[#C084FC] text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> 
          {isDownloading ? "Generating Image..." : "Download Ticket"}
        </button>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}
