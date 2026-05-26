"use client";

const PLAYLIST_URL = "https://open.spotify.com/playlist/4fDhzhworqL0XcHFJyvvo3";

export default function NowPlaying() {
  return (
    <a
      className="now-playing"
      href={PLAYLIST_URL}
      target="_blank"
      rel="noreferrer"
      title="Open playlist on Spotify"
    >
      <span className="np-bars" aria-hidden="true"><i /><i /><i /><i /></span>
      <em>my playlist</em>
      <span className="np-sep">·</span>
      <span className="np-artist">spotify</span>
    </a>
  );
}
