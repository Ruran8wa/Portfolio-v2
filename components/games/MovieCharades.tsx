"use client";
import { useState } from "react";
import { saveHighScore } from "@/lib/gameUtils";

const MOVIES = [
  { clue: "A young girl is trapped in a bathhouse for spirits and has to remember her own name before it's eaten by witchcraft. There is a no-face, a dragon-boy, and a lot of soap.", answer: "spirited away", accept: ["spirited away"], meta: "Miyazaki · 2001", hint: "Studio Ghibli." },
  { clue: "A jazz drummer is psychologically destroyed by a conducting professor who throws chairs and tells him he is not yet his tempo.", answer: "whiplash", accept: ["whiplash"], meta: "Chazelle · 2014", hint: "Caravan." },
  { clue: "A linguist is recruited to talk to squid-shaped aliens whose written language is a single, time-bending circle.", answer: "arrival", accept: ["arrival"], meta: "Villeneuve · 2016", hint: "Heptapods." },
  { clue: "Two ex-lovers undergo a brain procedure to erase each other from their memories — and spend most of the film trying to outrun it.", answer: "eternal sunshine of the spotless mind", accept: ["eternal sunshine", "eternal sunshine of the spotless mind"], meta: "Gondry · 2004", hint: "Kaufman screenplay." },
  { clue: "A wedge-shaped pastel hotel in a fictional European country is run by a flamboyant concierge whose protégé inherits a painting and several problems.", answer: "the grand budapest hotel", accept: ["grand budapest hotel", "the grand budapest hotel"], meta: "Anderson · 2014", hint: "Pink. Symmetrical." },
  { clue: "A poor family slowly replaces the staff of a rich family one con at a time, until a basement door changes everything.", answer: "parasite", accept: ["parasite", "기생충"], meta: "Bong · 2019", hint: "Best Picture, 2020." },
  { clue: "A man with no short-term memory hunts his wife's killer using polaroid notes and tattoos. The story plays backwards.", answer: "memento", accept: ["memento"], meta: "Nolan · 2000", hint: "Don't trust your own writing." },
  { clue: "Astronauts on a rescue mission fall through a higher-dimensional bookshelf inside a black hole. There is a love-as-force argument.", answer: "interstellar", accept: ["interstellar"], meta: "Nolan · 2014", hint: "Cornfields, then space." },
];

function norm(s: string) { return s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim(); }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr.map((_, i) => i)];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a as unknown as T[];
}

export default function MovieCharades() {
  const [order] = useState(() => shuffle(MOVIES));
  const [pos, setPos] = useState(0);
  const [guess, setGuess] = useState("");
  const [state, setState] = useState<"open" | "won" | "miss" | "gave-up">("open");
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const film = MOVIES[(order as unknown as number[])[pos % MOVIES.length]];

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const g = norm(guess);
    if (!g) return;
    const hit = film.accept.some((a) => { const na = norm(a); return na === g || g.includes(na) || na.includes(g); });
    if (hit) {
      const next = score + (showHint ? 1 : 2);
      setScore(next); setState("won"); saveHighScore("movie", next);
    } else { setState("miss"); setTimeout(() => setState("open"), 800); }
  };

  const next = () => { setPos((p) => p + 1); setGuess(""); setState("open"); setShowHint(false); };

  return (
    <div>
      <div className="lyric-meta">
        <span>ROUND <b>{(pos % MOVIES.length) + 1} / {MOVIES.length}</b></span>
        <span>SCORE <b>{score}</b></span>
        <span style={{ marginLeft: "auto" }}>(my own descriptions)</span>
      </div>
      <div className="lyric-card">&ldquo;{film.clue}&rdquo;</div>
      <form onSubmit={submit}>
        <input className="lyric-input" placeholder="name that film…" value={guess}
          onChange={(e) => setGuess(e.target.value)} autoFocus disabled={state === "won" || state === "gave-up"} />
      </form>
      <div className={`lyric-feedback ${state === "won" ? "ok" : state === "miss" ? "bad" : ""}`}>
        {state === "won"     && <>✓ correct — &ldquo;{film.answer}&rdquo; · {film.meta} (+{showHint ? 1 : 2})</>}
        {state === "miss"    && <>✗ not quite, try again…</>}
        {state === "gave-up" && <>↳ &ldquo;{film.answer}&rdquo; · {film.meta}</>}
        {state === "open" && showHint && <>hint: {film.hint}</>}
        {state === "open" && !showHint && <>&nbsp;</>}
      </div>
      <div className="typing-controls">
        {state === "open" && !showHint && <button type="button" className="btn ghost" onClick={() => setShowHint(true)}>Hint</button>}
        {state === "open" && <button type="button" className="btn ghost" onClick={() => setState("gave-up")}>Give up</button>}
        {state === "open" && <button type="button" className="btn" onClick={submit}>Guess →</button>}
        {(state === "won" || state === "gave-up") && <button type="button" className="btn" onClick={next}>Next film ▸</button>}
      </div>
    </div>
  );
}
