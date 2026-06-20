import { useState } from "react";
import { useApp } from "../../context";
import { C, Btn, Badge, SearchInput, IconBtn } from "../ui";

const grammarItems = [
  {
    title: "Present Perfect Tense – Thì Hiện Tại Hoàn Thành",
    tag: "Tenses", level: "B2", date: "10/06/2025",
    formula: "S + have/has + V(pp)",
    usage: "Hành động xảy ra và còn liên quan đến hiện tại",
    examples: ["She has worked at this company for five years. ✅", "I have already finished the TOEIC test preparation. ✅"],
    exercises: 12, views: 245, status: "Đã duyệt",
  },
  {
    title: "Passive Voice – Câu Bị Động",
    tag: "Passive Voice", level: "B2", date: "09/06/2025",
    formula: "S + be + V(pp) + (by O)",
    usage: "Không biết/không cần nêu chủ thể",
    examples: ["The report was submitted by the manager yesterday. ✅", "New products are being developed by the team. ✅"],
    exercises: 8, views: 189, status: "Chờ duyệt",
  },
  {
    title: "Conditional Sentences – Câu Điều Kiện (Type 1, 2, 3)",
    tag: "Conditionals", level: "C1", date: "08/06/2025",
    formula: "Type 1: If + S + V(s/es), S + will + V | Type 2: If + S + V(ed), S + would + V",
    usage: "Diễn đạt điều kiện và kết quả",
    examples: ["If she studies harder, she will pass the TOEIC. ✅ (Type 1)", "If I were the manager, I would change the policy. ✅ (Type 2)"],
    exercises: 15, views: 312, status: "Đã duyệt",
  },
];

const CATS = ["Tất cả", "Tenses", "Conditionals", "Passive Voice", "Articles", "Prepositions"];

export function ModalGrammar() {
  const { openModal, closeModal, showToast } = useApp();
  const [activeCat, setActiveCat] = useState("Tất cả");
  const [items, setItems] = useState(grammarItems);

  if (openModal !== "modal-grammar") return null;

  return (
    <div onClick={closeModal} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", backdropFilter: "blur(2px)", overflowY: "auto", padding: "20px 0" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.white, borderRadius: 12, padding: 28, width: 740, maxWidth: "96vw", margin: "auto", boxShadow: "0 4px 24px rgba(28,99,234,0.10)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: C.text1 }}>📘 Quản lý Ngữ Pháp</h3>
          <button onClick={closeModal} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: C.text2 }}>✕</button>
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {CATS.map((cat) => (
            <span key={cat} onClick={() => setActiveCat(cat)}
              style={{ display: "inline-flex", alignItems: "center", padding: "5px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                border: `1.5px solid ${activeCat === cat ? C.purple : C.border}`,
                background: activeCat === cat ? C.purple : C.white, color: activeCat === cat ? "#fff" : C.text2,
                fontWeight: activeCat === cat ? 600 : 400, transition: "all .15s" }}
            >{cat}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <SearchInput placeholder="Tìm chủ điểm ngữ pháp..." />
          <Btn variant="outline" style={{ fontSize: 12 }} onClick={() => showToast("📥 Import ngữ pháp...")}>📥 Import</Btn>
          <Btn variant="purple" onClick={() => showToast("✅ Đã thêm ngữ pháp mới!")}>+ Thêm mới</Btn>
        </div>

        {items.map((item, i) => (
          <div key={i} style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 12, background: C.white, transition: "box-shadow .2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(28,99,234,0.10)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "none")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text1, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 11.5, color: C.text3, marginBottom: 10, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <Badge variant="purple">{item.tag}</Badge>
                  <Badge variant={item.level === "C1" ? "danger" : "warning"}>{item.level}</Badge>
                  <span>{item.date}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <IconBtn onClick={() => showToast("✏️ Mở chỉnh sửa...")}>✏️</IconBtn>
                <IconBtn del onClick={() => { if (confirm("Xóa?")) { setItems((d) => d.filter((_, j) => j !== i)); showToast("🗑️ Đã xóa!"); } }}>🗑️</IconBtn>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: C.text2, marginBottom: 6 }}>
              <strong>Công thức:</strong> {item.formula} &nbsp;|&nbsp; <strong>Dùng khi:</strong> {item.usage}
            </div>
            <div style={{ background: C.bg, borderLeft: `3px solid ${C.purple}`, padding: "10px 14px", borderRadius: "0 8px 8px 0", fontSize: 12.5, color: C.text2, marginTop: 8 }}>
              {item.examples.map((ex, j) => (
                <div key={j} style={{ marginBottom: j < item.examples.length - 1 ? 4 : 0 }}>{ex}</div>
              ))}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <Badge variant="blue">{item.exercises} bài tập</Badge>
              <Badge variant="success">{item.views} lượt học</Badge>
              <Badge variant={item.status === "Đã duyệt" ? "success" : "warning"}>{item.status}</Badge>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <Btn variant="outline" onClick={closeModal}>Đóng</Btn>
          <Btn variant="purple" onClick={() => showToast("✅ Đã lưu!")}>+ Thêm ngữ pháp mới</Btn>
        </div>
      </div>
    </div>
  );
}
