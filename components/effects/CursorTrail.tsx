"use client";
import { useEffect, useRef } from "react";

export default function CursorTrail({ enabled = true }: { enabled?: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<{ el: HTMLDivElement; x: number; y: number }[]>([]);
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("trail-on");
      return;
    }
    document.body.classList.add("trail-on");

    const trail: { el: HTMLDivElement; x: number; y: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const el = document.createElement("div");
      el.className = "cursor-trail";
      el.style.opacity = String(0.5 - i * 0.07);
      el.style.width = 6 - i * 0.6 + "px";
      el.style.height = 6 - i * 0.6 + "px";
      document.body.appendChild(el);
      trail.push({ el, x: -100, y: -100 });
    }
    trailRef.current = trail;

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
        const t = e.target as Element;
        dotRef.current.classList.toggle("hot", !!t?.closest?.("a, button, [data-hot]"));
      }
    };
    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      trail.forEach((t) => (t.el.style.opacity = "0"));
    };
    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = "";
      trail.forEach((t, i) => (t.el.style.opacity = String(0.5 - i * 0.07)));
    };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    const tick = () => {
      let px = targetRef.current.x, py = targetRef.current.y;
      trail.forEach((t, i) => {
        t.x += (px - t.x) * (0.32 - i * 0.03);
        t.y += (py - t.y) * (0.32 - i * 0.03);
        t.el.style.left = t.x + "px";
        t.el.style.top = t.y + "px";
        px = t.x; py = t.y;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      trail.forEach((t) => t.el.remove());
      document.body.classList.remove("trail-on");
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={dotRef} className="cursor-dot" />;
}
