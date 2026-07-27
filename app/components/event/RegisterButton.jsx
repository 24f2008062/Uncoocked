"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterButton({ eventId, eventTitle, eventPrice }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // 1. Create the secure order on the backend
      const orderResponse = await fetch("/api/pay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          userId: session.user.id,
        }),
      });

      const orderData = await orderResponse.json();

      if (orderData.error) {
        alert(orderData.error);
        setLoading(false);
        return;
      }

      // 2. Open the Razorpay Interactive Modal interface
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use test key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Uncooked Portal",
        description: `Ticket Registration for ${eventTitle}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          // Triggered automatically when Razorpay registers payment success
          try {
            const verifyResponse = await fetch("/api/pay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                userId: session.user.id,
                eventId: eventId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              router.push("/dashboard?registration=confirmed");
            } else {
              alert("Verification failed: " + verifyData.error);
            }
          } catch (err) {
            console.error("Verification callback failed:", err);
            alert("Unable to verify payment signature.");
          }
        },
        prefill: {
          name: session.user.name || "",
          email: session.user.email || "",
        },
        theme: {
          color: "#9333EA", // Matches your deep purple aesthetic theme
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();

    } catch (error) {
      console.error("Checkout script error:", error);
      alert("Failed to connect with payment gateway.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
    >
      {loading ? "Initializing Secure Gateway..." : "REGISTER NOW"}
    </button>
  );
}