import { useApp } from "../context";
import { C, Badge, Btn } from "./ui";

export function VocabDrawer() {
  const { vocabDrawerOpen, setVocabDrawerOpen, showToast } = useApp();

  return (
    <>
      {/* Overlay */}
      {vocabDrawerOpen && (
        <div
          onClick={() => setVocabDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 140 }}
        />
      )}
      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          right: vocabDrawerOpen ? 0 : -440,
          top: 0,
          width: 420,
          height: "100vh",
          background: C.white,
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
          zIndex: 150,
          transition: "right .3s ease",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: 20, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.primary, color: "#fff", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>negotiate</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>/nɪˈɡoʊʃieɪt/</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => showToast("🔊 Đang phát âm...")}
              style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
            >
              🔊 Nghe
            </button>
            <button
              onClick={() => setVocabDrawerOpen(false)}
              style={{ background: "transparent", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 20, flex: 1 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <Badge variant="purple">Business</Badge>
            <Badge variant="warning">B2</Badge>
            <Badge variant="success">Đã duyệt</Badge>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>NGHĨA TIẾNG VIỆT</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.primary }}>đàm phán, thương lượng</div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>VÍ DỤ CÂU</div>
            <div style={{ background: C.bg, borderRadius: 8, padding: 12 }}>
              {[
                "1. They <negotiate> a new contract every year.",
                "2. Both sides need to <negotiate> before reaching an agreement.",
              ].map((ex, i) => (
                <div key={i} style={{ fontSize: 13, color: C.text2, marginBottom: i === 0 ? 6 : 0 }}>
                  {ex.split(/<|>/).map((part, j) =>
                    j % 2 === 1 ? <strong key={j} style={{ color: C.primary }}>{part}</strong> : part
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>TỪ LIÊN QUAN</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge variant="blue">negotiation (n)</Badge>
              <Badge variant="blue">negotiator (n)</Badge>
              <Badge variant="blue">negotiable (adj)</Badge>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>THỐNG KÊ</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
              {[
                { val: "20", label: "Xuất hiện", color: C.primary },
                { val: "89%", label: "Đúng", color: C.success },
                { val: "312", label: "Lượt học", color: C.warning },
              ].map((s, i) => (
                <div key={i} style={{ background: C.bg, borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: C.text3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Btn variant="outline" style={{ flex: 1 }} onClick={() => showToast("✏️ Mở chỉnh sửa...")}>✏️ Chỉnh sửa</Btn>
            <Btn variant="purple" style={{ flex: 1 }} onClick={() => { setVocabDrawerOpen(false); showToast("✅ Đã lưu!"); }}>Lưu</Btn>
          </div>
        </div>
      </div>
    </>
  );
}
