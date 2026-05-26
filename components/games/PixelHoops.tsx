"use client";
import { useState, useRef, useEffect } from "react";
import { saveHighScore } from "@/lib/gameUtils";

const W = 800, H = 400, HOOP_Y = 130, HOOP_R = 26, BASE_X = 640;

type Shot = { id: number; x: number; y: number; vx: number; vy: number; made: boolean; dead: boolean; counted: boolean; t: number; trail: { x: number; y: number }[] };

export default function PixelHoops() {
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [flash, setFlash] = useState<"swish" | null>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const [aimPower, setAimPower] = useState(0);
  const [aiming, setAiming] = useState(false);
  const [hoopX, setHoopX] = useState(BASE_X);
  const aimStartRef = useRef(0);
  const rafRef = useRef(0);
  const tStartRef = useRef(performance.now());
  const hoopXRef = useRef(BASE_X);
  const scoreRef = useRef(0);

  useEffect(() => { hoopXRef.current = hoopX; }, [hoopX]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const elapsed = now - tStartRef.current;
      const amplitude = Math.min(220, 60 + scoreRef.current * 18);
      const speed = 0.0008 + Math.min(0.0028, scoreRef.current * 0.0003);
      setHoopX(BASE_X + Math.sin(elapsed * speed) * amplitude * 0.7);
      setShots((prev) => prev.map((s) => {
        if (s.dead) return s;
        let nx = s.x + s.vx * dt, ny = s.y + s.vy * dt, vy = s.vy + 720 * dt;
        let made = s.made;
        if (!made && s.vy > 0 && Math.abs(nx - hoopXRef.current) < HOOP_R - 2 && Math.abs(ny - HOOP_Y) < 7) made = true;
        if (ny > H - 12) { ny = H - 12; vy = -vy * 0.5; if (Math.abs(vy) < 60) return { ...s, x: nx, y: ny, vy: 0, vx: s.vx * 0.6, dead: true, made }; }
        if (nx < 12 || nx > W - 12) return { ...s, dead: true, made };
        const trail = [...(s.trail.slice(-12)), { x: nx, y: ny }];
        return { ...s, x: nx, y: ny, vy, made, trail };
      }));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const dead = shots.filter((s) => s.dead && !s.counted);
    if (!dead.length) return;
    let madeAdd = 0; dead.forEach((s) => { if (s.made) madeAdd++; });
    if (madeAdd > 0) {
      setScore((p) => { const n = p + madeAdd; saveHighScore("hoop", n); return n; });
      setStreak((p) => { const n = p + madeAdd; setBestStreak((b) => Math.max(b, n)); return n; });
      setFlash("swish"); setTimeout(() => setFlash(null), 700);
    } else setStreak(0);
    setAttempts((a) => a + dead.length);
    setShots((prev) => prev.map((s) => s.dead && !s.counted ? { ...s, counted: true } : s));
    setTimeout(() => setShots((prev) => prev.filter((s) => !s.counted || Date.now() - s.t < 1200)), 50);
  }, [shots]);

  const onDown = () => {
    aimStartRef.current = Date.now(); setAiming(true);
    const grow = () => { setAimPower(Math.min(1, (Date.now() - aimStartRef.current) / 1200)); if (aimStartRef.current) requestAnimationFrame(grow); };
    grow();
  };
  const onUp = () => {
    if (!aiming) return; setAiming(false); aimStartRef.current = 0;
    const power = aimPower * 1000 + 200, angle = -Math.PI / 3.8;
    setShots((prev) => [...prev, { id: Math.random(), x: 130, y: 300, vx: Math.cos(angle) * power, vy: Math.sin(angle) * power, made: false, dead: false, counted: false, t: Date.now(), trail: [] }]);
    setAimPower(0);
  };

  const pct = attempts > 0 ? Math.round((score / attempts) * 100) : 0;

  return (
    <div>
      <div className="lyric-meta" style={{ marginBottom: 10 }}>
        <span>SCORE <b>{score}</b></span><span>ATT <b>{attempts}</b></span>
        <span>% <b>{pct}%</b></span><span>STREAK <b>{streak}{streak >= 3 ? " 🔥" : ""}</b></span>
        <span style={{ marginLeft: "auto" }}>HOLD to charge, RELEASE to shoot</span>
      </div>
      <div className="hoops-stage" style={{ height: H }} onMouseDown={onDown} onMouseUp={onUp} onMouseLeave={onUp} onTouchStart={onDown} onTouchEnd={onUp}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: "var(--ink)" }} />
        <div style={{ position: "absolute", left: hoopX + HOOP_R, top: HOOP_Y - 4, width: 4, height: H - HOOP_Y - 8, background: "var(--ink)", transition: "left 0.04s linear" }} />
        <div style={{ position: "absolute", left: hoopX + HOOP_R, top: HOOP_Y - 60, width: 6, height: 70, background: "var(--ink-soft)", transition: "left 0.04s linear" }} />
        <div style={{ position: "absolute", left: hoopX - HOOP_R, top: HOOP_Y, width: HOOP_R * 2, height: 4, background: "var(--accent)", borderRadius: 2, boxShadow: flash === "swish" ? "0 0 24px var(--accent)" : "none", transition: "left 0.04s linear" }} />
        <svg width={HOOP_R * 2} height={28} style={{ position: "absolute", left: hoopX - HOOP_R, top: HOOP_Y + 4, transition: "left 0.04s linear" }}>
          <path d={`M0 0 L${HOOP_R} 28 L${HOOP_R * 2} 0`} stroke="var(--ink)" fill="none" strokeWidth="1" opacity="0.6" />
          <path d={`M6 0 L${HOOP_R} 26 L${HOOP_R * 2 - 6} 0`} stroke="var(--ink)" fill="none" strokeWidth="1" opacity="0.5" />
        </svg>
        <div style={{ position: "absolute", left: 116, top: 286, width: 28, height: 28, background: "var(--ink)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", left: 112, top: 314, width: 36, height: 50, background: "var(--ink-soft)" }} />
        {aiming && (
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
            {Array.from({ length: 22 }, (_, i) => {
              const t = (i + 1) * 0.06, power = aimPower * 1000 + 200, angle = -Math.PI / 3.8;
              return <circle key={i} cx={130 + Math.cos(angle) * power * t} cy={300 + Math.sin(angle) * power * t + 0.5 * 720 * t * t} r={2} fill="var(--accent)" opacity={1 - i / 24} />;
            })}
          </svg>
        )}
        {aiming && (
          <div style={{ position: "absolute", left: 14, bottom: 14, width: 220, height: 10, background: "var(--paper)", border: "1px solid var(--ink)" }}>
            <div style={{ width: aimPower * 100 + "%", height: "100%", background: "var(--accent)" }} />
          </div>
        )}
        {flash === "swish" && <div className="hoop-flash">SWISH!</div>}
        {shots.map((s) => (
          <div key={s.id}>
            {s.trail.map((p, i) => <div key={i} style={{ position: "absolute", left: p.x - 3, top: p.y - 3, width: 6, height: 6, background: "var(--accent)", borderRadius: "50%", opacity: (i + 1) / (s.trail.length + 2) * 0.5, pointerEvents: "none" }} />)}
            <div style={{ position: "absolute", left: s.x - 10, top: s.y - 10, width: 20, height: 20, background: s.made ? "#0a7a30" : "var(--accent)", borderRadius: "50%", border: "1.5px solid var(--ink)" }} />
          </div>
        ))}
      </div>
      <div className="typing-controls" style={{ marginTop: 14 }}>
        <button className="btn ghost" onClick={() => { setScore(0); setAttempts(0); setStreak(0); setBestStreak(0); setShots([]); }}>Reset</button>
        <span style={{ fontSize: 11, color: "var(--ink-soft)", letterSpacing: "0.1em" }}>
          best streak: {bestStreak} · {score >= 10 ? "★ you got hops" : score >= 5 ? "warming up" : "fav sport irl"}
        </span>
      </div>
    </div>
  );
}
