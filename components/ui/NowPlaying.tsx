"use client";
import { useState, useEffect } from "react";

type Track = { isPlaying: boolean; title: string; artist: string; songUrl?: string };

const MOCK: Track[] = [
  { isPlaying: true, title: "West Coast", artist: "Lana Del Rey" },
  { isPlaying: true, title: "Pyramids", artist: "Frank Ocean" },
  { isPlaying: true, title: "Redbone", artist: "Childish Gambino" },
  { isPlaying: true, title: "Cherry Wine", artist: "Hozier" },
  { isPlaying: true, title: "Bags", artist: "Clairo" },
];

export default function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [mockIdx, setMockIdx] = useState(() => Math.floor(Math.random() * MOCK.length));

  useEffect(() => {
    let alive = true;
    const fetchTrack = async () => {
      try {
        const res = await fetch("/api/spotify/now-playing");
        if (!res.ok) throw new Error();
        const data: Track & { error?: string } = await res.json();
        if (alive && !data.error) setTrack(data);
      } catch { /* fall through to mock */ }
    };
    fetchTrack();
    const interval = setInterval(fetchTrack, 30_000);
    return () => { alive = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (track) return; // real data available
    const t = setInterval(() => setMockIdx((n) => (n + 1) % MOCK.length), 7000);
    return () => clearInterval(t);
  }, [track]);

  const t = track ?? MOCK[mockIdx];
  if (!t.isPlaying && track) return <span className="np-artist">not playing</span>;

  return (
    <span className="now-playing" title="Spotify Now Playing">
      <span className="np-bars" aria-hidden="true"><i /><i /><i /><i /></span>
      <em>{t.title}</em>
      <span className="np-sep">·</span>
      <span className="np-artist">{t.artist}</span>
    </span>
  );
}
