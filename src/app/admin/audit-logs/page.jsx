"use client";

import { useEffect, useState, useCallback } from "react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (actionFilter !== "ALL") query.set("action", actionFilter);
      if (debouncedSearch) query.set("search", debouncedSearch);
      query.set("page", page.toString());
      query.set("limit", "15");

      const res = await fetch(`/api/admin/audit-logs?${query.toString()}`);
      const result = await res.json();

      if (res.ok) {
        setLogs(result.data || []);
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages || 1);
          setTotalCount(result.pagination.total || 0);
        }
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setLoading(false);
    }
  }, [actionFilter, debouncedSearch, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount/deps-change
    fetchLogs();
  }, [fetchLogs]);

  const exportCSV = () => {
    if (!logs.length) return;
    const headers = ["Timestamp", "Admin Email", "Action", "Org Name", "Previous Status", "New Status", "Reason"];
    const rows = logs.map((log) => [
      new Date(log.timestamp).toLocaleString(),
      log.admin?.email || "System",
      log.action,
      log.application?.organizationName || "N/A",
      log.previousStatus || "N/A",
      log.newStatus || "N/A",
      `"${(log.reason || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">System Audit Trail</h1>
          <p className="text-xs text-gray-400 mt-1">Immutable security and state-transition logs across all host applications.</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={!logs.length}
          className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-xs font-bold px-4 py-2 rounded-lg border border-neutral-700 transition"
        >
          Export CSV 📥
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by admin email or organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neutral-600"
          />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
          >
            <option value="ALL">All Actions</option>
            <option value="APPLICATION_APPROVE">Approve</option>
            <option value="APPLICATION_REJECT">Reject</option>
            <option value="APPLICATION_REQUEST_INFO">Request Info</option>
            <option value="APPLICATION_SUSPEND">Suspend</option>
            <option value="APPLICATION_REINSTATE">Reinstate</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">Total Entries:</span>
          <span className="font-bold">{totalCount}</span>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950 text-gray-400 font-semibold uppercase tracking-wider">
              <th className="p-4">Timestamp</th>
              <th className="p-4">Admin User</th>
              <th className="p-4">Action</th>
              <th className="p-4">Organization</th>
              <th className="p-4">Transition</th>
              <th className="p-4">Reason / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Loading system audit records...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No audit entries found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-800/40 transition">
                  <td className="p-4 text-gray-400 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 font-semibold text-white">{log.admin?.email || "System"}</td>
                  <td className="p-4 font-mono font-bold text-amber-400 text-[11px]">{log.action}</td>
                  <td className="p-4 text-gray-300">{log.application?.organizationName || "N/A"}</td>
                  <td className="p-4">
                    <span className="text-gray-400">{log.previousStatus || "N/A"}</span>
                    <span className="text-gray-500 mx-1">→</span>
                    <span className="text-emerald-400 font-bold">{log.newStatus || "N/A"}</span>
                  </td>
                  <td className="p-4 text-gray-400 truncate max-w-xs">{log.reason || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

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
              Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
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