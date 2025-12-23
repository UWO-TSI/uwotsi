"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Options = {
  y?: number;
  delay?: number;
  duration?: number;
};

export function useScrollReveal(
  ref: React.RefObject<HTMLElement>,
  options: Options = {}
) {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: options.y ?? 24 },
        {
          opacity: 1,
          y: 0,
          duration: options.duration ?? 0.6,
          delay: options.delay ?? 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play reverse play reverse", // IMPORTANT
          },
        }
      );
    });

    return () => ctx.revert();
  }, [ref, options.y, options.delay, options.duration]);
}