export function saveHighScore(key: string, val: number, mode: "max" | "min" = "max") {
  try {
    const all: Record<string, number> = JSON.parse(localStorage.getItem("arcade_highs") || "{}");
    const cur = all[key];
    const better = cur == null ? true : mode === "max" ? val > cur : val < cur;
    if (better) {
      all[key] = val;
      localStorage.setItem("arcade_highs", JSON.stringify(all));
      window.dispatchEvent(new Event("arcade-score"));
    }
  } catch {}
}

export function getHighScores(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem("arcade_highs") || "{}"); }
  catch { return {}; }
}
