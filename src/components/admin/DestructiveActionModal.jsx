"use client";

import { useState } from "react";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";

export default function DestructiveActionModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Destructive Action",
  description = "This action will impact user access or platform content. Please confirm below.",
  expectedConfirmationText = "CONFIRM",
  actionLabel = "Execute Action",
  isDanger = true,
  isLoading = false,
}) {
  const [typedText, setTypedText] = useState("");
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const isConfirmed = typedText.trim().toUpperCase() === expectedConfirmationText.trim().toUpperCase() && reason.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isConfirmed || isLoading) return;
    onConfirm({ reason: reason.trim() });
    setTypedText("");
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDanger ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-amber-500/10 border border-amber-500/20 text-amber-400"}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
              <p className="text-[11px] text-gray-400">High-Impact Governance Action</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isLoading} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-neutral-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-gray-300 leading-relaxed bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            {description}
          </p>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Reason / Rationale <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide explicit reason for audit log compliance..."
              rows={2}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Type <span className="font-mono text-amber-400">{expectedConfirmationText}</span> to confirm <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder={`Type "${expectedConfirmationText}"`}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 font-mono focus:outline-none focus:border-amber-500/50 transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl border border-neutral-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isConfirmed || isLoading}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                isConfirmed && !isLoading
                  ? isDanger
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20"
                    : "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20"
                  : "bg-neutral-800 text-gray-600 border border-neutral-800 cursor-not-allowed"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {isLoading ? "Processing..." : actionLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
