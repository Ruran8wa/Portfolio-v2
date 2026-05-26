"use client";
import { useState, useEffect } from "react";
import HalftoneBlob from "@/components/effects/HalftoneBlob";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HomeScreen from "@/components/screens/HomeScreen";
import WorkScreen from "@/components/screens/WorkScreen";
import PlayScreen from "@/components/screens/PlayScreen";
import AboutScreen from "@/components/screens/AboutScreen";

type Palette = "acid" | "mono" | "sunset" | "plasma" | "blueprint" | "terminal";

interface Tweaks {
  palette: Palette;
  halftone: boolean;
  grain: boolean;
}

type SetTweak = <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => void;

const DEFAULTS: Tweaks = { palette: "blueprint", halftone: true, grain: true };
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

function useTweaks(defaults: Tweaks): [Tweaks, SetTweak] {
  const [t, setT] = useState<Tweaks>(defaults);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio-tweaks-v2");
      if (saved) setT((prev) => ({ ...prev, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  const setTweak: SetTweak = (k, v) => {
    setT((prev) => {
      const next = { ...prev, [k]: v };
      try { localStorage.setItem("portfolio-tweaks-v2", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return [t, setTweak];
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [tweaks, setTweak] = useTweaks(DEFAULTS);
  const [konamiBanner, setKonamiBanner] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-palette", tweaks.palette);
  }, [tweaks.palette]);

  useEffect(() => {
    let seq: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      seq = [...seq.slice(-(KONAMI.length - 1)), e.key];
      if (seq.join(",") === KONAMI.join(",")) {
        setTweak("palette", "terminal");
        setKonamiBanner(true);
        setTimeout(() => setKonamiBanner(false), 2800);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [tab]);

  const screens: Record<string, React.ReactNode> = {
    home:  <HomeScreen onTab={setTab} />,
    work:  <WorkScreen />,
    play:  <PlayScreen />,
    about: <AboutScreen />,
  };

  return (
    <>
      {tweaks.halftone && <HalftoneBlob />}
      {tweaks.grain && <div className="grain" />}
      {konamiBanner && (
        <div className="unlocked-badge">★ terminal palette unlocked</div>
      )}
      <div className="app">
        <Nav tab={tab} onTab={setTab} />
        {screens[tab]}
        <Footer onTab={setTab} tweaks={tweaks} setTweak={setTweak} />
      </div>
    </>
  );
}
