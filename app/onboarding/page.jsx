"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const SUGGESTED_CATEGORIES = [
  "Technology", "Startups", "AI & Machine Learning", "Programming", 
  "Gaming & Esports", "Music", "Business", "Finance", "Education", 
  "Workshops", "Networking", "Sports", "Art & Design", "Photography", 
  "Health & Fitness", "Food & Drinks", "Entertainment", "Cultural Events", 
  "Career & Jobs", "Community Events"
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading: isContextLoading } = useUser();
  const { update, status } = useSession();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  // If no mock user session is active, go to login
  useEffect(() => {
    if (!isContextLoading && !user) {
      router.push("/login");
    }
  }, [user, isContextLoading, router]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/users/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user || "demo@campus.edu",
          interests: selectedInterests
        })
      });
      if (res.ok) {
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("onboarding_just_completed", "true");
          }
        } catch (e) {
          console.warn("localStorage error:", e);
        }

        if (status === "authenticated") {
          try {
            if (typeof update === 'function') {
              const p = update({ onboardingCompleted: true });
              if (p && p.catch) p.catch(e => console.error(e));
            }
          } catch (e) {
            console.error("Session update error:", e);
          }
        }

        // Force browser redirect immediately
        window.location.href = "/event";
      } else {
        console.error("Failed to save interests");
        setIsSaving(false);
      }
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  if (isContextLoading || !user) return null; // Prevent flicker

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full space-y-8 bg-zinc-950/50 p-8 rounded-3xl border border-dark-border"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight neon-text-glow text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-lavender">
            Personalize Your Feed
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Select the topics you&apos;re interested in so we can recommend the best events for you.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {SUGGESTED_CATEGORIES.map((category) => {
            const isSelected = selectedInterests.includes(category);
            return (
              <button
                key={category}
                onClick={() => toggleInterest(category)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  isSelected 
                    ? "bg-neon-purple text-white shadow-neon scale-105 border border-neon-purple" 
                    : "bg-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-800 border border-dark-border"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 border-t border-dark-border/50">
          <button
            onClick={async () => {
              setIsSkipping(true);
              try {
                const res = await fetch("/api/users/onboarding", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: user || "demo@campus.edu",
                    interests: []
                  })
                });
                if (res.ok) {
                  try {
                    if (typeof window !== "undefined") {
                      localStorage.setItem("onboarding_just_completed", "true");
                    }
                  } catch (e) {
                    console.warn("localStorage error:", e);
                  }
                  
                  if (status === "authenticated") {
                    try {
                      if (typeof update === 'function') {
                        const p = update({ onboardingCompleted: true });
                        if (p && p.catch) p.catch(e => console.error(e));
                      }
                    } catch (e) {
                      console.error("Session update error:", e);
                    }
                  }
                  
                  // Force browser redirect immediately
                  window.location.href = "/event";
                } else {
                  setIsSkipping(false);
                }
              } catch (err) {
                console.error(err);
                setIsSkipping(false);
              }
            }}
            disabled={isSaving || isSkipping}
            className="w-full sm:w-auto px-6 py-3 bg-zinc-900 text-gray-400 hover:text-white text-sm font-bold rounded-xl transition-all"
          >
            {isSkipping ? "Skipping..." : "Skip for now"}
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving || isSkipping || selectedInterests.length === 0}
            className="w-full sm:w-auto px-8 py-3 bg-neon-purple text-white text-sm font-bold rounded-xl hover:bg-neon-purple/90 transition-all shadow-neon disabled:opacity-50 disabled:scale-100"
          >
            {isSaving ? "Saving..." : (selectedInterests.length === 0 ? "Select interests to save" : "Save Preferences")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
