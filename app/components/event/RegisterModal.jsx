"use client";

import React, { useState, useEffect } from "react";

export default function RegisterModal({
  open,
  onClose,
  onSubmit, // We will still call this after a successful payment to notify the UI
  ticketType,
  price,
  eventId,   // Pass these down or read them from your route if needed
  userId     // Pass these down or read them from your route if needed
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(false);

  // Dynamically load Razorpay SDK script when modal opens
  useEffect(() => {
    if (open) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Hit our Checkout API endpoint to create the Order
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: eventId, 
          userId: userId,
          // You can also pass teamName or track here if needed
        }),
      });

      const checkoutData = await res.json();
      if (!res.ok) throw new Error(checkoutData.error || "Failed to initiate registration");

      // 2. Short-circuit if it's a Free Event
      if (checkoutData.isFree) {
        alert("Registration Successful!");
        if (onSubmit) await onSubmit({ name, email, phone, university });
        onClose();
        window.location.reload();
        return;
      }

      // 3. Open the secure Razorpay Checkout overlay for Paid Events
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: checkoutData.amount,
        currency: "INR",
        name: "Event Registration",
        description: "Complete your payment to confirm your seat",
        order_id: checkoutData.orderId,
        handler: async function (response) {
          // 4. Send payment tokens back to our server verification endpoint
          const verifyRes = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationId: checkoutData.registrationId,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            alert("Payment Verified! Registration Complete.");
            if (onSubmit) await onSubmit({ name, email, phone, university });
            onClose();
            window.location.reload();
          } else {
            alert(verifyData.error || "Payment verification failed.");
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        theme: { color: "#ffffff" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert(err.message || "Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl mx-4 bg-[#0a0a0a] rounded-xl border border-zinc-800 shadow-2xl overflow-hidden animate-fadeIn">
        <div className="px-6 py-5 border-b border-zinc-800/80">
          <h3 className="text-base font-medium text-white tracking-tight">
            {ticketType === "Paid" ? "Payment details" : "Register for event"}
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            {ticketType === "Paid"
              ? `Enter your details to proceed to secure payment of ₹${price}.`
              : "Please provide your details to reserve a free ticket."}
          </p>
        </div>

        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3">
          <p className="text-xs font-bold text-amber-500 text-center uppercase tracking-wide">
            ⚠️ Note: Currently operating exclusively in Lucknow
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="modal-name" className="block text-sm font-medium text-zinc-300">
                Full name
              </label>
              <input
                id="modal-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="modal-email" className="block text-sm font-medium text-zinc-300">
                Email address
              </label>
              <input
                id="modal-email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="modal-phone" className="block text-sm font-medium text-zinc-300">
                Phone number
              </label>
              <input
                id="modal-phone"
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="modal-university" className="block text-sm font-medium text-zinc-300">
                University / Institution
              </label>
              <input
                id="modal-university"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {loading
                ? "Processing..."
                : ticketType === "Paid"
                  ? `Proceed to Pay ₹${price}`
                  : "Confirm reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}