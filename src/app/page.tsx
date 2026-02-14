"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import HeroVisorReveal from "@/components/HeroVisorReveal";

/* ── Utility ── */
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

/* ────────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────────── */

const IMPACT_METRICS = [
  { label: "Transactions Analysed", value: "1M+", icon: "◈" },
  { label: "Capital Flagged", value: "£45K", icon: "△" },
  { label: "Customers Segmented", value: "4,300+", icon: "◎" },
  { label: "Revenue Concentration", value: "23%", icon: "◇" },
];

type Project = {
  title: string;
  year: string;
  decisionFrame: string;
  context: string;
  insight: string;
  action: string;
  result: string;
  tags: string[];
};

type SkillData = {
  id: string;
  name: string;
  icon: string;
  description: string;
  projects: Project[];
};

const SKILLS: SkillData[] = [
  {
    id: "sql",
    name: "SQL",
    icon: "{ }",
    description:
      "Structuring business questions into diagnostic queries — from customer risk to operational bottlenecks.",
    projects: [
      {
        title: "Revenue Concentration Analysis",
        year: "2024",
        decisionFrame:
          "Which customers should we protect, and where does over-reliance on a few accounts become a revenue risk?",
        context:
          "Analysed 1M+ UK retail transactions to surface concentration risk using CTEs, window functions, and cumulative distribution queries.",
        insight:
          "Top 5% of customers accounted for 23% of total revenue — a dependency pattern invisible in standard reporting.",
        action:
          "Built a weekly monitoring query flagging high-dependency accounts with rank-based thresholds and pricing guardrail triggers.",
        result:
          "Expected to reduce concentration exposure by 8–12% over two planning cycles.",
        tags: ["CTEs", "Window Functions", "PERCENT_RANK", "Cumulative Distribution"],
      },
      {
        title: "Customer RFM Segmentation",
        year: "2024",
        decisionFrame:
          "Which customers are worth re-engaging now, and what does that mean in concrete terms for marketing and ops?",
        context:
          "Built an action-ready customer segmentation model using NTILE-based RFM scoring across recency, frequency, and monetary dimensions.",
        insight:
          "Segmented 4,300+ customers into five lifecycle cohorts — Champions, Loyal, At Risk, Hibernating, and New.",
        action:
          "Mapped each segment to specific retention plays with clear ownership (Sales, Marketing, CRM) and cadence.",
        result:
          "Expected uplift: +5–9% repeat purchase rate across mid-value cohorts.",
        tags: ["RFM", "NTILE", "Cohort Analysis", "Self-Joins"],
      },
      {
        title: "Product Performance Diagnostics",
        year: "2024",
        decisionFrame:
          "Which products are quietly tying up cash, and what should we do about stock allocation this quarter?",
        context:
          "Mapped SKU velocity against inventory holding days using self-joins, ABC classification, and rank-based exception flagging.",
        insight:
          "Identified 127 slow-moving SKUs linked to £45K in tied-up capital sitting in Category C.",
        action:
          "Introduced weekly exception flags to rebalance stock and de-prioritise low-yield SKUs before quarterly reviews.",
        result:
          "Estimated cash release potential: £18–25K within first quarter of adoption.",
        tags: ["Self-Joins", "ABC Classification", "RANK", "Exception Flags"],
      },
    ],
  },
  {
    id: "powerbi",
    name: "Power BI",
    icon: "▣",
    description:
      "Multi-market KPI visibility built for leadership decisions — clear ownership and drill paths, not just charts.",
    projects: [
      {
        title: "Executive Sales Command Center",
        year: "2024",
        decisionFrame:
          "How does leadership get a clean, single view of cross-market performance without an analyst prepping every weekly deck?",
        context:
          "Designed a star-schema data model in Power BI unifying sales data across 38 countries with DAX measures and role-based drill paths.",
        insight:
          "Unified a £8.5M revenue view into one self-service surface, eliminating manual slide preparation.",
        action:
          "Standardised KPI definitions, added mobile layout, and built role-based views for regional vs. global leadership.",
        result:
          "Estimated reporting prep time reduced by 25–35% for weekly leadership updates.",
        tags: ["DAX", "Star Schema", "Mobile Layout", "Role-Based Views"],
      },
    ],
  },
  {
    id: "tableau",
    name: "Tableau",
    icon: "◧",
    description:
      "Lifecycle and conversion stories that surface where intervention actually matters — not just where the numbers drop.",
    projects: [
      {
        title: "Customer Journey Funnel",
        year: "2024",
        decisionFrame:
          "Where in the customer lifecycle is the biggest conversion opportunity, and what would recovery actually mean in revenue terms?",
        context:
          "Visualised lifecycle drop-off using LOD expressions and story points to expose the most valuable intervention points.",
        insight:
          "Highlighted a 67% first-to-repeat conversion drop — the single highest leverage point for revenue recovery.",
        action:
          "Proposed a targeted reactivation sequence for first-time buyers within 30 days of initial purchase.",
        result:
          "Expected conversion recovery: +4–7 percentage points in the repeat purchase step.",
        tags: ["LOD Expressions", "Story Points", "Funnel Analysis", "Calculated Fields"],
      },
    ],
  },
  {
    id: "excel",
    name: "Excel",
    icon: "▦",
    description:
      "Financial models and operational templates that structure decisions before they ever reach a dashboard.",
    projects: [
      {
        title: "Scenario-Based P&L Model",
        year: "2025",
        decisionFrame:
          "If we adjust pricing by 5–15% across product tiers, what happens to gross margin and contribution under different volume assumptions?",
        context:
          "Built a dynamic P&L model with scenario toggles (base, optimistic, stress), SUMPRODUCT-driven cost allocation, and sensitivity tables.",
        insight:
          "A 10% price increase on mid-tier products yields a 6.2% margin improvement even under pessimistic volume decline of 8%.",
        action:
          "Delivered a three-scenario comparison with break-even thresholds and a sensitivity matrix for leadership review.",
        result:
          "Model adopted for quarterly pricing reviews, reducing ad-hoc analysis requests by an estimated 40%.",
        tags: ["Data Tables", "SUMPRODUCT", "Scenario Manager", "Sensitivity Analysis"],
      },
      {
        title: "Ops Capacity Planning Template",
        year: "2025",
        decisionFrame:
          "How many shifts do we need to cover projected volume without overstaffing during low-demand windows?",
        context:
          "Created a shift-planning workbook with INDEX/MATCH lookups against historical volume patterns, conditional formatting for coverage gaps, and a VBA-backed refresh macro.",
        insight:
          "Historical patterns showed consistent 22% volume drops on Tuesdays — overstaffed by 3–4 heads weekly.",
        action:
          "Introduced a weekly capacity heatmap with auto-flagging for under/over coverage vs. forecast.",
        result:
          "Projected labour cost saving of £2.8K/month through better shift alignment.",
        tags: ["INDEX/MATCH", "Conditional Formatting", "VBA Macros", "Heatmaps"],
      },
    ],
  },
  {
    id: "financial-modelling",
    name: "Financial Modelling",
    icon: "◆",
    description:
      "Structured financial reasoning — DCF, unit economics, and capital allocation models that connect numbers to decisions.",
    projects: [
      {
        title: "Unit Economics & LTV Model",
        year: "2025",
        decisionFrame:
          "What is the true lifetime value of each customer segment, and at what acquisition cost does each segment break even?",
        context:
          "Built a cohort-based LTV model with blended retention curves, variable contribution margins, and CAC payback period calculations.",
        insight:
          "Champion-segment LTV is 4.8× the At Risk segment — but CAC for Champions is only 1.6× higher, making them drastically more efficient to acquire.",
        action:
          "Recommended reallocating 30% of At Risk reactivation budget toward Champion-profile acquisition channels.",
        result:
          "Projected LTV:CAC improvement from 2.1:1 to 3.4:1 on the reallocated spend.",
        tags: ["LTV/CAC", "Cohort Retention", "Contribution Margin", "Payback Period"],
      },
      {
        title: "Investment Opportunity Scorecard",
        year: "2025",
        decisionFrame:
          "How do you compare pre-IPO investment opportunities across risk, liquidity, and return dimensions in a structured, repeatable way?",
        context:
          "Designed a weighted scoring model for evaluating pre-IPO and growth-stage investment opportunities with normalised risk/return metrics.",
        insight:
          "Liquidity risk and time-to-exit were systematically underweighted in informal assessments — adjusting weights changed the top-ranked opportunity.",
        action:
          "Delivered a reusable scorecard with adjustable weighting and automated rank-ordering across 8 evaluation dimensions.",
        result:
          "Framework adopted for personal portfolio decisions; improved consistency of investment analysis process.",
        tags: ["Weighted Scoring", "Risk/Return", "Normalisation", "Decision Matrices"],
      },
    ],
  },
];

type JourneyEntry = {
  year: string;
  title: string;
  description: string;
  isLast?: boolean;
};

const JOURNEY_ENTRIES: JourneyEntry[] = [
  {
    year: "2024–Present",
    title: "Risk & Logistics Analyst — Amazon",
    description:
      "Owned transport risk diagnostics across fulfilment operations. Translated day-to-day bottlenecks into measurable process signals that reduced escalation noise and sharpened operational visibility.",
  },
  {
    year: "2023",
    title: "BSc Economics & Accounting — City, University of London",
    description:
      "Built quantitative reasoning and commercial decision-framing discipline. Strengthened the ability to bridge business questions with analytical structure.",
  },
  {
    year: "Now",
    title: "Building Toward Analytics Roles",
    description:
      "Producing a portfolio that combines SQL depth, BI delivery, financial modelling, and narrative reporting — analysis that moves decisions, not just dashboards.",
    isLast: true,
  },
];

type NavTab = {
  title: string;
  href: string;
  icon: ReactNode;
};

/* ────────────────────────────────────────────────
   ICONS
   ──────────────────────────────────────────────── */

function HomeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.125 1.125 0 011.591 0L21.75 12M4.5 9.75v10.125A1.125 1.125 0 005.625 21H9.75v-4.875A1.125 1.125 0 0110.875 15h2.25a1.125 1.125 0 011.125 1.125V21h4.125a1.125 1.125 0 001.125-1.125V9.75" />
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

/* ────────────────────────────────────────────────
   NAVIGATION
   ──────────────────────────────────────────────── */

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
      style={{ borderColor: "var(--border)", backgroundColor: "rgba(22,26,33,0.88)" }}
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
              backgroundColor: active ? "rgba(95,168,168,0.08)" : "transparent",
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

/* ────────────────────────────────────────────────
   SECTION COMPONENTS
   ──────────────────────────────────────────────── */

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="font-mono text-sm" style={{ color: "var(--accent)" }}>
        {number}
      </span>
      <div className="h-px flex-1" style={{ backgroundColor: "var(--border-strong)" }} />
      <span
        className="text-xs uppercase tracking-[0.24em]"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </span>
    </div>
  );
}

/* ── Impact metrics — compact strip ── */
function ImpactStrip() {
  return (
    <div className="mx-auto grid max-w-6xl gap-2 px-6 sm:grid-cols-2 md:grid-cols-4">
      {IMPACT_METRICS.map((metric, index) => (
        <motion.article
          key={metric.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.3, delay: index * 0.06 }}
          className="group flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "rgba(22,26,33,0.5)",
          }}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs"
            style={{
              backgroundColor: "rgba(95,168,168,0.08)",
              color: "var(--accent)",
              border: "1px solid rgba(95,168,168,0.12)",
            }}
          >
            {metric.icon}
          </span>
          <div>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: "var(--text-muted)" }}
            >
              {metric.label}
            </p>
            <p className="text-lg font-semibold" style={{ color: "var(--text)" }}>
              {metric.value}
            </p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

/* ── Skill card with expandable projects ── */
function SkillCard({
  skill,
  isActive,
  onToggle,
}: {
  skill: SkillData;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-2xl border transition-all duration-300"
      style={{
        borderColor: isActive ? "rgba(95,168,168,0.2)" : "var(--border)",
        backgroundColor: isActive ? "rgba(22,26,33,0.7)" : "rgba(255,255,255,0.01)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        aria-controls={`${skill.id}-projects`}
        className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
        style={{ ["--tw-ring-color" as string]: "rgba(237,239,242,0.28)" }}
      >
        <div className="flex items-center gap-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm"
            style={{
              backgroundColor: isActive
                ? "rgba(95,168,168,0.1)"
                : "rgba(255,255,255,0.03)",
              color: isActive ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${isActive ? "rgba(95,168,168,0.2)" : "var(--border)"}`,
            }}
          >
            {skill.icon}
          </span>
          <div>
            <h3
              className="text-xl font-semibold uppercase tracking-wide"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                color: isActive ? "var(--accent)" : "var(--text)",
              }}
            >
              {skill.name}
            </h3>
            <p
              className="mt-0.5 text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {skill.description}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span
            className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
          >
            {skill.projects.length} {skill.projects.length === 1 ? "project" : "projects"}
          </span>
          <motion.span
            animate={{ rotate: isActive ? 45 : 0 }}
            className="text-lg"
            style={{
              color: isActive ? "var(--accent)" : "var(--text-muted)",
            }}
          >
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
                <ProjectCard key={project.title} project={project} delay={index * 0.06} />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ── Individual project card ── */
function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border p-4 md:p-5"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "rgba(11,14,18,0.65)",
      }}
    >
      {/* Title row */}
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-base font-semibold" style={{ color: "var(--text)" }}>
          {project.title}
        </h4>
        <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
          {project.year}
        </span>
      </div>

      {/* Context */}
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {project.context}
      </p>

      {/* Decision Frame */}
      <div
        className="mt-4 rounded-lg border p-3"
        style={{
          borderColor: "rgba(95,168,168,0.18)",
          backgroundColor: "rgba(95,168,168,0.03)",
        }}
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: "var(--accent)" }}
        >
          Decision Frame
        </p>
        <p
          className="mt-1 text-sm italic leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {project.decisionFrame}
        </p>
      </div>

      {/* Insight → Action → Result */}
      <div
        className="mt-3 grid gap-3 rounded-lg border p-3 sm:grid-cols-3"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "rgba(22,26,33,0.4)",
        }}
      >
        <div>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: "var(--accent)" }}
          >
            Insight
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text)" }}>
            {project.insight}
          </p>
        </div>
        <div>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: "var(--accent)" }}
          >
            Action
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text)" }}>
            {project.action}
          </p>
        </div>
        <div>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: "var(--accent)" }}
          >
            Result
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text)" }}>
            {project.result}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

/* ── Timeline ── */
function TimelineItem({
  entry,
  index,
}: {
  entry: JourneyEntry;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="relative pb-8 pl-8 last:pb-0"
    >
      {/* Vertical line */}
      {!entry.isLast ? (
        <span
          className="absolute bottom-0 left-[9px] top-5 w-px"
          style={{ backgroundColor: "var(--border-strong)" }}
        />
      ) : null}

      {/* Dot */}
      <span
        className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full border"
        style={{
          borderColor: entry.isLast ? "var(--accent)" : "var(--border-strong)",
          backgroundColor: "var(--bg)",
        }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: entry.isLast ? "var(--accent)" : "var(--text-muted)",
          }}
        />
      </span>

      <p
        className="font-mono text-xs uppercase tracking-[0.14em]"
        style={{ color: entry.isLast ? "var(--accent)" : "var(--text-muted)" }}
      >
        {entry.year}
      </p>
      <h4 className="mt-1 text-base font-semibold" style={{ color: "var(--text)" }}>
        {entry.title}
      </h4>
      <p
        className="mt-1.5 text-sm leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {entry.description}
      </p>
    </motion.article>
  );
}

/* ────────────────────────────────────────────────
   MAIN PAGE
   ──────────────────────────────────────────────── */

export default function Portfolio() {
  const [activeSkill, setActiveSkill] = useState<string>("sql");
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0.82]);
  const email = "mohamed.elburki@outlook.com";

  const navTabs = useMemo<NavTab[]>(
    () => [
      { title: "Home", href: "#hero", icon: <HomeIcon /> },
      { title: "Work", href: "#work", icon: <CodeIcon /> },
      { title: "Journey", href: "#journey", icon: <UserIcon /> },
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
    <div
      className="relative min-h-screen overflow-x-clip text-white"
      style={{ backgroundColor: "var(--background)" }}
    >
      <ExpandableNav tabs={navTabs} />

      {/* Fixed overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[rgba(14,15,18,0.18)]" />

      {/* ━━━ HEADER ━━━ */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="fixed left-0 right-0 top-0 z-40 px-6 py-4"
      >
        <div
          className="mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2 backdrop-blur"
          style={{
            borderColor: "var(--border-accent)",
            backgroundColor: "rgba(11,15,20,0.72)",
          }}
        >
          <p
            className="flex items-center gap-3 text-sm tracking-wide"
            style={{ color: "var(--text)" }}
          >
            <span className="font-semibold">M.E-B</span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: "var(--accent)" }}
            >
              Available for analyst roles
            </span>
          </p>
          <a
            href="#contact"
            className="rounded-full border px-3 py-1.5 text-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{
              borderColor: "var(--border-accent)",
              color: "var(--foreground)",
            }}
          >
            Let&apos;s talk
          </a>
        </div>
      </motion.header>

      {/* ━━━ HERO ━━━ */}
      <section
        id="hero"
        className="relative z-10 flex min-h-screen scroll-mt-24 items-center px-6 pb-14 pt-28"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <HeroVisorReveal nameLine1="Mohamed" nameLine2="El-Burki" />

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduceMotion ? { duration: 0 } : { delay: 1.3, duration: 0.4 }
                }
                className="mt-8 text-base md:text-lg"
                style={{ color: "var(--text)" }}
              >
                Data Analyst — Operations, Commercial &amp; Risk Analytics
              </motion.p>

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduceMotion ? { duration: 0 } : { delay: 1.45, duration: 0.4 }
                }
                className="mt-3 max-w-xl text-sm leading-relaxed md:text-base"
                style={{ color: "var(--text-muted)" }}
              >
                My background in economics and Amazon logistics operations built an
                instinct for what decision is actually being made — before I open a
                file. I target roles where that domain context turns analysis into
                action, not just another dashboard.
              </motion.p>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduceMotion ? { duration: 0 } : { delay: 1.6, duration: 0.38 }
                }
                className="mt-4 flex flex-wrap gap-2"
              >
                {["SQL", "Power BI", "Tableau", "Excel", "Financial Modelling"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                      style={{
                        borderColor: "var(--border-strong)",
                        color: "var(--text)",
                      }}
                    >
                      {t}
                    </span>
                  )
                )}
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduceMotion ? { duration: 0 } : { delay: 1.75, duration: 0.38 }
                }
                className="mt-8 flex flex-wrap gap-3"
              >
                <a
                  href="#work"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  style={{ backgroundColor: "var(--accent)", color: "#0E0F12" }}
                >
                  View Work
                </a>
                <a
                  href="#journey"
                  className="rounded-full border px-5 py-2.5 text-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  style={{
                    borderColor: "var(--border-soft)",
                    color: "var(--foreground)",
                  }}
                >
                  My Journey
                </a>
              </motion.div>
            </div>

            {/* Right side: compact signal console */}
            <motion.aside
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={
                reduceMotion ? { duration: 0 } : { delay: 1.2, duration: 0.45 }
              }
            >
              <div
                className="rounded-2xl border p-5 backdrop-blur md:p-6"
                style={{
                  borderColor: "var(--border-strong)",
                  backgroundColor: "rgba(22,26,33,0.65)",
                }}
              >
                <div className="flex items-center justify-between">
                  <p
                    className="font-mono text-xs uppercase tracking-[0.18em]"
                    style={{ color: "var(--accent)" }}
                  >
                    What I deliver
                  </p>
                  <span
                    className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    2026
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {[
                    "Turning operational noise into decision-ready metrics",
                    "Diagnosing risk before it becomes impact",
                    "Building dashboards teams actually use",
                    "Translating stakeholder questions into measurable signals",
                    "Structuring financial models that frame investment decisions",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--accent)" }}
                      />
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "Ops Analytics",
                    "Commercial Insights",
                    "BI Storytelling",
                    "Financial Analysis",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>

          {/* Impact strip — sits at bottom of hero */}
          <div className="mt-16">
            <ImpactStrip />
          </div>
        </div>
      </section>

      {/* ━━━ WORK ━━━ */}
      <section id="work" className="relative z-10 scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number="01" title="Work + Decisions" />

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-5xl uppercase tracking-tight md:text-7xl"
            style={{
              fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              color: "var(--text)",
            }}
          >
            Analysis That{" "}
            <span style={{ color: "var(--accent)" }}>Drives Decisions</span>
          </motion.h2>
          <p className="mt-4 max-w-2xl text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
            Each project starts with the business decision it was meant to inform.
            Expand any tool to review the framing, insight, action, and outcome.
          </p>

          <div className="mt-10 grid gap-3">
            {SKILLS.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isActive={activeSkill === skill.id}
                onToggle={() =>
                  setActiveSkill((c) => (c === skill.id ? "" : skill.id))
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ JOURNEY ━━━ */}
      <section id="journey" className="relative z-10 scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number="02" title="Journey" />

          <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2
                className="text-5xl uppercase tracking-tight md:text-7xl"
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                  color: "var(--text)",
                }}
              >
                From Warehouse{" "}
                <span style={{ color: "var(--accent)" }}>to Dashboard</span>
              </h2>
              <p
                className="mt-5 max-w-xl text-sm leading-relaxed md:text-base"
                style={{ color: "var(--text-muted)" }}
              >
                I approach analytics from operational truth first. That background
                makes my reporting practical, grounded, and focused on decisions
                that can actually be executed.
              </p>

              <div
                className="mt-6 rounded-xl border p-4"
                style={{
                  borderColor: "rgba(95,168,168,0.2)",
                  backgroundColor: "rgba(95,168,168,0.03)",
                }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--accent)" }}
                >
                  My story in one paragraph
                </p>
                <p
                  className="mt-2.5 text-sm leading-relaxed"
                  style={{ color: "var(--text)" }}
                >
                  My background in economics and Amazon operations developed an
                  instinct for what a business question actually looks like before
                  it becomes a data request. I&apos;m targeting operations and
                  commercial analyst roles where I can combine that stakeholder
                  context with SQL depth, BI delivery, and financial modelling —
                  analysis that earns trust, not just looks good on a screen.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Logistics & Supply Chain",
                  "Retail & E-Commerce",
                  "Operations Analytics",
                  "Commercial Finance",
                ].map((ind) => (
                  <span
                    key={ind}
                    className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em]"
                    style={{
                      borderColor: "var(--border-strong)",
                      color: "var(--text)",
                    }}
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div
              className="rounded-2xl border p-5 md:p-6"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "rgba(22,26,33,0.4)",
              }}
            >
              {JOURNEY_ENTRIES.map((entry, index) => (
                <TimelineItem key={entry.title} entry={entry} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ CONTACT ━━━ */}
      <section id="contact" className="relative z-10 scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number="03" title="Connect" />

          <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2
                className="text-5xl uppercase tracking-tight md:text-7xl"
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                  color: "var(--text)",
                }}
              >
                Ways to Work{" "}
                <span style={{ color: "var(--accent)" }}>With Me</span>
              </h2>
              <p
                className="mt-4 max-w-xl text-sm md:text-base"
                style={{ color: "var(--text-muted)" }}
              >
                Open to analyst roles and project collaborations where rigorous
                analytics improves decision speed and operating clarity.
              </p>

              <div className="mt-6 grid gap-2.5">
                {[
                  {
                    label: "Hiring",
                    desc: "Data Analyst / BI Analyst roles focused on commercial, risk, or operations insight.",
                    accent: true,
                  },
                  {
                    label: "Collaboration",
                    desc: "Dashboards, analytics workflows, and lightweight automation support.",
                    accent: false,
                  },
                  {
                    label: "Project Discussion",
                    desc: "SQL design, segmentation logic, KPI frameworks, financial models, and reporting decisions.",
                    accent: false,
                  },
                ].map((item) => (
                  <article
                    key={item.label}
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: item.accent
                        ? "rgba(95,168,168,0.18)"
                        : "var(--border)",
                      backgroundColor: item.accent
                        ? "rgba(95,168,168,0.03)"
                        : "rgba(255,255,255,0.01)",
                    }}
                  >
                    <p
                      className="font-mono text-[10px] uppercase tracking-[0.16em]"
                      style={{ color: "var(--accent)" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.desc}
                    </p>
                  </article>
                ))}
              </div>

              <p
                className="mt-5 rounded-lg border px-4 py-2.5 text-sm"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                Preferred: email · Response: within 24h · Timezone: UK (GMT/BST)
              </p>
            </div>

            {/* Contact links */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={copyEmail}
                className="group flex w-full items-center justify-between rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                style={{
                  borderColor: "var(--border-strong)",
                  backgroundColor: "rgba(22,26,33,0.55)",
                }}
              >
                <div>
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.16em]"
                    style={{ color: "var(--accent)" }}
                  >
                    Email
                  </p>
                  <p className="mt-1 text-base" style={{ color: "var(--text)" }}>
                    {email}
                  </p>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Best for hiring and project discussions
                  </p>
                </div>
                <span
                  className="text-sm"
                  style={{ color: "var(--text)" }}
                >
                  {copied ? "Copied ✓" : "Copy"}
                </span>
              </button>

              {[
                {
                  label: "LinkedIn",
                  name: "Mohamed El-Burki",
                  desc: "Profile and experience history",
                  href: "https://linkedin.com/in/mohamedelburki",
                },
                {
                  label: "GitHub",
                  name: "mohamedelburkib-cmd",
                  desc: "Code samples and technical breakdowns",
                  href: "https://github.com/mohamedelburkib-cmd",
                },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-full items-center justify-between rounded-2xl border p-5 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "rgba(255,255,255,0.01)",
                  }}
                >
                  <div>
                    <p
                      className="font-mono text-[10px] uppercase tracking-[0.16em]"
                      style={{ color: "var(--accent)" }}
                    >
                      {link.label}
                    </p>
                    <p className="mt-1 text-base" style={{ color: "var(--text)" }}>
                      {link.name}
                    </p>
                    <p
                      className="mt-0.5 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {link.desc}
                    </p>
                  </div>
                  <span style={{ color: "var(--text-muted)" }}>→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer
        className="relative z-10 mb-24 border-t px-6 py-8"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="mx-auto flex max-w-6xl items-center justify-between text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <p>&copy; 2026 Mohamed El-Burki</p>
          <p>Built with Next.js + Framer Motion</p>
        </div>
      </footer>
    </div>
  );
}
