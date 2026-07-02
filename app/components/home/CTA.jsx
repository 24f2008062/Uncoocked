"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 relative w-full border-t border-white/6 overflow-hidden">
      {/* Very subtle background — not a giant glow, just depth */}
      <div className="absolute inset-0 bg-[#0A0A0A] -z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(168,85,247,0.07),transparent)] -z-10" />

      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center space-y-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          className="space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold bg-white/5 text-white/50 border border-white/10">
            🚀 Join the Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Ready to Join Campus Events?
          </h2>
          <p className="text-[14px] text-white/45 max-w-xl mx-auto leading-relaxed">
            Discover active campus events, join club activities, secure instant
            tickets, and receive zero-noise logs on the student operating
            system.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0, 0, 0.2, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/login" className="btn-primary text-[13px]">
            Join Uncooked
          </Link>
          <Link href="/event" className="btn-secondary text-[13px]">
            Browse Events
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
