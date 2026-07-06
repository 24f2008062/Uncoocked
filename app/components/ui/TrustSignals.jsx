"use client";

export default function TrustSignals() {
  const partners = [
    { name: "Stanford University", icon: "🌲" },
    { name: "MIT Lab", icon: "🤖" },
    { name: "Harvard Campus", icon: "🏛️" },
    { name: "Vercel Delta", icon: "▲" },
    { name: "Stripe Build", icon: "💳" },
  ];

  return (
    <section className="w-full py-8 border-y border-dark-border bg-dark-bg/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
          Trusted by Student Founders & Teams at Leading Ecosystems
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 pt-2">
          {partners.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-transparent hover:border-neon-purple/20 hover:bg-dark-hover transition-all duration-300 group cursor-default"
            >
              <span className="text-sm grayscale group-hover:grayscale-0 transition-all">
                {p.icon}
              </span>
              <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
