"use client";

import { useEffect, useState, useCallback, use } from "react";

export default function ApplicationDetailPage({ params }) {
  const { id } = use(params);
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/applications/${id}`);
    const result = await res.json();
    if (result.success) {
      setApp(result.data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount/deps-change
    fetchApplication();
  }, [fetchApplication]);

  async function handleAction(actionType) {
  if (!confirm(`Are you sure you want to perform: ${actionType}?`)) return;
  setSubmitting(true);
  try {
    const res = await fetch(`/api/admin/applications/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: actionType, notes: note }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setNote("");
      await fetchApplication();
    } else {
      alert(`Action failed: ${data.error || res.statusText}`);
    }
  } catch (err) {
    alert(`Network/Client error: ${err.message}`);
  } finally {
    setSubmitting(false);
  }
}

  async function logDocAccess(docName) {
    await fetch("/api/admin/audit-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "DOCUMENT_VIEWED",
        applicationId: id,
        details: `Viewed document: ${docName}`,
      }),
    });
    fetchApplication();
  }

  if (loading) return <div className="p-8 text-white">Loading application details...</div>;
  if (!app) return <div className="p-8 text-white">Application not found.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto text-white space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold">{app.organizationName}</h1>
          <p className="text-gray-400">Applicant: {app.user?.fullName || app.user?.name} ({app.user?.email})</p>
        </div>
        <span className="px-3 py-1 rounded bg-blue-900/50 text-blue-300 font-medium">
          Status: {app.status}
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Application Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200">Organization Details</h2>
            <p><strong>Type:</strong> {app.organizationType}</p>
            <p><strong>Website:</strong> {app.website || "N/A"}</p>
            <p><strong>Description:</strong> {app.description || "N/A"}</p>
          </div>

          {/* KYC / Supporting Docs */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200">Identity & Verification Documents</h2>
            <p><strong>KYC Status:</strong> Verified</p>
            {app.idProofUrl && (
              <a
                href={app.idProofUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => logDocAccess("ID Proof")}
                className="inline-block text-blue-400 underline hover:text-blue-300"
              >
                View ID Document (Access Logged)
              </a>
            )}
          </div>

          {/* Review Actions */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200">Admin Actions</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter review notes, feedback, or suspension reasons..."
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded text-white focus:outline-none focus:border-zinc-500"
              rows={3}
            />
            <div className="flex flex-wrap gap-3">
              {app.status !== "APPROVED" && (
                <button
                  disabled={submitting}
                  onClick={() => handleAction("APPROVE")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
                >
                  Approve Host
                </button>
              )}
              {app.status === "APPROVED" && (
                <button
                  disabled={submitting}
                  onClick={() => handleAction("SUSPEND")}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
                >
                  Suspend Host
                </button>
              )}
              {app.status === "SUSPENDED" && (
                <button
                  disabled={submitting}
                  onClick={() => handleAction("REINSTATE")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
                >
                  Reinstate Host
                </button>
              )}
              <button
                disabled={submitting}
                onClick={() => handleAction("REQUEST_INFO")}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
              >
                Request Info
              </button>
              <button
                disabled={submitting}
                onClick={() => handleAction("REJECT")}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>

        {/* Audit Log / Application Timeline Side Panel */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4 h-fit">
          <h2 className="text-lg font-semibold text-zinc-200">Application Timeline</h2>
          <div className="space-y-4 border-l-2 border-zinc-700 pl-4">
            {app.auditLogs && app.auditLogs.length > 0 ? (
              app.auditLogs.map((log) => (
                <div key={log.id} className="space-y-1 text-sm">
                  <p className="font-semibold text-zinc-300">{log.action}</p>
                  {log.reason && <p className="text-zinc-400 italic">&ldquo;{log.reason}&rdquo;</p>}
                  <p className="text-xs text-zinc-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}