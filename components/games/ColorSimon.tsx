"use client";
import { useState } from "react";
import { saveHighScore } from "@/lib/gameUtils";

const PADS = [
  { k: 0, name: "RED",    color: "#d44a3c" },
  { k: 1, name: "BLUE",   color: "#3870c4" },
  { k: 2, name: "GREEN",  color: "#3aa54d" },
  { k: 3, name: "YELLOW", color: "#e0b13a" },
];

export default function ColorSimon() {
  const [seq, setSeq] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"idle" | "show" | "go" | "fail">("idle");
  const [active, setActive] = useState<number | null>(null);

  const playSeq = (s: number[]) => {
    let i = 0;
    const flash = () => {
      if (i >= s.length) { setActive(null); setPhase("go"); return; }
      setActive(s[i]);
      setTimeout(() => { setActive(null); setTimeout(() => { i++; flash(); }, 180); }, 480);
    };
    setTimeout(flash, 400);
  };

  const startRound = (cur: number[]) => {
    const next = [...cur, Math.floor(Math.random() * 4)];
    setSeq(next); setStep(0); setPhase("show"); playSeq(next);
  };

  const onPad = (k: number) => {
    if (phase !== "go") return;
    setActive(k); setTimeout(() => setActive(null), 160);
    if (k !== seq[step]) { setPhase("fail"); return; }
    if (step + 1 === seq.length) { saveHighScore("simon", seq.length); setTimeout(() => startRound(seq), 500); }
    else setStep(step + 1);
  };

  return (
    <div>
      <div className="lyric-meta">
        <span>LEN <b>{seq.length}</b></span>
        <span>STEP <b>{seq.length === 0 ? "—" : `${step}/${seq.length}`}</b></span>
        <span style={{ marginLeft: "auto" }}>
          {phase === "idle" && "press start"}{phase === "show" && "watch…"}
          {phase === "go" && "repeat the sequence"}{phase === "fail" && "✗ wrong pad"}
        </span>
      </div>
      <div className="simon-board">
        {PADS.map((p) => (
          <button key={p.k} className="simon-pad" data-on={active === p.k ? "1" : "0"}
            style={{ "--pad-color": p.color } as React.CSSProperties}
            onClick={() => onPad(p.k)} disabled={phase !== "go"}>
            <span className="simon-pad-label">{p.name}</span>
          </button>
        ))}
      </div>
      <div className="typing-controls">
        {(phase === "idle" || phase === "fail") && (
          <button className="btn" onClick={() => startRound([])}>
            {phase === "fail" ? "Try again →" : "Start →"}
          </button>
        )}
        {phase === "fail" && <span style={{ fontSize: 11, color: "var(--ink-soft)", letterSpacing: "0.1em" }}>reached length {seq.length}</span>}
      </div>
    </div>
  );
}
