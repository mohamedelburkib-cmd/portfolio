"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import HeroVisorReveal from "@/components/HeroVisorReveal";

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

type Project = {
  title: string;
  year: string;
  context: string;
  insight: string;
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
    description: "Query design, cohort slicing, and diagnostic analysis pipelines.",
    projectCount: 3,
    projects: [
      {
        title: "E-Commerce Revenue Analysis",
        year: "2024",
        context: "Analysed UK retail transactions to surface concentration risk.",
        insight: "Top 5 percent of customers accounted for 23 percent of revenue.",
        tags: ["CTEs", "Window Functions", "LAG/LEAD"],
        ctaHref: "#contact",
        ctaLabel: "Discuss this approach",
      },
      {
        title: "Customer RFM Segmentation",
        year: "2024",
        context: "Built an action-ready customer segmentation model for retention strategy.",
        insight: "Segmented 4,300+ customers into five lifecycle-based priority cohorts.",
        tags: ["RFM", "NTILE", "Cohorts"],
        ctaHref: "#contact",
        ctaLabel: "See segmentation logic",
      },
      {
        title: "Product Performance Diagnostics",
        year: "2024",
        context: "Mapped SKU velocity and inventory drag to improve allocation decisions.",
        insight: "Identified 127 SKUs linked to GBP45K in tied-up capital.",
        tags: ["Self-Joins", "Ranking", "ABC"],
        ctaHref: "#contact",
        ctaLabel: "Explore inventory insights",
      },
    ],
  },
  {
    id: "powerbi",
    name: "Power BI",
    description: "Executive dashboards with drill-down pathways and decision cues.",
    projectCount: 1,
    projects: [
      {
        title: "Executive Sales Command Center",
        year: "2024",
        context: "Designed a KPI cockpit for leadership to monitor cross-market health.",
        insight: "Unified a GBP8.5M revenue view across 38 countries in one report surface.",
        tags: ["DAX", "Star Schema", "Mobile Layout"],
        ctaHref: "#contact",
        ctaLabel: "Walk through dashboard",
      },
    ],
  },
  {
    id: "tableau",
    name: "Tableau",
    description: "Story-first visuals that explain behavior and conversion movement.",
    projectCount: 1,
    projects: [
      {
        title: "Customer Journey Funnel",
        year: "2024",
        context: "Visualized lifecycle drop-off to expose the most valuable intervention points.",
        insight: "Highlighted a 67 percent first-to-repeat conversion opportunity.",
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
  const [selected, setSelected] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 160);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSelect = (index: number, href: string) => {
    setSelected(index);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.35 }}
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-blue-400/15 bg-black/75 p-2 shadow-2xl shadow-black/70 backdrop-blur-xl"
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
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              active
                ? "gap-2 bg-blue-400/12 text-blue-300"
                : "text-white/55 hover:bg-white/8 hover:text-white"
            )}
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
      <span className="font-mono text-sm text-blue-300">{number}</span>
      <div className="h-px flex-1 bg-blue-300/30" />
      <span className="text-xs uppercase tracking-[0.32em] text-white/35">{title}</span>
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
      <div className="rounded-2xl border border-blue-400/15 bg-blue-400/[0.04] px-6 py-5 md:px-8">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-blue-300/80">{label}</p>
        <p className="max-w-3xl text-sm leading-relaxed text-white/65 md:text-base">{copy}</p>
      </div>
    </motion.div>
  );
}

function ImpactStrip() {
  return (
    <section aria-label="Impact metrics" className="relative z-10 px-6 pb-10">
      <div className="mx-auto grid max-w-6xl gap-3 rounded-2xl border border-blue-400/15 bg-black/35 p-3 backdrop-blur md:grid-cols-4 md:p-4">
        {IMPACT_METRICS.map((metric, index) => (
          <motion.article
            key={metric.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-blue-300">{metric.value}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function SignalConsole({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-300/30 bg-black/45 p-5 backdrop-blur md:p-6">
      <div className="pointer-events-none absolute -right-20 -top-16 h-40 w-40 rounded-full bg-blue-500/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue-300/90">Signal Console</p>
          <span className="rounded-full border border-blue-300/25 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200">
            Active 2026
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-blue-300/20 bg-[rgba(7,10,16,0.86)] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-300/85">Pipeline Flow</p>
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
              stroke="rgba(96,165,250,0.95)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="20 120"
              initial={reduceMotion ? false : { strokeDashoffset: 120 }}
              animate={reduceMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: [120, 0] }}
              transition={reduceMotion ? { duration: 0 } : { duration: 2.8, ease: "linear", repeat: Infinity }}
            />
            <circle cx="120" cy="52" r="4" fill="rgba(147,197,253,0.95)" />
            <circle cx="236" cy="52" r="4" fill="rgba(147,197,253,0.95)" />
          </svg>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-white/10 bg-black/35 p-3.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-300/85">Primary Stack</p>
            <p className="mt-1 text-sm text-white/80">SQL, Power BI, Tableau</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-black/35 p-3.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-300/85">Current Build</p>
            <p className="mt-1 text-sm text-white/80">Logistics-to-revenue signal model</p>
          </article>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-black/35 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-300/85">Focus Streams</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SIGNAL_STREAMS.map((stream) => (
              <span
                key={stream}
                className="rounded-full border border-blue-300/25 bg-blue-400/[0.08] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-blue-100"
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
      className="mt-14 rounded-2xl border border-blue-300/25 bg-blue-500/[0.06] p-6 md:p-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-blue-300/80">Featured Case Study</p>
          <h3
            className="mt-2 text-3xl uppercase tracking-tight text-white md:text-4xl"
            style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif" }}
          >
            Revenue Risk Mapping
          </h3>
        </div>
        <a
          href="#work"
          className="rounded-full border border-blue-300/30 px-4 py-2 text-sm text-blue-200 transition hover:border-blue-300/60 hover:bg-blue-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          View Work
        </a>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-blue-300/70">Problem</p>
          <p className="text-sm text-white/70">Revenue exposure was hidden inside uneven customer concentration.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-blue-300/70">Approach</p>
          <p className="text-sm text-white/70">Used cohort slices and rank windows to isolate dependency clusters.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-blue-300/70">Outcome</p>
          <p className="text-sm text-white/70">Identified a 23 percent concentration signal and converted it into flags.</p>
        </div>
      </div>
    </motion.article>
  );
}

function SkillCard({ skill, isActive, onToggle }: { skill: SkillData; isActive: boolean; onToggle: () => void }) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-500",
        isActive
          ? "border-blue-300/40 bg-blue-400/[0.06] shadow-[0_0_0_1px_rgba(76,141,255,0.18),0_24px_60px_rgba(76,141,255,0.08)]"
          : "border-white/10 bg-white/[0.02]"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        aria-controls={`${skill.id}-projects`}
        className={cn(
          "flex w-full items-start justify-between gap-4 p-5 text-left md:p-6",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-inset"
        )}
      >
        <div>
          <h3
            className={cn(
              "text-3xl uppercase tracking-tight md:text-4xl",
              isActive ? "text-blue-300" : "text-white"
            )}
            style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif" }}
          >
            {skill.name}
          </h3>
          <p className="mt-2 text-sm text-white/55">{skill.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">{skill.projectCount} projects</span>
          <motion.span animate={{ rotate: isActive ? 45 : 0 }} className={cn("text-lg", isActive ? "text-blue-300" : "text-white/35")}>
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
            className="overflow-hidden border-t border-blue-300/20"
          >
            <div className="grid gap-4 p-5 md:grid-cols-2 md:p-6">
              {skill.projects.map((project, index) => (
                <motion.article
                  key={project.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-xl border border-white/10 bg-black/35 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                    <span className="font-mono text-xs text-white/40">{project.year}</span>
                  </div>
                  <p className="text-sm text-white/62">{project.context}</p>
                  <div className="my-4 rounded-lg border-l-2 border-blue-300 bg-blue-400/[0.07] px-3 py-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-300/80">Insight</p>
                    <p className="mt-1 text-sm text-blue-100">{project.insight}</p>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/12 bg-white/[0.02] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.ctaHref}
                    className="inline-flex rounded-full border border-blue-300/30 px-3 py-1.5 text-xs text-blue-200 transition hover:border-blue-300/70 hover:bg-blue-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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

function TimelineItem({ entry }: { entry: JourneyEntry }) {
  return (
    <motion.article
      initial={{ opacity: 0.42, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.35 }}
      className="relative pb-10 pl-9 last:pb-0"
    >
      {!entry.isLast ? (
        <span className="absolute left-[11px] top-6 bottom-0 w-px bg-blue-300/35" />
      ) : null}
      <span className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-blue-300/60 bg-black shadow-[0_0_18px_rgba(76,141,255,0.32)]">
        <span className="h-2 w-2 rounded-full bg-blue-300" />
      </span>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue-300">{entry.year}</p>
      <h4 className="mt-2 text-xl font-semibold text-white">{entry.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{entry.description}</p>
      <p className="mt-3 rounded-lg border border-blue-300/20 bg-blue-400/[0.06] px-3 py-2 text-sm text-blue-100">
        {entry.outcome}
      </p>
    </motion.article>
  );
}

export default function Portfolio() {
  const [activeSkill, setActiveSkill] = useState<string>("sql");
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0.78]);
  const email = "mohamed.elburki@outlook.com";

  const navTabs = useMemo<NavTab[]>(
    () => [
      { title: "Hero", href: "#hero", icon: <HomeIcon /> },
      { title: "Tools", href: "#work", icon: <CodeIcon /> },
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

  return (
    <div className="relative min-h-screen overflow-x-clip text-white" style={{ backgroundColor: "var(--background)" }}>
      <ExpandableNav tabs={navTabs} />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[rgba(7,9,12,0.18)]" />

      <motion.header
        style={{ opacity: headerOpacity }}
        className="fixed left-0 right-0 top-0 z-40 px-6 py-4"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2 backdrop-blur" style={{ borderColor: "var(--border-accent)", backgroundColor: "rgba(11,15,20,0.68)" }}>
          <p className="flex items-center gap-3 text-sm tracking-wide text-white/85">
            <span className="font-semibold">M.E-B</span>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>System Online</span>
          </p>
          <button
            type="button"
            onClick={copyEmail}
            className="rounded-full border px-3 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{ borderColor: "var(--border-accent)", color: "var(--foreground)" }}
          >
            {copied ? "Copied" : "Contact"}
          </button>
        </div>
      </motion.header>

      <section id="hero" className="relative z-10 flex min-h-screen items-center px-6 pb-14 pt-28">
        <div className="mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <HeroVisorReveal
              nameLine1="Mohamed"
              nameLine2="El-Burki"
              roleLine="DATA ANALYST"
              hudLabel="PROFILE REVEAL"
            />
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { delay: 1.45, duration: 0.4 }}
              className="mt-7 max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
            >
              Transforming operational reality into decision-ready analytics. I bridge warehouse pressure,
              commercial priorities, and dashboard clarity so teams can act with confidence.
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
                style={{ backgroundColor: "var(--accent)", color: "#07090C" }}
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

      <section className="relative z-10 py-8">
        <NarrativeTransition
          label="Credibility Transition"
          copy="Built in high-pressure operations, refined through analytics projects. The next section shows the stack I use and the proof each tool produced."
        />
      </section>

      <section id="work" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <ChapterHeader number="02" title="Tools + Proof" />
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-5xl uppercase tracking-tight text-white md:text-7xl"
            style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif" }}
          >
            Tools of the <span className="text-blue-300">Trade</span>
          </motion.h2>
          <p className="mt-4 max-w-2xl text-white/55">
            Expand each category to review project context, insight statements, core methods, and a next-step CTA.
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

      <section id="story" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <ChapterHeader number="03" title="Journey" />
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <h2
                className="text-5xl uppercase tracking-tight text-white md:text-7xl"
                style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif" }}
              >
                From Warehouse <span className="text-blue-300">to Dashboard</span>
              </h2>
              <p className="mt-5 max-w-xl text-white/62">
                I approach analytics from operational truth first. That background makes my reporting practical,
                grounded, and focused on decisions that can actually be executed.
              </p>

              <div className="mt-7 rounded-xl border border-blue-300/20 bg-blue-400/[0.05] p-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-blue-300/80">What I do now</p>
                <ul className="mt-3 space-y-2 text-sm text-white/72">
                  <li>Convert raw operations and sales data into risk and growth narratives.</li>
                  <li>Build SQL and BI workflows that expose high-impact drivers quickly.</li>
                  <li>Frame insights with clear actions for business and operations stakeholders.</li>
                  <li>Prioritize outcomes with measurable performance deltas and accountability.</li>
                </ul>
              </div>

              <div className="mt-4 rounded-xl border border-white/12 bg-white/[0.02] p-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-blue-300/80">What I am learning / building</p>
                <ul className="mt-3 space-y-2 text-sm text-white/68">
                  <li>Deeper statistical testing for conversion and retention diagnostics.</li>
                  <li>Reusable BI templates that reduce setup time for repeat reporting use cases.</li>
                  <li>Now building: a logistics-to-revenue signal map for faster issue triage.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 md:p-6">
              {JOURNEY_ENTRIES.map((entry) => (
                <TimelineItem key={entry.title} entry={entry} />
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

      <section id="contact" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <ChapterHeader number="04" title="Connect" />
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2
                className="text-5xl uppercase tracking-tight text-white md:text-7xl"
                style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif" }}
              >
                Let&apos;s Build <span className="text-blue-300">Something Useful</span>
              </h2>
              <p className="mt-4 max-w-xl text-white/62">
                Open to analyst roles and project collaborations where rigorous data work improves decision speed and business clarity.
              </p>

              <div className="mt-7 grid gap-3">
                <article className="rounded-xl border border-blue-300/25 bg-blue-400/[0.06] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-300/90">Hire me</p>
                  <p className="mt-1 text-sm text-white/80">Data Analyst roles focused on commercial, risk, or logistics insight.</p>
                </article>
                <article className="rounded-xl border border-white/12 bg-white/[0.02] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-300/90">Collaborate</p>
                  <p className="mt-1 text-sm text-white/75">Dashboards, analysis workflows, and lightweight automation opportunities.</p>
                </article>
                <article className="rounded-xl border border-white/12 bg-white/[0.02] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-300/90">Ask about a project</p>
                  <p className="mt-1 text-sm text-white/75">Happy to break down SQL, Power BI, and Tableau decisions in detail.</p>
                </article>
              </div>

              <p className="mt-6 rounded-lg border border-blue-300/20 bg-black/30 px-4 py-3 text-sm text-blue-100">
                Availability: open to UK-based and remote opportunities. Preferred contact: email. Typical response time: within 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={copyEmail}
                className="group flex w-full items-center justify-between rounded-2xl border border-blue-300/25 bg-blue-400/[0.06] p-5 text-left transition hover:border-blue-300/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-300/90">Email</p>
                  <p className="mt-1 text-base text-white">{email}</p>
                  <p className="mt-1 text-xs text-white/55">Best for hiring and project discussions.</p>
                </div>
                <span className="text-blue-200">{copied ? "Copied" : "Open"}</span>
              </button>

              <a
                href="https://linkedin.com/in/mohamedelburki"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-between rounded-2xl border border-white/12 bg-white/[0.02] p-5 transition hover:border-blue-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-300/90">LinkedIn</p>
                  <p className="mt-1 text-base text-white">Mohamed El-Burki</p>
                  <p className="mt-1 text-xs text-white/55">Quick links: profile updates and experience history.</p>
                </div>
                <span className="text-white/40 transition group-hover:text-blue-200">Open</span>
              </a>

              <a
                href="https://github.com/mohamedelburkib-cmd"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-between rounded-2xl border border-white/12 bg-white/[0.02] p-5 transition hover:border-blue-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-blue-300/90">GitHub</p>
                  <p className="mt-1 text-base text-white">mohamedelburkib-cmd</p>
                  <p className="mt-1 text-xs text-white/55">Quick links: code samples and technical breakdowns.</p>
                </div>
                <span className="text-white/40 transition group-hover:text-blue-200">Open</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mb-24 border-t border-white/8 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs text-white/35">
          <p>(c) 2026 Mohamed El-Burki</p>
          <p>Built with Next.js + Framer Motion</p>
        </div>
      </footer>
    </div>
  );
}
