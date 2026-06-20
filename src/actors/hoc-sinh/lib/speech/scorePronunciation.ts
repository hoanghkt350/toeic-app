/** Chuẩn hoá chuỗi: bỏ dấu câu, hạ chữ thường, gộp khoảng trắng. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Khoảng cách Levenshtein giữa 2 chuỗi (để chấm có dung sai, không quá gắt). */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export interface PronScore {
  score: number; // 0..100
  ok: boolean; // đạt hay chưa
}

/**
 * Chấm phát âm 1 từ/cụm: so chuỗi máy nghe được với từ mẫu bằng độ giống Levenshtein.
 * ok = true khi điểm >= ngưỡng (mặc định 75).
 */
export function scorePronunciation(target: string, spoken: string, pass = 75): PronScore {
  const t = normalize(target);
  const s = normalize(spoken);
  if (!s) return { score: 0, ok: false };
  if (t === s) return { score: 100, ok: true };
  const dist = levenshtein(t, s);
  const score = Math.max(0, Math.round((1 - dist / Math.max(t.length, 1)) * 100));
  return { score, ok: score >= pass };
}
