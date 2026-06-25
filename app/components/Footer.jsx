"use client";

import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { usePathname } from "next/navigation";

export default function Footer() {
  const { role, user } = useUser();
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname === "/opportunities") return null;

  return (
    <footer className="w-full bg-black border-t border-dark-border py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-neon-purple to-neon-lavender bg-clip-text text-transparent neon-text-glow">
              UNCOOKED
            </span>
            <p className="text-xs text-gray-400 leading-relaxed">
              Empowering campus students and event organizers with zero-noise
              event coordination and ticketing tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href={user ? "/dashboard" : "/"}
                  className="text-gray-400 hover:text-neon-purple transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/event"
                  className="text-gray-400 hover:text-neon-purple transition-colors"
                >
                  Browse Events
                </Link>
              </li>
              <li>
                <Link
                  href="/opportunities"
                  className="text-gray-400 hover:text-neon-purple transition-colors"
                >
                  Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Resource Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-neon-purple transition-colors"
                >
                  Contact Support
                </Link>
              </li>

            </ul>
          </div>

          {/* Updates Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Stay in the Loop
            </h4>
            <p className="text-xs text-gray-400">
              Get notified when new fests, parties, or workshops open.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2 max-w-sm"
            >
              <input
                type="email"
                placeholder="student@campus.edu"
                className="flex-1 min-w-0 rounded-md border border-dark-border bg-dark-card px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
                required
              />

              <button
                type="submit"
                className="px-3 py-2 rounded-md bg-neon-purple text-white text-xs font-bold hover:bg-neon-purple/90 transition-all shadow-neon"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Footer Base */}
        <div className="mt-12 pt-8 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {currentYear} Uncooked. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neon-purple transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-neon-purple transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-neon-purple transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
