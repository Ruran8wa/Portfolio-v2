"use client";
import { useState, useEffect } from "react";
import HalftoneBlob from "@/components/effects/HalftoneBlob";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HomeScreen from "@/components/screens/HomeScreen";
import WorkScreen from "@/components/screens/WorkScreen";
import PlayScreen from "@/components/screens/PlayScreen";
import AboutScreen from "@/components/screens/AboutScreen";

type Palette = "blueprint" | "terminal";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
const STORAGE_KEY = "portfolio-palette-v3";

export default function App() {
  const [tab, setTab] = useState("home");
  const [palette, setPalette] = useState<Palette>("blueprint");
  const [konamiBanner, setKonamiBanner] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Palette | null;
      if (saved === "blueprint" || saved === "terminal") setPalette(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-palette", palette);
    try { localStorage.setItem(STORAGE_KEY, palette); } catch {}
  }, [palette]);

  const togglePalette = () =>
    setPalette((p) => (p === "blueprint" ? "terminal" : "blueprint"));

  useEffect(() => {
    let seq: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      seq = [...seq.slice(-(KONAMI.length - 1)), e.key];
      if (seq.join(",") === KONAMI.join(",")) {
        setPalette("terminal");
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
      <HalftoneBlob />
      <div className="grain" />
      {konamiBanner && (
        <div className="unlocked-badge">★ terminal palette unlocked</div>
      )}
      <div className="app">
        <Nav tab={tab} onTab={setTab} palette={palette} onTogglePalette={togglePalette} />
        {screens[tab]}
        <Footer onTab={setTab} />
      </div>
    </>
  );
}
