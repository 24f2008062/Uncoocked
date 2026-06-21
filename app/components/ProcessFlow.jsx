"use client";

export default function ProcessFlow() {
  const steps = [
    {
      number: "01",
      title: "Event Discovery",
      desc: "Find campus fests, parties, dandiya nights, workshops, or hackathons.",
    },
    {
      number: "02",
      title: "Community Join",
      desc: "Gain immediate access to secure, noise-free local channels.",
    },
    {
      number: "03",
      title: "Find Collaborators",
      desc: "Browse student profiles, majors, and past status bios.",
    },
    {
      number: "04",
      title: "Secure Entry",
      desc: "Secure tickets and register on guest lists instantly.",
    },
    {
      number: "05",
      title: "Uncooked Projects",
      desc: "Unlock club roles, leadership grants, and campus show calls.",
    },
  ];

  return (
    <section className="w-full py-16 bg-black border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-neon-purple tracking-widest uppercase block neon-text-glow">
            The Student Pipeline
          </span>
          <h2 className="text-3xl font-black text-white">
            How the Journey Flows
          </h2>
          <p className="text-xs text-gray-400">
            A seamless horizontal progression from discovering campus events to
            coordinating student check-ins.
          </p>
        </div>

        {/* Desktop Pipeline (Horizontal Grid) */}
        <div className="hidden lg:grid grid-cols-5 gap-4 relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-dark-border -z-10" />

          {steps.map((step, idx) => (
            <div key={idx} className="space-y-4 group">
              {/* Connector Dot */}
              <div className="mx-auto w-12 h-12 rounded-full bg-dark-card border-2 border-dark-border group-hover:border-neon-purple group-hover:shadow-neon flex items-center justify-center text-xs font-black text-gray-400 group-hover:text-white transition-all duration-300">
                {step.number}
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white group-hover:text-neon-purple transition-colors">
                  {step.title}
                </h4>
                <p className="text-[10px] text-gray-500 leading-normal max-w-[160px] mx-auto group-hover:text-gray-400 transition-colors">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Pipeline (Vertical Grid) */}
        <div className="lg:hidden space-y-6 max-w-md mx-auto text-left pl-6 relative border-l border-dark-border">
          {steps.map((step, idx) => (
            <div key={idx} className="relative space-y-1.5 pb-2 group">
              {/* Timeline Connector Bullet */}
              <div className="absolute -left-[37px] top-0.5 w-6 h-6 rounded-full bg-dark-card border border-dark-border group-hover:border-neon-purple group-hover:shadow-neon flex items-center justify-center text-[9px] font-black text-gray-400 group-hover:text-white transition-all duration-300">
                {step.number}
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-neon-purple transition-colors">
                {step.title}
              </h4>
              <p className="text-[10px] text-gray-500 leading-normal">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
