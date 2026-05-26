"use client";
import { useState, useRef, useEffect } from "react";
import { saveHighScore } from "@/lib/gameUtils";

type State = "ready" | "wait" | "go" | "done" | "early";

export default function Reaction() {
  const [state, setState] = useState<State>("ready");
  const [ms, setMs] = useState(0);
  const [best, setBest] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef(0);

  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  const click = () => {
    if (state === "wait") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState("early"); return;
    }
    if (state === "go") {
      const t = Date.now() - startRef.current;
      setMs(t); setState("done");
      if (!best || t < best) { setBest(t); }
      saveHighScore("react", t, "min"); return;
    }
    if (state === "done" || state === "early") { setState("ready"); setMs(0); return; }
    setState("wait");
    timerRef.current = setTimeout(() => { startRef.current = Date.now(); setState("go"); }, 800 + Math.random() * 2500);
  };

  const text = { ready: "Click to start", wait: "Wait for green…", go: "CLICK!", done: `${ms} ms`, early: "Too early — click to retry" }[state];

  return (
    <div>
      <div className="lyric-meta">
        <span>BEST <b>{best ? best + " ms" : "—"}</b></span>
        <span style={{ marginLeft: "auto" }}>fastest human reaction ~100ms. under 200 is sharp.</span>
      </div>
      <div className="reaction-stage" data-state={state} onClick={click}>{text}</div>
      <div className="typing-controls">
        <button className="btn ghost" onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); setState("ready"); setMs(0); }}>Reset</button>
        {state === "done" && (
          <span style={{ fontSize: 11, color: "var(--ink-soft)", letterSpacing: "0.1em" }}>
            {ms < 200 ? "★ elite" : ms < 280 ? "sharp" : ms < 380 ? "human" : "caffeinate"}
          </span>
        )}
      </div>
    </div>
  );
}
