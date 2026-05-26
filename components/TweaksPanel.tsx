"use client";
import { useState } from "react";

type Palette = "acid" | "mono" | "sunset" | "plasma" | "blueprint" | "terminal";

interface Tweaks {
  palette: Palette;
  halftone: boolean;
  grain: boolean;
}

type SetTweak = <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => void;

interface Props {
  tweaks: Tweaks;
  setTweak: SetTweak;
}

// Positions 1, 3, 5 (acid, sunset, blueprint) show their dark ink color
const PALETTES: { k: Palette; bg: string; ink: string; label: string }[] = [
  { k: "acid",      bg: "#0d1230", ink: "#f4f6c7", label: "Acid" },
  { k: "mono",      bg: "#f3f1ec", ink: "#0a0a0a", label: "Mono" },
  { k: "sunset",    bg: "#2a0e07", ink: "#ffe4c8", label: "Sunset" },
  { k: "plasma",    bg: "#f5d4ee", ink: "#1a0024", label: "Plasma" },
  { k: "blueprint", bg: "#0c1d3a", ink: "#e8f2ff", label: "Blueprint" },
  { k: "terminal",  bg: "#0e1a10", ink: "#cfffd0", label: "Terminal" },
];

const DARK_PALETTES: Palette[] = ["blueprint", "terminal"];

const EFFECTS: { k: "halftone" | "grain"; label: string }[] = [
  { k: "halftone", label: "halftone blob" },
  { k: "grain",    label: "film grain" },
];

export default function TweaksPanel({ tweaks, setTweak }: Props) {
  const [open, setOpen] = useState(false);

  const handlePalette = (p: Palette) => {
    setTweak("palette", p);
    setTweak("halftone", DARK_PALETTES.includes(p));
  };

  return (
    <div className="tweaks-panel">
      {open && (
        <div className="tweaks-body">
          <div>
            <div className="tweaks-section-label">palette</div>
            <div className="palette-swatches">
              {PALETTES.map((p) => (
                <button
                  key={p.k}
                  className="palette-swatch"
                  data-active={tweaks.palette === p.k ? "1" : "0"}
                  style={{ background: p.bg, color: p.ink }}
                  title={p.label}
                  onClick={() => handlePalette(p.k)}
                  aria-label={p.label}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="tweaks-section-label">effects</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {EFFECTS.map((e) => (
                <label key={e.k} className="tweaks-toggle-row" style={{ cursor: "pointer" }}>
                  <span>{e.label}</span>
                  <input
                    type="checkbox"
                    className="tweaks-switch"
                    checked={tweaks[e.k] as boolean}
                    onChange={(ev) => setTweak(e.k, ev.target.checked)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
      <button className="tweaks-toggle" onClick={() => setOpen((o) => !o)}>
        {open ? "× close" : "◈ tweak"}
      </button>
    </div>
  );
}
