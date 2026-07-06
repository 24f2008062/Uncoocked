"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLanded, setIsLanded] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isWiping, setIsWiping] = useState(false);

  useEffect(() => {
    // Phase 1: Stabilization - Logo lands perfectly at 1.0s
    const landTimer = setTimeout(() => {
      setIsLanded(true);
    }, 1000);

    // Phase 2a: Web Pulse starts AFTER the circle illuminates (at 1.6s)
    const pulseTimer = setTimeout(() => {
      setIsPulsing(true);
    }, 1600);

    // Phase 3: Screen Wipe & App Injection - Initiates at 2.8s
    const wipeTimer = setTimeout(() => {
      setIsWiping(true);
    }, 2800);

    // Phase 3: Full dissolution - Completes at 3.3s
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3300);

    return () => {
      clearTimeout(landTimer);
      clearTimeout(pulseTimer);
      clearTimeout(wipeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Generate natural, slightly distorted/bowed radial web lines
  const webPaths = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 22.5 * Math.PI) / 180;
      const startR = 6;
      const endR = 100;

      const x1 = 50 + startR * Math.cos(angle);
      const y1 = 50 + startR * Math.sin(angle);
      const x2 = 50 + endR * Math.cos(angle);
      const y2 = 50 + endR * Math.sin(angle);

      // Bow outwards slightly to make it organic
      const bowDirection = i % 2 === 0 ? 1 : -1;
      const midR = (startR + endR) / 2;
      const midAngle = angle + (bowDirection * 0.08); // slight angle offset
      const cx = 50 + midR * Math.cos(midAngle);
      const cy = 50 + midR * Math.sin(midAngle);

      return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    });
  }, []);

  // Generate natural sagging web rings between the radials
  const webRings = useMemo(() => {
    const radii = [8, 16, 26, 38, 52, 70, 90];
    return radii.map((r, i) => {
      let d = "";
      const points = 16;
      for (let p = 0; p < points; p++) {
        const angle1 = (p * 22.5 * Math.PI) / 180;
        const angle2 = (((p + 1) % points) * 22.5 * Math.PI) / 180;

        const px1 = 50 + r * Math.cos(angle1);
        const py1 = 50 + r * Math.sin(angle1);
        const px2 = 50 + r * Math.cos(angle2);
        const py2 = 50 + r * Math.sin(angle2);

        // Control point sags inwards
        const midAngle = ((p + 0.5) * 22.5 * Math.PI) / 180;
        const sagR = r * 0.88; // 12% inwards sag
        const cx = 50 + sagR * Math.cos(midAngle);
        const cy = 50 + sagR * Math.sin(midAngle);

        if (p === 0) d += `M ${px1} ${py1}`;
        d += ` Q ${cx} ${cy} ${px2} ${py2}`;
      }
      d += " Z";
      return d;
    });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }} // 500ms fade duration
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden pointer-events-none"
        >
          {/* Phase 2: Wireframe Web Mesh Pulse */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              className="absolute w-[200vw] h-[200vw] sm:w-[150vw] sm:h-[150vw]"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Radial Web Lines drawn outwards starting from the circle's edge (R=6) */}
              {webPaths.map((d, i) => (
                <motion.path
                  key={`line-${i}`}
                  d={d}
                  stroke="rgba(191,64,255,0.4)"
                  strokeWidth="0.1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={isPulsing ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 1.0, ease: [0.215, 0.61, 0.355, 1] }} // ease-out-cubic
                />
              ))}

              {/* Concentric Ripples / Grid starting past the circle */}
              {webRings.map((d, i) => (
                <motion.path
                  key={`ring-${i}`}
                  d={d}
                  stroke="rgba(191,64,255,0.35)"
                  strokeWidth="0.1"
                  fill="none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    isPulsing
                      ? { opacity: [0, 1, 0.15], scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{
                    duration: 1.2,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                  style={{ transformOrigin: "center" }}
                />
              ))}
            </svg>
          </div>

          {/* Glowing Fast Pulse traveling outwards alongside the grid */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={isPulsing ? { scale: 15, opacity: 0 } : { scale: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
            className="absolute w-[15vw] h-[15vw] rounded-full border-[1px] border-neon-purple shadow-[0_0_80px_30px_rgba(191,64,255,0.5)] pointer-events-none"
          />

          {/* Phase 3: Additive Blend Flash */}
          <AnimatePresence>
            {isWiping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white/80 z-40 mix-blend-overlay pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Phase 1 & 3: The Logo Landing & Final Pinch */}
          <motion.div
            initial={{ scale: 4, opacity: 0, filter: "blur(12px)" }}
            animate={
              isWiping 
                ? { scale: 0, opacity: 0 } 
                : { scale: 1, opacity: 1, filter: "blur(0px)" }
            }
            transition={
              isWiping 
                ? { duration: 0.4, ease: "backIn" } // Pinch inwards to a dot
                : { duration: 1.0, ease: [0.25, 1, 0.5, 1] } // Snappy landing
            }
            className="relative z-50 rounded-full flex items-center justify-center pointer-events-none"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={140}
              height={140}
              className="object-contain rounded-full overflow-hidden"
              priority
            />

            {/* The Illumination Circle that draws around the logo FIRST */}
            <svg
              className="absolute w-[220px] h-[220px] z-40 pointer-events-none"
              viewBox="0 0 100 100"
              style={{ overflow: "visible" }}
            >
              <motion.circle
                cx="50"
                cy="50"
                r="48"
                stroke="rgba(191,64,255,1)"
                strokeWidth="1.5"
                fill="rgba(191,64,255,0.02)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  isWiping ? { opacity: 0, scale: 0 } :
                  isLanded ? { pathLength: 1, opacity: 1, scale: 1 } : { pathLength: 0, opacity: 0, scale: 1 }
                }
                transition={
                  isWiping 
                    ? { duration: 0.4, ease: "backIn" } // Pinches in with the logo
                    : { pathLength: { duration: 0.5, ease: "linear" }, opacity: { duration: 0.1 } }
                }
                style={{
                  rotate: -90, // Start drawing from top center
                  transformOrigin: "center",
                  filter: "drop-shadow(0px 0px 8px rgba(191,64,255,0.8))",
                }}
              />
            </svg>

            {/* Subtle under-glow locked around logo once landed */}
            <motion.div
              animate={isWiping ? { opacity: 0, scale: 0 } : isLanded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1 }}
              transition={{ duration: isWiping ? 0.3 : 0.5 }}
              className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(191,64,255,0.6)] mix-blend-screen pointer-events-none"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
