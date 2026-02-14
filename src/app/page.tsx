"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const CYCLING_METRICS = [
  { label: "transactions analysed", value: "1,042,387" },
  { label: "capital flagged", value: "£45,200" },
  { label: "customers segmented", value: "4,312" },
  { label: "revenue concentration", value: "23.1%" },
  { label: "markets unified", value: "38" },
  { label: "repeat purchase lift", value: "+7.2pp" },
  { label: "reporting time saved", value: "~30%" },
  { label: "slow SKUs identified", value: "127" },
];

type Project = {
  id: string;
  tool: string;
  title: string;
  year: string;
  frame: string;
  insight: string;
  action: string;
  result: string;
  tags: string[];
  size: "large" | "medium" | "small";
  accent?: boolean;
};

const PROJECTS: Project[] = [
  {
    id: "revenue",
    tool: "SQL",
    title: "Revenue Concentration Analysis",
    year: "2024",
    frame: "Which customers should we protect?",
    insight: "Top 5% of customers = 23% of total revenue — a hidden dependency pattern.",
    action: "Weekly monitoring query with rank-based thresholds and pricing guardrails.",
    result: "8–12% concentration reduction expected over two cycles.",
    tags: ["CTEs", "Window Functions", "PERCENT_RANK"],
    size: "large",
    accent: true,
  },
  {
    id: "rfm",
    tool: "SQL",
    title: "Customer RFM Segmentation",
    year: "2024",
    frame: "Who's worth re-engaging now?",
    insight: "4,300+ customers mapped into 5 lifecycle cohorts.",
    action: "Segment-to-action ownership across Sales, Marketing, CRM.",
    result: "+5–9% repeat purchase rate in mid-value cohorts.",
    tags: ["NTILE", "Cohort Analysis", "Self-Joins"],
    size: "medium",
  },
  {
    id: "inventory",
    tool: "SQL",
    title: "Product Performance Diagnostics",
    year: "2024",
    frame: "Which SKUs are tying up cash?",
    insight: "127 slow SKUs = £45K tied capital in Category C.",
    action: "Weekly exception flags to rebalance stock allocation.",
    result: "£18–25K cash release potential in Q1.",
    tags: ["ABC Classification", "RANK"],
    size: "medium",
  },
  {
    id: "powerbi",
    tool: "Power BI",
    title: "Executive Sales Command Center",
    year: "2024",
    frame: "One clean view across 38 markets?",
    insight: "£8.5M revenue unified into a self-service surface.",
    action: "Star schema + DAX measures + role-based drill paths.",
    result: "25–35% reduction in weekly reporting prep time.",
    tags: ["DAX", "Star Schema", "Mobile Layout"],
    size: "large",
  },
  {
    id: "tableau",
    tool: "Tableau",
    title: "Customer Journey Funnel",
    year: "2024",
    frame: "Where's the biggest conversion drop?",
    insight: "67% drop-off at first-to-repeat purchase step.",
    action: "30-day reactivation sequence targeting first-time buyers.",
    result: "+4–7pp repeat purchase recovery.",
    tags: ["LOD", "Story Points", "Funnel"],
    size: "small",
  },
  {
    id: "pnl",
    tool: "Excel",
    title: "Scenario P&L Model",
    year: "2025",
    frame: "What if we adjust pricing 5–15%?",
    insight: "10% price increase → 6.2% margin improvement.",
    action: "3-scenario comparison with sensitivity matrix.",
    result: "Adopted for quarterly pricing reviews.",
    tags: ["Data Tables", "SUMPRODUCT", "Scenarios"],
    size: "small",
  },
  {
    id: "capacity",
    tool: "Excel",
    title: "Ops Capacity Planning",
    year: "2025",
    frame: "How many shifts cover projected volume?",
    insight: "22% volume drop on Tuesdays — overstaffed by 3–4 heads.",
    action: "Weekly capacity heatmap with auto-flagging.",
    result: "£2.8K/month projected savings.",
    tags: ["INDEX/MATCH", "VBA", "Heatmaps"],
    size: "small",
  },
  {
    id: "ltv",
    tool: "Financial Modelling",
    title: "Unit Economics & LTV Model",
    year: "2025",
    frame: "What's each segment's true lifetime value?",
    insight: "Champion LTV = 4.8× At Risk, but CAC only 1.6× higher.",
    action: "Reallocate 30% of reactivation budget to Champion acquisition.",
    result: "LTV:CAC projected from 2.1:1 → 3.4:1.",
    tags: ["LTV/CAC", "Cohort Retention", "Payback Period"],
    size: "medium",
  },
  {
    id: "scorecard",
    tool: "Financial Modelling",
    title: "Investment Scorecard",
    year: "2025",
    frame: "How to compare pre-IPO opportunities?",
    insight: "Liquidity risk was systematically underweighted in informal assessments.",
    action: "8-dimension weighted scorecard with adjustable weights.",
    result: "Adopted for personal portfolio decisions.",
    tags: ["Weighted Scoring", "Decision Matrices"],
    size: "small",
  },
];

const JOURNEY = [
  { year: "2024–Now", title: "Risk & Logistics Analyst", org: "Amazon", desc: "Transport risk diagnostics across fulfilment operations." },
  { year: "2023", title: "BSc Economics & Accounting", org: "City, University of London", desc: "Quantitative reasoning and commercial decision framing." },
  { year: "Now", title: "Analytics Transition", org: "Portfolio", desc: "SQL, BI, Excel, and financial modelling — analysis that moves decisions." },
];

const CONTACTS = [
  { id: "email", label: "Email", value: "mohamed.elburki@outlook.com", href: "mailto:mohamed.elburki@outlook.com", angle: -12 },
  { id: "linkedin", label: "LinkedIn", value: "Mohamed El-Burki", href: "https://linkedin.com/in/mohamedelburki", angle: -4 },
  { id: "github", label: "GitHub", value: "mohamedelburkib-cmd", href: "https://github.com/mohamedelburkib-cmd", angle: 5 },
];

/* ──────────────────────────────────────────────
   TERMINAL HERO
   ────────────────────────────────────────────── */

function TerminalHero() {
  const [metricIdx, setMetricIdx] = useState(0);
  const [displayVal, setDisplayVal] = useState("");
  const [typing, setTyping] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const metric = CYCLING_METRICS[metricIdx];
    if (reduceMotion) {
      setDisplayVal(metric.value);
      const timer = setTimeout(() => setMetricIdx((i) => (i + 1) % CYCLING_METRICS.length), 2200);
      return () => clearTimeout(timer);
    }

    let charIdx = 0;
    setDisplayVal("");
    setTyping(true);

    const typeTimer = setInterval(() => {
      charIdx++;
      setDisplayVal(metric.value.slice(0, charIdx));
      if (charIdx >= metric.value.length) {
        clearInterval(typeTimer);
        setTyping(false);
        setTimeout(() => setMetricIdx((i) => (i + 1) % CYCLING_METRICS.length), 1800);
      }
    }, 55);

    return () => clearInterval(typeTimer);
  }, [metricIdx, reduceMotion]);

  const metric = CYCLING_METRICS[metricIdx];

  return (
    <section id="hero" className="relative z-10 flex min-h-[92vh] items-center px-6 pt-20 pb-10">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Name */}
          <h1
            className="text-6xl uppercase tracking-tight md:text-[8rem] lg:text-[10rem]"
            style={{
              fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              lineHeight: 0.85,
              color: "var(--text)",
            }}
          >
            Mohamed
            <br />
            <span style={{ color: "var(--accent)" }}>El-Burki</span>
          </h1>

          {/* Role */}
          <p className="mt-4 text-sm uppercase tracking-[0.2em] md:text-base" style={{ color: "var(--text-muted)" }}>
            Data Analyst — Operations, Commercial &amp; Risk Analytics
          </p>

          {/* Terminal metric */}
          <div
            className="mt-6 inline-flex items-center gap-3 rounded-lg border px-4 py-3 font-mono"
            style={{
              borderColor: "var(--accent-mid)",
              backgroundColor: "var(--accent-soft)",
            }}
          >
            <span className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
              {metric.label}
            </span>
            <span className="text-lg font-bold md:text-xl" style={{ color: "var(--accent)" }}>
              {displayVal}
              {typing && (
                <span
                  className="ml-0.5 inline-block h-5 w-[2px]"
                  style={{
                    backgroundColor: "var(--accent)",
                    animation: "blink 0.6s step-end infinite",
                  }}
                />
              )}
            </span>
          </div>

          {/* Stack pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {["SQL", "Power BI", "Tableau", "Excel", "Financial Modelling"].map((t) => (
              <span
                key={t}
                className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* One-liner */}
          <p className="mt-6 max-w-xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
            I bridge operational pressure, commercial priorities, and dashboard clarity — so teams can act with confidence.
          </p>
        </motion.div>

        {/* Blink animation */}
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   BENTO PROJECT GRID
   ────────────────────────────────────────────── */

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const toolColors: Record<string, string> = {
    SQL: "#D2FF00",
    "Power BI": "#F2C811",
    Tableau: "#E97627",
    Excel: "#217346",
    "Financial Modelling": "#00D4AA",
  };

  const toolColor = toolColors[project.tool] || "var(--accent)";

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setIsOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300"
        style={{
          borderColor: hovered ? `${toolColor}33` : "var(--border)",
          backgroundColor: hovered ? "var(--card-hover)" : "var(--card-bg)",
          gridColumn: project.size === "large" ? "span 2" : "span 1",
          gridRow: project.size === "large" ? "span 1" : "span 1",
        }}
      >
        {/* Tool badge */}
        <div className="absolute right-3 top-3 z-10">
          <span
            className="rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em]"
            style={{ backgroundColor: `${toolColor}18`, color: toolColor, border: `1px solid ${toolColor}30` }}
          >
            {project.tool}
          </span>
        </div>

        {/* Default state */}
        <div
          className="flex h-full flex-col justify-between p-5 transition-opacity duration-300 md:p-6"
          style={{ opacity: hovered ? 0 : 1 }}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
              {project.year}
            </p>
            <h3
              className="mt-2 text-lg font-semibold leading-tight md:text-xl"
              style={{ color: "var(--text)" }}
            >
              {project.title}
            </h3>
          </div>
          <p className="mt-3 text-sm italic" style={{ color: "var(--text-muted)" }}>
            &ldquo;{project.frame}&rdquo;
          </p>
        </div>

        {/* Hover reveal */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-5 transition-opacity duration-300 md:p-6"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: toolColor }}>
              Insight
            </p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
              {project.insight}
            </p>
          </div>
          <div className="mt-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: toolColor }}>
              Result
            </p>
            <p className="mt-1 text-sm font-semibold" style={{ color: "var(--text)" }}>
              {project.result}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
              Click to open
            </span>
            <span style={{ color: toolColor }}>→</span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
          style={{
            backgroundColor: toolColor,
            width: hovered ? "100%" : "0%",
          }}
        />
      </motion.article>

      {/* Envelope modal */}
      <AnimatePresence>
        {isOpen && (
          <EnvelopeModal project={project} toolColor={toolColor} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function EnvelopeModal({
  project,
  toolColor,
  onClose,
}: {
  project: Project;
  toolColor: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />

      {/* Envelope card */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: -8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, y: 30, rotateX: -5 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border"
        style={{
          backgroundColor: "var(--envelope-bg)",
          borderColor: `${toolColor}30`,
          boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 40px ${toolColor}08`,
        }}
      >
        {/* Envelope flap (decorative) */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${toolColor}40, ${toolColor}, ${toolColor}40)` }}
        />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <span
                className="rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em]"
                style={{ backgroundColor: `${toolColor}18`, color: toolColor, border: `1px solid ${toolColor}30` }}
              >
                {project.tool}
              </span>
              <h3 className="mt-3 text-2xl font-semibold md:text-3xl" style={{ color: "var(--text)" }}>
                {project.title}
              </h3>
              <p className="mt-1 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                {project.year}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border px-3 py-1.5 font-mono text-xs transition hover:bg-white/5"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
            >
              ESC
            </button>
          </div>

          {/* Decision Frame */}
          <div
            className="mt-5 rounded-xl border p-4"
            style={{ borderColor: `${toolColor}25`, backgroundColor: `${toolColor}08` }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: toolColor }}>
              Decision Frame
            </p>
            <p className="mt-1.5 text-sm italic leading-relaxed" style={{ color: "var(--text)" }}>
              {project.frame}
            </p>
          </div>

          {/* Insight / Action / Result */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Insight", val: project.insight },
              { label: "Action", val: project.action },
              { label: "Result", val: project.result },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: toolColor }}>
                  {item.label}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                  {item.val}
                </p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BentoGrid() {
  return (
    <section id="work" className="relative z-10 scroll-mt-20 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm" style={{ color: "var(--accent)" }}>01</span>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border-strong)" }} />
          <span className="text-xs uppercase tracking-[0.24em]" style={{ color: "var(--text-muted)" }}>Projects</span>
        </div>

        <h2
          className="text-4xl uppercase tracking-tight md:text-6xl"
          style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif", color: "var(--text)" }}
        >
          Analysis That <span style={{ color: "var(--accent)" }}>Drives Decisions</span>
        </h2>
        <p className="mt-3 max-w-xl text-sm" style={{ color: "var(--text-muted)" }}>
          Hover to preview. Click to open the full case study.
        </p>

        {/* Bento Grid */}
        <div
          className="mt-8 grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   JOURNEY — compact horizontal
   ────────────────────────────────────────────── */

function Journey() {
  return (
    <section id="journey" className="relative z-10 scroll-mt-20 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm" style={{ color: "var(--accent)" }}>02</span>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border-strong)" }} />
          <span className="text-xs uppercase tracking-[0.24em]" style={{ color: "var(--text-muted)" }}>Journey</span>
        </div>

        <h2
          className="text-4xl uppercase tracking-tight md:text-6xl"
          style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif", color: "var(--text)" }}
        >
          From Warehouse <span style={{ color: "var(--accent)" }}>to Dashboard</span>
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {JOURNEY.map((j, i) => (
            <motion.div
              key={j.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl border p-5"
              style={{
                borderColor: j.year === "Now" ? "var(--accent-mid)" : "var(--border)",
                backgroundColor: j.year === "Now" ? "var(--accent-soft)" : "var(--card-bg)",
              }}
            >
              {/* Year badge */}
              <span
                className="font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: j.year === "Now" ? "var(--accent)" : "var(--text-muted)" }}
              >
                {j.year}
              </span>
              <h4 className="mt-2 text-base font-semibold" style={{ color: "var(--text)" }}>
                {j.title}
              </h4>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                {j.org}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {j.desc}
              </p>

              {/* Connector line for non-last */}
              {i < JOURNEY.length - 1 && (
                <div
                  className="absolute -right-4 top-1/2 hidden h-px w-4 md:block"
                  style={{ backgroundColor: "var(--border-strong)" }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   CONTACT — fan-out cards like Lando socials
   ────────────────────────────────────────────── */

function FanOutContact() {
  const [copied, setCopied] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText("mohamed.elburki@outlook.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const iconMap: Record<string, React.ReactNode> = {
    email: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13L2 4" />
      </svg>
    ),
    linkedin: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    github: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  };

  return (
    <section id="contact" className="relative z-10 scroll-mt-20 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm" style={{ color: "var(--accent)" }}>03</span>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border-strong)" }} />
          <span className="text-xs uppercase tracking-[0.24em]" style={{ color: "var(--text-muted)" }}>Connect</span>
        </div>

        <h2
          className="text-center text-4xl uppercase tracking-tight md:text-6xl"
          style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif", color: "var(--text)" }}
        >
          Get in <span style={{ color: "var(--accent)" }}>Touch</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm" style={{ color: "var(--text-muted)" }}>
          Open to analyst roles and project collaborations where rigorous analytics improves decision speed.
        </p>

        {/* Fan-out cards */}
        <div className="mt-10 flex items-center justify-center gap-4" style={{ perspective: "800px" }}>
          {CONTACTS.map((c, i) => {
            const isHovered = hoveredId === c.id;
            const baseRotate = c.angle;
            const hoverRotate = isHovered ? 0 : baseRotate;

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30, rotate: baseRotate }}
                whileInView={{ opacity: 1, y: 0, rotate: hoverRotate }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.06, rotate: 0, y: -8, zIndex: 10 }}
                onHoverStart={() => setHoveredId(c.id)}
                onHoverEnd={() => setHoveredId(null)}
                className="relative w-48 rounded-2xl border p-5 text-center transition-shadow duration-300 md:w-56"
                style={{
                  borderColor: isHovered ? "var(--accent-mid)" : "var(--border)",
                  backgroundColor: isHovered ? "var(--surface-2)" : "var(--surface)",
                  boxShadow: isHovered
                    ? "0 20px 60px rgba(0,0,0,0.4), 0 0 30px var(--accent-soft)"
                    : "0 8px 30px rgba(0,0,0,0.2)",
                  cursor: c.id === "email" ? "pointer" : "default",
                  transformOrigin: "center bottom",
                }}
                onClick={c.id === "email" ? copyEmail : undefined}
              >
                {/* Icon */}
                <div
                  className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: isHovered ? "var(--accent-mid)" : "var(--accent-soft)",
                    color: "var(--accent)",
                    transition: "background-color 0.3s",
                  }}
                >
                  {iconMap[c.id]}
                </div>

                <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>
                  {c.label}
                </p>
                <p className="mt-1.5 text-xs break-all leading-relaxed" style={{ color: "var(--text)" }}>
                  {c.id === "email" && copied ? "Copied ✓" : c.value}
                </p>

                {c.id !== "email" && (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0"
                    aria-label={`Open ${c.label}`}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <p
          className="mx-auto mt-8 max-w-sm text-center font-mono text-[10px] uppercase tracking-[0.14em]"
          style={{ color: "var(--text-muted)" }}
        >
          Preferred: email · Response: 24h · Timezone: UK (GMT/BST)
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────── */

export default function Portfolio() {
  return (
    <div className="relative min-h-screen overflow-x-clip" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-40 px-6 py-4">
        <div
          className="mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2 backdrop-blur-lg"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "rgba(10,10,11,0.75)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>M.E-B</span>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--accent)" }}>
              Available for roles
            </span>
          </div>
          <nav className="hidden items-center gap-5 sm:flex">
            {[
              { label: "Work", href: "#work" },
              { label: "Journey", href: "#journey" },
              { label: "Contact", href: "#contact" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-[10px] uppercase tracking-[0.16em] transition hover:opacity-80"
                style={{ color: "var(--text-muted)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <TerminalHero />
      <BentoGrid />
      <Journey />
      <FanOutContact />

      {/* Footer */}
      <footer className="relative z-10 border-t px-6 py-6" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
          <p>&copy; 2026 Mohamed El-Burki</p>
          <p className="font-mono text-[10px]">Next.js + Framer Motion</p>
        </div>
      </footer>
    </div>
  );
}
