'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 relative w-full border-t border-white/5 overflow-hidden">
      
      {/* Heavy gradient background mesh */}
      <div className="absolute inset-0 bg-zinc-950 -z-20" />
      <div className="absolute inset-0 bg-radial-gradient from-neon-purple/20 via-transparent to-transparent filter blur-3xl opacity-60 -z-10 translate-y-12" />
      
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center space-y-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-neon-purple/10 text-neon-lavender border border-neon-purple/30 shadow-neon">
            🚀 JOIN THE ECOSYSTEM
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
            Ready to Join Campus Events?
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Discover active campus events, join club activities, secure instant tickets, and receive zero-noise logs on the student operating system.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto"
        >
          <Link
            href="/login"
            className="w-full sm:w-auto text-center rounded-full bg-neon-purple text-white px-8 py-3.5 text-xs font-extrabold tracking-wider uppercase shadow-neon hover:bg-neon-purple/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Join Uncooked
          </Link>
          <Link
            href="/event"
            className="w-full sm:w-auto text-center rounded-full border border-white/10 bg-zinc-900/40 hover:bg-white/5 text-white px-8 py-3.5 text-xs font-extrabold tracking-wider uppercase transition-all"
          >
            Browse Events
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
