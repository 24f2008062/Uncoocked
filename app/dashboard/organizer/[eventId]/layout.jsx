"use client";

import { use } from "react";

import { useUser } from "@/app/context/UserContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  Ticket, 
  BarChart3, 
  Settings, 
  ArrowLeft 
} from "lucide-react";

export default function OrganizerLayout({ children, params }) {
  const { user, role } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const unwrappedParams = use(params);
  const eventId = unwrappedParams.eventId;

  // Protect the route
  if (!user || role !== "organizer") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-dark-card border border-dark-border p-8 rounded-2xl text-center shadow-neon max-w-md w-full">
          <span className="text-4xl block mb-4">🛡️</span>
          <h2 className="text-xl font-bold text-white mb-2">Organizer Access Only</h2>
          <p className="text-xs text-gray-400 mb-6">You must be logged in as an organizer to access this dashboard.</p>
          <button onClick={() => router.push("/dashboard")} className="w-full py-2 bg-neon-purple text-white text-xs font-bold rounded hover:bg-neon-purple/90 transition-all">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: `/dashboard/organizer/${eventId}` },
    { label: "Attendees", icon: Users, href: `/dashboard/organizer/${eventId}/attendees` },
    { label: "Announcements", icon: Megaphone, href: `/dashboard/organizer/${eventId}/announcements` },
    { label: "Tickets", icon: Ticket, href: `/dashboard/organizer/${eventId}/tickets` },
    { label: "Analytics", icon: BarChart3, href: `/dashboard/organizer/${eventId}/analytics` },
    { label: "Settings", icon: Settings, href: `/dashboard/organizer/${eventId}/settings` },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-dark-card border-r border-dark-border flex flex-col shrink-0 md:sticky md:top-0 md:h-screen z-10">
        <div className="p-6 border-b border-dark-border flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-black text-white leading-tight">Event Console</h2>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5 truncate max-w-[150px]">{eventId}</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  isActive 
                    ? "bg-neon-purple/10 text-neon-lavender border border-neon-purple/30 shadow-[0_0_15px_rgba(191,64,255,0.1)]" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-neon-purple" : "text-gray-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
