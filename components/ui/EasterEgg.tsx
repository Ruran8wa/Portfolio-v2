"use client";
import { useState, useRef, useEffect } from "react";

interface EasterEggProps {
  label: string;
  list: string[];
  glyph?: string;
  side?: "top" | "bottom" | "left" | "right";
}

export default function EasterEgg({ label, list, glyph = "◆", side = "top" }: EasterEggProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <span className={`egg ${open ? "is-open" : ""}`} ref={ref}>
      <button type="button" className="egg-trigger" onClick={() => setOpen((o) => !o)}
        aria-label={`reveal ${label}`} aria-expanded={open} title="?">
        {glyph}
      </button>
      {open && (
        <span className={`egg-pop egg-pop-${side}`} role="dialog">
          <span className="egg-eyebrow">— {label}</span>
          <span className="egg-list">
            {list.map((x, i) => <span key={i} className="egg-item">· {x}</span>)}
          </span>
        </span>
      )}
    </span>
  );
}
