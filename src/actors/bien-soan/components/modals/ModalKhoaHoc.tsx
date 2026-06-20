import { useApp } from "../../context";
import { ModalOverlay, ModalHeader, ModalFooter, Btn, FormGroup, Input, Textarea, Select } from "../ui";

export function ModalKhoaHoc() {
  const { openModal, closeModal, showToast } = useApp();
  return (
    <ModalOverlay open={openModal === "modal-khoahoc"} onClose={closeModal}>
      <ModalHeader title="📖 Tạo Khóa Học Mới" onClose={closeModal} />
      <FormGroup label="Tên khóa học" required>
        <Input placeholder="VD: TOEIC 800+ – Luyện thi chuyên sâu" />
      </FormGroup>
      <FormGroup label="Mô tả khóa học" required>
        <Textarea placeholder="Mô tả nội dung và mục tiêu của khóa học..." style={{ minHeight: 100 }} />
      </FormGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormGroup label="Cấp độ" required>
          <Select>
            <option>Cơ bản (300–500)</option>
            <option>Trung cấp (500–700)</option>
            <option>Nâng cao (700–900)</option>
            <option>Chuyên sâu (900+)</option>
          </Select>
        </FormGroup>
        <FormGroup label="Số bài học dự kiến">
          <Input type="number" defaultValue={15} />
        </FormGroup>
      </div>
      <FormGroup label="Mục tiêu học viên sau khóa">
        <Textarea placeholder="VD: Đạt điểm TOEIC 700+ sau 3 tháng học..." />
      </FormGroup>
      <ModalFooter>
        <Btn variant="outline" onClick={closeModal}>Hủy</Btn>
        <Btn variant="primary" onClick={() => { showToast("✅ Đã tạo khóa học thành công!"); closeModal(); }}>Tạo khóa học</Btn>
      </ModalFooter>
    </ModalOverlay>
  );
}
