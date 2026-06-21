"use client";

import React, { useState } from "react";

export default function RegisterModal({
  open,
  onClose,
  onSubmit,
  ticketType,
  price,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, email, phone, university });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent backdrop blur */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md mx-4 bg-[#0a0a0a] rounded-xl border border-zinc-800 shadow-2xl overflow-hidden animate-fadeIn">
        <div className="px-6 py-5 border-b border-zinc-800/80">
          <h3 className="text-base font-medium text-white tracking-tight">
            {ticketType === "Paid" ? "Payment details" : "Register for event"}
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            {ticketType === "Paid"
              ? `Enter your details to pay $${price} and secure your ticket.`
              : "Please provide your details to reserve a free ticket."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label
              htmlFor="modal-name"
              className="block text-sm font-medium text-zinc-300"
            >
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
            <label
              htmlFor="modal-email"
              className="block text-sm font-medium text-zinc-300"
            >
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
            <label
              htmlFor="modal-phone"
              className="block text-sm font-medium text-zinc-300"
            >
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
            <label
              htmlFor="modal-university"
              className="block text-sm font-medium text-zinc-300"
            >
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

          {ticketType === "Paid" && (
            <div className="pt-4 mt-4 border-t border-zinc-800/80 space-y-4">
              <h4 className="text-sm font-medium text-white tracking-tight">
                Payment information
              </h4>

              <div>
                <label
                  htmlFor="card-number"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Card number
                </label>
                <input
                  id="card-number"
                  required
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="mt-1.5 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition-colors"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="card-expiry"
                    className="block text-sm font-medium text-zinc-300"
                  >
                    Expiry
                  </label>
                  <input
                    id="card-expiry"
                    required
                    type="text"
                    placeholder="MM/YY"
                    className="mt-1.5 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="card-cvc"
                    className="block text-sm font-medium text-zinc-300"
                  >
                    CVC
                  </label>
                  <input
                    id="card-cvc"
                    required
                    type="text"
                    placeholder="123"
                    className="mt-1.5 block w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
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
                  ? `Pay $${price}`
                  : "Confirm reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
