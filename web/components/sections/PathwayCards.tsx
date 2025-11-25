"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PathwayCard {
  title: string;
  subtitle: string;
  href: string;
}

const cards: PathwayCard[] = [
  {
    title: "Nonprofits",
    subtitle: "Pro bono software support for 1 year",
    href: "/npo",
  },
  {
    title: "Companies",
    subtitle: "Hire for scoped project and consulting",
    href: "/company",
  },
  {
    title: "Sponsors",
    subtitle: "Fund tech that drives social impact",
    href: "/sponsor",
  },
  {
    title: "Students",
    subtitle: "Start a TETHOS Chapter",
    href: "/student",
  },
];

// ============================================
// BALATRO-INSPIRED CARD HAND CALCULATIONS
// ============================================

const CARD_SPACING = 0.85; // Natural spacing with slight corner overlap
const SMALL_LIFT = 12;
const MAX_FAN_ANGLE = 15;

function getCardTransform(index: number, totalCards: number) {
  const t = index - (totalCards - 1) / 2;
  const xOffset = t * (280 * CARD_SPACING); // 280px = card width
  const yOffset = -Math.abs(t) * SMALL_LIFT;
  const rotation = totalCards > 1 
    ? (t * MAX_FAN_ANGLE) / ((totalCards - 1) / 2)
    : 0;
  
  return { xOffset, yOffset, rotation };
}

// ============================================
// 3D CARD COMPONENT (Balatro-style)
// ============================================

function Card3D({ card, index, totalCards }: { card: PathwayCard; index: number; totalCards: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const breathingTween = useRef<gsap.core.Tween | null>(null);
  
  // Mouse position relative to card center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring physics for smooth 3D rotation (mimics Godot's spring/damp)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 150,
    damping: 20,
  });
  
  // Setup breathing animation
  useEffect(() => {
    if (!cardRef.current) return;
    
    breathingTween.current = gsap.to(cardRef.current, {
      scale: 0.9994, // Even more subtle: 0.06% scale change (was 0.9992)
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 3,
      paused: false,
    });
    
    return () => {
      breathingTween.current?.kill();
    };
  }, []);
  
  // Pause breathing on hover
  useEffect(() => {
    if (isHovered) {
      breathingTween.current?.pause();
      // Reset to scale 1
      gsap.to(cardRef.current, { scale: 1, duration: 0.2 });
    } else {
      breathingTween.current?.resume();
    }
  }, [isHovered]);
  
  // Handle mouse move for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalize mouse position to [-0.5, 0.5] range
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };
  
  const { xOffset, yOffset, rotation } = getCardTransform(index, totalCards);
  
  return (
    <motion.div
      ref={cardRef}
      className="pathway-card absolute w-[280px] h-[360px] cursor-pointer opacity-0"
      initial={{
        y: 150,
        scale: 0.8,
      }}
      animate={{
        y: isHovered ? yOffset - 50 : yOffset,
        scale: isHovered ? 1.15 : 1,
        rotate: isHovered ? rotation * 0.9 : rotation,
      }}
      style={{
        x: xOffset, // Static horizontal position
        transformOrigin: "center bottom",
        transformStyle: "preserve-3d",
        perspective: 1000,
        zIndex: isHovered ? 50 : index,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.5,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{
        scale: 1.05,
      }}
    >
      {/* 3D Card Inner Container */}
      <motion.div
        className="glass-card w-full h-full p-8 flex flex-col justify-center relative"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Shine overlay effect (appears on hover) */}
        <motion.div
          className="absolute inset-0 rounded-[22px] pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${useTransform(mouseX, [-0.5, 0.5], [0, 100])}% ${useTransform(mouseY, [-0.5, 0.5], [0, 100])}%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
            opacity: isHovered ? 0.6 : 0,
          }}
          animate={{
            opacity: isHovered ? 0.6 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Card Content */}
        <div className="relative z-10">
          <h3 className="font-heading text-2xl font-semibold mb-3">
            {card.title}
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {card.subtitle}
          </p>
        </div>
        
        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-2 rounded-[24px] blur-xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(0,47,167,0.4) 0%, transparent 70%)",
            opacity: isHovered ? 1 : 0,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN PATHWAY CARDS COMPONENT
// ============================================

export default function PathwayCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const helperTextRef = useRef<HTMLParagraphElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // 1. Fade in title
      mainTimeline.fromTo(
        titleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.inOut" },
        0
      );

      // 2. Animate cards up one by one
      const cardElements = cardsContainerRef.current?.querySelectorAll(".pathway-card");
      if (cardElements) {
        cardElements.forEach((card, index) => {
          const startTime = 0.2 + (index * 0.12);
          const { xOffset, yOffset, rotation } = getCardTransform(index, cards.length);
          
          mainTimeline.fromTo(
            card,
            {
              opacity: 0,
              y: 150,
              x: 0,
              rotation: 0,
              scale: 0.8,
            },
            {
              opacity: 1,
              y: yOffset,
              x: xOffset,
              rotation: rotation,
              scale: 1,
              duration: 0.15,
              ease: "back.out(1.2)",
            },
            startTime
          );
        });
      }

      // 3. Fade in helper text
      mainTimeline.fromTo(
        helperTextRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.inOut" },
        0.8
      );
      
      // Note: Breathing animation is now handled in Card3D component

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen flex items-center justify-center relative bg-[#0F0F10] overflow-hidden"
    >
      <div className="flex flex-col items-center justify-end h-full px-6 pb-24 w-full">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="font-heading text-5xl md:text-6xl font-semibold mb-auto mt-24 text-center opacity-0"
        >
          Who are you?
        </h2>

        {/* Cards Container */}
        <div ref={cardsContainerRef} className="relative w-full max-w-6xl mx-auto h-[400px]">
          {/* Desktop: Fanned card hand */}
          <div className="hidden md:block relative w-full h-full">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center">
              {cards.map((card, index) => (
                <Card3D
                  key={card.title}
                  card={card}
                  index={index}
                  totalCards={cards.length}
                />
              ))}
            </div>
          </div>

          {/* Mobile: Simple stacked layout */}
          <div className="md:hidden flex flex-col gap-6 w-full max-w-md mx-auto">
            {cards.map((card) => (
              <motion.div
                key={card.title}
                className="pathway-card glass-card w-full min-h-[200px] p-6 flex flex-col justify-center cursor-pointer"
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="font-heading text-xl font-semibold mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {card.subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Helper text */}
        <p
          ref={helperTextRef}
          className="mt-8 text-sm text-zinc-500 text-center opacity-0"
        >
          Not sure? Start with the card that feels closest to you
        </p>
      </div>
    </section>
  );
}