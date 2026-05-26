"use client";
import { useState, useEffect } from "react";
import Reveal from "@/components/effects/Reveal";
import { getHighScores } from "@/lib/gameUtils";
import TypeSprint from "@/components/games/TypeSprint";
import MovieCharades from "@/components/games/MovieCharades";
import LyricFinish from "@/components/games/LyricFinish";
import Reaction from "@/components/games/Reaction";
import PixelHoops from "@/components/games/PixelHoops";
import NumberMemory from "@/components/games/NumberMemory";
import ColorSimon from "@/components/games/ColorSimon";
import WordFlash from "@/components/games/WordFlash";
import AimTrainer from "@/components/games/AimTrainer";
import SnakeGame from "@/components/games/SnakeGame";

const CARTRIDGES = [
  { k: "type",  no: "01", code: "TYPE", name: "Code Sprint",    hint: "how fast can you type real code?" },
  { k: "movie", no: "02", code: "MOVI", name: "Movie Charades", hint: "guess the film from my description." },
  { k: "lyric", no: "03", code: "LYRC", name: "Lyric Finish",   hint: "complete the famous song title." },
  { k: "react", no: "04", code: "RXN",  name: "Reaction Time",  hint: "click when it turns green." },
  { k: "hoop",  no: "05", code: "HOOP", name: "Pixel Hoops",    hint: "free-throw, hold to charge." },
  { k: "num",   no: "06", code: "NUMS", name: "Number Memory",  hint: "recall the digit at position N." },
  { k: "simon", no: "07", code: "SIMN", name: "Color Simon",    hint: "repeat the colour sequence." },
  { k: "flash", no: "08", code: "FLSH", name: "Word Flash",     hint: "words blink past — recall one." },
  { k: "aim",   no: "09", code: "AIM",  name: "Aim Trainer",    hint: "click targets before they fade." },
  { k: "snake", no: "10", code: "SNAK", name: "Snake",          hint: "classic. don't bite yourself." },
];

const GAME_MAP: Record<string, React.ReactNode> = {
  type:  <TypeSprint />,
  movie: <MovieCharades />,
  lyric: <LyricFinish />,
  react: <Reaction />,
  hoop:  <PixelHoops />,
  num:   <NumberMemory />,
  simon: <ColorSimon />,
  flash: <WordFlash />,
  aim:   <AimTrainer />,
  snake: <SnakeGame />,
};

export default function PlayScreen() {
  const [active, setActive] = useState<string | null>(null);
  const [highs, setHighs] = useState<Record<string, number>>({});

  useEffect(() => {
    setHighs(getHighScores());
    const sync = () => setHighs(getHighScores());
    window.addEventListener("arcade-score", sync);
    return () => window.removeEventListener("arcade-score", sync);
  }, []);

  const current = CARTRIDGES.find((c) => c.k === active);

  return (
    <section className="section play" data-screen-label="03 Play">
      <Reveal>
        <div className="play-cab">
          <div className="play-cab-bezel">
            <div className="play-cab-row">
              <div className="play-cab-eyebrow">★ NICE — YOU FOUND THE ARCADE</div>
              <div className="play-cab-blink">▮ PLAYER 1 READY</div>
            </div>
            <h2 className="play-cab-title">
              <span className="play-cab-glyph">◆</span>
              <span>Insert coin.</span>
            </h2>
            <p className="play-cab-sub">
              Ten cartridges loaded. Pick one, play, beat your high score.
              These are real games, embedded right here — same site, no new tab.
            </p>
          </div>

          <div className="cartridge-grid">
            {CARTRIDGES.map((c) => (
              <button key={c.k} className="cartridge" data-active={active === c.k ? "1" : "0"}
                onClick={() => setActive(active === c.k ? null : c.k)}>
                <span className="cart-no">{c.no}</span>
                <span className="cart-code">{c.code}</span>
                <span className="cart-name">{c.name}</span>
                <span className="cart-hint">{c.hint}</span>
                <span className="cart-high">{highs[c.k] ? `HI ${highs[c.k]}` : "— — —"}</span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {current && (
        <Reveal key={current.k} delay={100}>
          <div className="game-screen">
            <div className="game-screen-chrome">
              <div className="gsc-left">
                <span className="gsc-dot" />
                <span>NOW PLAYING / {current.code}</span>
              </div>
              <div className="gsc-right">
                <button className="gsc-close" onClick={() => setActive(null)}>× close</button>
              </div>
            </div>
            <div className="game-screen-frame">
              <div className="game-frame">
                {GAME_MAP[current.k]}
              </div>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
