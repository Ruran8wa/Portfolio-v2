"use client";
import { useEffect, useRef } from "react";

export default function HalftoneBlob() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tx = 70, ty = 20, mx = 70, my = 20;
    let raf = 0;

    const onScroll = () => {
      const pct = Math.min(1, window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight));
      ty = 20 + pct * 70;
    };
    const onMouse = (e: MouseEvent) => { tx = 30 + (e.clientX / window.innerWidth) * 60; };
    const tick = () => {
      mx += (tx - mx) * 0.04;
      my += (ty - my) * 0.05;
      if (ref.current) {
        ref.current.style.setProperty("--blob-x", mx + "%");
        ref.current.style.setProperty("--blob-y", my + "%");
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <div ref={ref} className="halftone-blob" />;
}
