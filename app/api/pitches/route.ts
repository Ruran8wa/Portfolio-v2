import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const FILE = path.join(process.cwd(), "ideas.json");

export async function POST(req: Request) {
  try {
    const { email, idea } = await req.json();
    if (!email || !String(email).includes("@") || !idea?.trim()) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    let all: unknown[] = [];
    try {
      all = JSON.parse(await readFile(FILE, "utf8"));
    } catch {}
    all.push({ email: String(email).trim(), idea: String(idea).trim(), at: new Date().toISOString() });
    await writeFile(FILE, JSON.stringify(all, null, 2));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
