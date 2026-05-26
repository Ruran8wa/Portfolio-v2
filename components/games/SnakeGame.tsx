"use client";
import { useState, useRef, useEffect } from "react";
import { saveHighScore } from "@/lib/gameUtils";

const COLS = 22, ROWS = 14;
type Pt = { x: number; y: number };

export default function SnakeGame() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [snake, setSnake] = useState<Pt[]>([{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }]);
  const [dir, setDir] = useState<Pt>({ x: 1, y: 0 });
  const dirRef = useRef<Pt>({ x: 1, y: 0 });
  const [food, setFood] = useState<Pt>({ x: 14, y: 7 });
  const [alive, setAlive] = useState(true);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(140);
  const aliveRef = useRef(true);
  const foodRef = useRef<Pt>({ x: 14, y: 7 });

  useEffect(() => { aliveRef.current = alive; }, [alive]);
  useEffect(() => { dirRef.current = dir; }, [dir]);
  useEffect(() => { foodRef.current = food; }, [food]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = dirRef.current;
      const map: Record<string, Pt> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      };
      const nd = map[e.key];
      if (nd && !(d.x === -nd.x && d.y === -nd.y)) { setDir(nd); e.preventDefault(); }
      if (e.key === " ") { setPaused((p) => !p); e.preventDefault(); }
    };
    const stage = stageRef.current;
    stage?.addEventListener("keydown", onKey);
    return () => stage?.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!alive || paused) return;
    const id = setInterval(() => {
      setSnake((prev) => {
        const d = dirRef.current;
        const head = prev[0];
        const nx = head.x + d.x, ny = head.y + d.y;
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) { setAlive(false); return prev; }
        if (prev.some((s) => s.x === nx && s.y === ny)) { setAlive(false); return prev; }
        const f = foodRef.current;
        const ate = f.x === nx && f.y === ny;
        const next = [{ x: nx, y: ny }, ...prev];
        if (!ate) next.pop();
        else {
          let nf: Pt;
          do { nf = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
          while (next.some((s) => s.x === nf.x && s.y === nf.y));
          setFood(nf);
          setScore((s) => { const ns = s + 1; saveHighScore("snake", ns); return ns; });
          setSpeed((sp) => Math.max(70, sp - 4));
        }
        return next;
      });
    }, speed);
    return () => clearInterval(id);
  }, [alive, paused, speed]);

  const reset = () => {
    const start = [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }];
    setSnake(start); setDir({ x: 1, y: 0 }); dirRef.current = { x: 1, y: 0 };
    setFood({ x: 14, y: 7 }); setAlive(true); setPaused(false); setScore(0); setSpeed(140);
    setTimeout(() => stageRef.current?.focus(), 30);
  };

  return (
    <div>
      <div className="lyric-meta">
        <span>SCORE <b>{score}</b></span>
        <span>LEN <b>{snake.length}</b></span>
        <span>SPEED <b>{Math.round((140 / speed) * 100) / 100}×</b></span>
        <span style={{ marginLeft: "auto" }}>arrow keys · space = pause</span>
      </div>
      <div ref={stageRef} className="snake-stage" tabIndex={0} onClick={() => stageRef.current?.focus()}
        style={{ "--cols": COLS, "--rows": ROWS, aspectRatio: `${COLS} / ${ROWS}` } as React.CSSProperties}>
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const x = i % COLS, y = Math.floor(i / COLS);
          const segIdx = snake.findIndex((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;
          let cls = "snk-cell";
          if (segIdx === 0) cls += " snk-head";
          else if (segIdx > 0) cls += " snk-body";
          else if (isFood) cls += " snk-food";
          return <div key={i} className={cls} />;
        })}
        {!alive && (
          <div className="snake-overlay">
            <div className="snake-over">GAME OVER</div>
            <div className="snake-over-sub">final length · {snake.length}</div>
            <button className="btn" onClick={reset} style={{ marginTop: 14 }}>New game →</button>
          </div>
        )}
        {paused && alive && (
          <div className="snake-overlay">
            <div className="snake-over">PAUSED</div>
            <div className="snake-over-sub">press space to resume</div>
          </div>
        )}
      </div>
    </div>
  );
}
