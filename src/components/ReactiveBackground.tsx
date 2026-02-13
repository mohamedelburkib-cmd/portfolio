"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const BACKGROUND_CONFIG = {
  enabled: true,
  glowLerp: 0.16,
  scrollParallax: 0.05,
  noiseDriftSpeed: 0.24,
};

export default function ReactiveBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !BACKGROUND_CONFIG.enabled) return;

    if (prefersReducedMotion) {
      root.style.setProperty("--bg-cursor-x", "50%");
      root.style.setProperty("--bg-cursor-y", "30%");
      root.style.setProperty("--bg-scroll", "0px");
      root.style.setProperty("--bg-noise-x", "0px");
      return;
    }

    let frame = 0;
    let noiseTick = 0;
    let scrollY = window.scrollY;
    const target = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.3 };
    const cursor = { x: target.x, y: target.y };

    const handlePointer = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleResize = () => {
      target.x = Math.min(target.x, window.innerWidth);
      target.y = Math.min(target.y, window.innerHeight);
    };

    const render = () => {
      const viewportWidth = Math.max(window.innerWidth, 1);
      const viewportHeight = Math.max(window.innerHeight, 1);

      cursor.x += (target.x - cursor.x) * BACKGROUND_CONFIG.glowLerp;
      cursor.y += (target.y - cursor.y) * BACKGROUND_CONFIG.glowLerp;

      noiseTick += BACKGROUND_CONFIG.noiseDriftSpeed;
      const cursorXPct = `${(cursor.x / viewportWidth) * 100}%`;
      const cursorYPct = `${(cursor.y / viewportHeight) * 100}%`;

      root.style.setProperty("--bg-cursor-x", cursorXPct);
      root.style.setProperty("--bg-cursor-y", cursorYPct);
      root.style.setProperty("--bg-scroll", `${scrollY * BACKGROUND_CONFIG.scrollParallax}px`);
      root.style.setProperty("--bg-noise-x", `${noiseTick}px`);

      frame = window.requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerdown", handlePointer, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    render();

    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  if (!BACKGROUND_CONFIG.enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#04070f_0%,#050a12_48%,#03060d_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_-8%,rgba(76,141,255,0.14),transparent_46%)]" />
      <div className="absolute inset-0 opacity-22 [transform:translate3d(0,calc(var(--bg-scroll)*-1),0)] bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute inset-0 opacity-65 bg-[radial-gradient(circle_at_var(--bg-cursor-x)_var(--bg-cursor-y),rgba(76,141,255,0.22),rgba(76,141,255,0.08)_22%,transparent_44%)]" />
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-normal [background-size:180px_180px] [background-position:var(--bg-noise-x)_0]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(148,163,184,0.55) 0.55px, transparent 0.55px)",
        }}
      />
    </div>
  );
}
