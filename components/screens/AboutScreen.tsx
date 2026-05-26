"use client";
import Reveal from "@/components/effects/Reveal";
import EasterEgg from "@/components/ui/EasterEgg";
import NowPlaying from "@/components/ui/NowPlaying";

const SEEN_MUSIC = ["Lana del Rey", "Frank Ocean", "Hozier", "Clairo", "Steve Lacy"];


export default function AboutScreen() {
  return (
    <section className="section" data-screen-label="04 About">
      <Reveal>
        <div className="currently-label">— about</div>
      </Reveal>

      <Reveal delay={60} className="bio bio-intro">
        <p>
          I&apos;m Prince Rurangwa. I write software in Kigali. I care about
          <em> small, useful things</em> — interfaces that respect your time, codebases
          you can read after a week off, and side projects that get finished.{" "}
          <EasterEgg label="last seen / music" list={SEEN_MUSIC} />
        </p>
      </Reveal>

      <Reveal delay={160}>
        <div className="page-currently">
          <div className="currently-label">— currently I&apos;m…</div>
          <div className="currently-grid">
            <div className="cur-cell">
              <div className="cur-cell-label">Learning</div>
              <div className="cur-cell-value"><em>Rive</em></div>
              <div className="cur-cell-meta">interaction · animation</div>
            </div>
            <div className="cur-cell">
              <div className="cur-cell-label">Watching</div>
              <div className="cur-cell-value"><em>Witch Hat Atelier</em></div>
              <div className="cur-cell-meta">studio bug · 2024</div>
            </div>
            <div className="cur-cell">
              <div className="cur-cell-label">Reading</div>
              <div className="cur-cell-value"><em>Leonardo da Vinci</em></div>
              <div className="cur-cell-meta">walter isaacson</div>
            </div>
            <div className="cur-cell cur-cell-music">
              <div className="cur-cell-label">Playing</div>
              <div className="cur-cell-value"><NowPlaying /></div>
              <div className="cur-cell-meta">spotify · playlist</div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
