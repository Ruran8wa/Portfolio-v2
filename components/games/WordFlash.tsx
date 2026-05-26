"use client";
import { useState, useEffect } from "react";
import { saveHighScore } from "@/lib/gameUtils";

const WORDS = ["river","amber","circuit","moth","kite","ember","linen","harbor","velvet","static","ladder","saffron","marble","cobalt","monsoon","lantern","compass","iris","tundra","syrup","atlas","ginger","vellum","argon","satin","ribbon","fjord","echo","thicket","willow","neon","agate","yarrow","cinder"];

function pick(n: number, exclude: string[] = []) {
  const pool = WORDS.filter((x) => !exclude.includes(x));
  const out: string[] = [];
  while (out.length < n && pool.length) { const i = Math.floor(Math.random() * pool.length); out.push(pool.splice(i, 1)[0]); }
  return out;
}

export default function WordFlash() {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"show" | "ask" | "result">("show");
  const [words, setWords] = useState<string[]>([]);
  const [shown, setShown] = useState(-1);
  const [askIdx, setAskIdx] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    if (phase !== "show") return;
    const ws = pick(5); setWords(ws);
    const idx = Math.floor(Math.random() * 5); setAskIdx(idx);
    setChoices([ws[idx], ...pick(3, ws)].sort(() => Math.random() - 0.5));
    let i = 0; setShown(-1);
    const showOne = () => {
      if (i >= ws.length) { setShown(-1); setPhase("ask"); return; }
      setShown(i++); setTimeout(showOne, 750);
    };
    setTimeout(showOne, 400);
  }, [phase, round]);

  const choose = (w: string) => {
    setPicked(w); setPhase("result");
    if (w === words[askIdx]) {
      const next = score + 1; setScore(next); saveHighScore("flash", next);
      setTimeout(() => { setRound((r) => r + 1); setPhase("show"); setPicked(null); }, 900);
    }
  };

  return (
    <div>
      <div className="lyric-meta">
        <span>ROUND <b>{round}</b></span><span>STREAK <b>{score}</b></span>
        <span style={{ marginLeft: "auto" }}>{phase === "show" ? "watch…" : phase === "ask" ? "which was at the asked position?" : ""}</span>
      </div>
      <div className="wf-stage">
        {phase === "show" && <div className="wf-word">{shown >= 0 ? words[shown] : "…"}</div>}
        {phase === "ask" && (
          <div className="wf-ask">
            <div className="wf-ask-q">What was word <b>#{askIdx + 1}</b>?</div>
            <div className="wf-choices">{choices.map((w) => <button key={w} className="wf-choice" onClick={() => choose(w)}>{w}</button>)}</div>
          </div>
        )}
        {phase === "result" && (
          <div className="wf-result">
            <div className={`nm-result-msg ${picked === words[askIdx] ? "ok" : "bad"}`}>
              {picked === words[askIdx] ? `✓ "${words[askIdx]}"` : `✗ it was "${words[askIdx]}"`}
            </div>
            <div className="wf-seq">sequence: {words.map((w, i) => <span key={i} className={i === askIdx ? "hl" : ""}>{w}</span>)}</div>
            {picked !== words[askIdx] && <button className="btn" style={{ marginTop: 14 }} onClick={() => { setScore(0); setRound((r) => r + 1); setPhase("show"); setPicked(null); }}>Restart</button>}
          </div>
        )}
      </div>
    </div>
  );
}
