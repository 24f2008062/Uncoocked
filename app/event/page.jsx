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
      const res = await fetch("/api/events", { cache: "no-store" });
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

  // 1. Sync state with URL parameter on mount & handle browser back arrow navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      setSelectedEventId(id); // Synchronizes the view when browser back/forward buttons are pressed

      // If going back to all events list view, auto-scroll gracefully to explorer area
      if (!id) {
        setTimeout(() => {
          const explorerElement = document.getElementById("events-explorer-anchor");
          if (explorerElement) {
            explorerElement.scrollIntoView({ behavior: "smooth" });
          }
        }, 50);
      }
    };

    // Check URL parameters on mount
    const params = new URLSearchParams(window.location.search);
    const initialId = params.get("id");
    if (initialId) {
      setSelectedEventId(initialId);
    }

    const hash = window.location.hash;
    if (hash === "#command-center" && !initialId) {
      setTimeout(() => {
        const el = document.getElementById("command-center");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }

    // Attach native popstate listener for the top-left browser back arrow button
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // 2. Custom function to safely open an event and alter browser history stack state
  const handleSelectEvent = (id) => {
    setSelectedEventId(id);
    if (typeof window !== "undefined" && window.history.pushState) {
      // Pushes a history entry state so the browser back button registers it as a page forward movement
      window.history.pushState({ eventId: id }, "", `/event?id=${id}`);
    }
  };

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
        organizerId: selectedEvent.organizerId || selectedEvent.organizer?.email,
      };

      const chatUserData = {
        name: user?.fullName || user?.name || "Student",
        email: user?.email || (typeof user === "string" ? user : "anonymous@student.com"),
      };

      return (
        <div className="bg-[#000000] w-full min-h-screen text-white">
          <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-12 max-w-7xl mx-auto">
            <TwinLayout
              event={eventData}
              chatUserData={chatUserData}
              selectedEventId={selectedEventId}
              onBack={() => {
                window.history.back();
              }}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="bg-[#000000] w-full min-h-screen pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Events
          </h1>
          <p className="text-[12px] font-medium text-white/45 max-w-xl leading-relaxed">
            Discover workshops, hackathons, fests, competitions and campus events happening around you.
          </p>
        </div>

        <div id="events-explorer-anchor" className="pt-0" />

        <EventsExplorer
          events={allEvents}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectEvent={handleSelectEvent} // Swapped to our new route history action
          recommendedSection={
            user && (
              <RecommendedEvents 
                userEmail={typeof user === "string" ? user : user?.email} 
                onSelectEvent={handleSelectEvent} 
              />
            )
          }
        />
      </div>
    </div>
  );
}