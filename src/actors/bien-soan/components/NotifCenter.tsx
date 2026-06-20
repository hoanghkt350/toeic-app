import { useApp } from "../context";
import { C, Btn } from "./ui";

const notifs = [
  { color: C.success, text: "✅ Bài thi TOEIC Full Test #001 đã được duyệt", time: "30 phút trước", unread: true },
  { color: C.warning, text: "⚠️ Yêu cầu chỉnh sửa: Grammar Unit 3", time: "2 giờ trước", unread: true },
  { color: C.primary, text: "📖 Khóa học TOEIC 700+ đã xuất bản", time: "1 ngày trước", unread: false },
  { color: C.danger, text: "❗ Cần bổ sung 50 câu hỏi Listening Part 2", time: "2 ngày trước", unread: false },
  { color: C.success, text: "⭐ Business Vocabulary Part 3 nhận đánh giá 4.9 ⭐", time: "3 ngày trước", unread: false },
];

export function NotifCenter() {
  const { notifOpen, setNotifOpen, showToast } = useApp();

  if (!notifOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 62,
        right: 16,
        width: 340,
        background: C.white,
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(28,99,234,0.10)",
        zIndex: 120,
        border: `1px solid ${C.border}`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>🔔 Thông báo</span>
        <Btn
          variant="outline"
          style={{ fontSize: 11, padding: "4px 10px" }}
          onClick={() => {
            document.getElementById("notif-dot")?.style && (document.getElementById("notif-dot")!.style.display = "none");
            showToast("✅ Đã đánh dấu tất cả đã đọc");
            setNotifOpen(false);
          }}
        >
          Đã đọc tất cả
        </Btn>
      </div>
      <div style={{ maxHeight: 340, overflowY: "auto" }}>
        {notifs.map((n, i) => (
          <div
            key={i}
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              gap: 10,
              cursor: "pointer",
              background: n.unread ? C.tagBlue : "transparent",
              transition: "background .15s",
            }}
            onMouseEnter={(e) => { if (!n.unread) (e.currentTarget as HTMLElement).style.background = C.bg; }}
            onMouseLeave={(e) => { if (!n.unread) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, marginTop: 5, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 12.5, fontWeight: n.unread ? 500 : 400, color: C.text1, margin: 0 }}>{n.text}</p>
              <span style={{ fontSize: 11, color: C.text3 }}>{n.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 16px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
        <Btn variant="outline" style={{ fontSize: 12, width: "100%" }} onClick={() => { setNotifOpen(false); showToast("📬 Đã xem tất cả thông báo"); }}>
          Xem tất cả thông báo
        </Btn>
      </div>
    </div>
  );
}
