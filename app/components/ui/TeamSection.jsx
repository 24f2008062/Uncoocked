"use client";

export default function TeamSection() {
  const members = [
    { name: "Shushant S.", role: "Founder & CEO", avatar: "SS" },
    { name: "Siddhart B.", role: "Co-Founder", avatar: "SB" },
    { name: "Sanidhy S.", role: "Chief Product Officer", avatar: "SS" },
    { name: "Swayam B.", role: "Chief Technology Officer", avatar: "SB" },
    { name: "Abhay S.", role: "HR Manager", avatar: "AS" },
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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
