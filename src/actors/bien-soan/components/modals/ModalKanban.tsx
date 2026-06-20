import { useApp } from "../../context";
import { C, Btn, Badge } from "../ui";

const columns = [
  {
    title: "📝 Đang soạn", badge: "draft" as const, count: 4,
    items: [
      { title: "TOEIC Full Test #004", sub: "Full Test • 200 câu", note: "🔄 Đang soạn Part 3", noteColor: C.primary },
      { title: "Grammar – Modal Verbs", sub: "Ngữ pháp • B2", note: "🔄 Chưa có ví dụ", noteColor: C.primary },
      { title: "Từ vựng – Health & Medicine", sub: "Từ vựng • 60 từ", note: "🔄 50% hoàn thành", noteColor: C.primary },
      { title: "Listening Unit 6 – Part 3", sub: "Bài học • 45 phút", note: "🔄 Chưa có audio", noteColor: C.primary },
    ],
    borderColor: "#A8AEC2",
  },
  {
    title: "⏳ Chờ duyệt", badge: "warning" as const, count: 3,
    items: [
      { title: "TOEIC Mini Test – Listening", sub: "Mini Test • 100 câu", note: "⏳ Gửi 11/06", noteColor: C.warning },
      { title: "Grammar – Tenses Review", sub: "Ngữ pháp • B1", note: "⏳ Chờ Admin", noteColor: C.warning },
      { title: "TOEIC Practice – Reading", sub: "Practice • 100 câu", note: "⏳ Gửi 10/06", noteColor: C.warning },
    ],
    borderColor: C.warning,
  },
  {
    title: "✅ Đã duyệt", badge: "success" as const, count: 5,
    items: [
      { title: "TOEIC Full Test #001", sub: "Full Test • 200 câu", note: "✅ 12/06 • 2,450 views", noteColor: C.success },
      { title: "Business Vocabulary Part 3", sub: "Từ vựng • 45 từ", note: "✅ 09/06 • 1,204 views", noteColor: C.success },
      { title: "Khóa học TOEIC 700+", sub: "Khóa học • 18 bài", note: "✅ 05/06 • 134 HV", noteColor: C.success },
      { title: "Grammar – Present Perfect", sub: "Ngữ pháp • B2", note: "✅ 04/06 • 245 views", noteColor: C.success },
      { title: "Listening Unit 4 – Part 1", sub: "Bài học • 45 phút", note: "✅ 02/06 • 89 HV", noteColor: C.success },
    ],
    borderColor: C.success,
  },
];

export function ModalKanban() {
  const { openModal, closeModal, showToast } = useApp();
  if (openModal !== "modal-kanban") return null;

  return (
    <div onClick={closeModal} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", backdropFilter: "blur(2px)", overflowY: "auto", padding: "20px 0" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.white, borderRadius: 12, padding: 28, width: 860, maxWidth: "96vw", margin: "auto", boxShadow: "0 4px 24px rgba(28,99,234,0.10)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: C.text1 }}>📋 Kanban – Tiến Độ Nội Dung</h3>
          <button onClick={closeModal} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: C.text2 }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {columns.map((col, ci) => (
            <div key={ci} style={{ background: C.bg, borderRadius: 12, padding: 14, minHeight: 200 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", color: C.text1 }}>
                <span>{col.title}</span>
                <Badge variant={col.badge}>{col.count}</Badge>
              </div>
              {col.items.map((item, ii) => (
                <div key={ii} style={{ background: C.white, borderRadius: 8, padding: "12px 14px", marginBottom: 8, boxShadow: "0 2px 12px rgba(28,99,234,0.07)", cursor: "grab", borderLeft: `3px solid ${col.borderColor}`, transition: "box-shadow .2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(28,99,234,0.10)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(28,99,234,0.07)")}
                >
                  <p style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 2, color: C.text1 }}>{item.title}</p>
                  <span style={{ fontSize: 10.5, color: C.text3 }}>{item.sub}</span>
                  <br />
                  <span style={{ fontSize: 10.5, color: item.noteColor }}>{item.note}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <Btn variant="outline" onClick={closeModal}>Đóng</Btn>
          <Btn variant="primary" onClick={() => showToast("🔄 Đã làm mới!")}>🔄 Làm mới</Btn>
        </div>
      </div>
    </div>
  );
}
