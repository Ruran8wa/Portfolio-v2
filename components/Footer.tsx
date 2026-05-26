"use client";
import { useState } from "react";
import TweaksPanel from "@/components/TweaksPanel";

type Palette = "acid" | "mono" | "sunset" | "plasma" | "blueprint" | "terminal";

interface Tweaks {
  palette: Palette;
  halftone: boolean;
  grain: boolean;
}

type SetTweak = <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => void;

const KONAMI_HINT = ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"];

interface Props {
  onTab: (t: string) => void;
  tweaks: Tweaks;
  setTweak: SetTweak;
}

export default function Footer({ onTab, tweaks, setTweak }: Props) {
  const [hint, setHint] = useState(false);

  return (
    <footer className="foot">
      <div className="foot-left">
        <div className="foot-name" onClick={() => onTab("home")} style={{ cursor: "pointer" }}>
          ruran8wa
        </div>
        <div className="foot-meta">
          Prince Rurangwa · Software engineer<br />
          Kigali, Rwanda / remote · © 2026
        </div>
        <div className="foot-egg" onClick={() => setHint((h) => !h)} title="secret">
          {hint ? (
            <>
              try:{" "}
              {KONAMI_HINT.map((k, i) => (
                <code key={i}>{k}</code>
              ))}
            </>
          ) : (
            <span>— psst. there&apos;s a secret.</span>
          )}
        </div>
      </div>

      <div className="foot-links">
        <TweaksPanel tweaks={tweaks} setTweak={setTweak} />
        <a href="mailto:princerurangwa01@gmail.com">[ EMAIL ]</a>
        <a href="https://www.linkedin.com/in/prince-rurangwa/" target="_blank" rel="noreferrer">[ LINKEDIN ]</a>
        <a href="https://github.com/ruran8wa" target="_blank" rel="noreferrer">[ GITHUB ]</a>
        <a href="https://open.spotify.com/user/31kkqbierhoqns4f6hdpilkf3fby" target="_blank" rel="noreferrer">[ SPOTIFY ]</a>
      </div>
    </footer>
  );
}
