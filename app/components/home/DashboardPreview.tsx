'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, Send, CheckCircle, Radio, Settings, Terminal } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section className="py-16 relative w-full border-t border-white/5 bg-zinc-950/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-neon-purple tracking-widest uppercase block neon-text-glow">Control Panel</span>
          <h2 className="text-3xl font-black text-white tracking-tight sm:text-4xl">Student Console Dashboard</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-normal">
            Organizers and students organize events, manage registrations, check guest lists, and broadcast announcements from one clean console.
          </p>
        </div>

        {/* Dashboard Mockup Grid */}
        <div className="bg-zinc-950/60 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(191,64,255,0.03)] backdrop-blur-xl max-w-5xl mx-auto space-y-6">
          
          {/* Header controls bar */}
          <div className="flex flex-wrap justify-between items-center pb-4 border-b border-white/5 gap-3 font-mono text-[10px] text-gray-500">
            <div className="flex items-center gap-2 text-white font-bold">
              <Terminal className="h-4 w-4 text-neon-purple" />
              <span>STUDENT_CONSOLE_WORKSPACE // HOME_DASHBOARD</span>
            </div>
            <div className="flex items-center gap-4">
              <span>DB_REFRESH: OK</span>
              <span>STABILITY: 100%</span>
              <Settings className="h-3.5 w-3.5 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Main Dashboard Panels Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Side Column: Attending & Hosted (col-span-7) */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              
              {/* Attending Events Card */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-4 flex-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2.5 font-mono">
                  <Calendar className="h-4 w-4 text-neon-purple" /> Attending Events
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-lg hover:border-neon-purple/20 transition-colors">
                    <div>
                      <span className="block text-[11px] font-bold text-white leading-none">Annual Cultural Fest 2026</span>
                      <span className="text-[9px] text-gray-500 mt-1 block">Starts in 3 days ● Venue: Main Arena</span>
                    </div>
                    <span className="text-[9px] bg-green-950/40 text-green-400 border border-green-800/40 px-2.5 py-0.5 rounded-full font-bold">ACTIVE</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-lg hover:border-neon-purple/20 transition-colors">
                    <div>
                      <span className="block text-[11px] font-bold text-white leading-none">Grand Dandiya Festive Night 2026</span>
                      <span className="text-[9px] text-gray-500 mt-1 block">Starts in 28 days ● Venue: Auditorium Hall</span>
                    </div>
                    <span className="text-[9px] bg-zinc-900 text-gray-400 border border-white/10 px-2.5 py-0.5 rounded-full font-bold">UPCOMING</span>
                  </div>
                </div>
              </div>

              {/* Hosted Events Card */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-4 flex-1 mt-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2.5 font-mono">
                  <Radio className="h-4 w-4 text-neon-purple animate-pulse" /> Hosted Operations
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-lg hover:border-neon-purple/20 transition-colors">
                    <div>
                      <span className="block text-[11px] font-bold text-white leading-none">Generative AI & LLM Workshop</span>
                      <span className="text-[9px] text-gray-500 mt-1 block">145 Attendees Registered</span>
                    </div>
                    <span className="text-[9px] bg-neon-purple/10 text-neon-lavender border border-neon-purple/20 px-2.5 py-0.5 rounded-full font-bold">ORGANIZER</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side Column: Guest List & Broadcast Composer (col-span-5) */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              
              {/* Registration Guest List Card */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-4 flex-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2.5 font-mono">
                  <Users className="h-4 w-4 text-neon-purple" /> Live Attendee Guest List
                </h3>

                <div className="space-y-3 font-mono text-[10px] text-gray-400 max-h-36 overflow-hidden">
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span>👤 John Doe (john@campus.edu)</span>
                    <span className="text-white font-bold">CS & Tech</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span>👤 Alice Smith (alice@campus.edu)</span>
                    <span className="text-white font-bold">Engineering</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span>👤 Bob Johnson (bob@campus.edu)</span>
                    <span className="text-white font-bold">Fine Arts & Design</span>
                  </div>
                </div>
              </div>

              {/* Broadcast Composer Card */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-4 flex-1 mt-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2.5 font-mono">
                  <Send className="h-4 w-4 text-neon-purple" /> Broadcast Composer
                </h3>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <input
                      disabled
                      placeholder="Title: e.g. Pizza Room update"
                      className="block w-full rounded-md border border-white/10 bg-black/60 px-3 py-2 text-[10px] text-white placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <textarea
                      disabled
                      rows={2}
                      placeholder="Enter update logs to broadcast..."
                      className="block w-full rounded-md border border-white/10 bg-black/60 px-3 py-2 text-[10px] text-white placeholder:text-gray-600 focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    disabled
                    className="w-full py-2 bg-neon-purple text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 opacity-80 cursor-not-allowed"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Publish Broadcast Log
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
