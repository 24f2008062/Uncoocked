"use client";

import Hero from "./components/home/Hero";
import Metrics from "./components/home/Metrics";
import EventMatrixPreview from "./components/home/EventMatrixPreview";
import FeatureGrid from "./components/home/FeatureGrid";
import BuilderNetwork from "./components/home/BuilderNetwork";
import BulletinFeed from "./components/home/BulletinFeed";
import DashboardPreview from "./components/home/DashboardPreview";
import OpportunitiesPreview from "./components/home/OpportunitiesPreview";
import Partners from "./components/home/Partners";
import CTA from "./components/home/CTA";
import ReviewSection from "@/app/components/home/ReviewSection";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden bg-black w-full min-h-screen flex flex-col items-center">
      {/* Visual background grids & lights */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#09090e_1px,transparent_1px),linear-gradient(to_bottom,#09090e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-70" />
      <div className="absolute inset-0 bg-radial-gradient from-neon-purple/5 via-transparent to-transparent filter blur-3xl opacity-40 -z-10 translate-y-[-10%]" />

      {/* 1. Hero Command Center & Floating Dashboard */}
      <Hero />

      {/* 2. Live Builder Activity Metrics */}
      <Metrics />

      {/* 3. Event Matrix Preview */}
      <EventMatrixPreview />

      {/* 4. Platform Architecture Showcase Feature Grid */}
      <FeatureGrid />

      {/* 5. Builder Ecosystem Network Graph */}
      <BuilderNetwork />

      {/* 6. Live Bulletin Feed Preview */}
      <BulletinFeed />

      {/* 7. Dashboard Live Preview */}
      <DashboardPreview />

      {/* 8. Opportunities Board Preview */}
      <OpportunitiesPreview />

      {/* 9. Partner & Trust Section */}
      <Partners />

      {/* 10. Final CTA Conversion Section */}
      <CTA />

      {/* 11. Horizontal Scrollable Student Review Strip */}
      <div className="w-full">
        <ReviewSection />
      </div>
    </div>
  );
}