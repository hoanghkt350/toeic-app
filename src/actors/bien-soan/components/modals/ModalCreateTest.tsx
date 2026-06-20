import { useState } from "react";
import { useApp } from "../../context";
import { C, Btn, FormGroup, Input, Textarea, Select, TagPill, UploadZone, StepBar, RadioOpt, Badge } from "../ui";

const parts = [
  { num: 1, title: "Part 1 – Photographs", info: "Listening • 6 câu • Nhìn ảnh, chọn câu mô tả đúng", q: 6, color: C.primary, badge: "blue" as const },
  { num: 2, title: "Part 2 – Question-Response", info: "Listening • 25 câu • Nghe câu hỏi, chọn câu trả lời đúng", q: 25, color: C.primary, badge: "blue" as const },
  { num: 3, title: "Part 3 – Conversations", info: "Listening • 39 câu • 13 đoạn hội thoại × 3 câu", q: 39, color: C.primary, badge: "blue" as const },
  { num: 4, title: "Part 4 – Talks", info: "Listening • 30 câu • 10 bài nói đơn × 3 câu", q: 30, color: C.accent, badge: "blue" as const },
  { num: 5, title: "Part 5 – Incomplete Sentences", info: "Reading • 30 câu • Điền từ vào chỗ trống", q: 30, color: C.warning, badge: "warning" as const },
  { num: 6, title: "Part 6 – Text Completion", info: "Reading • 16 câu • 4 đoạn văn × 4 câu điền", q: 16, color: C.warning, badge: "warning" as const },
  { num: 7, title: "Part 7 – Reading Comprehension", info: "Reading • 54 câu • Single/Double/Triple passages", q: 54, color: C.danger, badge: "danger" as const },
];

function PartAccordion({ part }: { part: typeof parts[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, marginBottom: 10, overflow: "hidden" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: C.bg, cursor: "pointer", userSelect: "none" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#edf0fa")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = C.bg)}
      >
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: part.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
          {part.num}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text1 }}>{part.title}</div>
          <div style={{ fontSize: 11.5, color: C.text3 }}>{part.info}</div>
        </div>
        <Badge variant={part.badge}>{part.q} câu</Badge>
        <span style={{ color: C.text3 }}>{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <FormGroup label="Số câu hỏi"><Input type="number" defaultValue={part.q} /></FormGroup>
            <FormGroup label="Thời gian gợi ý"><Input defaultValue="Tự động" /></FormGroup>
          </div>
          <FormGroup label="Hướng dẫn (Direction)">
            <Textarea style={{ minHeight: 60 }} defaultValue={`Instructions for ${part.title}`} />
          </FormGroup>
          {part.num <= 4 && (
            <FormGroup label="File âm thanh">
              <UploadZone icon="🎵" label={`Tải lên file MP3 / M4A cho Part ${part.num}`} sub="part1.mp3 – tối đa 50MB" />
            </FormGroup>
          )}
        </div>
      )}
    </div>
  );
}

export function ModalCreateTest() {
  const { openModal, closeModal, openModalFn, showToast } = useApp();
  const [step, setStep] = useState(2);
  const [tags, setTags] = useState(["TOEIC", "Listening", "Reading"]);
  const [tagInput, setTagInput] = useState("");
  const [selectedPart, setSelectedPart] = useState(1);
  const [q1ans, setQ1ans] = useState("A");
  const [pubOpt, setPubOpt] = useState("review");

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags((t) => [...t, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handlePublish = () => {
    closeModal();
    showToast("🎉 Bài thi đã được gửi duyệt thành công!");
  };

  if (openModal !== "modal-create-test") return null;

  return (
    <div
      onClick={closeModal}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        backdropFilter: "blur(2px)", overflowY: "auto", padding: "20px 0",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.white, borderRadius: 12, padding: 28,
          width: 720, maxWidth: "96vw", margin: "auto",
          boxShadow: "0 4px 24px rgba(28,99,234,0.10)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: C.text1 }}>📝 Tạo Bài Thi TOEIC Mới</h3>
          <button onClick={closeModal} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: C.text2 }}>✕</button>
        </div>

        <StepBar current={step} />

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormGroup label="Tên bài thi" required style={{ gridColumn: "1/-1" }}>
                <Input placeholder="VD: TOEIC Full Test #003" defaultValue="TOEIC Full Test #003" />
              </FormGroup>
              <FormGroup label="Mô tả" style={{ gridColumn: "1/-1" }}>
                <Textarea defaultValue="Bài thi TOEIC đầy đủ 200 câu, bao gồm 7 phần Listening và Reading theo chuẩn ETS." />
              </FormGroup>
              <FormGroup label="Dạng bài thi" required>
                <Select><option>Full Test (7 Parts)</option><option>Mini Test</option><option>Part Test</option><option>Practice</option></Select>
              </FormGroup>
              <FormGroup label="Thời gian làm bài (phút)">
                <Input type="number" defaultValue={120} />
              </FormGroup>
              <FormGroup label="Điểm tối đa">
                <Input type="number" defaultValue={990} />
              </FormGroup>
              <FormGroup label="Cấp độ">
                <Select defaultValue="Trung cấp (500-700)"><option>Tất cả cấp độ</option><option>Cơ bản (300-500)</option><option>Trung cấp (500-700)</option><option>Nâng cao (700+)</option></Select>
              </FormGroup>
              <FormGroup label="Tags" style={{ gridColumn: "1/-1" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", background: C.white, minHeight: 42 }}>
                  {tags.map((tag, i) => <TagPill key={i} label={tag} onRemove={() => setTags((t) => t.filter((_, j) => j !== i))} />)}
                  <input type="text" placeholder="Thêm tag..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} style={{ border: "none", outline: "none", fontSize: 12.5, minWidth: 100, flex: 1, fontFamily: "inherit", background: "transparent" }} />
                </div>
              </FormGroup>
              <div style={{ gridColumn: "1/-1" }}>
                <FormGroup label="File hướng dẫn (PDF, tùy chọn)">
                  <UploadZone icon="📄" label="Kéo thả file hoặc nhấn để chọn" sub="PDF, DOCX – tối đa 10MB" />
                </FormGroup>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              <Btn variant="outline" onClick={closeModal}>Hủy</Btn>
              <Btn variant="primary" onClick={() => setStep(2)}>Tiếp theo: Cấu trúc →</Btn>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>Cấu trúc 7 Parts – TOEIC Chuẩn</div>
                <div style={{ fontSize: 12, color: C.text3 }}>Nhấn vào mỗi Part để chỉnh sửa</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Badge variant="blue">Tổng: 200 câu</Badge>
                <Badge variant="success">120 phút</Badge>
              </div>
            </div>
            {parts.map((p) => <PartAccordion key={p.num} part={p} />)}
            <div style={{ background: C.tagBlue, borderRadius: 8, padding: "12px 16px", marginTop: 4, fontSize: 12.5, color: C.primary }}>
              ✅ Tổng cộng: <strong>200 câu</strong> • Listening: <strong>100 câu</strong> • Reading: <strong>100 câu</strong>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              <Btn variant="outline" onClick={() => setStep(1)}>← Quay lại</Btn>
              <Btn variant="primary" onClick={() => setStep(3)}>Tiếp theo: Câu hỏi →</Btn>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>Thêm câu hỏi vào từng Part</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="outline" style={{ fontSize: 12 }} onClick={() => showToast("📥 Chức năng import Excel sẽ sớm có!")}>📥 Import Excel</Btn>
                <Btn variant="outline" style={{ fontSize: 12 }} onClick={() => showToast("🔗 Chọn từ ngân hàng câu hỏi...")}>🏦 Từ ngân hàng</Btn>
              </div>
            </div>
            {/* Part tabs */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {parts.map((p) => (
                <Btn
                  key={p.num}
                  variant={selectedPart === p.num ? "primary" : "outline"}
                  style={{ fontSize: 11.5, padding: "5px 12px" }}
                  onClick={() => { setSelectedPart(p.num); showToast(`📋 Part ${p.num} đang được hiển thị`); }}
                >
                  Part {p.num} ({p.q})
                </Btn>
              ))}
            </div>
            {/* Q content */}
            <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.primary, marginBottom: 12 }}>
                📸 Part {selectedPart} – {parts[selectedPart - 1].title.split("–")[1]?.trim()} ({parts[selectedPart - 1].q} câu)
              </div>
              {selectedPart <= 4 && (
                <FormGroup label="File âm thanh" required>
                  <UploadZone icon="🎵" label="Kéo thả hoặc chọn file MP3" sub="part_audio.mp3 – tối đa 50MB" />
                </FormGroup>
              )}
              {/* Q1 */}
              <div style={{ background: C.bg, borderRadius: 8, padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.primary, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.text1 }}>Câu 1</span>
                  <Badge variant="success" style={{ marginLeft: "auto" }}>Đã có âm thanh</Badge>
                </div>
                {selectedPart <= 4 && (
                  <FormGroup label="Hình ảnh đính kèm">
                    <UploadZone icon="🖼️" label={`Tải ảnh cho câu 1`} sub="JPG, PNG – tối đa 5MB" />
                  </FormGroup>
                )}
                <FormGroup label="Nội dung câu hỏi" required>
                  <Textarea placeholder="Nhập câu hỏi..." defaultValue={selectedPart <= 4 ? "Nghe và chọn câu mô tả đúng nhất:" : "The manager _____ the report before the meeting."} />
                </FormGroup>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                  <FormGroup label="Đáp án A"><Input defaultValue="The woman is sitting at a desk." /></FormGroup>
                  <FormGroup label="Đáp án B"><Input defaultValue="The man is standing near the window." /></FormGroup>
                  <FormGroup label="Đáp án C"><Input defaultValue="The people are shaking hands." /></FormGroup>
                  <FormGroup label="Đáp án D"><Input defaultValue="The books are on the shelf." /></FormGroup>
                </div>
                <FormGroup label="Đáp án đúng" style={{ marginTop: 4 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["A", "B", "C", "D"].map((l) => <RadioOpt key={l} active={q1ans === l} onClick={() => setQ1ans(l)}>{l}</RadioOpt>)}
                  </div>
                </FormGroup>
              </div>
              <Btn variant="outline" style={{ width: "100%", fontSize: 12.5 }} onClick={() => showToast("➕ Đã thêm câu hỏi mới!")}>+ Thêm câu hỏi</Btn>
            </div>
            <div style={{ background: C.tagOrange, borderRadius: 8, padding: "10px 14px", marginTop: 12, fontSize: 12, color: C.warning }}>
              ⚠️ Đã thêm 1/{parts[selectedPart - 1].q} câu hỏi cho Part {selectedPart}. Cần thêm {parts[selectedPart - 1].q - 1} câu nữa.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              <Btn variant="outline" onClick={() => setStep(2)}>← Quay lại</Btn>
              <Btn variant="outline" onClick={() => showToast("💾 Đã lưu nháp!")}>Lưu nháp</Btn>
              <Btn variant="primary" onClick={() => setStep(4)}>Tiếp theo: Xuất bản →</Btn>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: C.text1 }}>Bài thi đã sẵn sàng!</div>
              <div style={{ fontSize: 13, color: C.text2 }}>Kiểm tra lại thông tin trước khi gửi duyệt</div>
            </div>
            <div style={{ background: C.bg, borderRadius: 12, padding: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: C.text1 }}>📋 Tóm tắt bài thi</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }}>
                {[
                  ["Tên:", "TOEIC Full Test #003"],
                  ["Dạng:", "Full Test (7 Parts)"],
                  ["Tổng câu:", "200 câu"],
                  ["Thời gian:", "120 phút"],
                  ["Điểm tối đa:", "990đ"],
                ].map(([k, v], i) => (
                  <div key={i}><span style={{ color: C.text3 }}>{k}</span> <strong>{v}</strong></div>
                ))}
                <div><span style={{ color: C.text3 }}>Trạng thái:</span> <Badge variant="warning">Chờ duyệt</Badge></div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { val: "review", label: "Gửi duyệt", sub: "Gửi cho Admin kiểm duyệt trước khi xuất bản cho học viên" },
                { val: "draft", label: "Lưu nháp", sub: "Lưu lại để chỉnh sửa thêm, chưa gửi duyệt" },
              ].map((opt) => (
                <label
                  key={opt.val}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, cursor: "pointer", padding: 12, border: `1.5px solid ${pubOpt === opt.val ? C.primary : C.border}`, borderRadius: 8, background: pubOpt === opt.val ? C.tagBlue : C.white }}
                >
                  <input type="radio" name="pub-opt" checked={pubOpt === opt.val} onChange={() => setPubOpt(opt.val)} style={{ marginTop: 2, accentColor: C.primary }} />
                  <div>
                    <strong>{opt.label}</strong>
                    <div style={{ fontSize: 11.5, color: C.text3 }}>{opt.sub}</div>
                  </div>
                </label>
              ))}
            </div>
            <FormGroup label="Ghi chú cho Admin (tùy chọn)" style={{ marginTop: 14 }}>
              <Textarea placeholder="VD: Bài thi này dùng cho kỳ thi tháng 7/2025..." />
            </FormGroup>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
              <Btn variant="outline" onClick={() => setStep(3)}>← Quay lại</Btn>
              <Btn variant="outline" onClick={() => { showToast("👁️ Đang mở xem trước..."); setTimeout(() => openModalFn("modal-preview"), 300); }}>Xem trước</Btn>
              <Btn variant="primary" onClick={handlePublish}>✅ Gửi duyệt</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
