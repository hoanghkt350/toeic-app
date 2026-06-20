// src/app/components/ScreenQuanLyDeThi.tsx
import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Eye, X, ChevronDown, ChevronUp } from "lucide-react";
import type { TestItem, QuestionItem, Screen } from "../App";

const statusColor: Record<string, { bg: string; text: string }> = {
  "Nháp": { bg: "#F1F5F9", text: "#64748B" },
  "Xuất bản": { bg: "#D1FAE5", text: "#065F46" },
};

const statusLabel: Record<string, string> = {
  "Nháp": "Nháp",
  "Xuất bản": "Đã xuất bản",
};

const mockParts = [
  { id: "p1", label: "Part 1", sub: "Photographs", count: 6 },
  { id: "p2", label: "Part 2", sub: "Question-Response", count: 25 },
  { id: "p3", label: "Part 3", sub: "Conversations", count: 39 },
  { id: "p4", label: "Part 4", sub: "Short Talks", count: 30 },
  { id: "p5", label: "Part 5", sub: "Incomplete Sentences", count: 30 },
  { id: "p6", label: "Part 6", sub: "Text Completion", count: 16 },
  { id: "p7", label: "Part 7", sub: "Reading Comprehension", count: 54 },
];

interface Props {
  tests: TestItem[];
  setTests: React.Dispatch<React.SetStateAction<TestItem[]>>;
  onNavigate?: (screen: Screen) => void;
  onEditTest?: (test: TestItem) => void;
  showToast?: (msg: string) => void;
}

function PreviewModal({ test, onClose }: { test: TestItem; onClose: () => void }) {
  const parts = test.parts ?? mockParts;
  const questions = test.questions || [];
  const [expandedPartId, setExpandedPartId] = useState<string | null>(null);

  const togglePart = (partId: string) => {
    setExpandedPartId(prev => prev === partId ? null : partId);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="rounded-xl bg-white flex flex-col" style={{ width: 720, maxHeight: "90vh", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#E2E8F0" }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{test.ten}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span style={{ fontSize: 12, color: "#64748B" }}>Mã đề: {test.id}</span>
              <span style={{ fontSize: 12, color: "#64748B" }}>Ngày tạo: {test.ngayTao}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: statusColor[test.trangThai].bg, color: statusColor[test.trangThai].text }}>{statusLabel[test.trangThai]}</span>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center justify-center rounded-lg hover:bg-slate-100" style={{ width: 32, height: 32 }}>
            <X size={16} style={{ color: "#64748B" }} />
          </button>
        </div>

        <div className="flex gap-6 px-6 py-4 border-b" style={{ borderColor: "#F1F5F9", background: "#F8FAFC", flexShrink: 0 }}>
          <div className="text-center">
            <p style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tổng số câu</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#2563EB" }}>{test.soCau}</p>
          </div>
          <div style={{ width: 1, background: "#E2E8F0" }} />
          <div className="text-center">
            <p style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Số phần</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#0F172A" }}>{parts.length}</p>
          </div>
          <div style={{ width: 1, background: "#E2E8F0" }} />
          <div className="text-center">
            <p style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Thời gian</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#0F172A" }}>120 phút</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 bg-slate-50">
          <p style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Cấu trúc đề thi (Bấm vào phần để xem câu hỏi)</p>
          
          <div className="flex flex-col gap-3">
            {parts.map((part) => {
              const isExpanded = expandedPartId === part.id;
              const partQuestions = questions.filter(q => q && q.partId === part.id);
              
              return (
                <div key={part.id} className="rounded-xl overflow-hidden border border-border bg-white transition-all duration-200 shadow-sm" style={{ borderColor: isExpanded ? "#BFDBFE" : "#E2E8F0" }}>
                  <div 
                    className="flex items-center justify-between px-5 py-3 cursor-pointer select-none transition-colors"
                    style={{ background: isExpanded ? "#EFF6FF" : "#fff" }}
                    onClick={() => togglePart(part.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span style={{ fontSize: 14, fontWeight: 700, color: isExpanded ? "#1D4ED8" : "#0F172A" }}>{part.label}</span>
                        <span style={{ fontSize: 12, color: isExpanded ? "#3B82F6" : "#64748B" }}>{part.sub}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-48 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(part.count / test.soCau) * 100}%` }}></div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#2563EB", minWidth: 45, textAlign: "right" }}>{part.count} câu</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-500">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 py-4 bg-slate-50 border-t border-blue-100">
                      {partQuestions.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {partQuestions.map((q, qIndex) => (
                            <div key={q.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <div className="flex items-start justify-between mb-3">
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", lineHeight: 1.5 }}>
                                  <span className="text-blue-600 mr-1">Câu hỏi:</span> 
                                  {q.text || "(Chưa nhập nội dung câu hỏi)"}
                                </p>
                                {q.skill === "Listening" && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-700 whitespace-nowrap ml-2">Nghe</span>}
                                {q.skill === "Reading" && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700 whitespace-nowrap ml-2">Đọc</span>}
                                {q.skill === "Writing" && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-700 whitespace-nowrap ml-2">Viết</span>}
                              </div>
                              
                              {q.skill !== "Writing" && q.options ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pl-2">
                                  {(["A", "B", "C", "D"] as const).map((opt) => (
                                    <div key={opt} className="flex items-start gap-2">
                                      <span style={{
                                        width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1,
                                        background: q.correctAnswer === opt ? "#2563EB" : "#F1F5F9",
                                        color: q.correctAnswer === opt ? "#fff" : "#64748B",
                                        boxShadow: q.correctAnswer === opt ? "0 2px 4px rgba(37,99,235,0.2)" : "none"
                                      }}>{opt}</span>
                                      <span style={{ 
                                        fontSize: 13, 
                                        color: q.correctAnswer === opt ? "#0F172A" : "#475569", 
                                        fontWeight: q.correctAnswer === opt ? 600 : 400,
                                        paddingTop: 2
                                      }}>
                                        {q.options?.[opt] || `Lựa chọn ${opt}`}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-3 bg-orange-50 rounded border border-orange-100 mt-2">
                                  <p className="text-xs text-orange-700 italic">Câu hỏi tự luận (Essay). Chấm điểm bằng AI.</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-white rounded-lg border border-slate-200 border-dashed">
                          <p className="text-sm text-slate-500">Chưa có dữ liệu câu hỏi cho phần này.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t bg-white" style={{ borderColor: "#E2E8F0", flexShrink: 0 }}>
          <button onClick={onClose} className="px-5 py-2 rounded-lg border transition-colors hover:bg-slate-50" style={{ fontSize: 14, fontWeight: 500, color: "#374151", background: "#fff", borderColor: "#E2E8F0", cursor: "pointer" }}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ test, onSave, onClose }: { test: TestItem; onSave: (t: TestItem) => void; onClose: () => void }) {
  const parts = test.parts ?? mockParts;
  const [ten, setTen] = useState(test.ten);
  const [partCounts, setPartCounts] = useState<Record<string, number>>(
    Object.fromEntries(parts.map((p) => [p.id, p.count]))
  );
  const totalCau = Object.values(partCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="rounded-xl bg-white flex flex-col" style={{ width: 600, maxHeight: "85vh", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#E2E8F0" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Chỉnh sửa tên & cấu trúc</h3>
          <button onClick={onClose} className="flex items-center justify-center rounded-lg hover:bg-gray-100" style={{ width: 32, height: 32 }}>
            <X size={16} style={{ color: "#64748B" }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>Tên đề thi</label>
            <input type="text" value={ten} onChange={(e) => setTen(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8F0", outline: "none", fontSize: 14, boxSizing: "border-box" }} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Số câu theo từng phần</label>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#2563EB" }}>Tổng: {totalCau} câu</span>
            </div>
            <div className="flex flex-col gap-2">
              {parts.map((part) => (
                <div key={part.id} className="flex items-center justify-between rounded-lg px-4 py-2.5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{part.label}</span>
                    <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: 8 }}>{part.sub}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPartCounts(prev => ({ ...prev, [part.id]: Math.max(0, prev[part.id] - 1) }))} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#374151" }}>-</button>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", minWidth: 28, textAlign: "center" }}>{partCounts[part.id]}</span>
                    <button onClick={() => setPartCounts(prev => ({ ...prev, [part.id]: prev[part.id] + 1 }))} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#374151" }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "#E2E8F0" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", fontSize: 14, color: "#374151", cursor: "pointer" }}>Hủy</button>
          <button onClick={() => { onSave({ ...test, ten, soCau: totalCau, parts: parts.map((p) => ({ ...p, count: partCounts[p.id] })) }); }} style={{ padding: "8px 16px", borderRadius: 8, background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

export function ScreenQuanLyDeThi({ tests, setTests, onNavigate, onEditTest, showToast }: Props) {
  const [search, setSearch] = useState("");
  const [previewTest, setPreviewTest] = useState<TestItem | null>(null);
  const [editTest, setEditTest] = useState<TestItem | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filtered = tests.filter(
    (t) => t.ten.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when search changes
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
    if (showToast) showToast("Đã xóa đề thi!");
  };

  const handleSaveEdit = (updated: TestItem) => {
    setTests((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    setEditTest(null);
    if (showToast) showToast("Đã cập nhật cấu trúc đề thi thành công!");
  };

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontWeight: 600, fontSize: 18, color: "#0F172A" }}>Ngân hàng Đề thi</h2>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
            {tests.length} đề thi — {tests.filter((t) => t.trangThai === "Xuất bản").length} đã xuất bản
          </p>
        </div>
        <button onClick={() => onEditTest && onEditTest(null as any)} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-opacity hover:opacity-90" style={{ background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", border: "none" }}>
          <Plus size={16} />
          Tạo đề mới
        </button>
      </div>

      <div className="flex items-center gap-2 px-3 rounded-lg border border-border" style={{ background: "#fff", height: 38, width: 300 }}>
        <Search size={15} style={{ color: "#94A3B8", flexShrink: 0 }} />
        <input placeholder="Tìm theo mã đề hoặc tên..." value={search} onChange={(e) => handleSearchChange(e.target.value)} style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#0F172A", width: "100%" }} />
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
              {["Mã đề", "Tên đề thi", "Số câu", "Ngày tạo", "Trạng thái", "Thao tác"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((test, idx) => {
              const sc = statusColor[test.trangThai];
              return (
                <tr key={test.id} style={{ borderBottom: idx < currentData.length - 1 ? "1px solid #F1F5F9" : "none", transition: "background 0.12s" }} className="hover:bg-slate-50">
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#2563EB", fontFamily: "monospace" }}>{test.id}</td>
                  <td style={{ padding: "14px 16px", fontSize: 14, color: "#0F172A", fontWeight: 500 }}>{test.ten}</td>
                  <td style={{ padding: "14px 16px", fontSize: 14, color: "#64748B" }}>{test.soCau}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B" }}>{test.ngayTao}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.text }}>{statusLabel[test.trangThai]}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setPreviewTest(test)} className="flex items-center justify-center rounded-md transition-colors hover:bg-blue-100" style={{ width: 32, height: 32, border: "none", background: "transparent", cursor: "pointer" }} title="Xem chi tiết">
                        <Eye size={16} style={{ color: "#2563EB" }} />
                      </button>
                      <button onClick={() => onEditTest ? onEditTest(test) : setEditTest(test)} className="flex items-center justify-center rounded-md transition-colors hover:bg-slate-200" style={{ width: 32, height: 32, border: "none", background: "transparent", cursor: "pointer" }} title="Soạn thảo / Chỉnh sửa đề">
                        <Edit2 size={16} style={{ color: "#475569" }} />
                      </button>
                      <button onClick={() => handleDelete(test.id)} className="flex items-center justify-center rounded-md transition-colors hover:bg-red-100" style={{ width: 32, height: 32, border: "none", background: "transparent", cursor: "pointer" }} title="Xóa">
                        <Trash2 size={16} style={{ color: "#EF4444" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {currentData.length === 0 && (
          <div style={{ padding: "40px 16px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>Không tìm thấy đề thi phù hợp.</div>
        )}
        <div className="flex items-center justify-between border-t border-border" style={{ padding: "12px 16px", background: "#F8FAFC" }}>
          <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>
            Hiển thị {currentData.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} / {filtered.length} đề thi
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button 
                  key={p} 
                  onClick={() => setCurrentPage(p)}
                  style={{ width: 32, height: 32, borderRadius: 8, border: p === currentPage ? "1px solid #2563EB" : "1px solid #E2E8F0", background: p === currentPage ? "#EFF6FF" : "#fff", color: p === currentPage ? "#2563EB" : "#64748B", fontSize: 13, fontWeight: p === currentPage ? 600 : 400, cursor: "pointer" }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {previewTest && <PreviewModal test={previewTest} onClose={() => setPreviewTest(null)} />}
      {editTest && <EditModal test={editTest} onSave={handleSaveEdit} onClose={() => setEditTest(null)} />}
    </div>
  );
}