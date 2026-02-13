"use client";

import { animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./HeroVisorReveal.module.css";

export const VISOR_W = 320;
export const VISOR_H = 168;
export const LERP = 0.2;
export const SCANLINE_OPACITY = 0.03;

const TAGS = ["SQL", "Power BI", "Tableau", "Ops Analytics"];
const SWEEP_DURATION_S = 1.12;

type HeroVisorRevealProps = {
  nameLine1: string;
  nameLine2: string;
  roleLine?: string;
  hudLabel?: string;
};

const HAS_FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

export default function HeroVisorReveal({
  nameLine1,
  nameLine2,
  roleLine = "DATA ANALYST",
  hudLabel = "PROFILE",
}: HeroVisorRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pointerInsideRef = useRef(false);
  const targetRef = useRef({ x: 0.5, y: 0.46 });
  const currentRef = useRef({ x: 0.5, y: 0.46 });
  const reduceMotion = useReducedMotion();
  const [introFinished, setIntroFinished] = useState(false);
  const [tagIndex, setTagIndex] = useState(0);
  const [canHover, setCanHover] = useState(true);

  const staticReveal = useMemo(
    () => Boolean(reduceMotion) || !canHover,
    [reduceMotion, canHover]
  );
  const introComplete = staticReveal || introFinished;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(HAS_FINE_POINTER_QUERY);
    const onChange = () => setCanHover(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(
      () => setTagIndex((current) => (current + 1) % TAGS.length),
      2200
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.style.setProperty("--vw", `${VISOR_W}px`);
    element.style.setProperty("--vh", `${VISOR_H}px`);
    element.style.setProperty("--scanline-opacity", String(SCANLINE_OPACITY));
    element.style.setProperty("--mx", `${currentRef.current.x * 100}%`);
    element.style.setProperty("--my", `${currentRef.current.y * 100}%`);

    if (staticReveal) return;

    const width = element.clientWidth;
    const from = -VISOR_W * 0.7;
    const to = width + VISOR_W * 0.7;
    const centerY = element.clientHeight * 0.46;

    const controls = animate(from, to, {
      duration: SWEEP_DURATION_S,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        const xNorm = width <= 0 ? 0.5 : value / width;
        const clamped = Math.max(0, Math.min(1, xNorm));
        currentRef.current.x = clamped;
        currentRef.current.y = 0.46;
        targetRef.current.x = clamped;
        targetRef.current.y = 0.46;
        element.style.setProperty("--mx", `${clamped * 100}%`);
        element.style.setProperty("--my", `${(centerY / Math.max(1, element.clientHeight)) * 100}%`);
      },
      onComplete: () => setIntroFinished(true),
    });

    return () => controls.stop();
  }, [staticReveal]);

  useEffect(() => {
    if (staticReveal || !introComplete) return;
    const element = containerRef.current;
    if (!element) return;

    const tick = () => {
      const nextX = pointerInsideRef.current ? targetRef.current.x : 0.5;
      const nextY = pointerInsideRef.current ? targetRef.current.y : 0.46;

      currentRef.current.x += (nextX - currentRef.current.x) * LERP;
      currentRef.current.y += (nextY - currentRef.current.y) * LERP;

      element.style.setProperty("--mx", `${currentRef.current.x * 100}%`);
      element.style.setProperty("--my", `${currentRef.current.y * 100}%`);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const updateTarget = (clientX: number, clientY: number) => {
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      targetRef.current.x = Math.max(0, Math.min(1, x));
      targetRef.current.y = Math.max(0, Math.min(1, y));
    };

    rafRef.current = window.requestAnimationFrame(tick);

    const onMove = (event: PointerEvent) => {
      updateTarget(event.clientX, event.clientY);
    };

    const onEnter = (event: PointerEvent) => {
      pointerInsideRef.current = true;
      updateTarget(event.clientX, event.clientY);
    };

    const onLeave = () => {
      pointerInsideRef.current = false;
    };

    const onDown = (event: PointerEvent) => {
      updateTarget(event.clientX, event.clientY);
    };

    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerenter", onEnter);
    element.addEventListener("pointerleave", onLeave);
    element.addEventListener("pointerdown", onDown);

    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointerleave", onLeave);
      element.removeEventListener("pointerdown", onDown);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      pointerInsideRef.current = false;
    };
  }, [introComplete, staticReveal]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={[
        styles.root,
        staticReveal ? styles.staticReveal : "",
      ].join(" ")}
    >
      <div className={styles.baseLayer}>
        <h1 className={[styles.title, styles.baseTitle].join(" ")}>
          <span className="block">{nameLine1}</span>
          <span className="block">{nameLine2}</span>
        </h1>
      </div>

      <div className={[styles.revealLayer, styles.revealMask].join(" ")}>
        <h1 className={[styles.title, styles.revealText].join(" ")}>
          <span className="block">{nameLine1}</span>
          <span className={styles.roleSwap}>{roleLine}</span>
        </h1>
        <p className={styles.revealMeta}>OPERATIONS, COMMERCIAL AND RISK ANALYTICS</p>
        <p className={styles.tags}>
          <span className={styles.tagAccent}>FOCUS</span>
          <span> | </span>
          <span>{staticReveal ? TAGS.join(" | ") : TAGS[tagIndex]}</span>
        </p>
        <span className={styles.hud}>{hudLabel}</span>
      </div>

      {!staticReveal && introComplete ? <span aria-hidden className={styles.visorFrame} /> : null}
      {!staticReveal && introComplete ? <span aria-hidden className={styles.noise} /> : null}

      {!staticReveal && !introComplete ? (
        <motion.span
          aria-hidden
          className={styles.introSweep}
          initial={{ left: "-24%", opacity: 0.65 }}
          animate={{ left: "112%", opacity: 0.22 }}
          transition={{ duration: SWEEP_DURATION_S, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : null}
    </div>
  );
}
