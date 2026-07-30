"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { toast } from "sonner";

/**
 * Returns a function that checks the caller's host-verification status
 * then navigates to the appropriate page according to state:
 * - NOT_APPLIED -> /host-verification/apply
 * - PENDING, UNDER_REVIEW, REJECTED, SUSPENDED -> /host-verification/status
 * - NEEDS_MORE_INFORMATION -> /host-verification/resubmit
 * - APPROVED -> /dashboard/organizer/new
 */
export function useHostVerificationRedirect() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  return async function navigateToHostEvent() {
    if (isLoading) return;

    if (!user) {
      router.push("/login?callbackUrl=/dashboard/organizer/new");
      return;
    }

    try {
      const res = await fetch("/api/host-verification/status");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?callbackUrl=/dashboard/organizer/new");
          return;
        }
        throw new Error("Failed to query verification status");
      }

      const data = await res.json();
      const status = data.status || "NOT_APPLIED";

      switch (status) {
        case "APPROVED":
          router.push("/dashboard/organizer/new");
          break;
        case "NOT_APPLIED":
          router.push("/host-verification/apply");
          break;
        case "NEEDS_MORE_INFORMATION":
          router.push("/host-verification/resubmit");
          break;
        case "PENDING":
        case "UNDER_REVIEW":
        case "REJECTED":
        case "SUSPENDED":
        default:
          router.push("/host-verification/status");
          break;
      }
    } catch (err) {
      console.error("Host verification check failed:", err);
      toast.error("Could not check host verification status. Please try again.");
    }
  };
}
