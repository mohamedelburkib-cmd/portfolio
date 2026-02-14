"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import {
  Database,
  BarChart3,
  TrendingUp,
  Table2,
  LineChart,
  LayoutGrid,
} from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";

/* ══════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════ */

const CYCLING_METRICS = [
  { label: "transactions analysed", value: "1,042,387" },
  { label: "capital flagged", value: "£45,200" },
  { label: "customers segmented", value: "4,312" },
  { label: "revenue concentration", value: "23.1%" },
  { label: "markets unified", value: "38" },
  { label: "repeat purchase lift", value: "+7.2pp" },
  { label: "reporting time saved", value: "~30%" },
  { label: "slow SKUs flagged", value: "127" },
];

const CHAOS_PILLS = [
  { text: "NULL", x: 12, y: 18, rot: -8, delay: 0, color: "#ff5941" },
  { text: "JOIN", x: 68, y: 12, rot: 12, delay: 0.2, color: "#D2FF00" },
  { text: "#REF!", x: 82, y: 45, rot: -15, delay: 0.4, color: "#ff5941" },
  { text: "VLOOKUP", x: 25, y: 55, rot: 6, delay: 0.1, color: "#ffd726" },
  { text: "SELECT *", x: 55, y: 22, rot: -4, delay: 0.3, color: "#D2FF00" },
  { text: "MISMATCH", x: 42, y: 65, rot: 18, delay: 0.5, color: "#ff5941" },
  { text: "GROUP BY", x: 78, y: 68, rot: -10, delay: 0.15, color: "#D2FF00" },
  { text: "N/A", x: 15, y: 72, rot: 14, delay: 0.35, color: "#ff5941" },
  { text: "PARTITION", x: 60, y: 78, rot: -6, delay: 0.25, color: "#D2FF00" },
  { text: "TYPE ERR", x: 90, y: 25, rot: 8, delay: 0.45, color: "#ff5941" },
  { text: "SUM()", x: 35, y: 35, rot: -12, delay: 0.55, color: "#D2FF00" },
  { text: "OVERFLOW", x: 50, y: 48, rot: 20, delay: 0.6, color: "#ff5941" },
  { text: "INDEX", x: 8, y: 40, rot: -3, delay: 0.1, color: "#ffd726" },
  { text: "NTILE(5)", x: 72, y: 55, rot: 7, delay: 0.3, color: "#D2FF00" },
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
  size: "lg" | "md" | "sm";
  thumbnail: string;
};

const PROJECTS: Project[] = [
  {
    id: "revenue", tool: "SQL", title: "Revenue Concentration Analysis", year: "2024",
    frame: "Which customers should we protect, and where does over-reliance become a revenue risk?",
    insight: "Top 5% of customers = 23% of total revenue — a hidden dependency pattern.",
    action: "Weekly monitoring query with rank-based thresholds and pricing guardrails.",
    result: "8–12% concentration reduction expected over two cycles.",
    tags: ["CTEs", "Window Functions", "PERCENT_RANK"], size: "lg",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80",
  },
  {
    id: "rfm", tool: "SQL", title: "Customer RFM Segmentation", year: "2024",
    frame: "Who's worth re-engaging now, and what does that mean for marketing and ops?",
    insight: "4,300+ customers mapped into 5 lifecycle cohorts.",
    action: "Segment-to-action ownership across Sales, Marketing, CRM.",
    result: "+5–9% repeat purchase rate in mid-value cohorts.",
    tags: ["NTILE", "Cohort Analysis", "Self-Joins"], size: "md",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80",
  },
  {
    id: "inventory", tool: "SQL", title: "Product Performance Diagnostics", year: "2024",
    frame: "Which SKUs are quietly tying up cash before it compounds?",
    insight: "127 slow SKUs = £45K tied capital in Category C.",
    action: "Weekly exception flags to rebalance stock allocation.",
    result: "£18–25K cash release potential in Q1.",
    tags: ["ABC Classification", "RANK"], size: "md",
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop&q=80",
  },
  {
    id: "powerbi", tool: "Power BI", title: "Executive Sales Command Center", year: "2024",
    frame: "How does leadership get one clean view of cross-market performance?",
    insight: "£8.5M revenue unified into a self-service surface across 38 countries.",
    action: "Star schema + DAX measures + role-based drill paths + mobile layout.",
    result: "25–35% reduction in weekly reporting prep time.",
    tags: ["DAX", "Star Schema", "Mobile Layout"], size: "lg",
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=400&fit=crop&q=80",
  },
  {
    id: "tableau", tool: "Tableau", title: "Customer Journey Funnel", year: "2024",
    frame: "Where in the lifecycle is the biggest conversion opportunity?",
    insight: "67% drop-off at first-to-repeat purchase step.",
    action: "30-day reactivation sequence targeting first-time buyers.",
    result: "+4–7pp repeat purchase recovery.",
    tags: ["LOD", "Story Points", "Funnel"], size: "sm",
    thumbnail: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop&q=80",
  },
  {
    id: "pnl", tool: "Excel", title: "Scenario P&L Model", year: "2025",
    frame: "What if we adjust pricing 5–15% across product tiers?",
    insight: "10% price increase → 6.2% margin improvement even under 8% volume decline.",
    action: "3-scenario comparison with sensitivity matrix for leadership review.",
    result: "Adopted for quarterly pricing reviews, cutting ad-hoc requests ~40%.",
    tags: ["Data Tables", "SUMPRODUCT", "Scenarios"], size: "sm",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&q=80",
  },
  {
    id: "capacity", tool: "Excel", title: "Ops Capacity Planning", year: "2025",
    frame: "How many shifts cover projected volume without overstaffing?",
    insight: "22% volume drop on Tuesdays — overstaffed by 3–4 heads weekly.",
    action: "Weekly capacity heatmap with auto-flagging for coverage gaps.",
    result: "£2.8K/month projected savings through shift alignment.",
    tags: ["INDEX/MATCH", "VBA", "Heatmaps"], size: "sm",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop&q=80",
  },
  {
    id: "ltv", tool: "Financial Modelling", title: "Unit Economics & LTV Model", year: "2025",
    frame: "What's the true lifetime value per segment, and where does acquisition break even?",
    insight: "Champion LTV = 4.8× At Risk, but CAC only 1.6× higher.",
    action: "Reallocate 30% of reactivation budget to Champion acquisition channels.",
    result: "LTV:CAC projected from 2.1:1 → 3.4:1 on reallocated spend.",
    tags: ["LTV/CAC", "Cohort Retention", "Payback Period"], size: "md",
    thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop&q=80",
  },
  {
    id: "scorecard", tool: "Financial Modelling", title: "Investment Scorecard", year: "2025",
    frame: "How do you compare pre-IPO opportunities in a structured, repeatable way?",
    insight: "Liquidity risk was systematically underweighted in informal assessments.",
    action: "8-dimension weighted scorecard with adjustable weights and auto-ranking.",
    result: "Adopted for personal portfolio decisions — improved analysis consistency.",
    tags: ["Weighted Scoring", "Decision Matrices"], size: "sm",
    thumbnail: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=600&h=400&fit=crop&q=80",
  },
];

const JOURNEY = [
  { year: "2024–Now", title: "Risk & Logistics Analyst", org: "Amazon", desc: "Transport risk diagnostics across fulfilment operations. Reduced escalation noise, sharpened operational visibility.", now: false },
  { year: "2023", title: "BSc Economics & Accounting", org: "City, University of London", desc: "Quantitative reasoning and commercial decision framing.", now: false },
  { year: "Now", title: "Analytics Transition", org: "Portfolio", desc: "SQL, BI, Excel, and financial modelling — analysis that moves decisions, not just dashboards.", now: true },
];

const TOOL_COLORS: Record<string, string> = {
  SQL: "#D2FF00",
  "Power BI": "#F2C811",
  Tableau: "#E97627",
  Excel: "#217346",
  "Financial Modelling": "#00D4AA",
};

/* ══════════════════════════════════════════════════
   1. HERO
   ══════════════════════════════════════════════════ */

function ChaosPills({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {CHAOS_PILLS.map((pill, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.5, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6 + pill.delay, duration: 0.5, ease: "backOut" }}
          className="absolute font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1.5 border whitespace-nowrap"
          style={{
            left: `${pill.x}%`,
            top: `${pill.y}%`,
            color: pill.color,
            borderColor: `${pill.color}30`,
            backgroundColor: `${pill.color}0a`,
            transform: `rotate(${pill.rot}deg)`,
            animation: `float-chaos ${3 + (i % 4) * 0.8}s ease-in-out ${pill.delay}s infinite`,
          }}
        >
          {pill.text}
        </motion.span>
      ))}
    </motion.div>
  );
}

function TerminalTicker() {
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState("");
  const [typing, setTyping] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const metric = CYCLING_METRICS[idx];
    if (reduceMotion) {
      setDisplay(metric.value);
      const t = setTimeout(() => setIdx((i) => (i + 1) % CYCLING_METRICS.length), 2200);
      return () => clearTimeout(t);
    }
    let c = 0;
    setDisplay("");
    setTyping(true);
    const timer = setInterval(() => {
      c++;
      setDisplay(metric.value.slice(0, c));
      if (c >= metric.value.length) {
        clearInterval(timer);
        setTyping(false);
        setTimeout(() => setIdx((i) => (i + 1) % CYCLING_METRICS.length), 1600);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [idx, reduceMotion]);

  const metric = CYCLING_METRICS[idx];

  return (
    <div
      className="inline-flex items-center gap-3 rounded-lg border px-4 py-2.5"
      style={{ borderColor: "var(--accent-mid)", backgroundColor: "var(--accent-soft)" }}
    >
      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
        {metric.label}
      </span>
      <span className="font-mono text-base sm:text-lg font-bold" style={{ color: "var(--accent)" }}>
        {display}
        {typing && (
          <span className="ml-0.5 inline-block h-4 w-[2px]" style={{ backgroundColor: "var(--accent)", animation: "blink 0.6s step-end infinite" }} />
        )}
      </span>
    </div>
  );
}

function SpinningWords() {
  const words = ["SQL Analyst", "BI Developer", "Excel Modeller", "Finance Analyst", "Data Analyst"];
  return (
    <div className="spinning-loader">
      <span
        className="font-mono text-[10px] uppercase tracking-[0.15em]"
        style={{ color: "var(--text-muted)" }}
      >
        →&nbsp;
      </span>
      <div className="spinning-words">
        {words.map((w) => (
          <span
            key={w}
            className="spinning-word font-mono text-[10px] uppercase tracking-[0.15em]"
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

function HeroSection({ chaosOpacity }: { chaosOpacity: MotionValue<number> }) {
  const reduceMotion = useReducedMotion();
  const delay = (d: number) => (reduceMotion ? { duration: 0 } : { delay: d, duration: 0.5 });

  return (
    <section className="relative min-h-screen flex items-center px-6 pt-20 pb-10">
      <ChaosPills opacity={chaosOpacity} />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={delay(0.2)}
          className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Raw data in. Decisions out.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={delay(0.3)}
          className="text-5xl sm:text-7xl md:text-[8.5rem] lg:text-[10.5rem] uppercase leading-[0.85] tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span style={{ color: "var(--text)" }}>Mohamed</span>
          <br />
          <span style={{ color: "var(--accent)" }}>El-Burki</span>
        </motion.h1>

        {/* Spinning specialisation words */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={delay(0.45)}
          className="mt-3"
        >
          <SpinningWords />
        </motion.div>

        {/* Terminal ticker */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={delay(0.6)}
          className="mt-5"
        >
          <TerminalTicker />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={delay(0.8)}
          className="mt-5 max-w-lg text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          I turn operational noise, messy spreadsheets, and scattered metrics into
          analysis that teams actually use to make decisions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={delay(1.0)}
          className="mt-5 flex gap-3"
        >
          <a
            href="#work"
            className="rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--accent)", color: "#0a0a0b" }}
          >
            See the work
          </a>
          <a
            href="#contact"
            className="rounded-full border px-5 py-2.5 text-sm transition hover:-translate-y-0.5"
            style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}
          >
            Get in touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={delay(1.4)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
            Scroll to explore
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="block h-6 w-3.5 rounded-full border"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <span className="mx-auto mt-1 block h-1.5 w-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   2. PROJECT MODAL
   ══════════════════════════════════════════════════ */

function EnvelopeModal({ project, tc, onClose }: { project: Project; tc: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }} />

      <motion.div
        initial={{ opacity: 0, y: 36, rotateX: -6 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border"
        style={{ backgroundColor: "var(--envelope-bg)", borderColor: `${tc}28`, boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 40px ${tc}08` }}
      >
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${tc}40, ${tc}, ${tc}40)` }} />

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]" style={{ backgroundColor: `${tc}15`, color: tc, border: `1px solid ${tc}28` }}>
                {project.tool}
              </span>
              <h3 className="mt-3 text-xl sm:text-2xl font-semibold" style={{ color: "var(--text)" }}>{project.title}</h3>
              <p className="mt-1 font-mono text-xs" style={{ color: "var(--text-muted)" }}>{project.year}</p>
            </div>
            <button onClick={onClose} className="rounded-lg border px-3 py-1.5 font-mono text-xs transition hover:bg-white/5" style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}>
              ESC
            </button>
          </div>

          <div className="mt-5 rounded-xl border p-4" style={{ borderColor: `${tc}22`, backgroundColor: `${tc}08` }}>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: tc }}>Decision Frame</p>
            <p className="mt-1.5 text-sm italic leading-relaxed" style={{ color: "var(--text)" }}>{project.frame}</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Insight", val: project.insight },
              { label: "Action", val: project.action },
              { label: "Result", val: project.result },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border p-3.5" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
                <p className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: tc }}>{item.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text)" }}>{item.val}</p>
              </div>
            ))}
          </div>

          {/* Analysis stack — folder-structure style */}
          <div className="mt-4 rounded-xl border p-3.5" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] mb-2" style={{ color: tc }}>
              📊 Analysis Stack
            </p>
            <ul className="space-y-0.5">
              {project.tags.map((tag, i) => (
                <li key={tag} className="font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>
                  {i === project.tags.length - 1 ? "└── " : "├── "}{tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   3. PROJECT CARD (compact grid)
   ══════════════════════════════════════════════════ */

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const tc = TOOL_COLORS[project.tool] || "#D2FF00";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group relative h-56 rounded-2xl overflow-hidden cursor-pointer"
    >
      <Image
        src={project.thumbnail}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        alt={project.title}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      {/* Tool badge */}
      <span
        className="absolute top-3 right-3 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] backdrop-blur-md"
        style={{ backgroundColor: `${tc}22`, color: tc, border: `1px solid ${tc}50` }}
      >
        {project.tool}
      </span>

      {/* Hover overlay — folder / analysis stack */}
      <div className="absolute inset-0 bg-black/78 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] mb-2" style={{ color: tc }}>
            📊 Stack
          </p>
          <ul className="space-y-0.5">
            {project.tags.map((tag, i) => (
              <li key={tag} className="font-mono text-[9px] text-white/70">
                {i === project.tags.length - 1 ? "└── " : "├── "}{tag}
              </li>
            ))}
          </ul>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: tc }}>
          Open case study →
        </p>
      </div>

      {/* Default bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-0 transition-opacity duration-200">
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] mb-0.5" style={{ color: tc }}>
          {project.year}
        </p>
        <h3 className="text-white font-semibold text-sm leading-tight">{project.title}</h3>
        <p className="text-white/55 text-xs mt-1 line-clamp-2 leading-relaxed">{project.result}</p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   4. PROJECTS SECTION — expandable tabs + grid
   ══════════════════════════════════════════════════ */

// Map from tab index → tool name (null = All)
const TAB_TOOL_MAP: (string | null)[] = [null, "SQL", "Power BI", "Tableau", "Excel", "Financial Modelling"];

const TOOL_TABS = [
  { title: "All", icon: LayoutGrid },
  { title: "SQL", icon: Database },
  { title: "Power BI", icon: BarChart3 },
  { title: "Tableau", icon: TrendingUp },
  { title: "Excel", icon: Table2 },
  { title: "Models", icon: LineChart },
];

function ProjectsSection() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  const handleTabChange = (index: number | null) => {
    setSelectedTool(index !== null ? (TAB_TOOL_MAP[index] ?? null) : null);
  };

  const filtered = selectedTool ? PROJECTS.filter((p) => p.tool === selectedTool) : PROJECTS;
  const openProject = PROJECTS.find((p) => p.id === openProjectId) ?? null;
  const tc = openProject ? (TOOL_COLORS[openProject.tool] || "var(--accent)") : "var(--accent)";

  return (
    <section id="work" className="relative z-20 scroll-mt-20 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        {/* Header row */}
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-sm" style={{ color: "var(--accent)" }}>01</span>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border-strong)" }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Work</span>
        </div>

        {/* Title + tabs row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <h2
            className="text-3xl sm:text-5xl uppercase tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Projects <span style={{ color: "var(--accent)" }}>In Detail</span>
          </h2>
          <ExpandableTabs
            tabs={TOOL_TABS}
            onChange={handleTabChange}
            activeColor="text-[#D2FF00]"
          />
        </div>

        {/* Project count hint */}
        <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
          {filtered.length} project{filtered.length !== 1 ? "s" : ""}{selectedTool ? ` · ${selectedTool}` : " · all tools"}
        </p>

        {/* Grid */}
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={() => setOpenProjectId(p.id)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {openProject && (
          <EnvelopeModal project={openProject} tc={tc} onClose={() => setOpenProjectId(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   5. JOURNEY
   ══════════════════════════════════════════════════ */

function JourneySection() {
  return (
    <section id="journey" className="relative z-20 scroll-mt-20 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-sm" style={{ color: "var(--accent)" }}>02</span>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border-strong)" }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Journey</span>
        </div>

        <h2 className="text-3xl sm:text-5xl uppercase tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
          From Warehouse <span style={{ color: "var(--accent)" }}>to Dashboard</span>
        </h2>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {JOURNEY.map((j, i) => (
            <motion.div
              key={j.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border p-5"
              style={{
                borderColor: j.now ? "var(--accent-mid)" : "var(--border)",
                backgroundColor: j.now ? "var(--accent-soft)" : "var(--card-bg)",
              }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: j.now ? "var(--accent)" : "var(--text-muted)" }}>
                {j.year}
              </span>
              <h4 className="mt-2 text-base font-semibold" style={{ color: "var(--text)" }}>{j.title}</h4>
              <p className="font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>{j.org}</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{j.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   6. CONTACT — glassmorphism widget
   ══════════════════════════════════════════════════ */

function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("mohamed.elburki@outlook.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative z-20 scroll-mt-20 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-sm" style={{ color: "var(--accent)" }}>03</span>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border-strong)" }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Connect</span>
        </div>

        <h2 className="text-center text-3xl sm:text-5xl uppercase tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>
          Get in <span style={{ color: "var(--accent)" }}>Touch</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm" style={{ color: "var(--text-muted)" }}>
          Open to analyst roles and collaborations where analytics improves decision speed.
        </p>

        <div className="mt-10 flex justify-center">
          <div className="contact-main">
            <div className="contact-blob" />
            <span className="contact-text">{copied ? "Copied ✓" : "Connect"}</span>

            <button onClick={copyEmail} className="contact-card contact-card-email" title="Copy email address">
              <svg className="contact-icon email-icon" width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4L12 13L2 4" />
              </svg>
            </button>

            <a href="https://linkedin.com/in/mohamedelburki" target="_blank" rel="noopener noreferrer" className="contact-card contact-card-linkedin" title="LinkedIn">
              <svg className="contact-icon linkedin-icon" width="22" height="22" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            <a href="https://github.com/mohamedelburkib-cmd" target="_blank" rel="noopener noreferrer" className="contact-card contact-card-github" title="GitHub">
              <svg className="contact-icon github-icon" width="22" height="22" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-sm text-center font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
          Preferred: email · Response: 24h · Timezone: UK (GMT/BST)
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════ */

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const chaosOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      {/* Ambient background */}
      <motion.div
        style={{ y: bgY }}
        className="fixed inset-0 -z-10 pointer-events-none"
        aria-hidden
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0a0a0b 0%, #0d0d0f 50%, #0a0a0b 100%)" }} />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }} />
      </motion.div>

      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-40 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2 backdrop-blur-lg" style={{ borderColor: "var(--border-strong)", backgroundColor: "rgba(10,10,11,0.78)" }}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>M.E-B</span>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--accent)" }}>Available for roles</span>
          </div>
          <nav className="flex items-center gap-4 sm:gap-5">
            {[
              { label: "Work", href: "#work" },
              { label: "Journey", href: "#journey" },
              { label: "Contact", href: "#contact" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="font-mono text-[10px] uppercase tracking-[0.14em] transition hover:opacity-70" style={{ color: "var(--text-muted)" }}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <HeroSection chaosOpacity={chaosOpacity} />
      <ProjectsSection />
      <JourneySection />
      <ContactSection />

      <footer className="relative z-20 border-t px-6 py-6" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
          <p>&copy; 2026 Mohamed El-Burki</p>
          <p className="font-mono text-[10px]">Next.js + Framer Motion</p>
        </div>
      </footer>
    </div>
  );
}
