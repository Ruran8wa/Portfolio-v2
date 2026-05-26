"use client";
import { useState, useRef, useEffect } from "react";
import { saveHighScore } from "@/lib/gameUtils";

type Target = { id: number; x: number; y: number; born: number };

export default function AimTrainer() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const spawn = setInterval(() => {
      const stage = stageRef.current; if (!stage) return;
      const w = stage.clientWidth, h = stage.clientHeight, r = 22;
      const id = ++idRef.current;
      setTargets((t) => [...t, { id, x: r + Math.random() * (w - r * 2), y: r + Math.random() * (h - r * 2), born: Date.now() }]);
      setTimeout(() => setTargets((t) => t.filter((x) => x.id !== id)), 1400);
    }, 650);
    const tick = setInterval(() => setTime((t) => { if (t <= 1) { clearInterval(tick); clearInterval(spawn); setRunning(false); return 0; } return t - 1; }), 1000);
    return () => { clearInterval(spawn); clearInterval(tick); };
  }, [running]);

  useEffect(() => { if (!running && time === 0) saveHighScore("aim", score); }, [running, time, score]);

  const start = () => { setRunning(true); setTime(30); setScore(0); setMisses(0); setTargets([]); };
  const hit = (id: number) => { setTargets((t) => t.filter((x) => x.id !== id)); setScore((s) => s + 1); };
  const miss = (e: React.MouseEvent) => { if (running && e.target === stageRef.current) setMisses((m) => m + 1); };
  const acc = score + misses > 0 ? Math.round((score / (score + misses)) * 100) : 100;

  return (
    <div>
      <div className="lyric-meta">
        <span>TIME <b>{time}s</b></span><span>HITS <b>{score}</b></span><span>MISS <b>{misses}</b></span><span>ACC <b>{acc}%</b></span>
        <span style={{ marginLeft: "auto" }}>click the dots before they fade.</span>
      </div>
      <div ref={stageRef} className="aim-stage" onMouseDown={miss}>
        {!running && time === 30 && <button className="aim-start" onClick={start}>▶ START — 30 seconds</button>}
        {!running && time === 0 && (
          <div className="aim-end">
            <div className="aim-end-score">{score}<small> hits</small></div>
            <div className="aim-end-acc">{acc}% accuracy</div>
            <button className="btn" onClick={start} style={{ marginTop: 12 }}>Again →</button>
          </div>
        )}
        {targets.map((t) => (
          <button key={t.id} className="aim-target" style={{ left: t.x - 22, top: t.y - 22 }}
            onMouseDown={(e) => { e.stopPropagation(); hit(t.id); }}>
            <span />
          </button>
        ))}
      </div>
    </div>
  );
}
