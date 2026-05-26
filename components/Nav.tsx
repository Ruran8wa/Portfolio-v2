"use client";

const TABS = [
  { k: "home", label: "Home" },
  { k: "work", label: "Work" },
  { k: "about", label: "About" },
];

export default function Nav({ tab, onTab }: { tab: string; onTab: (t: string) => void }) {
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

      <a
        className="nav-resume"
        href="/resume"
        target="_blank"
        rel="noreferrer"
      >
        [ RESUME ]
      </a>
    </nav>
  );
}
