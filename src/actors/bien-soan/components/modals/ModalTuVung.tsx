import { useApp } from "../../context";
import { ModalOverlay, ModalHeader, ModalFooter, Btn, FormGroup, Input, Textarea, Select } from "../ui";

export function ModalTuVung() {
  const { openModal, closeModal, showToast } = useApp();
  return (
    <ModalOverlay open={openModal === "modal-tuvung"} onClose={closeModal}>
      <ModalHeader title="🔤 Thêm Từ Vựng Mới" onClose={closeModal} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormGroup label="Từ vựng" required>
          <Input placeholder="VD: negotiate" />
        </FormGroup>
        <FormGroup label="Phiên âm">
          <Input placeholder="VD: /nɪˈɡoʊʃieɪt/" />
        </FormGroup>
      </div>
      <FormGroup label="Nghĩa tiếng Việt" required>
        <Input placeholder="VD: đàm phán, thương lượng" />
      </FormGroup>
      <FormGroup label="Ví dụ câu">
        <Textarea placeholder="VD: They negotiate a new contract every year." />
      </FormGroup>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormGroup label="Chủ đề" required>
          <Select>
            <option>Business</option><option>Technology</option><option>Travel</option>
            <option>Health</option><option>General</option>
          </Select>
        </FormGroup>
        <FormGroup label="Mức độ" required>
          <Select>
            <option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option>
          </Select>
        </FormGroup>
      </div>
      <ModalFooter>
        <Btn variant="outline" onClick={closeModal}>Hủy</Btn>
        <Btn variant="purple" onClick={() => { showToast("✅ Đã lưu từ vựng thành công!"); closeModal(); }}>Lưu từ vựng</Btn>
      </ModalFooter>
    </ModalOverlay>
  );
}
