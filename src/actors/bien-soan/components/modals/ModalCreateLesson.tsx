import { useState } from "react";
import { useApp } from "../../context";
import { C, Btn, FormGroup, Input, Select, TagPill, UploadZone, RadioOpt } from "../ui";

export function ModalCreateLesson() {
  const { openModal, closeModal, showToast } = useApp();
  const [tags, setTags] = useState(["Listening", "Part 1", "TOEIC"]);
  const [tagInput, setTagInput] = useState("");
  const [diff, setDiff] = useState("TB");
  const [boldActive, setBoldActive] = useState(true);

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) { e.preventDefault(); setTags((t) => [...t, tagInput.trim()]); setTagInput(""); }
  };

  if (openModal !== "modal-create-lesson") return null;

  return (
    <div
      onClick={closeModal}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", backdropFilter: "blur(2px)", overflowY: "auto", padding: "20px 0" }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.white, borderRadius: 12, padding: 28, width: 780, maxWidth: "96vw", margin: "auto", boxShadow: "0 4px 24px rgba(28,99,234,0.10)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: C.text1 }}>📖 Tạo Bài Học Mới</h3>
          <button onClick={closeModal} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: C.text2 }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 18 }}>
          {/* Left */}
          <div>
            <FormGroup label="Tiêu đề bài học" required>
              <Input style={{ fontSize: 16, fontWeight: 600 }} defaultValue="Listening Part 1 – Photos (Bài 4)" />
            </FormGroup>

            <FormGroup label="Nội dung bài học" required>
              {/* Toolbar */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", padding: "8px 12px", background: C.bg, border: `1.5px solid ${C.border}`, borderBottom: "none", borderRadius: "8px 8px 0 0" }}>
                {[
                  { label: "B", title: "Bold", active: boldActive, onClick: () => { setBoldActive(!boldActive); } },
                  { label: "I", title: "Italic" },
                  { label: "U", title: "Underline" },
                ].map((btn, i) => (
                  <button key={i} title={btn.title} onClick={btn.onClick}
                    style={{ width: 30, height: 28, borderRadius: 6, border: `1px solid ${btn.active ? C.primary : "transparent"}`, background: btn.active ? C.primary : "transparent", cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: btn.active ? "#fff" : C.text2 }}
                  >
                    {btn.label}
                  </button>
                ))}
                <div style={{ width: 1, height: 20, background: C.border, margin: "0 4px" }} />
                {["H1", "H2"].map((h) => (
                  <button key={h} onClick={() => showToast(`${h} đã được áp dụng!`)} style={{ width: 30, height: 28, borderRadius: 6, border: "1px solid transparent", background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: 700, color: C.text2 }}>{h}</button>
                ))}
                <div style={{ width: 1, height: 20, background: C.border, margin: "0 4px" }} />
                {[["🖼️", "📷 Chèn ảnh..."], ["🎵", "🎵 Chèn file âm thanh..."], ["📹", "📹 Chèn video YouTube..."], ["🔗", "🔗 Chèn đường link..."]].map(([icon, msg]) => (
                  <button key={icon} onClick={() => showToast(msg)} style={{ width: 30, height: 28, borderRadius: 6, border: "1px solid transparent", background: "transparent", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</button>
                ))}
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                style={{ minHeight: 180, padding: 16, border: `1.5px solid ${C.border}`, borderRadius: "0 0 8px 8px", fontSize: 13.5, lineHeight: 1.7, outline: "none", background: C.white, color: C.text1 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
                onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
              >
                <h3 style={{ fontSize: 15, marginBottom: 8 }}>🎯 Mục tiêu bài học</h3>
                <ul style={{ paddingLeft: 18, marginBottom: 14, color: C.text2, fontSize: 13 }}>
                  <li>Nhận biết và mô tả hình ảnh trong TOEIC Listening Part 1</li>
                  <li>Nắm vững từ vựng mô tả người, địa điểm và hoạt động</li>
                </ul>
                <h3 style={{ fontSize: 15, marginBottom: 8 }}>📚 Nội dung chính</h3>
                <p style={{ color: C.text2, fontSize: 13, lineHeight: 1.7 }}>Trong Part 1 của bài thi TOEIC, bạn sẽ nghe một câu mô tả về một bức ảnh và chọn câu đúng nhất trong 4 lựa chọn...</p>
              </div>
            </FormGroup>

            {/* Vocab table */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: C.text1, marginBottom: 6 }}>
                Từ vựng trọng tâm
                <Btn variant="outline" style={{ fontSize: 11, padding: "3px 10px" }} onClick={() => showToast("➕ Đã thêm hàng từ vựng!")}>+ Thêm từ</Btn>
              </label>
              <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: C.bg }}>
                      {["Từ vựng", "Phiên âm", "Nghĩa"].map((h) => <th key={h} style={{ padding: "8px 12px", fontSize: 11, color: C.text3, textAlign: "left" }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[["describe", "/dɪˈskraɪb/", "mô tả, miêu tả"], ["adjacent", "/əˈdʒeɪsnt/", "kề liền, tiếp giáp"], ["facing", "/ˈfeɪsɪŋ/", "đang đối mặt với"]].map(([w, p, m], i) => (
                      <tr key={i} style={{ background: i % 2 === 1 ? C.bg : "transparent" }}>
                        <td><input defaultValue={w} style={{ border: "none", outline: "none", fontSize: 12.5, fontWeight: 600, width: "100%", padding: "8px 12px", background: "transparent", fontFamily: "inherit" }} /></td>
                        <td><input defaultValue={p} style={{ border: "none", outline: "none", fontSize: 12, color: C.text3, width: "100%", padding: 8, background: "transparent", fontFamily: "inherit" }} /></td>
                        <td><input defaultValue={m} style={{ border: "none", outline: "none", fontSize: 12, width: "100%", padding: 8, background: "transparent", fontFamily: "inherit" }} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audio */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text1, marginBottom: 6, display: "block" }}>File âm thanh đính kèm</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, border: `1.5px solid ${C.border}`, borderRadius: 8, background: C.bg }}>
                <Btn variant="primary" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => showToast("▶ Đang phát thử...")}>▶ Nghe thử</Btn>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: C.text1 }}>listening_part1_unit4.mp3</div>
                  <div style={{ fontSize: 11, color: C.text3 }}>2:34 • 3.2MB</div>
                </div>
                <Btn variant="outline" style={{ fontSize: 11.5, padding: "5px 10px", marginLeft: "auto" }} onClick={() => showToast("🔄 Chọn file thay thế...")}>↻ Thay thế</Btn>
              </div>
            </div>
          </div>

          {/* Right settings */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, fontWeight: 600, fontSize: 13, color: C.text1 }}>⚙️ Cài đặt</div>
              <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                <FormGroup label="Thuộc khóa học" style={{ marginBottom: 0 }}>
                  <Select style={{ fontSize: 12.5 }}><option>TOEIC 700+ – Nâng cao</option><option>TOEIC 500+ – Cơ bản</option></Select>
                </FormGroup>
                <FormGroup label="Unit / Chương" style={{ marginBottom: 0 }}>
                  <Select style={{ fontSize: 12.5 }}><option>Unit 4: Listening Skills</option><option>Unit 1: Introduction</option></Select>
                </FormGroup>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <FormGroup label="Thứ tự" style={{ marginBottom: 0 }}><Input type="number" defaultValue={4} style={{ fontSize: 12.5 }} /></FormGroup>
                  <FormGroup label="Thời lượng" style={{ marginBottom: 0 }}><Select style={{ fontSize: 12.5 }}><option>45 phút</option><option>30 phút</option><option>60 phút</option></Select></FormGroup>
                </div>
                <FormGroup label="Độ khó" style={{ marginBottom: 0 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["Dễ", "TB", "Khó"].map((d) => <RadioOpt key={d} active={diff === d} onClick={() => setDiff(d)}>{d}</RadioOpt>)}
                  </div>
                </FormGroup>
              </div>
            </div>

            <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, fontWeight: 600, fontSize: 13, color: C.text1 }}>🏷️ Tags</div>
              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", minHeight: 42, cursor: "text" }} onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}>
                  {tags.map((tag, i) => <TagPill key={i} label={tag} onRemove={() => setTags((t) => t.filter((_, j) => j !== i))} />)}
                  <input type="text" placeholder="Thêm tag..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} style={{ border: "none", outline: "none", fontSize: 12.5, minWidth: 80, flex: 1, fontFamily: "inherit", background: "transparent" }} />
                </div>
              </div>
            </div>

            <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, fontWeight: 600, fontSize: 13, color: C.text1 }}>🖼️ Thumbnail</div>
              <div style={{ padding: 14 }}><UploadZone icon="🖼️" label="Tải ảnh bìa" sub="JPG, PNG – 1280×720px" /></div>
            </div>

            <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, fontWeight: 600, fontSize: 13, color: C.text1 }}>📤 Xuất bản</div>
              <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <Btn variant="outline" style={{ width: "100%", fontSize: 12.5 }} onClick={() => showToast("💾 Đã lưu nháp bài học!")}>💾 Lưu nháp</Btn>
                <Btn variant="primary" style={{ width: "100%", fontSize: 12.5 }} onClick={() => { showToast("✅ Bài học đã được gửi duyệt!"); closeModal(); }}>✅ Gửi duyệt</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
