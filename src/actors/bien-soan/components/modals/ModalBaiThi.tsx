import { useState } from "react";
import { useApp } from "../../context";
import { ModalOverlay, ModalHeader, ModalFooter, Btn, FormGroup, Input, Textarea, Select, TagPill } from "../ui";

export function ModalBaiThi() {
  const { openModal, closeModal, showToast } = useApp();
  const [tags, setTags] = useState(["TOEIC", "Listening"]);
  const [tagInput, setTagInput] = useState("");

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags((t) => [...t, tagInput.trim()]);
      setTagInput("");
    }
  };

  return (
    <ModalOverlay open={openModal === "modal-baothi"} onClose={closeModal}>
      <ModalHeader title="📝 Tạo Bài Thi TOEIC Mới" onClose={closeModal} />
      <FormGroup label="Tên bài thi" required>
        <Input placeholder="VD: TOEIC Full Test #003" />
      </FormGroup>
      <FormGroup label="Mô tả">
        <Textarea placeholder="Mô tả ngắn về bài thi..." />
      </FormGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormGroup label="Dạng bài thi" required>
          <Select>
            <option>Full Test</option><option>Mini Test</option><option>Practice</option><option>Part Test</option>
          </Select>
        </FormGroup>
        <FormGroup label="Thời gian (phút)" required>
          <Input type="number" defaultValue={120} />
        </FormGroup>
        <FormGroup label="Điểm tối đa" required>
          <Input type="number" defaultValue={990} />
        </FormGroup>
        <FormGroup label="Số câu hỏi" required>
          <Input type="number" defaultValue={200} />
        </FormGroup>
      </div>
      <FormGroup label="Tags">
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 6, border: "1.5px solid var(--t-border)", borderRadius: 8, padding: "8px 10px", background: "var(--t-white)", minHeight: 42, cursor: "text" }}
          onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}
        >
          {tags.map((tag, i) => <TagPill key={i} label={tag} onRemove={() => setTags((t) => t.filter((_, j) => j !== i))} />)}
          <input
            type="text"
            placeholder="Thêm tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            style={{ border: "none", outline: "none", fontSize: 12.5, minWidth: 100, flex: 1, fontFamily: "inherit", background: "transparent" }}
          />
        </div>
      </FormGroup>
      <ModalFooter>
        <Btn variant="outline" onClick={closeModal}>Hủy</Btn>
        <Btn variant="outline" onClick={() => { showToast("💾 Đã lưu nháp!"); closeModal(); }}>Lưu nháp</Btn>
        <Btn variant="primary" onClick={() => { showToast("✅ Đã lưu bài thi thành công!"); closeModal(); }}>Lưu & Gửi duyệt</Btn>
      </ModalFooter>
    </ModalOverlay>
  );
}
