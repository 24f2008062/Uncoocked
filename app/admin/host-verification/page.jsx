"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileSearch,
  ShieldOff,
  Clock,
  ExternalLink,
  FileText,
  MessageSquare,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const STATUS_BADGES = {
  PENDING: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  UNDER_REVIEW: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  NEEDS_MORE_INFORMATION: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  APPROVED: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  REJECTED: "bg-rose-500/10 border-rose-500/30 text-rose-400",
  SUSPENDED: "bg-red-600/15 border-red-600/40 text-red-500",
  NOT_APPLIED: "bg-gray-500/10 border-gray-500/30 text-gray-400",
};

export default function AdminHostVerificationPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [notesInput, setNotesInput] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const url = statusFilter !== "ALL" 
        ? `/api/admin/host-verification?status=${statusFilter}`
        : "/api/admin/host-verification";
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          toast.error("Admin access required.");
          router.push("/dashboard");
          return;
        }
        throw new Error("Failed to load applications");
      }
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load host verification applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?callbackUrl=/admin/host-verification");
      return;
    }
    if (user) {
      fetchApplications();
    }
  }, [user, isLoading, statusFilter]);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/host-verification/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          notes: notesInput.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success(`Application updated to ${newStatus}`);
      setSelectedApp(null);
      setNotesInput("");
      await fetchApplications();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const name = (app.applicantUser?.fullName || app.applicantUser?.name || "").toLowerCase();
    const email = (app.applicantUser?.email || "").toLowerCase();
    const org = (app.orgName || "").toLowerCase();
    const club = (app.clubName || "").toLowerCase();
    return name.includes(term) || email.includes(term) || org.includes(term) || club.includes(term);
  });

  if (isLoading || loading) {
    return (
      <div className="min-h-[80vh] bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-black py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-purple-500" />
              Super Admin: Host Verification Console
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Review, approve, request details, reject, or suspend organizer verification applications.
            </p>
          </div>
          <button
            onClick={fetchApplications}
            className="self-start sm:self-auto px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh List
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {["ALL", "PENDING", "UNDER_REVIEW", "NEEDS_MORE_INFORMATION", "APPROVED", "REJECTED", "SUSPENDED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-colors ${
                  statusFilter === st
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-surface-2 text-gray-400 hover:text-white hover:bg-surface-3 border border-white/5"
                }`}
              >
                {st.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search user, email, org..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-2 border border-white/10 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Applications List Grid */}
        {filteredApplications.length === 0 ? (
          <div className="bg-[#111111] border border-white/10 border-dashed rounded-2xl p-12 text-center space-y-3">
            <FileSearch className="w-10 h-10 text-gray-600 mx-auto" />
            <p className="text-sm text-gray-400 font-medium">No host verification applications found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((app) => {
              const badgeClass = STATUS_BADGES[app.status] || STATUS_BADGES.NOT_APPLIED;
              const isSelected = selectedApp?.id === app.id;

              return (
                <div
                  key={app.id}
                  className={`bg-[#111111] border rounded-2xl p-6 transition-all space-y-4 ${
                    isSelected ? "border-purple-500 shadow-lg ring-1 ring-purple-500/20" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/6 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-white">
                          {app.applicantUser?.fullName || app.applicantUser?.name || "Applicant"}
                        </h3>
                        <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${badgeClass}`}>
                          {app.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono">{app.applicantUser?.email}</p>
                    </div>

                    <div className="text-[11px] text-gray-500 self-start sm:self-auto font-mono">
                      Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "N/A"}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">College / Organization</span>
                      <span className="text-gray-200 font-semibold">{app.orgName || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">Club / Department</span>
                      <span className="text-gray-200 font-semibold">{app.clubName || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">Applicant Designation / Role</span>
                      <span className="text-gray-200 font-semibold">{app.applicantRole || "N/A"}</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Planned Event Description</span>
                    <p className="text-gray-300 bg-surface-2 p-3 rounded-lg leading-relaxed">{app.eventDescription}</p>
                  </div>

                  {/* Portfolio & Documents */}
                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    {app.portfolioUrl && (
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Portfolio Link
                      </a>
                    )}

                    {app.documentsParsed && app.documentsParsed.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-gray-500 text-[11px] font-bold flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-purple-400" /> Documents ({app.documentsParsed.length}):
                        </span>
                        {app.documentsParsed.map((doc, idx) => (
                          <a
                            key={doc.id || idx}
                            href={doc.url || doc.data}
                            download={doc.name}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-1 bg-surface-3 border border-white/10 hover:border-purple-500/50 rounded text-[11px] text-gray-300 hover:text-white transition-colors"
                          >
                            {doc.name || `Document ${idx + 1}`}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Feedback Notes Display */}
                  {app.notes && (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-xs space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">Existing Reviewer Feedback</span>
                      <p className="text-gray-300">{app.notes}</p>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-white/6 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        if (isSelected) {
                          setSelectedApp(null);
                        } else {
                          setSelectedApp(app);
                          setNotesInput(app.notes || "");
                        }
                      }}
                      className="px-3 py-1.5 bg-surface-2 hover:bg-surface-3 border border-white/10 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                      {isSelected ? "Close Action Panel" : "Review & Update Status"}
                    </button>
                  </div>

                  {/* Expandable Review Action Panel */}
                  {isSelected && (
                    <div className="bg-surface-2 border border-purple-500/30 rounded-xl p-5 space-y-4 animate-fadeIn">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Update Host Status & Submit Reviewer Notes
                      </h4>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-gray-400">
                          Reviewer Feedback / Reason Notes (sent to applicant):
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Provide reasons or details for approving, requesting more info, rejecting, or suspending..."
                          value={notesInput}
                          onChange={(e) => setNotesInput(e.target.value)}
                          className="w-full p-3 bg-black border border-white/10 rounded-lg text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 resize-none"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          disabled={updating}
                          onClick={() => handleUpdateStatus(app.id, "APPROVED")}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve Application
                        </button>

                        <button
                          disabled={updating}
                          onClick={() => handleUpdateStatus(app.id, "NEEDS_MORE_INFORMATION")}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <AlertTriangle className="w-4 h-4" /> Request More Information
                        </button>

                        <button
                          disabled={updating}
                          onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                          className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" /> Reject Application
                        </button>

                        <button
                          disabled={updating}
                          onClick={() => handleUpdateStatus(app.id, "SUSPENDED")}
                          className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <ShieldOff className="w-4 h-4" /> Suspend Privileges
                        </button>

                        <button
                          disabled={updating}
                          onClick={() => handleUpdateStatus(app.id, "UNDER_REVIEW")}
                          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <FileSearch className="w-4 h-4" /> Mark Under Review
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
