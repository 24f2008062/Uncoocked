'use client';

import React, { useState } from 'react';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; email: string; team?: string }) => Promise<void> | void;
  ticketType?: 'Free' | 'Paid';
  price?: number;
}

export default function RegisterModal({ open, onClose, onSubmit, ticketType, price }: RegisterModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, email, team });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent backdrop blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-4 bg-dark-card rounded-lg border border-dark-border shadow-neon-thick overflow-hidden animate-fadeIn">
        <div className="px-6 py-4 border-b border-dark-border">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-neon-purple text-xl">{ticketType === 'Paid' ? '🛒' : '🎫'}</span> 
            {ticketType === 'Paid' ? 'Checkout & Pay' : 'Secure Ticket & Register'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {ticketType === 'Paid' ? `Complete your details to pay $${price} and secure your ticket.` : 'Fill in your details to reserve a free ticket.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label htmlFor="modal-name" className="block text-xs font-semibold text-gray-400">Full name</label>
            <input
              id="modal-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 block w-full rounded-md border border-dark-border bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
            />
          </div>

          <div>
            <label htmlFor="modal-email" className="block text-xs font-semibold text-gray-400">Email</label>
            <input
              id="modal-email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 block w-full rounded-md border border-dark-border bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
            />
          </div>

          <div>
            <label htmlFor="modal-team" className="block text-xs font-semibold text-gray-400">Team name (optional)</label>
            <input
              id="modal-team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="mt-1.5 block w-full rounded-md border border-dark-border bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-neon-purple text-white rounded-md font-bold text-xs hover:bg-neon-purple/90 disabled:opacity-60 transition-all shadow-neon"
            >
              {loading ? 'Processing…' : (ticketType === 'Paid' ? `Confirm Payment - $${price}` : 'Secure Ticket & Register')}
            </button>

            <button type="button" onClick={onClose} className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
