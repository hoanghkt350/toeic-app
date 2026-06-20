import { C, Card, CardHeader, CardTitle, CardBody, Badge } from "../ui";

const kpis = [
  { icon: "📝", value: "48", label: "Bài thi đã tạo", change: "↑ +4 so với tháng trước", color: C.primary },
  { icon: "📖", value: "12", label: "Khóa học", change: "↑ +2 so với tháng trước", color: C.accent },
  { icon: "❓", value: "86", label: "Câu hỏi mới", change: "↑ +12 so với tháng trước", color: C.warning },
  { icon: "🔤", value: "120", label: "Từ vựng mới", change: "↑ +28 so với tháng trước", color: C.purple },
  { icon: "👁️", value: "12.4K", label: "Lượt xem", change: "↑ +28% so với tháng trước", color: C.success },
  { icon: "⭐", value: "4.8", label: "Đánh giá TB", change: "↑ +0.2 so với tháng trước", color: C.warning },
];

const chartData = [
  { t1: 20, t2: 8, t3: 30 }, { t1: 25, t2: 10, t3: 42 }, { t1: 18, t2: 7, t3: 38 },
  { t1: 30, t2: 12, t3: 55 }, { t1: 22, t2: 9, t3: 44 }, { t1: 48, t2: 15, t3: 72 },
  { t1: 35, t2: 11, t3: 60 }, { t1: 28, t2: 10, t3: 48 }, { t1: 32, t2: 13, t3: 52 },
  { t1: 26, t2: 8, t3: 46 }, { t1: 38, t2: 14, t3: 62 }, { t1: 42, t2: 16, t3: 68 },
];
const months = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];
const maxVal = 72;

const topItems = [
  { rank: "🥇", name: "TOEIC Full Test #001", type: "Bài thi", typeBadge: "blue" as const, views: "2,450", rating: "4.9", status: "Đã duyệt", statusBadge: "success" as const },
  { rank: "🥈", name: "Khóa học TOEIC 700+ – Nâng cao", type: "Khóa học", typeBadge: "accent" as const, views: "1,832", rating: "4.8", status: "Đã duyệt", statusBadge: "success" as const },
  { rank: "🥉", name: "Business Vocabulary Part 3", type: "Từ vựng", typeBadge: "purple" as const, views: "1,204", rating: "4.7", status: "Đã duyệt", statusBadge: "success" as const },
  { rank: "4", name: "Grammar – Tenses & Conditionals", type: "Bài học", typeBadge: "purple" as const, views: "987", rating: "4.6", status: "Chờ duyệt", statusBadge: "warning" as const },
  { rank: "5", name: "TOEIC Mini Test – Listening Part 1–2", type: "Bài thi", typeBadge: "blue" as const, views: "876", rating: "4.5", status: "Đã duyệt", statusBadge: "success" as const },
];

export function ThongKe() {
  return (
    <div style={{ padding: "24px 28px" }}>
      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 20 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ background: C.white, borderRadius: 12, padding: 16, boxShadow: "0 2px 12px rgba(28,99,234,0.07)", borderTop: `3px solid ${kpi.color}` }}>
            <div style={{ fontSize: 20 }}>{kpi.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, margin: "8px 0 2px", color: kpi.color }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: C.text2 }}>{kpi.label}</div>
            <div style={{ fontSize: 11, color: C.success, marginTop: 6 }}>{kpi.change}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 18 }}>
        <Card>
          <CardHeader>
            <CardTitle>Nội dung tạo theo tháng</CardTitle>
            <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
              {[{ color: C.primary, label: "Bài thi" }, { color: C.accent, label: "Khóa học" }, { color: C.warning, label: "Từ vựng" }].map((l) => (
                <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: l.color, display: "inline-block" }} />
                  {l.label}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardBody>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, padding: "0 8px" }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 2, flex: 1 }}>
                  {[{ val: d.t1, color: C.primary }, { val: d.t2, color: C.accent }, { val: d.t3, color: C.warning }].map((bar, j) => (
                    <div
                      key={j}
                      title={`${months[i]}: ${bar.val}`}
                      style={{
                        flex: 1,
                        height: (bar.val / maxVal) * 150,
                        background: bar.color,
                        borderRadius: "4px 4px 0 0",
                        opacity: i === 5 ? 1 : 0.65,
                        cursor: "pointer",
                        transition: "opacity .2s",
                        minWidth: 4,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, padding: "6px 8px 0" }}>
              {months.map((m) => (
                <div key={m} style={{ flex: 1, textAlign: "center", fontSize: 10, color: C.text3 }}>{m}</div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Phân loại nội dung</CardTitle></CardHeader>
          <CardBody>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <svg width="130" height="130" viewBox="0 0 130 130" style={{ flexShrink: 0 }}>
                <circle cx="65" cy="65" r="52" fill="none" stroke={C.primary} strokeWidth="22" strokeDasharray="115 212" strokeDashoffset="0" />
                <circle cx="65" cy="65" r="52" fill="none" stroke={C.accent} strokeWidth="22" strokeDasharray="90 212" strokeDashoffset="-115" />
                <circle cx="65" cy="65" r="52" fill="none" stroke={C.warning} strokeWidth="22" strokeDasharray="72 212" strokeDashoffset="-205" />
                <circle cx="65" cy="65" r="52" fill="none" stroke={C.purple} strokeWidth="22" strokeDasharray="47 212" strokeDashoffset="-277" />
                <text x="65" y="62" textAnchor="middle" fontSize="16" fontWeight="700" fill={C.text1}>384</text>
                <text x="65" y="76" textAnchor="middle" fontSize="10" fill={C.text3}>tổng</text>
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { color: C.primary, label: "Bài thi TOEIC", pct: "35%", count: "135" },
                  { color: C.accent, label: "Khóa học", pct: "28%", count: "107" },
                  { color: C.warning, label: "Câu hỏi lẻ", pct: "22%", count: "85" },
                  { color: C.purple, label: "Từ vựng", pct: "15%", count: "57" },
                ].map((leg, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: leg.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{leg.label}</div>
                      <div style={{ fontSize: 11, color: C.text3 }}>{leg.pct} • {leg.count} nội dung</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top content */}
      <Card>
        <CardHeader><CardTitle>🏆 Top nội dung được xem nhiều nhất – Tháng 6/2025</CardTitle></CardHeader>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["#", "Tên nội dung", "Loại", "Lượt xem", "Đánh giá", "Trạng thái"].map((h) => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11.5, color: C.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topItems.map((row, i) => (
                <tr key={i} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F7F9FF")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}>
                  <td style={{ padding: "13px 16px", fontWeight: 700, color: i < 3 ? C.warning : C.text3, borderBottom: `1px solid ${C.border}` }}>{row.rank}</td>
                  <td style={{ padding: "13px 16px", fontWeight: 600, fontSize: 13, borderBottom: `1px solid ${C.border}` }}>{row.name}</td>
                  <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}><Badge variant={row.typeBadge}>{row.type}</Badge></td>
                  <td style={{ padding: "13px 16px", fontWeight: 700, fontSize: 13, borderBottom: `1px solid ${C.border}` }}>{row.views}</td>
                  <td style={{ padding: "13px 16px", color: C.warning, fontSize: 13, borderBottom: `1px solid ${C.border}` }}>⭐ {row.rating}</td>
                  <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}><Badge variant={row.statusBadge}>{row.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
