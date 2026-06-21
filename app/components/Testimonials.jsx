"use client";

export default function Testimonials() {
  const reviews = [
    {
      name: "Sarah Chen",
      role: "Cultural Club President @ MIT",
      avatar: "SC",
      quote:
        "We organized our entire guest list booking using Uncooked. The zero-noise bulletin channel prevented any spam, and attendee check-ins completed in minutes.",
      stars: 5,
    },
    {
      name: "Marcus Vance",
      role: "Club Coordinator @ Stanford",
      avatar: "MV",
      quote:
        "The campus event tools are exceptional. I discovered workshops and cultural meetups for our society, registered, and secured tickets within a minute.",
      stars: 5,
    },
    {
      name: "Elena Rostova",
      role: "Fest Director @ Harvard",
      avatar: "ER",
      quote:
        "Direct organizer controls are highly effective. We launched registration forms and collected attendee guest lists with full transparent analytics.",
      stars: 5,
    },
  ];

  return (
    <section className="w-full py-16 bg-black border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4 text-center">
          <span className="text-xs font-extrabold text-neon-purple tracking-widest uppercase block neon-text-glow">
            Social Proof
          </span>
          <h2 className="text-3xl font-black text-white">
            Student & Attendee Feedback
          </h2>
          <p className="text-xs text-gray-400 max-w-2xl mx-auto">
            See how campus students, society heads, and event organizers
            leverage the Uncooked portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4 hover:border-neon-purple/30 hover:shadow-neon transition-all duration-300"
            >
              {/* Star Rating */}
              <div className="flex gap-1 text-neon-purple">
                {Array.from({ length: rev.stars }).map((_, i) => (
                  <span key={i} className="text-xs">
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs text-gray-300 leading-relaxed italic">
                &quot;{rev.quote}&quot;
              </p>

              {/* Profile */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-xs font-bold text-neon-lavender flex items-center justify-center">
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{rev.name}</h4>
                  <span className="text-[10px] text-gray-500 block">
                    {rev.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
