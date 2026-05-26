"use client";
import { useState } from "react";
import { saveHighScore } from "@/lib/gameUtils";

const LYRICS = [
  { line: "Is this the real life? Is this just",     answer: "fantasy",    accept: [],                    artist: "Queen",            song: "Bohemian Rhapsody" },
  { line: "Hello from the other",                    answer: "side",       accept: [],                    artist: "Adele",            song: "Hello" },
  { line: "Sweet dreams are made of",                answer: "this",       accept: [],                    artist: "Eurythmics",       song: "Sweet Dreams" },
  { line: "Just a small town girl, living in a lonely", answer: "world",   accept: [],                    artist: "Journey",          song: "Don't Stop Believin'" },
  { line: "I will always love",                      answer: "you",        accept: [],                    artist: "Whitney Houston",  song: "I Will Always Love You" },
  { line: "Rolling in the",                          answer: "deep",       accept: [],                    artist: "Adele",            song: "Rolling in the Deep" },
  { line: "We found love in a hopeless",             answer: "place",      accept: [],                    artist: "Rihanna",          song: "We Found Love" },
  { line: "Somebody that I used to",                 answer: "know",       accept: [],                    artist: "Gotye",            song: "Somebody That I Used to Know" },
  { line: "Never gonna give you up, never gonna let you", answer: "down",  accept: [],                    artist: "Rick Astley",      song: "Never Gonna Give You Up" },
  { line: "What is love? Baby don't hurt",           answer: "me",         accept: [],                    artist: "Haddaway",         song: "What Is Love" },
  { line: "Hit me baby one more",                    answer: "time",       accept: [],                    artist: "Britney Spears",   song: "...Baby One More Time" },
  { line: "Somewhere over the",                      answer: "rainbow",    accept: [],                    artist: "Judy Garland",     song: "Over the Rainbow" },
  { line: "Every breath you take, every move you",   answer: "make",       accept: [],                    artist: "The Police",       song: "Every Breath You Take" },
  { line: "Don't you forget about",                  answer: "me",         accept: [],                    artist: "Simple Minds",     song: "Don't You (Forget About Me)" },
  { line: "I want it that",                          answer: "way",        accept: [],                    artist: "Backstreet Boys",  song: "I Want It That Way" },
];

function norm(s: string) {
  return String(s).toLowerCase().replace(/[^a-z' ]/g, "").replace(/\s+/g, " ").trim();
}

function shuffleIdx(n: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LyricFinish() {
  const [order] = useState(() => shuffleIdx(LYRICS.length));
  const [pos, setPos] = useState(0);
  const [guess, setGuess] = useState("");
  const [state, setState] = useState<"open" | "won" | "miss" | "gave-up">("open");
  const [score, setScore] = useState(0);

  const item = LYRICS[order[pos % LYRICS.length]];
  const accept = item.accept.length ? [item.answer, ...item.accept] : [item.answer];

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const g = norm(guess);
    if (!g) return;
    if (accept.some((a) => norm(a) === g)) {
      const next = score + 1;
      setScore(next);
      setState("won");
      saveHighScore("lyric", next);
    } else {
      setState("miss");
      setTimeout(() => setState("open"), 700);
    }
  };

  const next = () => { setPos((p) => p + 1); setGuess(""); setState("open"); };

  return (
    <div>
      <div className="lyric-meta">
        <span>ROUND <b>{(pos % LYRICS.length) + 1} / {LYRICS.length}</b></span>
        <span>SCORE <b>{score}</b></span>
        <span style={{ marginLeft: "auto" }}>finish the lyric</span>
      </div>

      <div className="lyric-card" style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: 28 }}>
          {item.line}
        </span>
        <span className="lf-blank">
          {state === "won" || state === "gave-up" ? item.answer : "_____"}
        </span>
      </div>

      <form onSubmit={submit}>
        <input
          className="lyric-input"
          placeholder="complete the lyric…"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          autoFocus
          disabled={state === "won" || state === "gave-up"}
        />
      </form>

      <div className={`lyric-feedback ${state === "won" ? "ok" : state === "miss" ? "bad" : ""}`}>
        {state === "won"     && <>✓ &ldquo;{item.line} {item.answer}&rdquo; — {item.artist}, <em>{item.song}</em> (+1)</>}
        {state === "miss"    && <>✗ not quite, try again…</>}
        {state === "gave-up" && <>↳ &ldquo;{item.answer}&rdquo; — {item.artist}, <em>{item.song}</em></>}
        {state === "open"    && <>&nbsp;</>}
      </div>

      <div className="typing-controls">
        {state === "open"    && <button type="button" className="btn ghost" onClick={() => setState("gave-up")}>Give up</button>}
        {state === "open"    && <button type="button" className="btn" onClick={submit}>Guess →</button>}
        {(state === "won" || state === "gave-up") && <button type="button" className="btn" onClick={next}>Next lyric ▸</button>}
      </div>
    </div>
  );
}
