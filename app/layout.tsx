import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ruran8wa",
  description: "Software engineer · Kigali / remote",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&family=Instrument+Serif:ital@0;1&display=swap"
        />
      </head>
      <body data-palette="blueprint">
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <filter id="halftone" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.1" />
              <feComposite in="SourceGraphic" in2="noise" operator="in" />
            </filter>
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves={2} stitchTiles="stitch" />
              <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
