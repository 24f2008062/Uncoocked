"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShieldOff,
  FileSearch,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const STATUS_MAP = {
  NOT_APPLIED: {
    title: "Not Applied",
    badge: "NOT APPLIED",
    icon: Clock,
    badgeStyle: "bg-gray-500/10 border-gray-500/30 text-gray-400",
    description: "You haven't submitted a host verification application yet.",
    ctaLabel: "Apply for Host Verification",
    ctaHref: "/host-verification/apply",
  },
  PENDING: {
    title: "Application Received",
    badge: "PENDING",
    icon: Clock,
    badgeStyle: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    description: "Your host verification request has been received and is queued for verification.",
    ctaLabel: null,
  },
  UNDER_REVIEW: {
    title: "Under Administrative Review",
    badge: "UNDER REVIEW",
    icon: FileSearch,
    badgeStyle: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    description: "Our administrative team is actively reviewing your credentials and event organization details.",
    ctaLabel: null,
  },
  NEEDS_MORE_INFORMATION: {
    title: "Action Required: Additional Information Needed",
    badge: "NEEDS MORE INFO",
    icon: AlertTriangle,
    badgeStyle: "bg-orange-500/10 border-orange-500/30 text-orange-400",
    description: "Reviewers have requested further details before approving your host status.",
    ctaLabel: "Re-submit Application",
    ctaHref: "/host-verification/resubmit",
  },
  APPROVED: {
    title: "Host Status Verified & Active",
    badge: "APPROVED",
    icon: CheckCircle,
    badgeStyle: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    description: "Congratulations! Your host verification is active. You can now host campus events.",
    ctaLabel: "Host an Event Now →",
    ctaHref: "/dashboard/organizer/new",
  },
  REJECTED: {
    title: "Application Not Approved",
    badge: "REJECTED",
    icon: XCircle,
    badgeStyle: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    description: "Your application was not approved. You can address the feedback below and re-apply.",
    ctaLabel: "Re-apply for Host Status",
    ctaHref: "/host-verification/resubmit",
  },
  SUSPENDED: {
    title: "Host Privilege Suspended",
    badge: "SUSPENDED",
    icon: ShieldOff,
    badgeStyle: "bg-red-600/15 border-red-600/40 text-red-500",
    description: "Your host verification status has been suspended. Please contact platform support.",
    ctaLabel: "Contact Support",
    ctaHref: "/contact",
  },
};

export default function HostVerificationStatusPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?callbackUrl=/host-verification/status");
      return;
    }

    if (user) {
      fetch("/api/host-verification/status")
        .then((res) => res.json())
        .then((resData) => setData(resData))
        .catch(() => setData(null))
        .finally(() => setFetching(false));
    }
  }, [user, isLoading, router]);

  if (isLoading || fetching) {
    return (
      <div className="min-h-[80vh] bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentStatus = data?.status || "NOT_APPLIED";
  const config = STATUS_MAP[currentStatus] || STATUS_MAP.NOT_APPLIED;
  const IconComponent = config.icon;

  return (
    <div className="min-h-[85vh] bg-black py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-purple-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="card p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${config.badgeStyle}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">{config.title}</h1>
                <p className="text-xs text-gray-400 mt-0.5">Host Verification State</p>
              </div>
            </div>
            <span className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-full border ${config.badgeStyle}`}>
              {config.badge}
            </span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">{config.description}</p>

          {/* Admin notes if provided */}
          {data?.notes && (
            <div className="bg-surface-3 border border-white/10 rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                Reviewer Feedback Notes
              </span>
              <p className="text-xs text-gray-200 whitespace-pre-wrap">{data.notes}</p>
            </div>
          )}

          {/* Submitted metadata */}
          {data?.submittedAt && (
            <div className="text-[11px] text-gray-500 pt-1">
              Submitted on: {new Date(data.submittedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}

          {/* CTA Buttons */}
          {config.ctaLabel && (
            <div className="pt-2">
              <button
                onClick={() => router.push(config.ctaHref)}
                className="btn-primary w-full py-3 font-bold"
              >
                {config.ctaLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
