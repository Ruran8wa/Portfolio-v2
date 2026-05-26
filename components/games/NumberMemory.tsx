"use client";
import { useState, useEffect } from "react";
import { saveHighScore } from "@/lib/gameUtils";

export default function NumberMemory() {
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<"show" | "ask" | "result">("show");
  const [seq, setSeq] = useState<number[]>([]);
  const [askIdx, setAskIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (phase !== "show") return;
    const N = 4 + round;
    const s = Array.from({ length: N }, () => Math.floor(Math.random() * 10));
    setSeq(s);
    setAskIdx(Math.floor(Math.random() * s.length));
    const t = setTimeout(() => setPhase("ask"), 800 + N * 350);
    return () => clearTimeout(t);
  }, [phase, round]);

  const pick = (n: number) => {
    setPicked(n); setPhase("result");
    if (n === seq[askIdx]) {
      const next = score + 1; setScore(next); saveHighScore("num", next);
      setTimeout(() => { setRound((r) => r + 1); setPhase("show"); setPicked(null); }, 1100);
    }
  };

  const restart = () => { setRound(1); setScore(0); setPhase("show"); setPicked(null); };

  return (
    <div>
      <div className="lyric-meta">
        <span>ROUND <b>{round}</b></span><span>STREAK <b>{score}</b></span><span>LEN <b>{4 + round}</b></span>
        <span style={{ marginLeft: "auto" }}>{phase === "show" ? "memorize…" : phase === "ask" ? "answer:" : ""}</span>
      </div>
      <div className="nm-stage">
        {phase === "show" && <div className="nm-seq">{seq.map((d, i) => <span key={i} className="nm-digit">{d}</span>)}</div>}
        {phase === "ask" && (
          <div className="nm-ask">
            <div className="nm-ask-q">What was the digit at <b>position {askIdx + 1}</b>?</div>
            <div className="nm-keys">{[0,1,2,3,4,5,6,7,8,9].map((n) => <button key={n} className="nm-key" onClick={() => pick(n)}>{n}</button>)}</div>
          </div>
        )}
        {phase === "result" && (
          <div className="nm-result">
            <div className={`nm-result-msg ${picked === seq[askIdx] ? "ok" : "bad"}`}>{picked === seq[askIdx] ? "✓ correct" : "✗ wrong"}</div>
            <div className="nm-result-seq">sequence: {seq.map((d, i) => <span key={i} className={i === askIdx ? "hl" : ""}>{d}</span>)}</div>
            {picked !== seq[askIdx] && <button className="btn" style={{ marginTop: 14 }} onClick={restart}>Restart</button>}
          </div>
        )}
      </div>
    </div>
  );
}
