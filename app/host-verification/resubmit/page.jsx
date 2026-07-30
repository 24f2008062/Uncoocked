"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import HostVerificationForm from "@/app/components/host-verification/HostVerificationForm";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function HostVerificationResubmitPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?callbackUrl=/host-verification/resubmit");
      return;
    }

    if (user) {
      fetch("/api/host-verification/status")
        .then((res) => res.json())
        .then((resData) => {
          if (!["NEEDS_MORE_INFORMATION", "REJECTED"].includes(resData.status)) {
            router.replace("/host-verification/status");
          } else {
            setData(resData);
            setFetching(false);
          }
        })
        .catch(() => setFetching(false));
    }
  }, [user, isLoading, router]);

  if (isLoading || fetching) {
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
          href="/host-verification/status"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-purple-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Status Overview
        </Link>

        <div className="card p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Re-submit Verification Application</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Address reviewer feedback and submit your updated credentials.
              </p>
            </div>
          </div>

          {data?.notes && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                Feedback / Notes from Reviewer
              </span>
              <p className="text-xs text-gray-200 whitespace-pre-wrap">{data.notes}</p>
            </div>
          )}

          <HostVerificationForm initialData={data?.record} isResubmit={true} />
        </div>
      </div>
    </div>
  );
}
