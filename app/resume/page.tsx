import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume — ruran8wa",
};

export default function ResumePage() {
  return (
    <div className="resume-page">
      <header className="resume-header">
        <Link href="/" className="resume-back">← back</Link>
        <span className="resume-title">Prince Rurangwa — CV</span>
        <a className="resume-download" href="/resume.pdf" download="Prince Rurangwa - CV.pdf">
          [ DOWNLOAD ]
        </a>
      </header>
      <div className="resume-viewer">
        <iframe
          src="/resume.pdf"
          title="Prince Rurangwa Resume"
          className="resume-iframe"
        />
      </div>
    </div>
  );
}
