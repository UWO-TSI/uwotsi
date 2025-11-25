"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [squarePos, setSquarePos] = useState({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const squarePosRef = useRef({ x: 0, y: 0 });

  // Fixed cursor color
  const cursorColor = "#A1A1AA";

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop for smooth square following with exponential easing
    let animationFrameId: number;
    const animate = () => {
      setSquarePos((prev) => {
        squarePosRef.current = prev;
        const targetX = mousePosRef.current.x;
        const targetY = mousePosRef.current.y;
        
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Exponential easing: speed is proportional to distance
        // Fast when far, exponentially slower as it approaches
        // Using a damping factor that creates exponential decay
        const damping = 0.125; // Lower = slower, higher = faster (25% slower than 0.15)
        // Speed scales with distance for natural exponential easing
        const speed = Math.min(1, damping * (1 + distance / 200));

        const newX = prev.x + dx * speed;
        const newY = prev.y + dy * speed;

        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      {/* Dot - follows mouse exactly */}
      <div
        data-cursor-element
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="w-1 h-1 rounded-sm"
          style={{ backgroundColor: cursorColor }}
        />
      </div>

      {/* Square with L-shaped brackets - follows with lag */}
      <div
        data-cursor-element
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: `${squarePos.x}px`,
          top: `${squarePos.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="relative w-[21px] h-[21px]">
          {/* Top-left bracket */}
          <div
            className="absolute top-0 left-0 w-2 h-2"
            style={{ 
              borderColor: cursorColor,
              borderTopWidth: '1.34px',
              borderLeftWidth: '1.34px',
              borderStyle: 'solid'
            }}
          />
          {/* Top-right bracket */}
          <div
            className="absolute top-0 right-0 w-2 h-2"
            style={{ 
              borderColor: cursorColor,
              borderTopWidth: '1.34px',
              borderRightWidth: '1.34px',
              borderStyle: 'solid'
            }}
          />
          {/* Bottom-left bracket */}
          <div
            className="absolute bottom-0 left-0 w-2 h-2"
            style={{ 
              borderColor: cursorColor,
              borderBottomWidth: '1.34px',
              borderLeftWidth: '1.34px',
              borderStyle: 'solid'
            }}
          />
          {/* Bottom-right bracket */}
          <div
            className="absolute bottom-0 right-0 w-2 h-2"
            style={{ 
              borderColor: cursorColor,
              borderBottomWidth: '1.34px',
              borderRightWidth: '1.34px',
              borderStyle: 'solid'
            }}
          />
        </div>
      </div>
    </>
  );
}

