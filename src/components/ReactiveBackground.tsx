"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function ReactiveBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion) {
      root.style.setProperty("--bg-x", "50%");
      root.style.setProperty("--bg-y", "30%");
      return;
    }

    let frame = 0;
    const cursor = { x: 0.5, y: 0.3 };
    const target = { x: 0.5, y: 0.3 };

    const onPointer = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };

    const tick = () => {
      cursor.x += (target.x - cursor.x) * 0.08;
      cursor.y += (target.y - cursor.y) * 0.08;
      root.style.setProperty("--bg-x", `${cursor.x * 100}%`);
      root.style.setProperty("--bg-y", `${cursor.y * 100}%`);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={rootRef} aria-hidden className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0a0a0b 0%, #0d0d0f 50%, #0a0a0b 100%)" }} />
      <div className="absolute inset-0 opacity-25" style={{
        backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }} />
      <div className="absolute inset-0 opacity-40" style={{
        background: "radial-gradient(circle at var(--bg-x, 50%) var(--bg-y, 30%), rgba(210,255,0,0.06), transparent 45%)",
      }} />
    </div>
  );
}
