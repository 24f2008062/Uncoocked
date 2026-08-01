"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ApplicationsQueuePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "ALL";
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Queue Data
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (currentStatus !== "ALL") query.set("status", currentStatus);
      if (debouncedSearch) query.set("search", debouncedSearch);
      query.set("page", page.toString());
      query.set("limit", "10");

      const res = await fetch(`/api/admin/applications?${query.toString()}`);
      const result = await res.json();

      if (res.ok) {
        setApplications(result.data || []);
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages || 1);
          setTotalCount(result.pagination.total || 0);
        }
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  }, [currentStatus, debouncedSearch, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount/deps-change
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusFilter = (status) => {
    setPage(1);
    if (status === "ALL") {
      router.push("/admin/applications");
    } else {
      router.push(`/admin/applications?status=${status}`);
    }
  };

  // CSV Export Handler
  const exportQueueCSV = () => {
    if (!applications.length) return;
    const headers = ["Applicant Name", "Applicant Email", "Organization Name", "Organization Type", "Submitted Date", "Status"];
    const rows = applications.map((app) => [
      `"${app.user?.name || app.user?.fullName || "N/A"}"`,
      app.user?.email || "N/A",
      `"${app.organizationName || "N/A"}"`,
      `"${app.organizationType || "N/A"}"`,
      new Date(app.createdAt).toLocaleDateString(),
      app.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `applications_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusTabs = [
    { label: "ALL", value: "ALL" },
    { label: "PENDING", value: "PENDING" },
    { label: "UNDER REVIEW", value: "UNDER_REVIEW" },
    { label: "NEEDS MORE INFO", value: "NEEDS_MORE_INFORMATION" },
    { label: "APPROVED", value: "APPROVED" },
    { label: "REJECTED", value: "REJECTED" },
    { label: "SUSPENDED", value: "SUSPENDED" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black">Host Verification Queue</h1>
        <p className="text-xs text-gray-400 mt-1">
          Review, approve, or reject incoming organizer host applications.
        </p>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="space-y-4">
        {/* Search Bar & Export Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search by applicant name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neutral-600"
          />
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              Total Results: <strong className="text-white">{totalCount}</strong>
            </span>
            <button
              onClick={exportQueueCSV}
              disabled={!applications.length}
              className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-xs font-bold px-4 py-2 rounded-lg border border-neutral-700 transition flex items-center gap-1.5"
            >
              Export CSV 📥
            </button>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-4">
          {statusTabs.map((tab) => {
            const isActive = currentStatus === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleStatusFilter(tab.value)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  isActive
                    ? "bg-amber-500 text-black"
                    : "bg-neutral-900 text-gray-400 border border-neutral-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950 text-gray-400 font-semibold uppercase tracking-wider">
              <th className="p-4">Applicant</th>
              <th className="p-4">Organization</th>
              <th className="p-4">Submitted Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Loading applications queue...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No applications found matching your current filter criteria.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-neutral-800/40 transition">
                  <td className="p-4 font-medium">
                    <div>
                      <p className="font-bold text-white">
                        {app.user?.name || app.user?.fullName || "N/A"}
                      </p>
                      <p className="text-[10px] text-gray-500">{app.user?.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-300 font-semibold">{app.organizationName || "N/A"}</p>
                    <p className="text-[10px] text-gray-500">{app.organizationType || "N/A"}</p>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        app.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : app.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : app.status === "SUSPENDED"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : app.status === "REJECTED"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-3 py-1.5 rounded-md transition inline-block text-[11px]"
                    >
                      Review Application
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-neutral-800 text-xs">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded bg-neutral-800 disabled:opacity-40 hover:bg-neutral-700 transition"
            >
              ← Previous
            </button>
            <span className="text-gray-400">
              Page <strong className="text-white">{page}</strong> of{" "}
              <strong className="text-white">{totalPages}</strong>
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded bg-neutral-800 disabled:opacity-40 hover:bg-neutral-700 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}