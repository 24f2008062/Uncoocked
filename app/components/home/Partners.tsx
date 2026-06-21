'use client';

import { motion } from 'framer-motion';

export default function Partners() {
  const partners = [
    { name: 'University Innovation Cell', short: 'UIC', glowColor: 'hover:text-blue-400 hover:border-blue-400/30' },
    { name: 'Startup Club', short: 'SC', glowColor: 'hover:text-green-400 hover:border-green-400/30' },
    { name: 'Developer Society', short: 'DEV_SOC', glowColor: 'hover:text-neon-purple hover:border-neon-purple/30' },
    { name: 'Maker Community', short: 'MKR_COMM', glowColor: 'hover:text-yellow-400 hover:border-yellow-400/30' },
    { name: 'Entrepreneurship Hub', short: 'E_HUB', glowColor: 'hover:text-cyan-400 hover:border-cyan-400/30' },
    { name: 'Tech Council', short: 'TECH_CO', glowColor: 'hover:text-pink-400 hover:border-pink-400/30' },
  ];

  return (
    <section className="py-16 relative w-full border-t border-white/5 bg-zinc-950/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-10 text-center">
        
        {/* Title */}
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">
          BUILT FOR STUDENTS ACROSS THE ECOSYSTEM
        </h3>

        {/* Logo Wall */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center justify-center max-w-5xl mx-auto">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -2 }}
              className={`bg-zinc-900/30 border border-white/5 rounded-xl px-5 py-6 flex flex-col items-center justify-center gap-1 cursor-default grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-300 font-mono ${partner.glowColor}`}
            >
              <span className="text-sm font-black tracking-widest">{partner.short}</span>
              <span className="text-[7.5px] uppercase font-bold text-gray-500 tracking-wider text-center group-hover:text-inherit">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
