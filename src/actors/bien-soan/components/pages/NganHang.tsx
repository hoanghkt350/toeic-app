import { useState } from "react";
import { useApp } from "../../context";
import {
  C, Card, CardHeader, CardTitle, Badge, Btn, FilterBar, SearchInput, Pagination, IconBtn,
  FormGroup, Textarea, Input, Select, RadioOpt,
} from "../ui";

const initialData = [
  { id: 1, code: "Q-001", type: "Listening P1", typeBadge: "blue" as const, question: "Look at the picture. What is the woman doing?", level: "Dễ", levelBadge: "success" as const, used: "12 lần", cat: "Listening" },
  { id: 2, code: "Q-002", type: "Reading P5", typeBadge: "blue" as const, question: "The manager _____ the report before the meeting.", level: "Trung bình", levelBadge: "warning" as const, used: "8 lần", cat: "Reading" },
  { id: 3, code: "Q-003", type: "Grammar", typeBadge: "purple" as const, question: "Identify the error in the following sentence.", level: "Khó", levelBadge: "danger" as const, used: "5 lần", cat: "Grammar" },
  { id: 4, code: "Q-004", type: "Vocabulary", typeBadge: "success" as const, question: 'Choose the word with the closest meaning to "negotiate".', level: "Dễ", levelBadge: "success" as const, used: "20 lần", cat: "Vocabulary" },
  { id: 5, code: "Q-005", type: "Listening P2", typeBadge: "blue" as const, question: "Where will the meeting be held tomorrow?", level: "Trung bình", levelBadge: "warning" as const, used: "15 lần", cat: "Listening" },
  { id: 6, code: "Q-006", type: "Reading P6", typeBadge: "blue" as const, question: "Read the passage and answer the question below.", level: "Khó", levelBadge: "danger" as const, used: "3 lần", cat: "Reading" },
];

const CATS = ["Tất cả", "Listening", "Reading", "Grammar", "Vocabulary"];

export function NganHang() {
  const { openModalFn, showToast } = useApp();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("Tất cả");
  const [answerSel, setAnswerSel] = useState("A");
  const [levelSel, setLevelSel] = useState("Dễ");
  const [qType, setQType] = useState("Listening Part 1");
  const [qText, setQText] = useState("");
  const [answers, setAnswers] = useState({ A: "", B: "", C: "", D: "" });
  const [explanation, setExplanation] = useState("");

  const filtered = data.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.question.toLowerCase().includes(q) || r.code.toLowerCase().includes(q);
    const matchCat = activeCat === "Tất cả" || r.cat === activeCat;
    return matchSearch && matchCat;
  });

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa câu hỏi này không?")) {
      setData((d) => d.filter((r) => r.id !== id));
      showToast("🗑️ Đã xóa thành công!");
    }
  };

  const handleSave = () => {
    if (!qText.trim()) { showToast("⚠️ Vui lòng nhập nội dung câu hỏi!"); return; }
    const newItem = {
      id: Date.now(),
      code: `Q-${String(data.length + 1).padStart(3, "0")}`,
      type: qType,
      typeBadge: "blue" as const,
      question: qText,
      level: levelSel,
      levelBadge: levelSel === "Dễ" ? "success" as const : levelSel === "Trung bình" ? "warning" as const : "danger" as const,
      used: "0 lần",
      cat: qType.includes("Listening") ? "Listening" : qType.includes("Reading") ? "Reading" : qType === "Grammar" ? "Grammar" : "Vocabulary",
    };
    setData((d) => [newItem, ...d]);
    setQText("");
    setAnswers({ A: "", B: "", C: "", D: "" });
    setExplanation("");
    showToast("✅ Đã thêm câu hỏi vào ngân hàng!");
  };

  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, alignItems: "start" }}>
        {/* Left: Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ngân Hàng Câu Hỏi</CardTitle>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn variant="outline" style={{ fontSize: 12 }} onClick={() => openModalFn("modal-import")}>📥 Import Excel</Btn>
              <Btn variant="primary" onClick={() => openModalFn("modal-cauhoi")}>+ Thêm câu hỏi</Btn>
            </div>
          </CardHeader>
          <FilterBar>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATS.map((cat) => (
                <span
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  style={{
                    display: "inline-flex", alignItems: "center", padding: "5px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                    border: `1.5px solid ${activeCat === cat ? C.primary : C.border}`,
                    background: activeCat === cat ? C.primary : C.white,
                    color: activeCat === cat ? "#fff" : C.text2,
                    fontWeight: activeCat === cat ? 600 : 400,
                    transition: "all .15s",
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
            <SearchInput placeholder="Tìm câu hỏi..." onSearch={setSearch} />
          </FilterBar>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.bg }}>
                  {["Mã", "Loại", "Câu hỏi", "Mức độ", "Đã dùng", ""].map((h) => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11.5, color: C.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F7F9FF")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}>
                    <td style={{ padding: "13px 16px", fontSize: 11, color: C.text3, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>{row.code}</td>
                    <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                      <Badge variant={row.typeBadge}>{row.type}</Badge>
                    </td>
                    <td style={{ padding: "13px 16px", maxWidth: 220, fontSize: 12.5, borderBottom: `1px solid ${C.border}` }}>{row.question}</td>
                    <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                      <Badge variant={row.levelBadge}>{row.level}</Badge>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: C.text2, borderBottom: `1px solid ${C.border}` }}>{row.used}</td>
                    <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <IconBtn onClick={() => openModalFn("modal-cauhoi")}>✏️</IconBtn>
                        <IconBtn del onClick={() => handleDelete(row.id)}>🗑️</IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination total="1,240 câu hỏi" shown={String(filtered.length)} pages={4} />
        </Card>

        {/* Right: Inline form */}
        <Card style={{ position: "sticky", top: 78 }}>
          <CardHeader><CardTitle>✏️ Thêm câu hỏi mới</CardTitle></CardHeader>
          <div style={{ padding: 20 }}>
            <FormGroup label="Loại câu hỏi" required>
              <Select value={qType} onChange={(e) => setQType(e.target.value)}>
                <option>Listening Part 1</option>
                <option>Listening Part 2</option>
                <option>Reading Part 5</option>
                <option>Reading Part 6</option>
                <option>Grammar</option>
                <option>Vocabulary</option>
              </Select>
            </FormGroup>
            <FormGroup label="Nội dung câu hỏi" required>
              <Textarea placeholder="Nhập nội dung câu hỏi..." value={qText} onChange={(e) => setQText(e.target.value)} />
            </FormGroup>
            {(["A", "B", "C", "D"] as const).map((letter) => (
              <FormGroup key={letter} label={`Đáp án ${letter}`}>
                <Input placeholder={`Nhập đáp án ${letter}...`} value={answers[letter]} onChange={(e) => setAnswers((a) => ({ ...a, [letter]: e.target.value }))} />
              </FormGroup>
            ))}
            <FormGroup label="Đáp án đúng" required>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["A", "B", "C", "D"].map((l) => (
                  <RadioOpt key={l} active={answerSel === l} onClick={() => setAnswerSel(l)}>{l}</RadioOpt>
                ))}
              </div>
            </FormGroup>
            <FormGroup label="Mức độ">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Dễ", "Trung bình", "Khó"].map((l) => (
                  <RadioOpt key={l} active={levelSel === l} success={levelSel === l} onClick={() => setLevelSel(l)}>{l}</RadioOpt>
                ))}
              </div>
            </FormGroup>
            <FormGroup label="Giải thích đáp án">
              <Textarea placeholder="Giải thích tại sao đáp án đúng..." value={explanation} onChange={(e) => setExplanation(e.target.value)} />
            </FormGroup>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="outline" style={{ flex: 1 }} onClick={() => showToast("💾 Đã lưu nháp!")}>Lưu nháp</Btn>
              <Btn variant="primary" style={{ flex: 1 }} onClick={handleSave}>Lưu câu hỏi</Btn>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
