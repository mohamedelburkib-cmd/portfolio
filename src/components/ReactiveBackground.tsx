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
      root.style.setProperty("--bg-y", "32%");
      return;
    }

    let frame = 0;
    const cursor = { x: 0.5, y: 0.32 };
    const target = { x: 0.5, y: 0.32 };

    const onPointer = (event: PointerEvent) => {
      target.x = event.clientX / Math.max(window.innerWidth, 1);
      target.y = event.clientY / Math.max(window.innerHeight, 1);
    };

    const tick = () => {
      cursor.x += (target.x - cursor.x) * 0.1;
      cursor.y += (target.y - cursor.y) * 0.1;

      root.style.setProperty("--bg-x", `${cursor.x * 100}%`);
      root.style.setProperty("--bg-y", `${cursor.y * 100}%`);

      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#12161d_0%,#171c24_48%,#151a22_100%)]" />
      <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,rgba(232,237,243,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(232,237,243,0.07)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute inset-0 opacity-35" style={{ background: "radial-gradient(circle at var(--bg-x,50%) var(--bg-y,32%), rgba(158,201,107,0.22), rgba(158,201,107,0.06) 22%, transparent 48%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(110% 80% at 50% 120%, rgba(0,0,0,0.45), transparent 60%)" }} />
    </div>
  );
}
