"use client";

export default function TeamSection() {
  const members = [
    { name: "Sanidhya S.", role: "Founder & Head of Product", avatar: "SS" },
    { name: "Alex Rivera", role: "Technical Architecture Lead", avatar: "AR" },
    { name: "Tariq Patel", role: "Venture & Partnerships Lead", avatar: "TP" },
  ];

  return (
    <section className="w-full py-16 bg-black border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4 text-center">
          <span className="text-xs font-extrabold text-neon-purple tracking-widest uppercase block neon-text-glow">
            Our Operations
          </span>
          <h2 className="text-3xl font-black text-white">The Core Team</h2>
          <p className="text-xs text-gray-400 max-w-2xl mx-auto">
            The developers and product architects coordinating student
            engagement across the campus network.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {members.map((m, idx) => (
            <div
              key={idx}
              className="bg-dark-card border border-dark-border rounded-xl p-6 text-center space-y-4 hover:border-neon-purple/30 hover:shadow-neon transition-all duration-300 group"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-neon-purple/5 border border-dark-border group-hover:border-neon-purple/40 text-lg font-black text-neon-lavender flex items-center justify-center transition-all duration-300">
                {m.avatar}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white group-hover:text-neon-purple transition-colors">
                  {m.name}
                </h4>
                <p className="text-[10px] text-gray-500 font-semibold">
                  {m.role}
                </p>
              </div>
              <div className="flex justify-center pt-2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-500 hover:text-neon-purple transition-colors"
                  aria-label={`${m.name} LinkedIn`}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
