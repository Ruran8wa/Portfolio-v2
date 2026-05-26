"use client";
import { useState } from "react";
import Reveal from "@/components/effects/Reveal";
import EasterEgg from "@/components/ui/EasterEgg";
import PitchForm from "@/components/ui/PitchForm";

const PROJECTS = [
  {
    tag: "01", name: "Traka", status: "shipped",
    blurb: "A lightweight, cross-platform desktop time tracker. Lives in your tray, stays out of the way, and gives you weekly receipts on what you actually did. Built around the principle that the best tracker is the one you forget is running.",
    stack: ["Tauri", "React", "Rust"],
    url: "https://github.com/Aevlabs/traka-releases",
  },
  {
    tag: "02", name: "Rayo", status: "in beta",
    blurb: "A mobile-first map of public buildings in Rwanda, scoring each on accessibility — ramps, restrooms, signage, navigability. Crowdsourced data, offline-first, designed for wheelchair users, parents with strollers, and field surveyors.",
    stack: ["Expo", "React Native", "NestJS", "Supabase"],
    url: "https://github.com/Ruran8wa/Rayo",
  },
  {
    tag: "03", name: "Hanki", status: "shipped",
    blurb: "Connects the Rwandan diaspora with youth back home — mentorship, scholarships, opportunities. The hard part wasn't the tech; it was designing a feed that didn't feel like LinkedIn.",
    stack: ["React", "TypeScript", "Supabase"],
    url: "https://atlasc2u.vercel.app/",
  },
];

const SEEN_MOVIES = ["Spirited Away", "Whiplash", "Arrival", "Eternal Sunshine"];

export default function WorkScreen() {
  const [pitchOpen, setPitchOpen] = useState(false);

  return (
    <section className="section" data-screen-label="02 Work">
      <Reveal>
        <div className="currently-label">— selected work</div>
      </Reveal>
      <Reveal delay={80}>
        <div className="work-intro">
          Projects I&apos;d build again, even if no one was watching.{" "}
          <EasterEgg label="last seen / movies + tv" list={SEEN_MOVIES} />
        </div>
      </Reveal>

      <div className="work-grid">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.tag} delay={i * 100} as="div" className="proj">
            <div className="proj-no">{p.tag} / {String(PROJECTS.length).padStart(2, "0")}</div>
            <div className="proj-head">
              <h3 className="proj-name">{p.name}</h3>
              <span className="proj-badge">{p.status}</span>
              <a className="proj-link" href={p.url} target="_blank" rel="noreferrer">view →</a>
            </div>
            <div>
              <p className="proj-blurb">{p.blurb}</p>
              <div className="proj-stack">
                {p.stack.map((s) => <code key={s}>{s}</code>)}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="work-foot">
        <Reveal delay={400} className="work-foot-note">
          <div className="wfn-label">— more</div>
          <a href="https://github.com/ruran8wa" target="_blank" rel="noreferrer" className="wfn-link">
            github.com/ruran8wa →
          </a>
          <div className="wfn-meta">half-finished things live here too.</div>
        </Reveal>

        <Reveal delay={480}>
          <div className="pitch">
            <div className="pitch-eyebrow">— got an idea?</div>
            <h3 className="pitch-title">
              Send me a problem worth <em>building for.</em>
            </h3>
            <p className="pitch-body">
              I keep a list of weekend projects. Yours could be on it. Small tools, weird experiments,
              that one annoying thing nobody&apos;s built — if it&apos;s interesting, I&apos;ll probably try.
            </p>
            <button className="btn" onClick={() => setPitchOpen(true)}>
              Pitch me an idea →
            </button>
          </div>
        </Reveal>
      </div>

      {pitchOpen && <PitchForm onClose={() => setPitchOpen(false)} />}
    </section>
  );
}
