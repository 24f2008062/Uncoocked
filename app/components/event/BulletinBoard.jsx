"use client";

import React, { useState } from "react";
import ConversionModal from "@/app/components/ui/ConversionModal";

export default function BulletinBoard({ updates, onAddUpdate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [targetUpdate, setTargetUpdate] = useState(null);

  // Organizer state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  function openConversion(u) {
    setTargetUpdate(u);
    setModalOpen(true);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    if (onAddUpdate) {
      onAddUpdate({
        title: newTitle.trim(),
        content: newContent.trim(),
      });
      setNewTitle("");
      setNewContent("");
      setShowAddForm(false);
    }
  }

  return (
    <div className="bg-dark-card rounded-lg border border-dark-border overflow-hidden shadow-neon space-y-4 p-1 animate-fadeIn h-full flex flex-col">
      {/* Header */}
      <div className="bg-black border-b border-dark-border px-6 py-4 rounded-t-md flex items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="text-neon-purple text-lg">📢</span>
            Official Bulletin Board
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Organizer updates only
          </p>
        </div>

        {onAddUpdate && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-[11px] px-3 py-1.5 rounded bg-neon-purple text-white font-bold hover:bg-neon-purple/95 transition-all shadow-neon"
          >
            {showAddForm ? "Close Editor" : "+ Broadcast"}
          </button>
        )}
      </div>

      {/* Broadcast Composer Form (Organizer Only) */}
      {onAddUpdate && showAddForm && (
        <form
          onSubmit={handleFormSubmit}
          className="px-6 py-4 border border-neon-purple/35 rounded-md bg-black mx-2 space-y-3 flex-shrink-0"
        >
          <h4 className="text-xs font-bold text-neon-purple uppercase tracking-wider">
            Broadcast New Update
          </h4>

          <div>
            <label
              htmlFor="broadcast-title"
              className="block text-[10px] font-semibold text-gray-400"
            >
              Update Title
            </label>
            <input
              id="broadcast-title"
              required
              type="text"
              placeholder="e.g. Venue Change / Schedule Update"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mt-1 block w-full rounded border border-dark-border bg-black px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
            />
          </div>

          <div>
            <label
              htmlFor="broadcast-content"
              className="block text-[10px] font-semibold text-gray-400"
            >
              Message Content
            </label>
            <textarea
              id="broadcast-content"
              required
              rows={3}
              placeholder="Provide event details..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="mt-1 block w-full rounded border border-dark-border bg-black px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
            />
          </div>

          <button
            type="submit"
            className="w-full text-center px-4 py-2 bg-neon-purple text-white text-xs font-bold rounded hover:bg-neon-purple/90 transition-all shadow-neon"
          >
            Publish Live Update
          </button>
        </form>
      )}

      {/* Updates List */}
      <div className="divide-y divide-dark-border px-2 flex-1 overflow-y-auto no-scrollbar">
        {updates.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <p className="text-xs">No updates yet</p>
          </div>
        ) : (
          updates.map((update) => (
            <div key={update.id} className="px-4 py-4 first:pt-2 last:pb-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-white leading-normal">
                    {update.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {update.date}
                  </p>
                </div>
                {!onAddUpdate && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => openConversion(update)}
                      className="text-[10px] px-2.5 py-1 rounded bg-black border border-dark-border text-gray-300 hover:text-neon-purple hover:border-neon-purple/30 transition-all"
                    >
                      Message Coordinator
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-1.5 text-xs text-gray-300 leading-relaxed">
                {update.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Notice */}
      <div className="bg-black px-6 py-3 border-t border-dark-border rounded-b-md">
        <p className="text-[10px] text-gray-400 leading-normal">
          💡{" "}
          {onAddUpdate
            ? "You are acting as an Organizer. Broadcasts will refresh in this sandbox."
            : "This board is managed by organizers. Comments and user submissions are not allowed."}
        </p>
      </div>

      <ConversionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Message Coordinator`}
        message={`Scan the QR Code to install the Uncooked Operating System. This allows you to open a secure chat channel with the organizers regarding the update: "${targetUpdate?.title || ""}".`}
      />
    </div>
  );
}
