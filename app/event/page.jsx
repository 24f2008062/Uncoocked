"use client";

import { useState, useEffect } from "react";
import TwinLayout from "@/app/components/TwinLayout";
import EventsExplorer from "@/app/components/EventsExplorer";
import RecommendedEvents from "@/app/components/RecommendedEvents";
import { useUser } from "@/app/context/UserContext";

export default function EventPage() {
  const { user } = useUser();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allEvents, setAllEvents] = useState([]);

  const loadEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) {
        setAllEvents(data.events);
      }
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Check URL query parameters and hash on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id) {
        setSelectedEventId(id);
      }

      const hash = window.location.hash;
      if (hash === "#command-center" && !selectedEventId) {
        setTimeout(() => {
          const el = document.getElementById("command-center");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      }
    }
  }, [selectedEventId]);

  // If an event is selected, render TwinLayout details page view
  if (selectedEventId) {
    const selectedEvent = allEvents.find((e) => e.id === selectedEventId);
    if (selectedEvent) {
      const eventData = {
        ...selectedEvent,
        schedule:
          selectedEvent.schedule ||
          `
### Schedule Details
- **Day 1**: Orientation & Kickoff
- **Day 2**: Project Submissions & Coding Sprints
- **Day 3**: Judging panel evaluations & Ceremony
        `,
        prizePool:
          selectedEvent.prizePool ||
          `
### Prize Structure
- **🥇 Grand Prize Winner**: Custom Trophies & Compute Credits
- **🥈 Runner Up**: Custom swag packs & certificate of excellence
        `,
        bulletinUpdates: selectedEvent.bulletinUpdates || [],
        bannerUrl: selectedEvent.bannerUrl || "",
        hostEmail: selectedEvent.hostEmail,
      };
      return (
        <div className="bg-black w-full min-h-screen">
          <TwinLayout
            event={eventData}
            onBack={() => {
              setSelectedEventId(null);
              // Clean up URL query param and hash when going back
              if (window.history.pushState) {
                window.history.pushState({}, "", "/event");
              } else {
                window.location.href = "/event";
              }
            }}
          />
        </div>
      );
    }
  }

  return (
    <div className="bg-black w-full min-h-screen pt-8 pb-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {user && (
          <RecommendedEvents 
            userEmail={user} 
            onSelectEvent={setSelectedEventId} 
          />
        )}

        {/* Unified Events Explorer */}
        <EventsExplorer
          events={allEvents}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectEvent={setSelectedEventId}
        />
      </div>
    </div>
  );
}
