"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import HostVerificationForm from "@/app/components/host-verification/HostVerificationForm";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HostVerificationApplyPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?callbackUrl=/host-verification/apply");
      return;
    }

    if (user) {
      fetch("/api/host-verification/status")
        .then((r) => r.json())
        .then((data) => {
          // Task 13: Prevent access to apply page if user is already PENDING, UNDER_REVIEW, or APPROVED
          if (["PENDING", "UNDER_REVIEW", "APPROVED"].includes(data.status)) {
            router.replace("/host-verification/status");
          } else {
            setCheckingStatus(false);
          }
        })
        .catch(() => setCheckingStatus(false));
    }
  }, [user, isLoading, router]);

  if (isLoading || checkingStatus) {
    return (
      <div className="min-h-[80vh] bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Host Verification Application</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Verify your organization credentials to publish & manage campus events.
              </p>
            </div>
          </div>

          <HostVerificationForm />
        </div>
      </div>
    </div>
  );
}
