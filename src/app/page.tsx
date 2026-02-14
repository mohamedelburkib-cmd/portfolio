"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import HeroVisorReveal from "@/components/HeroVisorReveal";
import Image from "next/image";

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const IMPACT_METRICS = [
  { label: "Transactions Analysed", value: "1M+" },
  { label: "Capital Flagged", value: "GBP45K" },
  { label: "Customers Segmented", value: "4,300+" },
  { label: "Revenue Concentration Found", value: "23%" },
];

const SIGNAL_STREAMS = [
  "Revenue risk mapping",
  "Customer cohort diagnostics",
  "Ops performance triage",
  "Executive KPI reporting",
];

const VALUE_TAGS = ["Ops Analytics", "Commercial Insights", "BI Storytelling"];

type Project = {
  title: string;
  year: string;
  decisionFrame: string;
  context: string;
  insight: string;
  action: string;
  result: string;
  proofSrc: string;
  proofLabel: string;
  proofType: "Dashboard" | "Model" | "SQL";
  tags: string[];
  ctaHref: string;
  ctaLabel: string;
};

type SkillData = {
  id: string;
  name: string;
  description: string;
  projectCount: number;
  projects: Project[];
};

type JourneyEntry = {
  year: string;
  title: string;
  description: string;
  outcome: string;
  isLast?: boolean;
};

type NavTab = {
  title: string;
  href: string;
  icon: ReactNode;
};

const SKILLS: SkillData[] = [
  {
    id: "sql",
    name: "SQL",
    description: "Structuring business questions into diagnostic queries — from customer risk to operational bottlenecks.",
    projectCount: 3,
    projects: [
      {
        title: "E-Commerce Revenue Analysis",
        year: "2024",
        decisionFrame: "Which customers should we protect, and where does over-reliance on a few accounts become a revenue risk?",
        context: "Analysed UK retail transactions to surface concentration risk.",
        insight: "Top 5 percent of customers accounted for 23 percent of revenue.",
        action: "Prioritized high-dependency accounts for weekly monitoring and pricing guardrails.",
        result: "Expected to reduce concentration exposure by 8-12% over two planning cycles.",
        proofSrc: "/projects/revenue-risk-placeholder.svg",
        proofLabel: "Dashboard preview (placeholder)",
        proofType: "Dashboard",
        tags: ["CTEs", "Window Functions", "LAG/LEAD"],
        ctaHref: "#contact",
        ctaLabel: "Discuss this approach",
      },
      {
        title: "Customer RFM Segmentation",
        year: "2024",
        decisionFrame: "Which customers are worth re-engaging now, and what does that mean in concrete terms for marketing and ops to own?",
        context: "Built an action-ready customer segmentation model for retention strategy.",
        insight: "Segmented 4,300+ customers into five lifecycle-based priority cohorts.",
        action: "Mapped each segment to retention plays and ownership across marketing and ops.",
        result: "Expected uplift: +5-9% repeat purchase across mid-value cohorts.",
        proofSrc: "/projects/rfm-placeholder.svg",
        proofLabel: "Segmentation model preview (placeholder)",
        proofType: "Model",
        tags: ["RFM", "NTILE", "Cohorts"],
        ctaHref: "#contact",
        ctaLabel: "See segmentation logic",
      },
      {
        title: "Product Performance Diagnostics",
        year: "2024",
        decisionFrame: "Which products are quietly tying up cash, and what should we do about stock allocation this quarter before it compounds?",
        context: "Mapped SKU velocity and inventory drag to improve allocation decisions.",
        insight: "Identified 127 SKUs linked to GBP45K in tied-up capital.",
        action: "Introduced weekly exception flags to rebalance stock and de-prioritize low-yield SKUs.",
        result: "Estimated cash release potential: GBP18K-GBP25K within first quarter of adoption.",
        proofSrc: "/projects/kpi-model-placeholder.svg",
        proofLabel: "SQL diagnostics preview (placeholder)",
        proofType: "SQL",
        tags: ["Self-Joins", "Ranking", "ABC"],
        ctaHref: "#contact",
        ctaLabel: "Explore inventory insights",
      },
    ],
  },
  {
    id: "powerbi",
    name: "Power BI",
    description: "Multi-market KPI visibility built for leadership decisions — with clear ownership and drill paths, not just charts.",
    projectCount: 1,
    projects: [
      {
        title: "Executive Sales Command Center",
        year: "2024",
        decisionFrame: "How does leadership get a clean, single view of cross-market performance without needing an analyst to prep every weekly deck?",
        context: "Designed a KPI cockpit for leadership to monitor cross-market health.",
        insight: "Unified a GBP8.5M revenue view across 38 countries in one report surface.",
        action: "Standardized KPI definitions and added role-based drill paths for faster reviews.",
        result: "Estimated reporting prep time reduced by 25-35% for weekly leadership updates.",
        proofSrc: "/projects/kpi-model-placeholder.svg",
        proofLabel: "Data model / KPI architecture (placeholder)",
        proofType: "Model",
        tags: ["DAX", "Star Schema", "Mobile Layout"],
        ctaHref: "#contact",
        ctaLabel: "Walk through dashboard",
      },
    ],
  },
  {
    id: "tableau",
    name: "Tableau",
    description: "Lifecycle and conversion stories that surface where intervention actually matters — not just where the numbers drop.",
    projectCount: 1,
    projects: [
      {
        title: "Customer Journey Funnel",
        year: "2024",
        decisionFrame: "Where in the customer lifecycle is the biggest conversion opportunity, and what would recovery actually mean in revenue terms?",
        context: "Visualized lifecycle drop-off to expose the most valuable intervention points.",
        insight: "Highlighted a 67 percent first-to-repeat conversion opportunity.",
        action: "Proposed a targeted reactivation sequence for first-time buyers within 30 days.",
        result: "Expected conversion recovery: +4-7 percentage points in repeat purchase step.",
        proofSrc: "/projects/revenue-risk-placeholder.svg",
        proofLabel: "Funnel dashboard preview (placeholder)",
        proofType: "Dashboard",
        tags: ["LOD", "Story Points", "Funnel Analysis"],
        ctaHref: "#contact",
        ctaLabel: "Review funnel narrative",
      },
    ],
  },
];

const JOURNEY_ENTRIES: JourneyEntry[] = [
  {
    year: "2024",
    title: "Risk and Logistics Analyst",
    description:
      "Owned transport and risk diagnostics across Amazon operations, translating day-to-day bottlenecks into measurable process signals.",
    outcome: "Delivered analyses used to reduce escalation noise and sharpen operational visibility.",
  },
  {
    year: "2023",
    title: "Economics and Accounting Degree",
    description:
      "Built quantitative reasoning and business modeling discipline at City St George's, University of London.",
    outcome: "Strengthened commercial decision framing for analytics conversations with stakeholders.",
  },
  {
    year: "Now",
    title: "Operations to Analytics Transition",
    description:
      "Building a practical portfolio that blends SQL depth, BI delivery, and narrative reporting for business teams.",
    outcome: "Focused on producing analysis that moves decisions, not just dashboards.",
    isLast: true,
  },
];

function HomeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955a1.125 1.125 0 011.591 0L21.75 12M4.5 9.75v10.125A1.125 1.125 0 005.625 21H9.75v-4.875A1.125 1.125 0 0110.875 15h2.25a1.125 1.125 0 011.125 1.125V21h4.125a1.125 1.125 0 001.125-1.125V9.75"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3L9.75 20.25" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function ExpandableNav({ tabs }: { tabs: NavTab[] }) {
  const [selected, setSelected] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = tabs
      .map((tab, index) => ({ element: document.querySelector(tab.href), index }))
      .filter((entry): entry is { element: Element; index: number } => Boolean(entry.element));

    if (!sections.length) return;

    const onScroll = () => {
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section) => {
        const rect = section.element.getBoundingClientRect();
        const distance = Math.abs(rect.top - 120);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = section.index;
        }
      });

      setSelected(nearest);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [tabs]);

  const onSelect = (index: number, href: string) => {
    setSelected(index);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.35 }}
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border p-2 backdrop-blur-xl"
      style={{ borderColor: "var(--border)", backgroundColor: "rgba(22,26,33,0.85)" }}
      aria-label="Section navigation"
    >
      {tabs.map((tab, index) => {
        const active = selected === index;
        return (
          <button
            key={tab.title}
            type="button"
            onClick={() => onSelect(index, tab.href)}
            className={cn(
              "group flex items-center rounded-full px-3 py-2.5 text-sm transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              active ? "gap-2" : "hover:bg-white/8"
            )}
            style={{
              color: active ? "var(--text)" : "var(--text-muted)",
              backgroundColor: active ? "rgba(255,255,255,0.04)" : "transparent",
              boxShadow: active ? "inset 0 -1px 0 var(--accent)" : "none",
            }}
          >
            {tab.icon}
            <AnimatePresence initial={false}>
              {active ? (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {tab.title}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </button>
        );
      })}
    </motion.nav>
  );
}

function ChapterHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span className="font-mono text-sm" style={{ color: "var(--accent)" }}>{number}</span>
      <div className="h-px flex-1" style={{ backgroundColor: "var(--border-strong)" }} />
      <span className="text-xs uppercase tracking-[0.24em]" style={{ color: "var(--text-muted)" }}>{title}</span>
    </div>
  );
}

function NarrativeTransition({ label, copy }: { label: string; copy: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      className="mx-auto max-w-6xl px-6"
    >
      <div className="rounded-2xl border px-6 py-5 md:px-8" style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}>
        <p className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>{label}</p>
        <p className="max-w-3xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>{copy}</p>
      </div>
    </motion.div>
  );
}

function ImpactStrip() {
  return (
    <section aria-label="Impact metrics" className="relative z-10 px-6 pb-10">
      <div className="mx-auto grid max-w-6xl gap-3 rounded-2xl border p-3 backdrop-blur md:grid-cols-4 md:p-4" style={{ borderColor: "var(--border)", backgroundColor: "rgba(22,26,33,0.58)" }}>
        {IMPACT_METRICS.map((metric, index) => (
          <motion.article
            key={metric.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            className="rounded-xl border px-4 py-3"
            style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold" style={{ color: "var(--text)" }}>{metric.value}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function ValueSection() {
  return (
    <section className="relative z-10 px-6 pb-10" aria-label="Where I add value">
      <div className="mx-auto max-w-6xl rounded-2xl border p-6 md:p-8" style={{ borderColor: "var(--border)", backgroundColor: "rgba(22,26,33,0.64)" }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>Where I add value</p>
        <h3 className="mt-3 text-3xl uppercase tracking-tight md:text-4xl" style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif", color: "var(--text)" }}>
          Decision Support Built for Real Operations
        </h3>
        <ul className="mt-5 space-y-2 text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
          <li>Turning operational noise into decision-ready metrics.</li>
          <li>Diagnosing risk (cost, service, concentration) before it becomes impact.</li>
          <li>Building dashboards teams actually use with clear owners and actions.</li>
          <li>Translating stakeholder questions into measurable signals.</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          {VALUE_TAGS.map((tag) => (
            <span key={tag} className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SignalConsole({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border p-5 backdrop-blur md:p-6" style={{ borderColor: "var(--border-strong)", backgroundColor: "rgba(22,26,33,0.7)" }}>
      <div className="pointer-events-none absolute -right-20 -top-16 h-40 w-40 rounded-full blur-3xl" style={{ backgroundColor: "rgba(95,168,168,0.06)" }} />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-32 w-32 rounded-full blur-3xl" style={{ backgroundColor: "rgba(95,168,168,0.04)" }} />

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>What I&apos;m focused on</p>
          <span className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            Active 2026
          </span>
        </div>

        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "rgba(11,14,18,0.82)" }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>How I work</p>
          <svg viewBox="0 0 360 96" className="mt-3 h-20 w-full">
            <path
              d="M6 52C46 18 78 82 120 52S198 18 236 52S312 82 352 48"
              fill="none"
              stroke="rgba(148,163,184,0.32)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <motion.path
              d="M6 52C46 18 78 82 120 52S198 18 236 52S312 82 352 48"
              fill="none"
              stroke="rgba(95,168,168,0.88)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="20 120"
              initial={reduceMotion ? false : { strokeDashoffset: 120 }}
              animate={reduceMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: [120, 0] }}
              transition={reduceMotion ? { duration: 0 } : { duration: 2.8, ease: "linear", repeat: Infinity }}
            />
            <circle cx="120" cy="52" r="4" fill="rgba(95,168,168,0.88)" />
            <circle cx="236" cy="52" r="4" fill="rgba(95,168,168,0.88)" />
          </svg>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border p-3.5" style={{ borderColor: "var(--border)", backgroundColor: "rgba(11,14,18,0.72)" }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Primary Stack</p>
            <p className="mt-1 text-sm" style={{ color: "var(--text)" }}>SQL, Power BI, Tableau</p>
          </article>
          <article className="rounded-xl border p-3.5" style={{ borderColor: "var(--border)", backgroundColor: "rgba(11,14,18,0.72)" }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>What I&apos;ve shipped</p>
            <p className="mt-1 text-sm" style={{ color: "var(--text)" }}>Risk mapping, cohort diagnostics, KPI governance</p>
          </article>
        </div>

        <div className="mt-3 rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "rgba(11,14,18,0.72)" }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Focus Streams</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SIGNAL_STREAMS.map((stream) => (
              <span
                key={stream}
                className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              >
                {stream}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedCaseStudy() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      className="mt-14 rounded-2xl border p-6 md:p-8"
      style={{ borderColor: "var(--border-strong)", backgroundColor: "rgba(22,26,33,0.74)" }}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Featured Case Study</p>
          <h3
            className="mt-2 text-3xl uppercase tracking-tight md:text-4xl"
            style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif", color: "var(--text)" }}
          >
            Revenue Risk Mapping
          </h3>
        </div>
        <a
          href="#work"
          className="rounded-full border px-4 py-2 text-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2"
          style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}
        >
          Open case study
        </a>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "rgba(11,14,18,0.72)" }}>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Problem</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Revenue exposure was hidden inside uneven customer concentration.</p>
        </div>
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "rgba(11,14,18,0.72)" }}>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Approach</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Used cohort slices and rank windows to isolate dependency clusters.</p>
        </div>
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "rgba(11,14,18,0.72)" }}>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>Outcome</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Identified a 23 percent concentration signal and converted it into a weekly decision routine.</p>
        </div>
      </div>
    </motion.article>
  );
}

function SkillCard({ skill, isActive, onToggle }: { skill: SkillData; isActive: boolean; onToggle: () => void }) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        isActive
          ? "shadow-[0_8px_30px_rgba(0,0,0,0.22)]"
          : ""
      )}
      style={{
        borderColor: isActive ? "var(--border-strong)" : "var(--border)",
        backgroundColor: isActive ? "rgba(27,34,48,0.34)" : "rgba(255,255,255,0.01)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        aria-controls={`${skill.id}-projects`}
        className={cn(
          "flex w-full items-start justify-between gap-4 p-5 text-left md:p-6",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
        )}
        style={{ ["--tw-ring-color" as string]: "rgba(237,239,242,0.28)" }}
      >
        <div>
          <h3
            className={cn(
              "text-3xl uppercase tracking-tight md:text-4xl",
              isActive ? "" : "text-white"
            )}
            style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif", color: isActive ? "var(--accent)" : "var(--text)" }}
          >
            {skill.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{skill.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>{skill.projectCount} projects</span>
          <motion.span animate={{ rotate: isActive ? 45 : 0 }} className="text-lg" style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }}>
            +
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isActive ? (
          <motion.div
            id={`${skill.id}-projects`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="grid gap-4 p-5 md:p-6">
              {skill.projects.map((project, index) => (
                <motion.article
                  key={project.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl border p-4 md:p-5"
                  style={{ borderColor: "var(--border)", backgroundColor: "rgba(11,14,18,0.72)" }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{project.title}</h4>
                    <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{project.year}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{project.context}</p>

                  <div className="mt-4 overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)" }}>
                    <Image
                      src={project.proofSrc}
                      alt={project.proofLabel}
                      width={960}
                      height={540}
                      className="h-auto w-full object-cover"
                    />
                    <div className="flex items-center justify-between border-t px-3 py-2" style={{ borderColor: "var(--border)", backgroundColor: "rgba(14,15,18,0.8)" }}>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>{project.proofLabel}</p>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--accent)" }}>{project.proofType}</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border p-3" style={{ borderColor: "rgba(95,168,168,0.22)", backgroundColor: "rgba(95,168,168,0.04)" }}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>Decision Frame</p>
                    <p className="mt-1 text-sm italic leading-relaxed" style={{ color: "var(--text-muted)" }}>{project.decisionFrame}</p>
                  </div>

                  <div className="mt-3 space-y-2 rounded-xl border p-3" style={{ borderColor: "var(--border)", backgroundColor: "rgba(22,26,33,0.52)" }}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>Insight</p>
                    <p className="text-sm" style={{ color: "var(--text)" }}>{project.insight}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>Action</p>
                    <p className="text-sm" style={{ color: "var(--text)" }}>{project.action}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>Result</p>
                    <p className="text-sm" style={{ color: "var(--text)" }}>{project.result}</p>
                  </div>

                  <div className="mb-4 mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border px-2 py-1 font-mono text-[10px] uppercase tracking-wider" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.ctaHref}
                    className="inline-flex rounded-full border px-3 py-1.5 text-xs transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2"
                    style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}
                  >
                    {project.ctaLabel}
                  </a>
                </motion.article>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function TimelineItem({ entry, isActive }: { entry: JourneyEntry; isActive: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0.42, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.35 }}
      className="relative rounded-xl pb-10 pl-9 pr-3 pt-2 last:pb-2"
      style={{ backgroundColor: isActive ? "rgba(27,34,48,0.34)" : "transparent" }}
    >
      {!entry.isLast ? (
        <span className="absolute left-[11px] top-6 bottom-0 w-px" style={{ backgroundColor: "var(--border-strong)" }} />
      ) : null}
      <span className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border bg-black" style={{ borderColor: "var(--border-strong)" }}>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: isActive ? "var(--accent)" : "var(--text-muted)" }} />
      </span>
      <p className="font-mono text-xs uppercase tracking-[0.16em]" style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }}>{entry.year}</p>
      <h4 className="mt-2 text-xl font-semibold" style={{ color: "var(--text)" }}>{entry.title}</h4>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{entry.description}</p>
      <p className="mt-3 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
        {entry.outcome}
      </p>
    </motion.article>
  );
}

export default function Portfolio() {
  const [activeSkill, setActiveSkill] = useState<string>("sql");
  const [activeJourney, setActiveJourney] = useState(0);
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0.78]);
  const email = "mohamed.elburki@outlook.com";

  const navTabs = useMemo<NavTab[]>(
    () => [
      { title: "Hero", href: "#hero", icon: <HomeIcon /> },
      { title: "Work", href: "#work", icon: <CodeIcon /> },
      { title: "Journey", href: "#story", icon: <UserIcon /> },
      { title: "Connect", href: "#contact", icon: <MailIcon /> },
    ],
    []
  );

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    const timelineItems = Array.from(document.querySelectorAll("[data-journey-index]"));
    if (!timelineItems.length) return;

    const onScroll = () => {
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      timelineItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.top - window.innerHeight * 0.32);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = Number(item.getAttribute("data-journey-index") ?? 0);
        }
      });

      setActiveJourney(nearest);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip text-white" style={{ backgroundColor: "var(--background)" }}>
      <ExpandableNav tabs={navTabs} />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[rgba(14,15,18,0.18)]" />

      <motion.header
        style={{ opacity: headerOpacity }}
        className="fixed left-0 right-0 top-0 z-40 px-6 py-4"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2 backdrop-blur" style={{ borderColor: "var(--border-accent)", backgroundColor: "rgba(11,15,20,0.68)" }}>
          <p className="flex items-center gap-3 text-sm tracking-wide" style={{ color: "var(--text)" }}>
            <span className="font-semibold">M.E-B</span>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--accent)" }}>Available for new roles</span>
          </p>
          <a
            href="#contact"
            className="rounded-full border px-3 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{ borderColor: "var(--border-accent)", color: "var(--foreground)" }}
          >
            Let&apos;s talk
          </a>
        </div>
      </motion.header>

      <section id="hero" className="relative z-10 flex min-h-screen scroll-mt-24 items-center px-6 pb-14 pt-28">
        <div className="mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <HeroVisorReveal
              nameLine1="Mohamed"
              nameLine2="El-Burki"
              roleLine="DATA ANALYST"
              hudLabel="PROFILE REVEAL"
            />
            <p className="mt-4 text-base md:text-lg" style={{ color: "var(--text)" }}>
              Data Analyst - Operations, Commercial and Risk Analytics
            </p>
            <p className="mt-1 text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
              SQL • Power BI • Tableau • Storytelling • Decision Support
            </p>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { delay: 1.45, duration: 0.4 }}
              className="mt-7 max-w-xl text-base leading-relaxed md:text-lg"
              style={{ color: "var(--text-muted)" }}
            >
              My background in economics and logistics operations built an instinct for what decision is
              actually being made — before I open a file. I target operations, commercial, and risk roles
              where that domain context turns analysis into action, not just another dashboard.
            </motion.p>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { delay: 1.6, duration: 0.38 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href="#work"
                className="rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                style={{ backgroundColor: "var(--accent)", color: "#0E0F12" }}
              >
                View Work
              </a>
              <a
                href="#story"
                className="rounded-full border px-5 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                style={{ borderColor: "var(--border-soft)", color: "var(--foreground)" }}
              >
                Follow Journey
              </a>
            </motion.div>
          </div>

          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={reduceMotion ? { duration: 0 } : { delay: 1.2, duration: 0.45 }}
            className="md:pt-2"
          >
            <SignalConsole reduceMotion={Boolean(reduceMotion)} />
          </motion.aside>
        </div>
      </section>

      <ImpactStrip />
      <ValueSection />

      <section className="relative z-10 py-8">
        <NarrativeTransition
          label="Credibility Transition"
          copy="Built in high-pressure operations, refined through analytics projects. The next section shows the stack I use and the proof each tool produced."
        />
      </section>

      <section id="work" className="relative z-10 scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <ChapterHeader number="02" title="Work + Decisions" />
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-5xl uppercase tracking-tight text-white md:text-7xl"
            style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif" }}
          >
            Analysis That <span style={{ color: "var(--accent)" }}>Drives Decisions</span>
          </motion.h2>
          <p className="mt-4 max-w-2xl" style={{ color: "var(--text-muted)" }}>
            Each project starts with the business decision it was meant to inform. Expand to review the framing, insight, action, and outcome.
          </p>

          <div className="mt-10 grid gap-4">
            {SKILLS.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isActive={activeSkill === skill.id}
                onToggle={() => setActiveSkill((current) => (current === skill.id ? "" : skill.id))}
              />
            ))}
          </div>

          <FeaturedCaseStudy />
        </div>
      </section>

      <section className="relative z-10 py-8">
        <NarrativeTransition
          label="Story Transition"
          copy="The tooling is one side of the portfolio. The timeline below explains where the operating instincts came from and what I now deliver."
        />
      </section>

      <section id="story" className="relative z-10 scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <ChapterHeader number="03" title="Journey" />
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <h2
                className="text-5xl uppercase tracking-tight md:text-7xl"
                style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif", color: "var(--text)" }}
              >
                From Warehouse <span style={{ color: "var(--accent)" }}>to Dashboard</span>
              </h2>
              <p className="mt-5 max-w-xl" style={{ color: "var(--text-muted)" }}>
                I approach analytics from operational truth first. That background makes my reporting practical,
                grounded, and focused on decisions that can actually be executed.
              </p>

              <div className="mt-7 rounded-xl border p-4" style={{ borderColor: "rgba(95,168,168,0.28)", backgroundColor: "rgba(95,168,168,0.04)" }}>
                <p className="font-mono text-xs uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>My story in one paragraph</p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                  My background in economics and Amazon operations developed an instinct for what a business
                  question actually looks like before it becomes a data request. I&apos;m targeting operations
                  and commercial analyst roles where I can combine that stakeholder context with SQL depth
                  and BI delivery — analysis that earns trust, not just looks good on a screen.
                </p>
              </div>

              <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "rgba(22,26,33,0.54)" }}>
                <p className="font-mono text-xs uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>Target industries</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Logistics & Supply Chain", "Retail & E-Commerce", "Operations Analytics", "Commercial Finance"].map((ind) => (
                    <span key={ind} className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}>
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}>
                <p className="font-mono text-xs uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>What I do</p>
                <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
                  <li>Frame the business decision before touching the data.</li>
                  <li>Identify operational and revenue risk before it becomes impact.</li>
                  <li>Turn stakeholder questions into measurable KPI paths.</li>
                  <li>Build dashboards teams actually use — with owners and actions attached.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: "var(--border)", backgroundColor: "rgba(22,26,33,0.48)" }}>
              {JOURNEY_ENTRIES.map((entry, index) => (
                <div key={entry.title} data-journey-index={index}>
                  <TimelineItem entry={entry} isActive={activeJourney === index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-8">
        <NarrativeTransition
          label="Closing Transition"
          copy="If this aligns with your team priorities, the final section gives fast paths to hire, collaborate, or discuss a specific project."
        />
      </section>

      <section id="contact" className="relative z-10 scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <ChapterHeader number="04" title="Connect" />
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2
                className="text-5xl uppercase tracking-tight md:text-7xl"
                style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif", color: "var(--text)" }}
              >
                Ways to Work <span style={{ color: "var(--accent)" }}>With Me</span>
              </h2>
              <p className="mt-4 max-w-xl" style={{ color: "var(--text-muted)" }}>
                Open to analyst roles and project collaborations where rigorous analytics improves decision speed and operating clarity.
              </p>

              <div className="mt-7 grid gap-3">
                <article className="rounded-xl border p-4" style={{ borderColor: "var(--border-strong)", backgroundColor: "rgba(22,26,33,0.58)" }}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>Hiring</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--text)" }}>Data Analyst / BI Analyst roles focused on commercial, risk, or operations insight.</p>
                </article>
                <article className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>Collaboration</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Dashboards, analytics workflows, and lightweight automation support.</p>
                </article>
                <article className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>Project Discussion</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>SQL design, segmentation logic, KPI frameworks, and reporting decisions.</p>
                </article>
              </div>

              <p className="mt-6 rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                Preferred contact: email. Typical response time: within 24 hours. Location/timezone: UK.
              </p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={copyEmail}
                className="group flex w-full items-center justify-between rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "rgba(22,26,33,0.58)" }}
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>Email</p>
                  <p className="mt-1 text-base" style={{ color: "var(--text)" }}>{email}</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>Best for hiring and project discussions.</p>
                </div>
                <span style={{ color: "var(--text)" }}>{copied ? "Copied" : "Open"}</span>
              </button>

              <a
                href="https://linkedin.com/in/mohamedelburki"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-between rounded-2xl border p-5 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>LinkedIn</p>
                  <p className="mt-1 text-base" style={{ color: "var(--text)" }}>Mohamed El-Burki</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>Quick links: profile updates and experience history.</p>
                </div>
                <span className="transition" style={{ color: "var(--text-muted)" }}>Open</span>
              </a>

              <a
                href="https://github.com/mohamedelburkib-cmd"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-between rounded-2xl border p-5 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                style={{ borderColor: "var(--border)", backgroundColor: "rgba(255,255,255,0.01)" }}
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>GitHub</p>
                  <p className="mt-1 text-base" style={{ color: "var(--text)" }}>mohamedelburkib-cmd</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>Quick links: code samples and technical breakdowns.</p>
                </div>
                <span className="transition" style={{ color: "var(--text-muted)" }}>Open</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mb-24 border-t px-6 py-8" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
          <p>(c) 2026 Mohamed El-Burki</p>
          <p>Built with Next.js + Framer Motion</p>
        </div>
      </footer>
    </div>
  );
}
