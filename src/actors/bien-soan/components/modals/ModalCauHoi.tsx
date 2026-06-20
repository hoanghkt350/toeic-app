import { useState } from "react";
import { useApp } from "../../context";
import { ModalOverlay, ModalHeader, ModalFooter, Btn, FormGroup, Input, Textarea, Select, RadioOpt } from "../ui";

export function ModalCauHoi() {
  const { openModal, closeModal, showToast } = useApp();
  const [ans, setAns] = useState("A");
  return (
    <ModalOverlay open={openModal === "modal-cauhoi"} onClose={closeModal}>
      <ModalHeader title="❓ Thêm Câu Hỏi Nhanh" onClose={closeModal} />
      <FormGroup label="Loại câu hỏi" required>
        <Select>
          <option>Listening Part 1</option><option>Listening Part 2</option>
          <option>Reading Part 5</option><option>Reading Part 6</option>
          <option>Grammar</option><option>Vocabulary</option>
        </Select>
      </FormGroup>
      <FormGroup label="Nội dung câu hỏi" required>
        <Textarea placeholder="Nhập nội dung câu hỏi..." />
      </FormGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <FormGroup label="Đáp án A"><Input placeholder="Đáp án A" /></FormGroup>
        <FormGroup label="Đáp án B"><Input placeholder="Đáp án B" /></FormGroup>
        <FormGroup label="Đáp án C"><Input placeholder="Đáp án C" /></FormGroup>
        <FormGroup label="Đáp án D"><Input placeholder="Đáp án D" /></FormGroup>
      </div>
      <FormGroup label="Đáp án đúng" required>
        <div style={{ display: "flex", gap: 8 }}>
          {["A", "B", "C", "D"].map((l) => (
            <RadioOpt key={l} active={ans === l} onClick={() => setAns(l)}>{l}</RadioOpt>
          ))}
        </div>
      </FormGroup>
      <ModalFooter>
        <Btn variant="outline" onClick={closeModal}>Hủy</Btn>
        <Btn variant="primary" onClick={() => { showToast("✅ Đã lưu câu hỏi thành công!"); closeModal(); }}>Lưu câu hỏi</Btn>
      </ModalFooter>
    </ModalOverlay>
  );
}
