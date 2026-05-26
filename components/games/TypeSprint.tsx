"use client";
import { useState, useRef, useEffect, useMemo, useReducer } from "react";
import { saveHighScore } from "@/lib/gameUtils";

const SNIPPETS = [
  { lang: "TypeScript", code: `const debounce = <T extends (...a: any[]) => any>(fn: T, ms = 250) => {
  let t: number;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};` },
  { lang: "Python", code: `def quicksort(xs):
    if len(xs) < 2: return xs
    p = xs[0]
    return quicksort([x for x in xs[1:] if x < p]) + [p] + quicksort([x for x in xs[1:] if x >= p])` },
  { lang: "JSX", code: `function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>clicked {n}x</button>;
}` },
  { lang: "Bash", code: `#!/usr/bin/env bash
for f in *.ts; do
  echo "compiling $f"
  tsc "$f" --outDir dist
done` },
];

export default function TypeSprint() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * SNIPPETS.length));
  const snip = SNIPPETS[idx];
  const [typed, setTyped] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [done, setDone] = useState<number | false>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [, force] = useReducer((x: number) => x + 1, 0);

  const target = snip.code;
  const correct = useMemo(() => {
    let n = 0;
    for (let i = 0; i < typed.length && i < target.length; i++) if (typed[i] === target[i]) n++;
    return n;
  }, [typed, target]);

  const elapsed = start && !done ? (Date.now() - start) / 1000 : start && done ? (done - start) / 1000 : 0;
  const wpm = elapsed > 0 ? Math.round((correct / 5) / (elapsed / 60)) : 0;
  const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;

  useEffect(() => {
    if (!start || done) return;
    const i = setInterval(force, 200);
    return () => clearInterval(i);
  }, [start, done]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (!start) setStart(Date.now());
    setTyped(v);
    if (v === target) {
      const ts = Date.now();
      setDone(ts);
      const t = start ? (ts - start) / 1000 : 0;
      if (t > 0) saveHighScore("type", Math.round((target.length / 5) / (t / 60)));
    }
  };

  const reset = (newIdx?: number) => {
    const ni = newIdx ?? (idx + 1) % SNIPPETS.length;
    setIdx(ni); setTyped(""); setStart(null); setDone(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div>
      <div className="lyric-meta">
        <span>LANG: <b>{snip.lang}</b></span>
        <span>LEN: <b>{target.length} CHARS</b></span>
      </div>
      <pre className="typing-source" onClick={() => inputRef.current?.focus()}>
        {target.split("").map((ch, i) => {
          const t = typed[i];
          let cls = "pend";
          if (t != null) cls = t === ch ? "ok" : "bad";
          if (i === typed.length) cls = "cur";
          let render = ch;
          if (cls === "bad" && ch === " ") render = "·";
          if (cls === "bad" && ch === "\n") render = "↵\n";
          return <span key={i} className={cls}>{render}</span>;
        })}
      </pre>
      <textarea ref={inputRef} value={typed} onChange={onChange} spellCheck={false} autoFocus
        style={{ width: "100%", minHeight: 80, padding: "12px 14px", fontFamily: "JetBrains Mono, monospace", fontSize: 14, lineHeight: 1.6, border: "1px solid var(--ink)", background: "var(--paper)", color: "var(--ink)", outline: "none", resize: "vertical" }}
        placeholder="start typing…" disabled={!!done} />
      <div className="typing-controls">
        <div className="typing-stats" style={{ flex: 1 }}>
          <span>WPM<b>{wpm}</b></span>
          <span>ACC<b>{acc}%</b></span>
          <span>TIME<b>{elapsed.toFixed(1)}s</b></span>
          {done && <span style={{ color: "var(--accent)", alignSelf: "center", letterSpacing: "0.16em" }}>★ COMPLETE</span>}
        </div>
        <button className="btn ghost" onClick={() => reset()}>Next snippet ▸</button>
        <button className="btn" onClick={() => reset(idx)}>Retry</button>
      </div>
    </div>
  );
}
