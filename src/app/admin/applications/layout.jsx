"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Applications Queue", href: "/admin/applications" },
    { label: "Audit Logs", href: "/admin/audit-logs" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Admin Navigation Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="text-lg font-black tracking-wider text-amber-500">
              UNCOOKED <span className="text-xs font-bold text-white uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">Admin</span>
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      isActive ? "bg-neutral-800 text-white" : "text-gray-400 hover:text-white hover:bg-neutral-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-gray-400 font-mono">Super Admin Console</span>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}