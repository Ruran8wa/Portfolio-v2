"use client";

type Palette = "blueprint" | "terminal";

const TABS = [
  { k: "home", label: "Home" },
  { k: "work", label: "Work" },
  { k: "about", label: "About" },
];

interface Props {
  tab: string;
  onTab: (t: string) => void;
  palette: Palette;
  onTogglePalette: () => void;
}

export default function Nav({ tab, onTab, palette, onTogglePalette }: Props) {
  return (
    <nav className="nav">
      <button className="nav-mark" onClick={() => onTab("home")}>ruran8wa</button>

      <div className="nav-tabs">
        {TABS.map((t) => (
          <button
            key={t.k}
            className="nav-tab"
            data-active={tab === t.k ? "1" : "0"}
            onClick={() => onTab(t.k)}
          >
            {t.label}
          </button>
        ))}
        <button
          className="nav-egg"
          data-active={tab === "play" ? "1" : "0"}
          onClick={() => onTab("play")}
          title="play"
          aria-label="Open arcade"
        >
          ◆
        </button>
      </div>

      <div className="nav-right">
        <button
          className="nav-theme-toggle"
          onClick={onTogglePalette}
          title={`Switch to ${palette === "blueprint" ? "terminal" : "blueprint"}`}
          aria-label="Toggle theme"
        >
          <span className="ntt-dot" data-palette="blueprint" data-active={palette === "blueprint" ? "1" : "0"} />
          <span className="ntt-dot" data-palette="terminal"  data-active={palette === "terminal"  ? "1" : "0"} />
        </button>
        <a className="nav-resume" href="/resume" target="_blank" rel="noreferrer">[ RESUME ]</a>
      </div>
    </nav>
  );
}
