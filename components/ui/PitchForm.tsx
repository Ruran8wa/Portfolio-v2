"use client";
import { useState, useRef, useEffect } from "react";

export default function PitchForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [state, setState] = useState<"open" | "saved" | "error">("open");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    setTimeout(() => emailRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || !idea.trim()) { setState("error"); return; }
    const subject = encodeURIComponent(`Pitch idea from ${email.trim()}`);
    const body = encodeURIComponent(`From: ${email.trim()}\n\n${idea.trim()}`);
    window.open(`mailto:princerurangwa01@gmail.com?subject=${subject}&body=${body}`);
    setState("saved");
  };

  return (
    <div className="pitch-modal-backdrop" onClick={onClose}>
      <div className="pitch-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pitch-modal-x" onClick={onClose} aria-label="close">✕</button>

        {state !== "saved" && (
          <form onSubmit={submit}>
            <div className="pitch-eyebrow">— pitch form</div>
            <h3 className="pitch-modal-title">What should I <em>build?</em></h3>
            <p className="pitch-modal-sub">Drop your email and the idea. I read all of them. I might even build yours.</p>
            <label className="pf-label">
              <span>your email</span>
              <input ref={emailRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@somewhere.com" required />
            </label>
            <label className="pf-label">
              <span>the idea</span>
              <textarea value={idea} onChange={(e) => setIdea(e.target.value)}
                placeholder="One-liner is fine. Or go long — bullet points work." rows={5} required />
            </label>
            {state === "error" && <div className="pf-error">add an email and an idea, then send.</div>}
            <div className="pf-actions">
              <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn">Send it →</button>
            </div>
          </form>
        )}

        {state === "saved" && (
          <div>
            <div className="pitch-eyebrow">— saved</div>
            <h3 className="pitch-modal-title">Got it. <em>I&apos;ll take a look.</em></h3>
            <p className="pitch-modal-sub">Your idea has been saved to the project. I&apos;ll get to it.</p>
            <div className="pf-actions">
              <button type="button" className="btn" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
