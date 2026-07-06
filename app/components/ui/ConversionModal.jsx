"use client";

import React from "react";

export default function ConversionModal({
  open,
  onClose,
  title = "Unlock Uncooked",
  message,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent backdrop blur */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg mx-4 bg-dark-card rounded-lg border border-dark-border shadow-neon-thick overflow-hidden animate-fadeIn">
        <div className="px-6 py-4 border-b border-dark-border">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-neon-purple text-xl">📱</span> {title}
          </h3>
        </div>

        <div className="px-6 py-6 space-y-4">
          <p className="text-xs text-gray-300 leading-relaxed">
            {message ||
              "Unlock immediate access to exclusive work opportunities, real-time ticket registrations, and live mobile push notifications. Scan to install the native Uncooked Operating System."}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            <div className="w-36 h-36 flex flex-col items-center justify-center rounded-lg bg-black border border-dark-border shadow-neon p-2 shrink-0">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center">
                QR Code
              </span>
              <div className="w-20 h-20 bg-neon-purple/10 border border-dashed border-neon-purple/40 rounded mt-2 flex items-center justify-center">
                <span className="text-xl">📲</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center sm:text-left">
              <p className="text-xs text-gray-400 leading-relaxed">
                Scan to install the native Uncooked Operating System and unlock
                real-time features on mobile.
              </p>
              <div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center px-4 py-2 bg-neon-purple text-white text-xs font-bold rounded-md hover:bg-neon-purple/90 transition-all shadow-neon"
                >
                  Install App
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-dark-border text-right">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
