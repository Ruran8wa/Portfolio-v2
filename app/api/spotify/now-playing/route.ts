import { NextResponse } from "next/server";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";

async function getAccessToken(): Promise<string | null> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return null;

  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: SPOTIFY_REFRESH_TOKEN }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

export async function GET() {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ isPlaying: false, error: "no_credentials" });

  const res = await fetch(NOW_PLAYING_URL, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30 },
  });

  if (res.status === 204 || !res.ok) return NextResponse.json({ isPlaying: false });

  const song = await res.json();
  if (!song?.item) return NextResponse.json({ isPlaying: false });

  return NextResponse.json({
    isPlaying: song.is_playing,
    title: song.item.name as string,
    artist: (song.item.artists as { name: string }[]).map((a) => a.name).join(", "),
    albumArt: (song.item.album.images as { url: string }[])[0]?.url,
    songUrl: song.item.external_urls.spotify as string,
  });
}
