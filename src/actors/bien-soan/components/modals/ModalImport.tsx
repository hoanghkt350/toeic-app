import { useApp } from "../../context";
import { C, Btn, FormGroup, Select, UploadZone, RadioOpt, Badge } from "../ui";
import { useState } from "react";

const importHistory = [
  { file: "questions_batch_3.xlsx", type: "Câu hỏi", count: "86", date: "10/06", status: "OK" },
  { file: "vocab_business.csv", type: "Từ vựng", count: "120", date: "08/06", status: "OK" },
  { file: "questions_invalid.xlsx", type: "Câu hỏi", count: "0/45", date: "05/06", status: "Lỗi" },
];

export function ModalImport() {
  const { openModal, closeModal, showToast } = useApp();
  const [exportFmt, setExportFmt] = useState("Excel");

  if (openModal !== "modal-import") return null;

  return (
    <div onClick={closeModal} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(2px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.white, borderRadius: 12, padding: 28, width: 560, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 4px 24px rgba(28,99,234,0.10)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: C.text1 }}>📥 Import / Export Nội Dung</h3>
          <button onClick={closeModal} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: C.text2 }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          {/* Import */}
          <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: C.primary }}>📥 Import</div>
            <FormGroup label="Loại nội dung">
              <Select><option>Câu hỏi (Excel/CSV)</option><option>Từ vựng (Excel/CSV)</option><option>Bài thi (JSON)</option></Select>
            </FormGroup>
            <UploadZone icon="📂" label="Kéo thả file hoặc nhấn chọn" sub="Excel, CSV, JSON – tối đa 10MB" />
            <div style={{ marginTop: 8, fontSize: 11.5, color: C.text3 }}>
              💡 <a href="#" onClick={(e) => { e.preventDefault(); showToast("📄 Tải file mẫu..."); }} style={{ color: C.primary }}>Tải file mẫu</a> để biết định dạng đúng
            </div>
            <Btn variant="primary" style={{ width: "100%", marginTop: 10 }} onClick={() => showToast("📥 Đang import 86 câu hỏi...")}>Import ngay</Btn>
          </div>

          {/* Export */}
          <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: C.success }}>📤 Export</div>
            <FormGroup label="Loại nội dung">
              <Select><option>Toàn bộ</option><option>Câu hỏi</option><option>Từ vựng</option><option>Bài thi</option><option>Báo cáo</option></Select>
            </FormGroup>
            <FormGroup label="Định dạng xuất">
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Excel", "CSV", "JSON", "PDF"].map((fmt) => (
                  <RadioOpt key={fmt} active={exportFmt === fmt} onClick={() => setExportFmt(fmt)}>{fmt}</RadioOpt>
                ))}
              </div>
            </FormGroup>
            <FormGroup label="Khoảng thời gian">
              <Select><option>Tất cả</option><option>Tháng này</option><option>3 tháng</option><option>Năm 2025</option></Select>
            </FormGroup>
            <Btn variant="success" style={{ width: "100%" }} onClick={() => showToast("📤 Đang xuất file... sẽ tải về ngay!")}>⬇️ Xuất file</Btn>
          </div>
        </div>

        {/* Import history */}
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: C.text1 }}>📋 Lịch sử Import</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {["File", "Loại", "Số lượng", "Ngày", "Kết quả"].map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11.5, color: C.text3, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {importHistory.map((row, i) => (
              <tr key={i} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F7F9FF")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}>
                <td style={{ padding: "11px 16px", fontSize: 12, borderBottom: `1px solid ${C.border}` }}>{row.file}</td>
                <td style={{ padding: "11px 16px", borderBottom: `1px solid ${C.border}` }}><Badge variant="blue" style={{ fontSize: 10 }}>{row.type}</Badge></td>
                <td style={{ padding: "11px 16px", fontSize: 12, borderBottom: `1px solid ${C.border}` }}>{row.count}</td>
                <td style={{ padding: "11px 16px", fontSize: 11, color: C.text3, borderBottom: `1px solid ${C.border}` }}>{row.date}</td>
                <td style={{ padding: "11px 16px", borderBottom: `1px solid ${C.border}` }}><Badge variant={row.status === "OK" ? "success" : "danger"} style={{ fontSize: 10 }}>{row.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <Btn variant="outline" onClick={closeModal}>Đóng</Btn>
        </div>
      </div>
    </div>
  );
}
