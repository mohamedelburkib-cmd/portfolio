"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  Database,
  BarChart3,
  TrendingUp,
  Table2,
  LineChart,
} from "lucide-react";

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
  thumbnail: string;
};

type JourneyStep = {
  year: string;
  title: string;
  org: string;
  desc: string;
  now?: boolean;
};

const PROJECTS: Project[] = [
  {
    id: "revenue",
    tool: "SQL",
    title: "Revenue Concentration Analysis",
    year: "2024",
    frame: "Which customers should we protect, and where does over-reliance become a risk?",
    insight: "Top 5 percent of customers accounted for 23 percent of total revenue.",
    action: "Set weekly concentration thresholds and account review workflow.",
    result: "8-12 percent concentration reduction expected over two cycles.",
    tags: ["CTEs", "Window Functions", "PERCENT_RANK"],
    thumbnail: "/projects/revenue-risk-placeholder.svg",
  },
  {
    id: "rfm",
    tool: "SQL",
    title: "Customer RFM Segmentation",
    year: "2024",
    frame: "Who is worth re-engaging now, and where should budget shift first?",
    insight: "4,300+ customers mapped into five lifecycle cohorts.",
    action: "Assigned segment ownership across CRM, marketing, and sales teams.",
    result: "+5-9 percent repeat purchase improvement in target cohorts.",
    tags: ["NTILE", "Cohorts", "Recency-Frequency-Monetary"],
    thumbnail: "/projects/rfm-placeholder.svg",
  },
  {
    id: "inventory",
    tool: "SQL",
    title: "Product Performance Diagnostics",
    year: "2024",
    frame: "Which SKUs are locking cash before it impacts margin decisions?",
    insight: "127 slow SKUs linked to GBP45K tied-up capital.",
    action: "Introduced exception-led reallocation and de-prioritization routine.",
    result: "GBP18K-GBP25K release potential estimated in first quarter.",
    tags: ["ABC", "Ranking", "Exception Flags"],
    thumbnail: "/projects/kpi-model-placeholder.svg",
  },
  {
    id: "powerbi",
    tool: "Power BI",
    title: "Executive Sales Command Center",
    year: "2024",
    frame: "How can leadership review cross-market performance in one view?",
    insight: "GBP8.5M revenue landscape unified across 38 markets.",
    action: "Built governed KPI layer with role-based drill paths.",
    result: "25-35 percent reduction in weekly reporting preparation.",
    tags: ["DAX", "Star Schema", "Role Views"],
    thumbnail: "/projects/kpi-model-placeholder.svg",
  },
  {
    id: "tableau",
    tool: "Tableau",
    title: "Customer Journey Funnel",
    year: "2024",
    frame: "Where is the largest conversion drop in the customer journey?",
    insight: "67 percent drop-off at first-to-repeat purchase transition.",
    action: "Proposed a 30-day reactivation path for first-time buyers.",
    result: "+4-7 percentage points repeat purchase recovery expected.",
    tags: ["LOD", "Story Points", "Funnel Diagnostics"],
    thumbnail: "/projects/rfm-placeholder.svg",
  },
  {
    id: "pnl",
    tool: "Excel",
    title: "Scenario P and L Model",
    year: "2025",
    frame: "What margin outcomes appear under different pricing decisions?",
    insight: "10 percent price uplift maintained margin even with demand softness.",
    action: "Created a three-scenario sensitivity matrix for reviews.",
    result: "Adopted in quarterly pricing sessions, reduced ad-hoc asks by ~40 percent.",
    tags: ["Scenarios", "Data Tables", "Sensitivity"],
    thumbnail: "/projects/revenue-risk-placeholder.svg",
  },
  {
    id: "capacity",
    tool: "Excel",
    title: "Operations Capacity Planning",
    year: "2025",
    frame: "How do shifts align with demand without overstaffing?",
    insight: "Tuesday demand was consistently over-covered by 3-4 heads.",
    action: "Built shift heatmap with automated shortfall and surplus flags.",
    result: "Approx. GBP2.8K monthly savings projected from alignment.",
    tags: ["Heatmaps", "INDEX/MATCH", "Automation"],
    thumbnail: "/projects/kpi-model-placeholder.svg",
  },
  {
    id: "ltv",
    tool: "Financial Modelling",
    title: "Unit Economics and LTV Model",
    year: "2025",
    frame: "Which segment delivers stronger LTV relative to acquisition spend?",
    insight: "Champion segment LTV significantly outperformed At-Risk profiles.",
    action: "Reallocated 30 percent of reactivation budget into high-LTV channels.",
    result: "LTV:CAC expected to improve from 2.1:1 to 3.4:1.",
    tags: ["LTV:CAC", "Retention Curves", "Payback"],
    thumbnail: "/projects/revenue-risk-placeholder.svg",
  },
  {
    id: "scorecard",
    tool: "Financial Modelling",
    title: "Investment Scorecard",
    year: "2025",
    frame: "How can opportunities be compared with repeatable logic?",
    insight: "Liquidity risk was underweighted in informal evaluations.",
    action: "Designed 8-dimension weighted scorecard with dynamic ranking.",
    result: "Improved decision consistency across personal portfolio reviews.",
    tags: ["Weighted Scoring", "Decision Matrix", "Ranking"],
    thumbnail: "/projects/kpi-model-placeholder.svg",
  },
];

const JOURNEY: JourneyStep[] = [
  {
    year: "2024-Now",
    title: "Risk and Logistics Analyst",
    org: "Amazon",
    desc: "Owned transport risk diagnostics and process signals used to reduce escalation noise and improve visibility.",
  },
  {
    year: "2023",
    title: "BSc Economics and Accounting",
    org: "City, University of London",
    desc: "Built commercial reasoning, quantitative discipline, and decision framing for analytics work.",
  },
  {
    year: "Now",
    title: "Analytics Transition",
    org: "Portfolio and Client-style Cases",
    desc: "Building SQL, BI, and modelling case studies focused on measurable business actions.",
    now: true,
  },
];

const TOOL_COLORS: Record<string, string> = {
  SQL: "#9EC96B",
  "Power BI": "#D0B86E",
  Tableau: "#C78C67",
  Excel: "#6FA980",
  "Financial Modelling": "#82AFC3",
};

const TOOLS = [
  { key: "SQL",                 icon: Database,   count: 3, color: TOOL_COLORS["SQL"] },
  { key: "Power BI",            icon: BarChart3,  count: 1, color: TOOL_COLORS["Power BI"] },
  { key: "Tableau",             icon: TrendingUp, count: 1, color: TOOL_COLORS["Tableau"] },
  { key: "Excel",               icon: Table2,     count: 2, color: TOOL_COLORS["Excel"] },
  { key: "Financial Modelling", icon: LineChart,  count: 2, color: TOOL_COLORS["Financial Modelling"] },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

function SectionHeader({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span
        className="text-3xl leading-none"
        style={{ fontFamily: "var(--font-display)", color: "var(--accent)", opacity: 0.6 }}
      >
        {index}
      </span>
      <div className="h-px flex-1" style={{ backgroundColor: "var(--border-strong)" }} />
      <span
        className="font-mono text-[10px] uppercase tracking-[0.16em]"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const MARQUEE_WORDS = [
  "SQL", "Power BI", "Tableau", "Excel", "Python",
  "Financial Modelling", "DAX", "CTEs", "Window Functions",
  "Decision Support", "Risk Analytics", "Operations",
];

function SkillsMarquee() {
  const doubled = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div
      className="overflow-hidden rounded-xl border py-2.5"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div className="flex animate-marquee gap-5 whitespace-nowrap">
        {doubled.map((word, i) => (
          <span key={i} className="flex items-center gap-5">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: "var(--text-muted)" }}
            >
              {word}
            </span>
            <span style={{ color: "var(--border-strong)" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function HeroSection() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = heroRef.current;
    if (!node || reduceMotion) return;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      node.style.setProperty("--mx", `${x}px`);
      node.style.setProperty("--my", `${y}px`);
    };

    node.addEventListener("pointermove", onMove, { passive: true });
    return () => node.removeEventListener("pointermove", onMove);
  }, [reduceMotion]);

  return (
    <section id="hero" className="relative z-20 flex min-h-screen scroll-mt-24 items-center px-6 pb-12 pt-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-end">
        {/* Left — name card */}
        <div
          ref={heroRef}
          className="relative overflow-hidden rounded-2xl border p-8 md:p-10"
          style={{ borderColor: "var(--border)", backgroundColor: "rgba(29,36,48,0.55)" }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(340px circle at var(--mx, 50%) var(--my, 35%), rgba(158,201,107,0.14), transparent 70%)",
            }}
          />
          <p
            className="relative font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "var(--text-muted)" }}
          >
            Data Analyst Portfolio
          </p>
          <h1
            className="relative mt-4 text-5xl uppercase tracking-tight sm:text-7xl md:text-[8.2rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Mohamed
            <br />
            <span style={{ color: "var(--accent)" }}>El-Burki</span>
          </h1>
          <p className="relative mt-4 text-base md:text-lg" style={{ color: "var(--text)" }}>
            Data Analyst — Operations, Commercial and Risk Analytics
          </p>
          <p className="relative mt-6 max-w-xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
            I convert operational complexity into insight that supports real decisions: what to act
            on, why it matters, and what outcome to track next.
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              className="rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--accent)", color: "#12161d" }}
            >
              View Tools
            </a>
            <a
              href="#contact"
              className="rounded-full border px-5 py-2.5 text-sm transition hover:-translate-y-0.5"
              style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}
            >
              Let&apos;s Talk
            </a>
          </div>
        </div>

        {/* Right — stats + role + marquee */}
        <div className="flex flex-col gap-4 lg:pt-8">
          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl border p-5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <p
                className="text-5xl leading-none"
                style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}
              >
                9
              </p>
              <p
                className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: "var(--text-muted)" }}
              >
                Case Studies
              </p>
            </div>
            <div
              className="rounded-2xl border p-5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <p
                className="text-5xl leading-none"
                style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}
              >
                5
              </p>
              <p
                className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: "var(--text-muted)" }}
              >
                Tools
              </p>
            </div>
          </div>

          {/* Role card */}
          <div
            className="rounded-2xl border p-5"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--card-bg)" }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: "var(--accent)" }}
            >
              Currently
            </p>
            <p className="mt-2 text-base font-semibold" style={{ color: "var(--text)" }}>
              Risk &amp; Logistics Analyst
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
              Amazon · UK
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              BSc Economics &amp; Accounting — open to Data Analyst and BI roles in operations,
              commercial, or risk contexts.
            </p>
          </div>

          {/* Skills ticker */}
          <SkillsMarquee />
        </div>
      </div>
    </section>
  );
}

// ─── Project modal ─────────────────────────────────────────────────────────────

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const color = TOOL_COLORS[project.tool] ?? "var(--accent)";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.article
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 22 }}
        transition={{ duration: 0.26 }}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--surface)" }}
      >
        <div className="h-1.5 w-full" style={{ backgroundColor: color }} />

        <div className="p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span
                className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
              >
                {project.tool}
              </span>
              <h3 className="mt-3 text-2xl font-semibold" style={{ color: "var(--text)" }}>
                {project.title}
              </h3>
              <p className="mt-1 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                {project.year}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-3 py-1.5 font-mono text-xs"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              ESC
            </button>
          </div>

          <div
            className="mt-5 rounded-xl border p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.02)" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color }}>
              Decision Frame
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
              {project.frame}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(["insight", "action", "result"] as const).map((key) => (
              <div
                key={key}
                className="rounded-xl border p-3.5"
                style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color }}>
                  {key}
                </p>
                <p className="mt-1.5 text-sm" style={{ color: "var(--text)" }}>
                  {project[key]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

// ─── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const color = TOOL_COLORS[project.tool] ?? "var(--accent)";
  const cardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "65%");
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "65%");
  };

  return (
    <motion.button
      ref={cardRef}
      type="button"
      onClick={onOpen}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -4 }}
      className="group relative h-60 overflow-hidden rounded-2xl border text-left"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <Image
        src={project.thumbnail}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/86 via-black/30 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(260px circle at var(--mx) var(--my), ${color}3a, transparent 72%)`,
        }}
      />

      <span
        className="absolute right-3 top-3 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]"
        style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}4a` }}
      >
        {project.tool}
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-200 group-hover:opacity-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color }}>
          {project.year}
        </p>
        <h3 className="mt-1 text-lg font-semibold leading-tight text-white">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/72">{project.result}</p>
      </div>

      <div className="absolute inset-0 flex translate-y-2 flex-col justify-end bg-black/75 p-4 opacity-0 transition-all duration-250 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color }}>
          Insight → Action → Result
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-white/84">{project.insight}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-white/75"
              style={{ borderColor: "rgba(255,255,255,0.22)" }}
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color }}>
          Open case study
        </p>
      </div>
    </motion.button>
  );
}

// ─── Tool tile ─────────────────────────────────────────────────────────────────

function ToolTile({
  tool,
  isActive,
  onClick,
}: {
  tool: (typeof TOOLS)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = tool.icon;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex h-28 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border transition-colors duration-200 sm:h-32"
      style={{
        borderColor: isActive ? `${tool.color}88` : `${tool.color}33`,
        backgroundColor: isActive ? `${tool.color}14` : "var(--surface)",
      }}
    >
      <Icon
        size={22}
        style={{ color: isActive ? tool.color : `${tool.color}99` }}
        className="transition-colors duration-200"
      />
      <p
        className="font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200"
        style={{ color: isActive ? tool.color : "var(--text)" }}
      >
        {tool.key}
      </p>
      <p
        className="font-mono text-[9px] uppercase tracking-[0.1em]"
        style={{ color: isActive ? `${tool.color}bb` : "var(--text-muted)" }}
      >
        {tool.count} project{tool.count !== 1 ? "s" : ""}
      </p>

      {isActive && (
        <motion.div
          layoutId="tool-active-bar"
          className="absolute bottom-0 left-4 right-4 h-[3px] rounded-full"
          style={{ backgroundColor: tool.color }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}
    </motion.button>
  );
}

// ─── Tools section ─────────────────────────────────────────────────────────────

function ToolsSection() {
  const [selectedTool, setSelectedTool] = useState<string>("SQL");
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  const filteredProjects = PROJECTS.filter((p) => p.tool === selectedTool);
  const openProject = PROJECTS.find((p) => p.id === openProjectId) ?? null;
  const activeTool = TOOLS.find((t) => t.key === selectedTool);

  return (
    <section id="work" className="relative z-20 scroll-mt-24 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="01" label="Tools" />

        <div className="mb-8">
          <h2
            className="text-4xl uppercase tracking-tight sm:text-6xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Explore by <span style={{ color: "var(--accent)" }}>Tool</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm" style={{ color: "var(--text-muted)" }}>
            Select a tool to browse the case studies behind it. Each project shows the decision
            frame, insight, action taken, and outcome.
          </p>
        </div>

        {/* Tool tile grid */}
        <LayoutGroup>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {TOOLS.map((tool) => (
              <ToolTile
                key={tool.key}
                tool={tool}
                isActive={selectedTool === tool.key}
                onClick={() => setSelectedTool(tool.key)}
              />
            ))}
          </div>
        </LayoutGroup>

        {/* Project count strip */}
        <p
          className="mb-6 mt-6 font-mono text-[10px] uppercase tracking-[0.14em]"
          style={{ color: "var(--text-muted)" }}
        >
          {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}&nbsp;—&nbsp;
          <span style={{ color: activeTool?.color ?? "var(--accent)" }}>{selectedTool}</span>
        </p>

        {/* Project grid */}
        <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => setOpenProjectId(project.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {openProject ? (
          <ProjectModal project={openProject} onClose={() => setOpenProjectId(null)} />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

// ─── Journey ───────────────────────────────────────────────────────────────────

function JourneyNode({ step }: { step: JourneyStep }) {
  const isAmazon = step.org === "Amazon";
  const isNow = !!step.now;

  return (
    <div className="relative flex gap-5 pl-10">
      {/* Node circle */}
      <div
        className="absolute left-0 top-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2"
        style={{
          borderColor: isNow || isAmazon ? "var(--accent)" : "var(--border-strong)",
          backgroundColor: isNow
            ? "var(--accent-soft)"
            : isAmazon
            ? "rgba(158,201,107,0.12)"
            : "var(--surface)",
        }}
      >
        {isNow ? (
          <motion.div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        ) : (
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: isAmazon ? "var(--accent)" : "var(--border-strong)" }}
          />
        )}
      </div>

      {/* Content */}
      <article
        className="flex-1 rounded-2xl border p-5"
        style={{
          borderColor: isNow
            ? "var(--border-strong)"
            : isAmazon
            ? "rgba(158,201,107,0.22)"
            : "var(--border)",
          backgroundColor: isNow
            ? "rgba(158,201,107,0.08)"
            : isAmazon
            ? "rgba(158,201,107,0.05)"
            : "var(--card-bg)",
        }}
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.14em]"
          style={{ color: isNow ? "var(--accent)" : "var(--text-muted)" }}
        >
          {step.year}
        </p>
        <h3 className="mt-1 text-lg font-semibold" style={{ color: "var(--text)" }}>
          {step.title}
        </h3>
        <p
          className="font-mono text-[10px] uppercase tracking-[0.12em]"
          style={{ color: isNow || isAmazon ? "var(--accent)" : "var(--text-muted)" }}
        >
          {step.org}
        </p>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {step.desc}
        </p>
      </article>
    </div>
  );
}

function JourneySection() {
  return (
    <section id="journey" className="relative z-20 scroll-mt-24 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="02" label="Journey" />

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2
              className="text-4xl uppercase tracking-tight sm:text-6xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              From Warehouse <span style={{ color: "var(--accent)" }}>to Dashboard</span>
            </h2>

            <div
              className="mt-5 rounded-2xl border p-5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
            >
              <p
                className="font-mono text-[11px] uppercase tracking-[0.16em]"
                style={{ color: "var(--accent)" }}
              >
                What I do now
              </p>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--text)" }}>
                <li>Build diagnostic dashboards that speed decisions.</li>
                <li>Identify operational constraints and risk before escalation.</li>
                <li>Turn messy processes into measurable operational flows.</li>
                <li>Translate stakeholder questions into clear KPI paths.</li>
              </ul>
            </div>

            <div
              className="mt-4 rounded-2xl border p-5"
              style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}
            >
              <p
                className="font-mono text-[11px] uppercase tracking-[0.16em]"
                style={{ color: "var(--accent)" }}
              >
                What I am building
              </p>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
                <li>Recruiter-ready portfolio of SQL, Power BI, and Tableau case studies.</li>
                <li>Reusable analytics workflow patterns for faster reporting delivery.</li>
                <li>Deeper analytics engineering habits for cleaner data foundations.</li>
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div
              className="absolute bottom-4 left-[15px] top-4 w-px"
              style={{ backgroundColor: "var(--border-strong)" }}
            />
            <div className="space-y-6">
              {JOURNEY.map((step) => (
                <JourneyNode key={step.title} step={step} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ───────────────────────────────────────────────────────────────────

function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("mohamed.elburki@outlook.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section id="contact" className="relative z-20 scroll-mt-24 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="03" label="Connect" />

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h2
              className="text-4xl uppercase tracking-tight sm:text-6xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              Get in <span style={{ color: "var(--accent)" }}>Touch</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm" style={{ color: "var(--text-muted)" }}>
              Open to Data Analyst and BI opportunities where analytics improves decision quality.
            </p>

            <div className="mt-6 grid gap-3">
              <article
                className="rounded-2xl border p-4"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--card-bg)" }}
              >
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--accent)" }}
                >
                  Hiring
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--text)" }}>
                  Data Analyst or BI Analyst roles in operations, commercial, or risk contexts.
                </p>
              </article>
              <article
                className="rounded-2xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}
              >
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--accent)" }}
                >
                  Collaboration
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                  Dashboards, analytics workflows, and lightweight automation projects.
                </p>
              </article>
              <article
                className="rounded-2xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}
              >
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--accent)" }}
                >
                  Project Discussion
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                  SQL logic, segmentation design, KPI architecture, and reporting frameworks.
                </p>
              </article>
            </div>

            <p
              className="mt-5 rounded-xl border px-4 py-3 text-sm"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              Preferred contact: email. Typical response: within 24 hours. Location and timezone: UK.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={copyEmail}
              className="flex w-full items-center justify-between rounded-2xl border p-5 text-left transition hover:-translate-y-0.5"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--card-bg)" }}
            >
              <div>
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--accent)" }}
                >
                  Email
                </p>
                <p className="mt-1 text-base" style={{ color: "var(--text)" }}>
                  mohamed.elburki@outlook.com
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  Best for hiring and project discussions.
                </p>
              </div>
              <span style={{ color: "var(--text)" }}>{copied ? "Copied" : "Copy"}</span>
            </button>

            <a
              href="https://linkedin.com/in/mohamedelburki"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between rounded-2xl border p-5 transition hover:-translate-y-0.5"
              style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}
            >
              <div>
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--accent)" }}
                >
                  LinkedIn
                </p>
                <p className="mt-1 text-base" style={{ color: "var(--text)" }}>
                  Mohamed El-Burki
                </p>
              </div>
              <span style={{ color: "var(--text-muted)" }}>Open</span>
            </a>

            <a
              href="https://github.com/mohamedelburkib-cmd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between rounded-2xl border p-5 transition hover:-translate-y-0.5"
              style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}
            >
              <div>
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--accent)" }}
                >
                  GitHub
                </p>
                <p className="mt-1 text-base" style={{ color: "var(--text)" }}>
                  mohamedelburkib-cmd
                </p>
              </div>
              <span style={{ color: "var(--text-muted)" }}>Open</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const navLinks = [
    { label: "Tools", href: "#work" },
    { label: "Journey", href: "#journey" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <header className="fixed left-0 right-0 top-0 z-40 px-6 py-4">
        <div
          className="mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2 backdrop-blur-lg"
          style={{ borderColor: "var(--border)", backgroundColor: "rgba(23,28,36,0.76)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              M.E-B
            </span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span
              className="hidden font-mono text-[10px] uppercase tracking-[0.14em] sm:inline"
              style={{ color: "var(--accent)" }}
            >
              Open to opportunities
            </span>
          </div>

          <nav className="flex items-center gap-4 sm:gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-[10px] uppercase tracking-[0.14em] transition hover:opacity-75"
                style={{ color: "var(--text-muted)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <HeroSection />
      <ToolsSection />
      <JourneySection />
      <ContactSection />

      <footer
        className="relative z-20 border-t px-6 py-6"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="mx-auto flex max-w-6xl items-center justify-between text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <p>(c) 2026 Mohamed El-Burki</p>
          <p className="font-mono text-[10px]">Next.js + Framer Motion</p>
        </div>
      </footer>
    </div>
  );
}
