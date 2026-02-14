"use client";

import { animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./HeroVisorReveal.module.css";

export const VISOR_W = 380;
export const VISOR_H = 220;
export const LERP = 0.18;
export const SCANLINE_OPACITY = 0.02;

// Rotating lens "scenes" — each shows different analytics data
const LENS_SCENES = [
  {
    metrics: [
      { label: "Revenue at risk", value: "23%" },
      { label: "Accounts flagged", value: "47" },
      { label: "Confidence", value: "0.91" },
    ],
    sql: ["SELECT", " customer_id, ", "SUM", "(revenue)"],
    bars: [0.4, 0.72, 0.55, 0.88, 0.65, 0.92, 0.48, 0.78],
  },
  {
    metrics: [
      { label: "Cohort size", value: "4,312" },
      { label: "Repeat rate", value: "34%" },
      { label: "LTV delta", value: "+£18.4" },
    ],
    sql: ["NTILE", "(5) ", "OVER", " (ORDER BY recency)"],
    bars: [0.88, 0.65, 0.42, 0.35, 0.22, 0.18, 0.12, 0.08],
  },
  {
    metrics: [
      { label: "Tied capital", value: "£45K" },
      { label: "Slow SKUs", value: "127" },
      { label: "Release est.", value: "£22K" },
    ],
    sql: ["RANK", "() ", "OVER", " (PARTITION BY category)"],
    bars: [0.2, 0.35, 0.5, 0.42, 0.68, 0.75, 0.88, 0.95],
  },
  {
    metrics: [
      { label: "Markets", value: "38" },
      { label: "Revenue", value: "£8.5M" },
      { label: "Prep saved", value: "30%" },
    ],
    sql: ["MEASURE", " = ", "CALCULATE", "(SUM(Sales))"],
    bars: [0.6, 0.72, 0.58, 0.82, 0.7, 0.65, 0.9, 0.55],
  },
];

const SWEEP_DURATION_S = 1.12;
const HAS_FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

type HeroVisorRevealProps = {
  nameLine1: string;
  nameLine2: string;
  hudLabel?: string;
};

export default function HeroVisorReveal({
  nameLine1,
  nameLine2,
  hudLabel = "ANALYSIS LENS",
}: HeroVisorRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pointerInsideRef = useRef(false);
  const targetRef = useRef({ x: 0.5, y: 0.46 });
  const currentRef = useRef({ x: 0.5, y: 0.46 });
  const reduceMotion = useReducedMotion();
  const [introFinished, setIntroFinished] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [canHover, setCanHover] = useState(true);

  const staticReveal = useMemo(
    () => Boolean(reduceMotion) || !canHover,
    [reduceMotion, canHover]
  );
  const introComplete = staticReveal || introFinished;
  const scene = LENS_SCENES[sceneIndex];

  // Detect pointer capability
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(HAS_FINE_POINTER_QUERY);
    const onChange = () => setCanHover(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Rotate lens scenes
  useEffect(() => {
    const timer = window.setInterval(
      () => setSceneIndex((c) => (c + 1) % LENS_SCENES.length),
      3200
    );
    return () => window.clearInterval(timer);
  }, []);

  // Intro sweep animation
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
        element.style.setProperty("--my", "46%");
      },
      onComplete: () => setIntroFinished(true),
    });

    return () => controls.stop();
  }, [staticReveal]);

  // Pointer tracking
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
      targetRef.current.x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      targetRef.current.y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    };

    rafRef.current = window.requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => updateTarget(e.clientX, e.clientY);
    const onEnter = (e: PointerEvent) => { pointerInsideRef.current = true; updateTarget(e.clientX, e.clientY); };
    const onLeave = () => { pointerInsideRef.current = false; };

    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerenter", onEnter);
    element.addEventListener("pointerleave", onLeave);
    element.addEventListener("pointerdown", onMove);

    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointerleave", onLeave);
      element.removeEventListener("pointerdown", onMove);
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
      className={[styles.root, staticReveal ? styles.staticReveal : ""].join(" ")}
    >
      {/* Base layer: faded ghost name */}
      <div className={styles.baseLayer}>
        <h1 className={[styles.title, styles.baseTitle].join(" ")}>
          <span className="block">{nameLine1}</span>
          <span className="block">{nameLine2}</span>
        </h1>
      </div>

      {/* Reveal layer: bright name visible through lens */}
      <div className={[styles.revealLayer, styles.revealMask].join(" ")}>
        <h1 className={[styles.title, styles.revealText].join(" ")}>
          <span className="block">{nameLine1}</span>
          <span className="block">{nameLine2}</span>
        </h1>
        <span className={styles.hud}>{hudLabel}</span>
      </div>

      {/* Lens analytics overlay — the creative part */}
      {!staticReveal && introComplete ? (
        <div className={styles.lensContent} aria-hidden>
          {/* Mini bar chart */}
          <div className={styles.lensChart}>
            {scene.bars.map((h, i) => (
              <div key={i} className={styles.lensBar} style={{ height: `${h * 100}%` }} />
            ))}
          </div>

          {/* Metrics */}
          {scene.metrics.map((m) => (
            <div key={m.label} className={styles.lensMetric}>
              <span>{m.label}</span>
              <span className={styles.lensValue}>{m.value}</span>
            </div>
          ))}

          {/* SQL snippet */}
          <div className={styles.lensSql}>
            <span className={styles.lensSqlKeyword}>{scene.sql[0]}</span>
            {scene.sql[1]}
            <span className={styles.lensSqlKeyword}>{scene.sql[2]}</span>
            {scene.sql[3]}
          </div>
        </div>
      ) : null}

      {/* Visor frame with corner brackets */}
      {!staticReveal && introComplete ? (
        <>
          <span aria-hidden className={styles.visorFrame}>
            <span className={styles.cornerTL} />
            <span className={styles.cornerTR} />
            <span className={styles.cornerBL} />
            <span className={styles.cornerBR} />
          </span>
          <span aria-hidden className={styles.noise} />
        </>
      ) : null}

      {/* Intro sweep */}
      {!staticReveal && !introComplete ? (
        <motion.span
          aria-hidden
          className={styles.introSweep}
          initial={{ left: "-24%", opacity: 0.6 }}
          animate={{ left: "112%", opacity: 0.18 }}
          transition={{ duration: SWEEP_DURATION_S, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : null}

      {/* Prompt hint */}
      {!staticReveal && introComplete ? (
        <span className={styles.promptHint}>Move cursor to explore</span>
      ) : null}
    </div>
  );
}
