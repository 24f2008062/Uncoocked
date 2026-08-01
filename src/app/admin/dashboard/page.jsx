"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (res.ok) setStats(data.stats);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { title: "Pending Reviews", value: stats?.pendingCount ?? 0, href: "/admin/applications?status=PENDING", color: "border-amber-500/30 text-amber-400" },
    { title: "Under Review", value: stats?.underReviewCount ?? 0, href: "/admin/applications?status=UNDER_REVIEW", color: "border-blue-500/30 text-blue-400" },
    { title: "Action Needed", value: stats?.needsInfoCount ?? 0, href: "/admin/applications?status=NEEDS_MORE_INFORMATION", color: "border-purple-500/30 text-purple-400" },
    { title: "Approved Hosts", value: stats?.approvedCount ?? 0, href: "/admin/applications?status=APPROVED", color: "border-emerald-500/30 text-emerald-400" },
    { title: "Suspended Hosts", value: stats?.suspendedCount ?? 0, href: "/admin/applications?status=SUSPENDED", color: "border-rose-500/30 text-rose-400" },
    { title: "Total Applications", value: stats?.totalApplications ?? 0, href: "/admin/applications", color: "border-neutral-800 text-white" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Super Admin Overview</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time stats for event host verification and management.</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading overview metrics...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <Link
              key={i}
              href={card.href}
              className={`bg-neutral-900 border ${card.color} p-6 rounded-xl hover:bg-neutral-800/80 transition flex flex-col justify-between`}
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</p>
              <p className={`text-3xl font-black mt-2 ${card.color.split(" ")[1]}`}>{card.value}</p>
            </Link>
          ))}
        </div>
      )}

     {/* Host Verification Queue Callout Card */}
<div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
  <div className="space-y-1 max-w-lg">
    <h3 className="text-lg font-bold text-white tracking-tight">Host Verification Queue</h3>
    <p className="text-xs text-gray-400 leading-relaxed">
      Manage pending registrations, review credentials, and check incoming event host applications.
    </p>
  </div>
  
  <Link
    href="/admin/applications"
    className="bg-white hover:bg-gray-200 text-black font-extrabold text-xs px-4 py-2.5 rounded-lg transition shrink-0 shadow-sm"
  >
    View Full Queue →
  </Link>
</div>
    </div>
  );
}