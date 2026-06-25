"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";

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

export default function HostEventModal({
  open,
  onClose,
  onSaved,
  editingEvent,
}) {
  const { user } = useUser();
  const isEditing = !!editingEvent;

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
  const [newCity, setNewCity] = useState("Lucknow"); // Hardcoded for MVP

  useEffect(() => {
    if (editingEvent) {
      setNewTitle(editingEvent.title);
      setNewType(editingEvent.type);
      setNewDate(editingEvent.date);
      setNewLocation(editingEvent.location);
      setNewDescription(editingEvent.description);
      setNewBannerUrl(editingEvent.bannerUrl || "");
      setNewTicketType(editingEvent.ticketType || "Free");
      setNewPrice(editingEvent.price || 0);
      setNewCapacity(editingEvent.capacity || 100);
      setNewWaitlistEnabled(editingEvent.waitlistEnabled ?? true);
      setNewCity(editingEvent.city || "Lucknow");
    } else {
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
      setNewCity("Lucknow");
    }
  }, [editingEvent, open]);

  if (!open) return null;

  const handleHostNewEvent = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to host an event.");
      return;
    }

    try {
      const eventPayload = {
        id: isEditing && editingEvent ? editingEvent.id : `hosted-ev-${Date.now()}`,
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
        city: newCity,
        organizerId: user,
      };

      let res;
      if (isEditing && editingEvent) {
        res = await fetch(`/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        });
      } else {
        res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        });
      }

      if (!res.ok) throw new Error("Failed to save event to database");
      
      alert(`Successfully ${isEditing ? 'updated' : 'launched'} event: ${newTitle}`);

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save event. Please check the logs.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-dark-card border border-dark-border p-6 rounded-2xl shadow-neon relative space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-500">
                City <span className="text-neon-purple">(MVP Lock)</span>
              </label>
              <input
                readOnly
                type="text"
                value={newCity}
                className="w-full px-3 py-2 bg-zinc-900 border border-dark-border rounded-lg text-xs text-gray-400 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-500">
                Area / Venue
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Gomti Nagar"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-dark-border rounded-lg text-xs text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
              />
            </div>
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
              onClick={onClose}
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
  );
}
