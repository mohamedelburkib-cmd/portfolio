"use client";
import React, { useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";

export type ParallaxProject = {
  id: string;
  title: string;
  tool: string;
  thumbnail: string;
  year: string;
  result: string;
};

const TOOL_COLORS: Record<string, string> = {
  SQL: "#D2FF00",
  "Power BI": "#F2C811",
  Tableau: "#E97627",
  Excel: "#217346",
  "Financial Modelling": "#00D4AA",
};

export const HeroParallax = ({
  projects,
  onProjectClick,
}: {
  projects: ParallaxProject[];
  onProjectClick: (id: string) => void;
}) => {
  const [activeRow, setActiveRow] = useState(0);

  const firstRow = projects.slice(0, 3);
  const secondRow = projects.slice(3, 6);
  const thirdRow = projects.slice(6, 9);

  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (v < 0.35) setActiveRow(0);
      else if (v < 0.68) setActiveRow(1);
      else setActiveRow(2);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const scrollToRow = (rowIndex: number) => {
    const el = ref.current;
    if (!el) return;
    const sectionTop = el.getBoundingClientRect().top + window.scrollY;
    const sectionHeight = el.offsetHeight;
    window.scrollTo({
      top: sectionTop + (rowIndex / 3) * sectionHeight + 1,
      behavior: "smooth",
    });
  };

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-500, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 [overflow-x:clip] antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      {/* Row navigation dots */}
      <div className="sticky top-[45vh] z-30 flex justify-end pointer-events-none">
        <div className="flex flex-col gap-3 pr-6 pointer-events-auto">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => scrollToRow(i)}
              className="h-2.5 w-2.5 rounded-full border transition-all duration-300"
              style={{
                backgroundColor: activeRow === i ? "#D2FF00" : "transparent",
                borderColor:
                  activeRow === i ? "#D2FF00" : "rgba(255,255,255,0.3)",
                boxShadow: activeRow === i ? "0 0 8px #D2FF00" : "none",
              }}
              aria-label={`Jump to row ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              translate={translateX}
              onClick={() => onProjectClick(project.id)}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              translate={translateXReverse}
              onClick={() => onProjectClick(project.id)}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              translate={translateX}
              onClick={() => onProjectClick(project.id)}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const ProjectCard = ({
  project,
  translate,
  onClick,
}: {
  project: ParallaxProject;
  translate: MotionValue<number>;
  onClick: () => void;
}) => {
  const tc = TOOL_COLORS[project.tool] || "#D2FF00";

  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      onClick={onClick}
      className="group/project h-96 w-[30rem] relative flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden"
    >
      <Image
        src={project.thumbnail}
        height={600}
        width={600}
        className="object-cover object-center absolute h-full w-full inset-0"
        alt={project.title}
      />

      {/* Permanent bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Tool badge */}
      <span
        className="absolute top-4 right-4 rounded-full px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]"
        style={{
          backgroundColor: `${tc}22`,
          color: tc,
          border: `1px solid ${tc}50`,
          backdropFilter: "blur(6px)",
        }}
      >
        {project.tool}
      </span>

      {/* Hover dark overlay */}
      <div className="absolute inset-0 opacity-0 group-hover/project:opacity-75 bg-black pointer-events-none transition-opacity duration-300" />

      {/* Project info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p
          className="font-mono text-[9px] uppercase tracking-[0.14em] mb-1 transition-opacity duration-300 opacity-0 group-hover/project:opacity-100"
          style={{ color: tc }}
        >
          {project.year}
        </p>
        <h3 className="text-white font-semibold text-lg leading-tight">
          {project.title}
        </h3>
        <p className="text-white/60 text-xs mt-1.5 leading-relaxed transition-opacity duration-300 opacity-0 group-hover/project:opacity-100">
          {project.result}
        </p>
        <p
          className="font-mono text-[10px] uppercase tracking-[0.12em] mt-3 transition-opacity duration-300 opacity-0 group-hover/project:opacity-100"
          style={{ color: tc }}
        >
          Open case study →
        </p>
      </div>
    </motion.div>
  );
};
