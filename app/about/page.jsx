import TeamSection from "@/app/components/ui/TeamSection";

export const metadata = {
  title: "About Uncooked | The Zero-Noise OS",
  description: "Learn about Uncooked, our parent company, and the team behind the platform.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-full bg-black text-white w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden border-b border-white/6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.08),transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#A855F7] bg-clip-text text-transparent">
            About Uncooked
          </h1>
          <p className="text-[15px] md:text-base text-white/45 max-w-2xl mx-auto leading-relaxed">
            The Zero-Noise Operating System for Student Events and Campus Ecosystems. We are on a mission to organize and elevate campus engagement for students worldwide.
          </p>
        </div>
      </section>

      {/* App & Parent Company Details */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* The App */}
            <div className="space-y-5 bg-[#111111] border border-white/8 p-6 md:p-8 rounded-2xl hover:border-white/16 shadow-sm transition-all duration-150">
              <h2 className="text-xl font-bold text-white border-l-2 border-[#A855F7] pl-4">The Platform</h2>
              <p className="text-[14px] text-white/45 leading-relaxed">
                Uncooked is a unified portal designed specifically for modern campus ecosystems. We replace the fragmented noise of traditional communication channels with a streamlined, central hub where students can discover events, find opportunities, and connect with their peers without friction.
              </p>
              <ul className="text-[13px] space-y-2 text-white/40 mt-4">
                <li className="flex items-center gap-2">
                  <span className="text-[#A855F7]">✓</span> Centralized Event Discovery
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#A855F7]">✓</span> Professional Networking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#A855F7]">✓</span> Seamless Registrations
                </li>
              </ul>
            </div>

            {/* The Parent Company */}
            <div className="space-y-5 bg-[#111111] border border-white/8 p-6 md:p-8 rounded-2xl hover:border-white/16 shadow-sm transition-all duration-150">
              <h2 className="text-xl font-bold text-white border-l-2 border-[#A855F7] pl-4">Parent Company</h2>
              <p className="text-[14px] text-white/45 leading-relaxed">
                Uncooked is proudly developed and maintained by <strong className="text-white/70 font-semibold">UnfusedZ</strong>. Founded with the vision to bridge the gap between academic institutions and student experiences, our parent company focuses on building tools that empower the next generation of campus leaders.
              </p>
              <div className="p-4 rounded-xl bg-white/3 border border-white/8 mt-4">
                <p className="text-[13px] text-white/40 italic text-center">
                  &quot;Innovating the student experience, one campus at a time.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />
    </div>
  );
}
