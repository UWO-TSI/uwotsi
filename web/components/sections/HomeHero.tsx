"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollIndicator from "@/components/ui/ScrollIndicator";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial entrance animation
      gsap.from(contentRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });

      // Create a timeline for the fade out effect
      // Pin the section while fading content from 1 to 0
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%", // Pin for 1.5 viewport heights (adjust for slower/faster fade)
          scrub: 1, // Smooth scrubbing (1 = slight lag for smoothness)
          pin: true,
          pinSpacing: true, // Maintain spacing so next section waits
          anticipatePin: 1,
        },
      });

      // Fade out content
      timeline.to(contentRef.current, {
        opacity: 0,
        ease: "power2.inOut",
        duration: 1,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen flex items-center justify-center relative bg-[#0F0F10]"
    >
      <div
        ref={contentRef}
        className="flex flex-col items-center justify-center px-6 text-center w-full"
      >
        <h1 className="font-heading mb-8 text-6xl font-semibold leading-tight tracking-tight">
          Technology That Moves People Forwards.
        </h1>
        
        <p className="max-w-2xl text-lg text-zinc-400 mb-12">
          We build modern software for nonprofits, companies, and communities.
          <br />
          Powered by student developers. Designed for real-world impact.
        </p>
        
        {/* Video play button with text */}
        <div className="flex flex-col items-center gap-3 mb-16">
          <button className="w-[43px] h-[43px] rounded-full bg-zinc-400/30 hover:bg-zinc-400/40 transition-colors flex items-center justify-center group">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ marginLeft: '2px' }}
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <a
            href="#"
            className="text-sm text-white hover:text-zinc-300 transition-colors"
          >
            Watch Our Story →
          </a>
        </div>
        
        {/* Scroll indicator and text */}
        <div className="flex flex-col items-center gap-4">
          <ScrollIndicator />
          <span className="text-[14px] font-light leading-[1.5] text-[#A1A1AA]">
            Discover who we serve
          </span>
        </div>
      </div>
    </section>
  );
}