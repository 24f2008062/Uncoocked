"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Bell,
  CheckCircle2,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCheck,
} from "lucide-react";

export default function NotificationCenterPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?page=${page}&limit=15`);
      const data = await res.json();

      if (res.status === 401) {
        router.push("/login?callbackUrl=/notifications");
        return;
      }

      if (res.ok && data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [page, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount/deps-change
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        toast.success("All notifications marked as read!");
      }
    } catch (err) {
      toast.error("Failed to mark all read");
      console.error("Mark all read error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        toast.success("Notification deleted");
      }
    } catch (err) {
      toast.error("Failed to delete notification");
      console.error("Delete notification error:", err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "VERIFICATION":
        return <Building2 className="w-4 h-4 text-amber-400" />;
      case "GOVERNANCE":
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      case "SECURITY":
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case "MODERATION":
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-500 text-xs font-mono font-bold tracking-wider uppercase mb-1">
            <Bell className="w-4 h-4" /> User Notification Center
          </div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-amber-500 text-black text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-400 mt-1">Platform updates, host application status notices, and governance alerts.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchNotifications}
            className="bg-neutral-900 hover:bg-neutral-800 text-gray-300 text-xs font-bold px-3.5 py-2 rounded-lg border border-neutral-800 transition flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-4 py-2 rounded-lg border border-neutral-700 transition flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mx-auto" />
            <p className="text-sm font-bold text-gray-300">You are all caught up!</p>
            <p className="text-xs text-gray-500">No notifications to show at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/60">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 flex items-start justify-between gap-4 transition ${
                  !n.read ? "bg-amber-500/5" : "hover:bg-neutral-800/30"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-black/50 border border-neutral-800 shrink-0 mt-0.5">
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white leading-tight">{n.title}</h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-gray-500 font-mono pt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-xs font-semibold text-amber-400 hover:underline px-2 py-1 rounded bg-black/40 border border-neutral-800"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-neutral-800 transition"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
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
