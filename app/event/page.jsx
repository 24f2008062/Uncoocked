"use client";

import { useState, useEffect } from "react";
import TwinLayout from "@/app/components/TwinLayout";
import EventsExplorer from "@/app/components/EventsExplorer";
import RecommendedEvents from "@/app/components/RecommendedEvents";
import { useUser } from "@/app/context/UserContext";
import EventChat from "@/app/components/EventChat";

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

  // If an event is selected, render TwinLayout details page view along with the Chatroom
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
        <div className="bg-black w-full min-h-screen text-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto items-start">
            
            <div className="lg:col-span-2 w-full min-w-0">
              <TwinLayout
                event={eventData}
                onBack={() => {
                  // Simply call browser's native back history navigation sequence
                  // This triggers our 'popstate' listener above, maintaining absolute consistency!
                  window.history.back();
                }}
              />
            </div>
            
            <div className="lg:col-span-1 w-full flex justify-center lg:justify-end sticky top-24 z-10">
              {user ? (
                <EventChat 
                  eventId={selectedEventId} 
                  currentUser={chatUserData} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[480px] w-full max-w-md border border-zinc-800 rounded-xl bg-zinc-900/60 p-6 text-center backdrop-blur-md shadow-xl">
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

          </div>
        </div>
      );
    }
  }

  return (
    <div className="bg-black w-full min-h-screen pt-8 pb-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {user && (
          <RecommendedEvents 
            userEmail={typeof user === "string" ? user : user?.email} 
            onSelectEvent={handleSelectEvent} // Swapped to our new route history action
          />
        )}

        <div id="events-explorer-anchor" className="pt-2" />

        <EventsExplorer
          events={allEvents}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectEvent={handleSelectEvent} // Swapped to our new route history action
        />
      </div>
    </div>
  );
}