"use client";
import Reveal from "@/components/effects/Reveal";
import EasterEgg from "@/components/ui/EasterEgg";

const BUILD_VERBS = [
  "small things", "big things", "weekend things", "2am things",
  "mobile things", "desktop things", "accessibility things",
  "mapping things", "ML things", "things that ship", "things that don't",
  "things people actually use",
];

const STACK = [
  { label: "frontend",  items: ["React", "TypeScript", "Next.js", "Tailwind", "TanStack", "React Router"] },
  { label: "mobile",    items: ["Expo", "React Native"] },
  { label: "backend",   items: ["NestJS", "Supabase", "PostgreSQL"] },
  { label: "languages", items: ["JavaScript", "Python", "Bash"] },
  { label: "tools",     items: ["Docker", "Git", "GitHub"] },
  { label: "extras",    items: ["Tauri", "Rive", "scikit-learn"] },
];

const SEEN_ANIME      = ["Witch Hat Atelier", "Vinland Saga", "Frieren", "Mushishi"];
const STACK_OF_MONTH  = ["Tauri + Rust", "Expo + RN", "scikit-learn", "Rive"];

export default function HomeScreen({ onTab }: { onTab: (t: string) => void }) {
  const doubled = [...BUILD_VERBS, ...BUILD_VERBS];

  return (
    <section className="section home" data-screen-label="01 Home">
      <div className="hero">
        <Reveal delay={120}>
          <div className="hero-eyebrow">— Software engineer · Kigali / remote</div>
        </Reveal>
        <Reveal as="h1" delay={200} className="hero-title">
          I build things
          <span className="hero-period" onClick={() => onTab("play")} title="psst">.</span>
        </Reveal>
        <Reveal as="div" delay={300} className="hero-subline">
          Small, big, weird. <em>As long as the pain is real.</em>
        </Reveal>
        <Reveal delay={400}>
          <p className="hero-sub">
            Mostly web and mobile (React, Expo, React Native), with a little ML on the side.
            The stack rotates every six months. The obsession with details doesn&apos;t.
          </p>
        </Reveal>
        <Reveal delay={500}>
          <div className="hero-ctas">
            <button className="btn" onClick={() => onTab("work")}>See what I&apos;ve built →</button>
            <button className="btn ghost" onClick={() => onTab("about")}>Who I am</button>
          </div>
        </Reveal>
      </div>

      <Reveal delay={600}>
        <div className="marquee-row">
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {doubled.map((v, i) => (
                <span key={i} className="marquee-item">
                  {v}<span className="marquee-dot">◆</span>
                </span>
              ))}
            </div>
          </div>
          <span className="marquee-tail-egg">
            <EasterEgg label="last seen / anime" list={SEEN_ANIME} side="bottom" />
          </span>
        </div>
      </Reveal>

      <Reveal delay={700}>
        <div className="stack">
          <div className="stack-head">
            <div className="currently-label">— things I reach for</div>
            <div className="stack-sub">
              tools, not religions. swapped freely.{" "}
              <EasterEgg label="stack of the month" list={STACK_OF_MONTH} />
            </div>
          </div>
          <div className="stack-grid">
            {STACK.map((row) => (
              <div key={row.label} className="stack-row">
                <div className="stack-row-label">{row.label}</div>
                <div className="stack-chips">
                  {row.items.map((x) => <code key={x} className="stack-chip">{x}</code>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
