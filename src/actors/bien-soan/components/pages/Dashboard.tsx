import { useEffect, useRef } from "react";
import { useApp } from "../../context";
import { C, Card, CardHeader, CardTitle, CardBody, Badge, Btn } from "../ui";

const stats = [
  { color: C.primary, bg: C.tagBlue, icon: "📝", value: 48, label: "Bài thi TOEIC", sub: "↑ 4 bài mới tháng này", page: "baothi" as const },
  { color: C.accent, bg: "#d6f7f0", icon: "📖", value: 12, label: "Khóa học", sub: "↑ 2 khóa mới tháng này", page: "khoahoc" as const },
  { color: C.warning, bg: C.tagOrange, icon: "❓", value: 1240, label: "Ngân hàng câu hỏi", sub: "↑ 86 câu mới tháng này", page: "nganhang" as const },
  { color: C.success, bg: C.tagGreen, icon: "🔤", value: 3450, label: "Từ vựng", sub: "↑ 120 từ mới tháng này", page: "tuvung" as const },
];

const recentItems = [
  { name: "TOEIC Full Test #001", sub: "200 câu • 7 Parts", type: "Bài thi", typeBadge: "blue" as const, status: "Đã duyệt", statusBadge: "success" as const, date: "12/06/2025" },
  { name: "Listening Unit 4", sub: "Part 1 – Photos", type: "Bài học", typeBadge: "purple" as const, status: "Chờ duyệt", statusBadge: "warning" as const, date: "11/06/2025" },
  { name: "Business Vocabulary Part 3", sub: "45 từ • Business", type: "Từ vựng", typeBadge: "accent" as const, status: "Nháp", statusBadge: "draft" as const, date: "10/06/2025" },
  { name: "Grammar - Present Perfect", sub: "Thì hiện tại hoàn thành", type: "Bài học", typeBadge: "purple" as const, status: "Đã duyệt", statusBadge: "success" as const, date: "09/06/2025" },
  { name: "TOEIC Mini Test - Reading", sub: "100 câu • 3 Parts", type: "Bài thi", typeBadge: "blue" as const, status: "Chờ duyệt", statusBadge: "warning" as const, date: "08/06/2025" },
];

const notifications = [
  { color: C.success, text: "Bài thi #001 đã được Admin duyệt", time: "30 phút trước" },
  { color: C.warning, text: "Yêu cầu chỉnh sửa Grammar Unit 3", time: "2 giờ trước" },
  { color: C.primary, text: "Khóa học TOEIC 700+ đã xuất bản", time: "1 ngày trước" },
  { color: C.danger, text: "Cần bổ sung 50 câu hỏi Listening Part 2", time: "2 ngày trước" },
];

export function Dashboard() {
  const { setCurrentPage, openModalFn, showToast } = useApp();
  const numRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    stats.forEach((s, i) => {
      const el = numRefs.current[i];
      if (!el) return;
      let cur = 0;
      const step = Math.ceil(s.value / 40);
      const interval = setInterval(() => {
        cur = Math.min(cur + step, s.value);
        el.textContent = cur.toLocaleString();
        if (cur >= s.value) clearInterval(interval);
      }, 30);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ padding: "24px 28px" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {stats.map((s, i) => (
          <div
            key={i}
            onClick={() => setCurrentPage(s.page)}
            style={{
              background: C.white,
              borderRadius: 12,
              padding: "18px 20px",
              boxShadow: "0 2px 12px rgba(28,99,234,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              borderTop: `3px solid ${s.color}`,
              cursor: "pointer",
              transition: "transform .2s, box-shadow .2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(28,99,234,0.10)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(28,99,234,0.07)";
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: s.bg, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p ref={(el) => (numRefs.current[i] = el)} style={{ fontSize: 26, fontWeight: 700, color: s.color, margin: 0, lineHeight: 1 }}>
                {s.value.toLocaleString()}
              </p>
              <span style={{ fontSize: 11.5, color: C.text2, marginTop: 4, display: "block" }}>{s.label}</span>
              <small style={{ fontSize: 10, color: C.success }}>{s.sub}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}>
        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <Btn variant="outline" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setCurrentPage("baothi")}>
              Xem tất cả →
            </Btn>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.bg }}>
                  {["Tên nội dung", "Loại", "Trạng thái", "Ngày"].map((h) => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11.5, color: C.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentItems.map((item, i) => (
                  <tr key={i} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F7F9FF")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: C.text1 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{item.sub}</div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <Badge variant={item.typeBadge}>{item.type}</Badge>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <Badge variant={item.statusBadge}>{item.status}</Badge>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: C.text2 }}>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Quick actions */}
          <Card>
            <CardHeader><CardTitle>Tạo nội dung nhanh</CardTitle></CardHeader>
            <CardBody>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { icon: "📝", label: "Bài thi TOEIC", bg: C.tagBlue, color: C.primary, action: () => openModalFn("modal-create-test") },
                  { icon: "📖", label: "Khóa học", bg: C.tagGreen, color: C.accent, action: () => openModalFn("modal-create-lesson") },
                  { icon: "❓", label: "Câu hỏi", bg: C.tagOrange, color: C.warning, action: () => openModalFn("modal-cauhoi") },
                  { icon: "🔤", label: "Từ vựng", bg: C.tagPurple, color: C.purple, action: () => setCurrentPage("tuvung") },
                ].map((qa, i) => (
                  <button
                    key={i}
                    onClick={qa.action}
                    style={{
                      padding: 14,
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: qa.bg,
                      color: qa.color,
                      transition: "all .18s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(28,99,234,0.10)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "";
                      (e.currentTarget as HTMLElement).style.boxShadow = "";
                    }}
                  >
                    {qa.icon} {qa.label}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Notifications */}
          <Card style={{ flex: 1 }}>
            <CardHeader><CardTitle>🔔 Thông báo</CardTitle></CardHeader>
            <CardBody style={{ padding: "4px 16px" }}>
              {notifications.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < notifications.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 12.5, color: C.text1, margin: 0, lineHeight: 1.5 }}>{n.text}</p>
                    <span style={{ fontSize: 11, color: C.text3 }}>{n.time}</span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
