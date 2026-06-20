import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  ClipboardList,
  BarChart2,
  Eye,
  Calendar,
  Target,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";

/* ── palette constants ──────────────────────────────────── */
const C = {
  blue:      "#1d4ed8",
  blueMid:   "#3b82f6",
  blueLight: "#eff6ff",
  blueBorder:"#bfdbfe",
  violet:    "#7c3aed",
  green:     "#16a34a",
  greenLight:"#f0fdf4",
  greenBorder:"#bbf7d0",
  orange:    "#d97706",
  orangeLight:"#fffbeb",
  orangeBorder:"#fde68a",
  red:       "#dc2626",
  redLight:  "#fef2f2",
  redBorder: "#fecaca",
  text:      "#111827",
  muted:     "#64748b",
  border:    "#e2e8f0",
  bg:        "#f8faff",
  card:      "#ffffff",
};

/* ── data ───────────────────────────────────────────────── */
const scoreHistory = [
  { date: "01/03", listening: 265, reading: 210, total: 475 },
  { date: "08/03", listening: 280, reading: 225, total: 505 },
  { date: "15/03", listening: 275, reading: 240, total: 515 },
  { date: "22/03", listening: 295, reading: 250, total: 545 },
  { date: "29/03", listening: 310, reading: 245, total: 555 },
  { date: "05/04", listening: 305, reading: 265, total: 570 },
  { date: "12/04", listening: 320, reading: 270, total: 590 },
  { date: "19/04", listening: 330, reading: 280, total: 610 },
  { date: "26/04", listening: 325, reading: 295, total: 620 },
  { date: "05/05", listening: 340, reading: 300, total: 640 },
];

const parts = [
  { part: "Phần 1", name: "Mô tả hình ảnh",     score: 88, section: "Nghe",  trend: "up" },
  { part: "Phần 2", name: "Hỏi & Đáp",           score: 72, section: "Nghe",  trend: "up" },
  { part: "Phần 3", name: "Đoạn hội thoại",      score: 65, section: "Nghe",  trend: "flat" },
  { part: "Phần 4", name: "Bài nói ngắn",         score: 58, section: "Nghe",  trend: "down" },
  { part: "Phần 5", name: "Hoàn thành câu",       score: 74, section: "Đọc",   trend: "up" },
  { part: "Phần 6", name: "Hoàn thành đoạn văn", score: 62, section: "Đọc",   trend: "up" },
  { part: "Phần 7", name: "Đọc hiểu",             score: 50, section: "Đọc",   trend: "down" },
];

const radarData = parts.map((p) => ({ subject: p.part, score: p.score }));

const recentTests = [
  { id: 1, name: "Thi Thử Toàn Bộ #5", date: "05/05/2026", total: 640, listening: 340, reading: 300, duration: "120 phút", mistakes: 48,  improvement: +20 },
  { id: 2, name: "Thi Thử Toàn Bộ #4", date: "26/04/2026", total: 620, listening: 325, reading: 295, duration: "120 phút", mistakes: 55,  improvement: +10 },
  { id: 3, name: "Thi Thử Toàn Bộ #3", date: "12/04/2026", total: 590, listening: 310, reading: 280, duration: "120 phút", mistakes: 62,  improvement: +35 },
  { id: 4, name: "Kiểm Tra Mini #4",    date: "05/04/2026", total: 570, listening: 305, reading: 265, duration: "40 phút",  mistakes: 28,  improvement: +15 },
  { id: 5, name: "Thi Thử Toàn Bộ #2", date: "22/03/2026", total: 545, listening: 295, reading: 250, duration: "120 phút", mistakes: 70,  improvement: +30 },
];

/* ── helpers ────────────────────────────────────────────── */
function scoreColor(s: number) {
  if (s >= 75) return C.green;
  if (s >= 60) return C.blue;
  if (s >= 50) return C.orange;
  return C.red;
}
function scoreBg(s: number) {
  if (s >= 75) return C.greenLight;
  if (s >= 60) return C.blueLight;
  if (s >= 50) return C.orangeLight;
  return C.redLight;
}

function TrendIcon({ t }: { t: string }) {
  if (t === "up")   return <TrendingUp  size={13} style={{ color: C.green }} />;
  if (t === "down") return <TrendingDown size={13} style={{ color: C.red }} />;
  return <Minus size={13} style={{ color: C.muted }} />;
}

const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.10)", fontSize: "0.8rem", minWidth: 160 }}>
      <div style={{ fontWeight: 700, color: C.text, marginBottom: 8 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <span style={{ color: C.muted }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: C.text, marginLeft: "auto", paddingLeft: 12 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ── KPI card ───────────────────────────────────────────── */
function KpiCard({ label, value, sub, icon: Icon, color, bg }: { label: string; value: string | number; sub: string; icon: any; color: string; bg: string }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.68rem", color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: C.text, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.72rem", color: C.muted }}>{sub}</div>
    </div>
  );
}

/* ── Part row ───────────────────────────────────────────── */
function PartRow({ p }: { p: typeof parts[0] }) {
  const col = scoreColor(p.score);
  const bg  = scoreBg(p.score);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 64, flexShrink: 0 }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: C.text }}>{p.part}</div>
        <div style={{ fontSize: "0.65rem", color: C.muted, lineHeight: 1.4, marginTop: 1 }}>{p.name}</div>
      </div>
      <div style={{ flex: 1, height: 8, borderRadius: 999, background: "#f1f5f9", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${p.score}%`, borderRadius: 999, background: col, transition: "width 0.7s ease" }} />
      </div>
      <div style={{ width: 44, textAlign: "right", flexShrink: 0 }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: col, background: bg, borderRadius: 999, padding: "2px 8px", display: "inline-block" }}>
          {p.score}%
        </span>
      </div>
      <TrendIcon t={p.trend} />
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────── */
export function Analytics() {
  const [chartMode, setChartMode] = useState<"total" | "split">("total");
  const [openTest, setOpenTest]   = useState<number | null>(null);

  const latest = scoreHistory[scoreHistory.length - 1];
  const prev   = scoreHistory[scoreHistory.length - 2];
  const delta  = latest.total - prev.total;

  const strengths  = parts.filter((p) => p.score >= 70).sort((a, b) => b.score - a.score);
  const weaknesses = parts.filter((p) => p.score < 70).sort((a, b) => a.score - b.score);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingBottom: 48, maxWidth: 900, margin: "0 auto" }}>

      {/* ── KPI row ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <KpiCard label="Điểm Gần Nhất"  value={latest.total} sub={`+${delta} so với lần trước`}            icon={Award}       color={C.blue}   bg={C.blueLight} />
        <KpiCard label="Mục Tiêu"        value={800}          sub={`Còn ${800 - latest.total} điểm nữa`}    icon={Target}      color={C.violet} bg="#f5f3ff" />
        <KpiCard label="Bài Thi Thử"     value={recentTests.length} sub="Tổng số bài đã hoàn thành"         icon={ClipboardList} color={C.green} bg={C.greenLight} />
        <KpiCard label="Tăng Trung Bình" value={`+${Math.round((latest.total - scoreHistory[0].total) / scoreHistory.length)}`} sub="Điểm/tuần" icon={Zap} color={C.orange} bg={C.orangeLight} />
      </div>

      {/* ── Score chart ─────────────────────────────────── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "32px 32px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <BarChart2 size={16} style={{ color: C.blue }} />
              <h3 style={{ margin: 0, color: C.text }}>Biểu Đồ Tiến Độ Điểm Số</h3>
            </div>
            <p style={{ margin: 0, fontSize: "0.78rem", color: C.muted }}>
              Theo dõi điểm thi thử qua {scoreHistory.length} tuần gần nhất
            </p>
          </div>
          <div style={{ display: "flex", gap: 4, padding: 4, background: "#f1f5f9", borderRadius: 12 }}>
            {(["total", "split"] as const).map((m) => (
              <button key={m} onClick={() => setChartMode(m)}
                style={{
                  fontSize: "0.72rem", fontWeight: 600, padding: "6px 14px", border: "none", cursor: "pointer",
                  borderRadius: 9, background: chartMode === m ? C.card : "transparent",
                  color: chartMode === m ? C.blue : C.muted,
                  boxShadow: chartMode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {m === "total" ? "Tổng Điểm" : "Nghe / Đọc"}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={scoreHistory} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} dy={8} />
            <YAxis domain={chartMode === "total" ? [420, 850] : [190, 410]} tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <ReferenceLine y={800} stroke={C.red} strokeDasharray="5 4" strokeWidth={1.5}
              label={{ value: "Mục tiêu 800", position: "insideTopRight", fontSize: 10, fill: C.red, dy: -4 }} />
            {chartMode === "total" ? (
              <Line type="monotone" dataKey="total" name="Tổng điểm"
                stroke={C.blue} strokeWidth={2.5}
                dot={{ r: 4, fill: C.card, stroke: C.blue, strokeWidth: 2 }}
                activeDot={{ r: 6, fill: C.blue, stroke: C.card, strokeWidth: 2 }} />
            ) : (
              <>
                <Line type="monotone" dataKey="listening" name="Nghe"
                  stroke={C.blue} strokeWidth={2}
                  dot={{ r: 3.5, fill: C.card, stroke: C.blue, strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: C.blue }} />
                <Line type="monotone" dataKey="reading" name="Đọc"
                  stroke={C.violet} strokeWidth={2} strokeDasharray="6 3"
                  dot={{ r: 3.5, fill: C.card, stroke: C.violet, strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: C.violet }} />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>

        {/* Legend for split mode */}
        {chartMode === "split" && (
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16 }}>
            {[{ color: C.blue, label: "Nghe", dash: false }, { color: C.violet, label: "Đọc", dash: true }].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="24" height="4">
                  {l.dash
                    ? <line x1="0" y1="2" x2="24" y2="2" stroke={l.color} strokeWidth="2" strokeDasharray="5 3" />
                    : <line x1="0" y1="2" x2="24" y2="2" stroke={l.color} strokeWidth="2" />}
                </svg>
                <span style={{ fontSize: "0.75rem", color: C.muted, fontWeight: 500 }}>{l.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Strengths & Weaknesses ───────────────────────── */}
      <div>
        <h3 style={{ margin: "0 0 20px", color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 4, height: 20, background: C.blue, borderRadius: 2, display: "inline-block" }} />
          Điểm Mạnh &amp; Điểm Yếu
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Radar */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "28px 24px 20px" }}>
            <p style={{ margin: "0 0 4px", fontSize: "0.8rem", fontWeight: 600, color: C.text }}>Biểu Đồ Kỹ Năng</p>
            <p style={{ margin: "0 0 16px", fontSize: "0.72rem", color: C.muted }}>Hiệu suất tổng quan theo từng phần</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: C.muted }} />
                <Radar dataKey="score" stroke={C.blue} fill={C.blue} fillOpacity={0.14} strokeWidth={2}
                  dot={{ r: 3, fill: C.blue, strokeWidth: 0 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Progress bars */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "28px 24px" }}>
            <p style={{ margin: "0 0 4px", fontSize: "0.8rem", fontWeight: 600, color: C.text }}>Chi Tiết Từng Phần</p>
            <p style={{ margin: "0 0 20px", fontSize: "0.72rem", color: C.muted }}>Tỉ lệ trả lời đúng theo phần thi</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted }}>Kỹ Năng Nghe</div>
              {parts.filter((p) => p.section === "Nghe").map((p) => <PartRow key={p.part} p={p} />)}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted }}>Kỹ Năng Đọc</div>
              {parts.filter((p) => p.section === "Đọc").map((p) => <PartRow key={p.part} p={p} />)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Strength / Weakness summary ──────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Strengths */}
        <div style={{ background: C.card, border: `1.5px solid ${C.greenBorder}`, borderRadius: 20, padding: "24px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={15} style={{ color: C.green }} />
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#15803d" }}>Điểm Mạnh</div>
              <div style={{ fontSize: "0.68rem", color: C.muted }}>{strengths.length} phần đang tốt</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {strengths.map((p) => (
              <div key={p.part} style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 12, padding: "10px 14px", background: C.greenLight, border: `1px solid ${C.greenBorder}` }}>
                <CheckCircle2 size={14} style={{ color: C.green, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#15803d" }}>{p.part}</span>
                  <span style={{ fontSize: "0.75rem", color: "#166534", marginLeft: 6 }}>— {p.name}</span>
                </div>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: C.green }}>{p.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div style={{ background: C.card, border: `1.5px solid ${C.orangeBorder}`, borderRadius: 20, padding: "24px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={15} style={{ color: C.orange }} />
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#92400e" }}>Cần Cải Thiện</div>
              <div style={{ fontSize: "0.68rem", color: C.muted }}>{weaknesses.length} phần cần tập trung</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {weaknesses.map((p) => {
              const isCritical = p.score < 60;
              return (
                <div key={p.part} style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 12, padding: "10px 14px", background: isCritical ? C.redLight : C.orangeLight, border: `1px solid ${isCritical ? C.redBorder : C.orangeBorder}` }}>
                  <AlertTriangle size={14} style={{ color: isCritical ? C.red : C.orange, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: isCritical ? "#991b1b" : "#92400e" }}>{p.part}</span>
                    <span style={{ fontSize: "0.75rem", color: isCritical ? "#b91c1c" : "#78350f", marginLeft: 6 }}>— {p.name}</span>
                  </div>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: isCritical ? C.red : C.orange }}>{p.score}%</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Recent Tests ─────────────────────────────────── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 4, height: 20, background: C.blue, borderRadius: 2, display: "inline-block" }} />
            Bài Thi Gần Đây
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={13} style={{ color: C.muted }} />
            <span style={{ fontSize: "0.72rem", color: C.muted }}>{recentTests.length} bài đã làm</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recentTests.map((test) => {
            const isOpen = openTest === test.id;
            const highScore = test.total >= 600;
            return (
              <div key={test.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden", transition: "box-shadow 0.2s" }}>

                {/* Row */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px" }}>

                  {/* Score badge */}
                  <div style={{
                    width: 60, height: 60, flexShrink: 0, borderRadius: 16,
                    background: highScore ? C.blueLight : C.orangeLight,
                    border: `2px solid ${highScore ? C.blueBorder : C.orangeBorder}`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 800, color: highScore ? C.blue : C.orange, lineHeight: 1 }}>{test.total}</span>
                    <span style={{ fontSize: "0.58rem", fontWeight: 600, color: highScore ? C.blueMid : C.orange, marginTop: 1 }}>điểm</span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.text, marginBottom: 6 }}>{test.name}</div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginBottom: 10 }}>
                      <span style={{ fontSize: "0.72rem", color: C.muted }}>{test.date}</span>
                      <span style={{ fontSize: "0.72rem", color: C.muted }}>·</span>
                      <span style={{ fontSize: "0.72rem", color: C.muted }}>{test.duration}</span>
                      <span style={{ fontSize: "0.72rem", color: C.muted }}>·</span>
                      <span style={{ fontSize: "0.72rem", color: C.red, fontWeight: 600 }}>{test.mistakes} lỗi sai</span>
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, background: C.greenLight, color: C.green, borderRadius: 999, padding: "1px 8px" }}>
                        +{test.improvement} vs lần trước
                      </span>
                    </div>

                    {/* Listening / Reading mini bars */}
                    <div style={{ display: "flex", gap: 20 }}>
                      {[
                        { label: "Nghe", value: test.listening, max: 495, color: C.blue },
                        { label: "Đọc",  value: test.reading,   max: 495, color: C.violet },
                      ].map((s) => (
                        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                          <span style={{ fontSize: "0.65rem", color: C.muted, width: 28, flexShrink: 0 }}>{s.label}</span>
                          <div style={{ flex: 1, height: 5, borderRadius: 999, background: "#f1f5f9" }}>
                            <div style={{ height: "100%", width: `${(s.value / s.max) * 100}%`, borderRadius: 999, background: s.color }} />
                          </div>
                          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: s.color, width: 30, textAlign: "right", flexShrink: 0 }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => setOpenTest(isOpen ? null : test.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        borderRadius: 12, padding: "8px 14px",
                        background: isOpen ? C.blue : "#f1f5f9",
                        color: isOpen ? "#fff" : C.text,
                        border: "none", cursor: "pointer",
                        fontSize: "0.75rem", fontWeight: 600,
                        transition: "all 0.15s",
                      }}
                    >
                      <Eye size={13} />
                      {isOpen ? "Đóng" : "Xem Lỗi"}
                      {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                </div>

                {/* Expandable mistake panel */}
                {isOpen && (
                  <div style={{ borderTop: `1px solid ${C.border}`, padding: "20px 24px 24px", background: "#fafbff" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: C.text, marginBottom: 16 }}>
                      Phân Tích Lỗi Sai — {test.name}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                      {parts.map((p) => {
                        const errCount = Math.max(1, Math.round(((100 - p.score) / 100) * (p.section === "Nghe" ? 12 : 14)));
                        const col = scoreColor(p.score);
                        const bg  = scoreBg(p.score);
                        return (
                          <div key={p.part} style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 12, padding: "10px 14px", background: bg, border: `1px solid ${col}22` }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: col }}>{p.part}</div>
                              <div style={{ fontSize: "0.63rem", color: C.muted, marginTop: 1 }}>{p.name}</div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div style={{ fontSize: "0.9rem", fontWeight: 800, color: col }}>{errCount}</div>
                              <div style={{ fontSize: "0.6rem", color: C.muted }}>lỗi</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      borderRadius: 14, padding: "13px 0",
                      background: C.blue, color: "#fff", border: "none", cursor: "pointer",
                      fontSize: "0.85rem", fontWeight: 700,
                    }}>
                      <RotateCcw size={15} />
                      Ôn Tập Tất Cả Câu Sai
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
