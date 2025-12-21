"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import Button from "@/components/ui/Button";
import ButtonHelperText from "@/components/ui/ButtonHelperText";

export default function CompaniesHero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    gsap.from(contentRef.current, {
      opacity: 0,
      y: 16,
      duration: 1,
      ease: "power3.out",
      delay: 0.2,
    });
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#0F0F10] pt-[96px]">
      <div
        ref={contentRef}
        className="flex flex-col items-center text-center px-6 w-full"
      >
        {/* Headline */}
        <h1 className="font-heading text-5xl md:text-6xl font-semibold leading-tight tracking-tight mb-20">
          Technology & Talent
          <br />
          For Ambitious Companies.
        </h1>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-12 sm:flex-row sm:items-start sm:justify-center">
          <div className="flex flex-col items-center">
            <Button>Start a Project</Button>
            <ButtonHelperText>
              Custom software, AI, and design services
            </ButtonHelperText>
          </div>

          <div className="flex flex-col items-center">
            <Button variant="secondary">Partner for Talent</Button>
            <ButtonHelperText>
              Access top student developers through our guided summer program
            </ButtonHelperText>
          </div>
        </div>

        {/* Scroll indicator — client only */}
        {mounted && (
          <div className="flex flex-col items-center gap-4 mt-20">
            <ScrollIndicator />
            <span className="text-[14px] font-light leading-[1.5] text-[#A1A1AA]">
              Scroll for more info
            </span>
          </div>
        )}
      </div>
    </section>
  );
}