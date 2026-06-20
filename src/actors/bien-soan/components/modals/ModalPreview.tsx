import { useState } from "react";
import { useApp } from "../../context";
import { C, Btn } from "../ui";

export function ModalPreview() {
  const { openModal, closeModal, showToast } = useApp();
  const [chosen, setChosen] = useState<string | null>("B");

  const opts = [
    { key: "A", text: "The woman is sitting at a desk." },
    { key: "B", text: "The man is standing near the window." },
    { key: "C", text: "The people are shaking hands." },
    { key: "D", text: "The books are on the shelf." },
  ];

  const handlePublish = () => {
    closeModal();
    showToast("🎉 Bài thi đã được gửi duyệt thành công!");
  };

  if (openModal !== "modal-preview") return null;

  return (
    <div
      onClick={closeModal}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(2px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: C.white, borderRadius: 12, padding: 28, width: 680, maxWidth: "96vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 4px 24px rgba(28,99,234,0.10)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: C.text1 }}>👁️ Xem trước – TOEIC Full Test #003</h3>
          <button onClick={closeModal} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: C.text2 }}>✕</button>
        </div>

        <div style={{ background: C.bg, borderRadius: 12, padding: 24, fontSize: 13.5 }}>
          {/* Preview header */}
          <div style={{ background: C.primary, color: "#fff", padding: "16px 20px", borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>TOEIC Full Test #003</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>Part 1 – Photographs • 6 câu • Listening</div>
            <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12.5 }}>
              <span>⏱️ Còn lại: <strong>119:45</strong></span>
              <span>📍 Câu 1/200</span>
              <div style={{ flex: 1 }} />
              <span style={{ background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 20 }}>🔊 Đang phát</span>
            </div>
          </div>

          {/* Question */}
          <div style={{ background: C.white, borderRadius: 8, padding: 16, marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: C.text3 }}>Câu 1</div>
            <div style={{ background: C.bg, borderRadius: 8, height: 120, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, fontSize: 32 }}>🖼️</div>
            <div style={{ fontSize: 13, color: C.text2, marginBottom: 10 }}>Nghe và chọn câu mô tả đúng nhất về bức ảnh:</div>
            {opts.map((opt) => {
              const isChosen = chosen === opt.key;
              return (
                <div
                  key={opt.key}
                  onClick={() => { setChosen(opt.key); showToast("✅ Đã chọn đáp án!"); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, marginTop: 8, cursor: "pointer",
                    border: `1.5px solid ${isChosen ? C.success : C.border}`,
                    background: isChosen ? C.tagGreen : C.white,
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => { if (!isChosen) { (e.currentTarget as HTMLElement).style.borderColor = C.primary; (e.currentTarget as HTMLElement).style.background = C.tagBlue; } }}
                  onMouseLeave={(e) => { if (!isChosen) { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.background = C.white; } }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", border: `2px solid ${isChosen ? C.success : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0,
                    background: isChosen ? C.success : "transparent", color: isChosen ? "#fff" : C.text2,
                  }}>
                    {opt.key}
                  </div>
                  {opt.text}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <Btn variant="outline">← Câu trước</Btn>
            <div style={{ fontSize: 12, color: C.text3 }}>1 / 200</div>
            <Btn variant="primary">Câu tiếp →</Btn>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <Btn variant="outline" onClick={closeModal}>Đóng xem trước</Btn>
          <Btn variant="primary" onClick={handlePublish}>✅ Gửi duyệt ngay</Btn>
        </div>
      </div>
    </div>
  );
}
