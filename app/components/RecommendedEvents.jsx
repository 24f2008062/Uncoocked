"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Bookmark, Sparkles } from "lucide-react";

export default function RecommendedEvents({ userEmail, onSelectEvent }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/recommendations?email=${encodeURIComponent(userEmail)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Could not load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchRecommendations();
    }
  }, [userEmail]);

  const handleSaveEvent = async (eventId) => {
    try {
      await fetch('/api/events/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          eventId,
          interactionType: 'SAVE'
        })
      });
      // Optionally show a toast or feedback
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewEvent = async (eventId) => {
    // Record view
    try {
      await fetch('/api/events/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          eventId,
          interactionType: 'VIEW'
        })
      });
    } catch (err) {
      console.error(err);
    }
    // Navigate
    onSelectEvent(eventId);
  };

  if (!userEmail) return null;
  if (loading) {
    return (
      <div className="w-full py-8 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-zinc-900 rounded-lg"></div>
        <div className="flex gap-4 overflow-hidden">
          {[1,2,3].map(i => <div key={i} className="min-w-[300px] h-48 bg-zinc-900 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="w-full py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-neon-purple" />
          <h2 className="text-2xl font-black text-white tracking-tight">Recommended For You</h2>
        </div>
        <button 
          onClick={fetchRecommendations}
          className="text-xs font-bold text-neon-purple hover:text-neon-lavender transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
        {recommendations.map((ev, idx) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="snap-start shrink-0 w-[300px] sm:w-[340px] group flex flex-col overflow-hidden bg-zinc-950/80 backdrop-blur-md border border-neon-purple/30 hover:border-neon-purple shadow-[0_0_15px_rgba(191,64,255,0.1)] hover:shadow-[0_0_25px_rgba(191,64,255,0.3)] rounded-2xl transition-all duration-300"
          >
            {/* Banner */}
            <div className="relative h-36 w-full overflow-hidden bg-zinc-900 border-b border-dark-border/40">
              {ev.bannerUrl ? (
                <img
                  src={ev.bannerUrl}
                  alt={ev.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-neon-purple/20 via-zinc-900 to-zinc-950 flex items-center justify-center p-4 text-center">
                  <span className="font-black text-sm text-white/90 neon-text-glow leading-snug line-clamp-2 tracking-wide">
                    {ev.title}
                  </span>
                </div>
              )}
              {/* Badge */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-[10px] font-extrabold text-white px-2 py-1 rounded-md flex items-center gap-1 border border-dark-border/50">
                <Sparkles className="h-3 w-3 text-neon-lavender" />
                <span>{Math.round(ev.recommendationScore || 0)}% Match</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleSaveEvent(ev.id); }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-md border border-dark-border/50 text-gray-300 hover:text-neon-purple transition-colors"
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 space-y-3">
              <div>
                <h3 className="text-sm font-extrabold text-white group-hover:text-neon-lavender transition-colors line-clamp-1">
                  {ev.title}
                </h3>
                <p className="text-[10px] text-neon-purple font-mono mt-1">
                  {ev.recommendationReason}
                </p>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-neon-purple" />
                  <span>{new Date(ev.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="h-3 w-3 text-neon-purple shrink-0" />
                  <span className="truncate">{ev.location.split(',')[0]}</span>
                </div>
              </div>

              <button
                onClick={() => handleViewEvent(ev.id)}
                className="mt-auto w-full flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-zinc-900 border border-dark-border text-white hover:bg-neon-purple hover:border-neon-purple font-bold transition-all"
              >
                View Details
                <ArrowRight className="h-3 w-3 shrink-0" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
