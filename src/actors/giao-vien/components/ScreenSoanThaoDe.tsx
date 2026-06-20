// src/app/components/ScreenSoanThaoDe.tsx
import { useState, useEffect, useRef } from "react";
import { Upload, Music2, Image as ImageIcon, Save, Globe, CheckCircle, ChevronLeft, ChevronRight, Edit2, X } from "lucide-react";
import type { TestItem, QuestionItem, SkillType } from "../App";

const defaultParts = [
  { id: "p1", label: "Part 1", sub: "Photographs", count: 6 },
  { id: "p2", label: "Part 2", sub: "Question-Response", count: 25 },
  { id: "p3", label: "Part 3", sub: "Conversations", count: 39 },
  { id: "p4", label: "Part 4", sub: "Short Talks", count: 30 },
  { id: "p5", label: "Part 5", sub: "Incomplete Sentences", count: 30 },
  { id: "p6", label: "Part 6", sub: "Text Completion", count: 16 },
  { id: "p7", label: "Part 7", sub: "Reading Comprehension", count: 54 },
];

const grammarTopicsVi = [
  "Mệnh đề quan hệ", "Thì hiện tại hoàn thành", "Thì quá khứ đơn",
  "Câu bị động", "Mệnh đề điều kiện", "Từ vựng Kinh tế",
  "Từ vựng Văn phòng", "Từ vựng Marketing", "Giới từ chỉ thời gian", "Liên từ & Trạng từ",
];

const grammarTopicsEn = [
  "Relative Clause", "Present Perfect", "Simple Past",
  "Passive Voice", "Conditionals", "Business Vocab",
  "Office Vocab", "Marketing Vocab", "Prepositions of Time", "Conjunctions & Adverbs",
];

const difficultyLevelsVi = [
  { label: "Dễ (450)", value: "easy", color: "#10B981", bg: "#D1FAE5" },
  { label: "Trung bình (600)", value: "medium", color: "#F59E0B", bg: "#FEF3C7" },
  { label: "Khó (750)", value: "hard", color: "#EF4444", bg: "#FEE2E2" },
  { label: "Rất khó (900)", value: "expert", color: "#8B5CF6", bg: "#EDE9FE" },
];

const difficultyLevelsEn = [
  { label: "Easy (450)", value: "easy", color: "#10B981", bg: "#D1FAE5" },
  { label: "Medium (600)", value: "medium", color: "#F59E0B", bg: "#FEF3C7" },
  { label: "Hard (750)", value: "hard", color: "#EF4444", bg: "#FEE2E2" },
  { label: "Expert (900)", value: "expert", color: "#8B5CF6", bg: "#EDE9FE" },
];

type Answer = "A" | "B" | "C" | "D";

interface Props {
  showToast?: (msg: string) => void;
  editingTest: TestItem | null;
  onPublish: (test: TestItem) => void;
  onBack: () => void;
  lang?: string;
}

function EditStructureModal({ parts, onSave, onClose, lang }: { parts: any[], onSave: (p: any[]) => void, onClose: () => void, lang: string }) {
  const isEn = lang === "en";
  const [partCounts, setPartCounts] = useState<Record<string, number>>(
    Object.fromEntries(parts.map((p) => [p.id, p.count]))
  );
  const totalCau = Object.values(partCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="rounded-xl bg-white flex flex-col" style={{ width: 600, maxHeight: "85vh", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{isEn ? "Edit Test Structure" : "Chỉnh sửa cấu trúc số câu"}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer border-none bg-transparent">
            <X size={16} style={{ color: "#64748B" }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{isEn ? "Questions per Part" : "Số câu theo từng phần"}</label>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#2563EB" }}>{isEn ? "Total:" : "Tổng:"} {totalCau} {isEn ? "questions" : "câu"}</span>
          </div>
          <div className="flex flex-col gap-2">
            {parts.map((part) => (
              <div key={part.id} className="flex items-center justify-between rounded-lg px-4 py-2.5 bg-slate-50 border border-slate-200">
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{part.label}</span>
                  <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: 8 }}>{part.sub}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPartCounts(prev => ({ ...prev, [part.id]: Math.max(0, prev[part.id] - 1) }))} className="w-7 h-7 rounded border border-slate-200 bg-white cursor-pointer flex items-center justify-center hover:bg-slate-50">-</button>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", minWidth: 28, textAlign: "center" }}>{partCounts[part.id]}</span>
                  <button onClick={() => setPartCounts(prev => ({ ...prev, [part.id]: prev[part.id] + 1 }))} className="w-7 h-7 rounded border border-slate-200 bg-white cursor-pointer flex items-center justify-center hover:bg-slate-50">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border bg-white text-sm cursor-pointer hover:bg-slate-50">{isEn ? "Cancel" : "Hủy"}</button>
          <button onClick={() => onSave(parts.map((p) => ({ ...p, count: partCounts[p.id] })))} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold border-none cursor-pointer hover:bg-blue-700">
            {isEn ? "Save changes" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ScreenSoanThaoDe({ showToast, editingTest, onPublish, onBack, lang = "vi" }: Props) {
  const isEn = lang === "en";
  const grammarTopics = isEn ? grammarTopicsEn : grammarTopicsVi;
  const difficultyLevels = isEn ? difficultyLevelsEn : difficultyLevelsVi;
  const isEditing = !!editingTest;
  const [parts, setParts] = useState(editingTest?.parts ?? defaultParts);
  const totalCau = parts.reduce((acc, p) => acc + p.count, 0);

  const [testId, setTestId] = useState(editingTest?.id || `TEST-${Date.now()}`);
  const [testName, setTestName] = useState(editingTest?.ten || "");
  const [showEditParts, setShowEditParts] = useState(false);
  
  const [questions, setQuestions] = useState<QuestionItem[]>(editingTest?.questions || []);
  const [globalQIndex, setGlobalQIndex] = useState(0);

  let offset = 0;
  let activePartObj = parts[0] || { id: "none", label: "Empty", sub: "", count: 0 };
  for (const p of parts) {
    if (globalQIndex < offset + p.count) {
      activePartObj = p;
      break;
    }
    offset += p.count;
  }

  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState<Answer>("A");
  const [options, setOptions] = useState<Record<Answer, string>>({ A: "", B: "", C: "", D: "" });
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<string | null>(null);
  
  const [selectedSkill, setSelectedSkill] = useState<SkillType>("Reading");
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (globalQIndex >= totalCau && totalCau > 0) {
      setGlobalQIndex(totalCau - 1);
      return;
    }

    const q = questions[globalQIndex];
    if (q) {
      setQuestion(q.text || "");
      setCorrectAnswer((q.correctAnswer as Answer) || "A");
      setOptions(q.options || { A: "", B: "", C: "", D: "" });
      setSelectedTopic(q.topic || "");
      setSelectedDifficulty(q.difficulty || "");
      setAudioFile(q.audioUrl || null);
      setImageFile(q.imageUrl || null);
      setSelectedSkill(q.skill || "Reading");
    } else {
      const defaultSk = activePartObj.id.match(/p[1-4]/) ? "Listening" : "Reading";
      setQuestion("");
      setCorrectAnswer("A");
      setOptions({ A: "", B: "", C: "", D: "" });
      setSelectedTopic("");
      setSelectedDifficulty("");
      setAudioFile(null);
      setImageFile(null);
      setSelectedSkill(defaultSk);
    }
  }, [globalQIndex, questions, activePartObj.id, totalCau]);

  const saveCurrentQuestion = () => {
    setQuestions(prev => {
      const newQ = [...prev];
      newQ[globalQIndex] = {
        id: `q-${globalQIndex}`,
        partId: activePartObj.id,
        skill: selectedSkill,
        text: question,
        options: selectedSkill === "Writing" ? undefined : options,
        correctAnswer: selectedSkill === "Writing" ? undefined : correctAnswer,
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        audioUrl: audioFile || undefined,
        imageUrl: imageFile || undefined
      };
      return newQ;
    });
    if (showToast) showToast(isEn ? `Saved Question ${globalQIndex + 1}!` : `Đã lưu Câu ${globalQIndex + 1}!`);
  };

  const jumpToPart = (partId: string) => {
    let off = 0;
    for (const p of parts) {
      if (p.id === partId) break;
      off += p.count;
    }
    setGlobalQIndex(off);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file.name);
      if (showToast) showToast(isEn ? `Uploaded audio: ${file.name}` : `Đã tải lên âm thanh: ${file.name}`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file.name);
      if (showToast) showToast(isEn ? `Uploaded image: ${file.name}` : `Đã tải lên hình ảnh: ${file.name}`);
    }
  };

  const handlePublish = () => {
    if (!testName.trim()) {
      if (showToast) showToast(isEn ? "Please enter Test Name!" : "Vui lòng nhập Tên đề thi!");
      return;
    }
    const finalQuestions = [...questions];
    finalQuestions[globalQIndex] = {
        id: `q-${globalQIndex}`,
        partId: activePartObj.id,
        skill: selectedSkill,
        text: question,
        options: selectedSkill === "Writing" ? undefined : options,
        correctAnswer: selectedSkill === "Writing" ? undefined : correctAnswer,
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        audioUrl: audioFile || undefined,
        imageUrl: imageFile || undefined
    };

    onPublish({
      id: testId,
      ten: testName,
      soCau: totalCau,
      trangThai: "Xuất bản",
      ngayTao: editingTest?.ngayTao || new Date().toLocaleDateString("vi-VN"),
      parts,
      questions: finalQuestions
    });
  };

  return (
    <div className="flex relative h-[calc(100vh-64px)] overflow-hidden" style={{ background: "#F8FAFC" }}>
      <div className="w-[300px] border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted cursor-pointer" style={{ background: "#fff", color: "#374151" }}>
              <ChevronLeft size={16} />
            </button>
            <h2 style={{ fontWeight: 600, fontSize: 16, color: "#0F172A", flex: 1 }}>{isEn ? "Test Structure" : "Cấu trúc đề thi"}</h2>
            <button onClick={() => setShowEditParts(true)} className="p-1.5 rounded hover:bg-slate-100 cursor-pointer border-none bg-transparent" title="Chỉnh sửa số câu">
              <Edit2 size={15} style={{ color: "#2563EB" }} />
            </button>
          </div>
          <p style={{ fontSize: 13, color: "#64748B", marginBottom: 12 }}>{isEn ? "Total:" : "Tổng cộng:"} {totalCau} {isEn ? "questions" : "câu"}</p>
          <div style={{ height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "100%", background: "#2563EB", borderRadius: 99 }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {parts.map((p) => {
            const isActive = activePartObj.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => jumpToPart(p.id)}
                className="w-full text-left rounded-lg p-3 transition-colors hover:bg-slate-50 cursor-pointer"
                style={{
                  background: isActive ? "#EFF6FF" : "transparent",
                  border: isActive ? "1px solid #BFDBFE" : "1px solid transparent",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#1D4ED8" : "#334155" }}>{p.label}</span>
                  <span style={{ fontSize: 12, color: isActive ? "#2563EB" : "#64748B" }}>{p.count} {isEn ? "qs" : "câu"}</span>
                </div>
                <p style={{ fontSize: 12, color: isActive ? "#3B82F6" : "#94A3B8" }}>{p.sub}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex items-center justify-between p-6 bg-card border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              placeholder={isEn ? "Test ID" : "Mã đề"}
              style={{ width: 120, padding: "8px 12px", borderRadius: 6, border: "1px solid #E2E8F0", fontSize: 14, outline: "none", fontWeight: 500 }}
              disabled={isEditing}
            />
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder={isEn ? "Enter test name..." : "Nhập tên đề thi..."}
              style={{ width: 300, padding: "8px 12px", borderRadius: 6, border: "1px solid #E2E8F0", fontSize: 14, outline: "none" }}
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border transition-colors hover:bg-slate-50 cursor-pointer" style={{ fontSize: 14, color: "#374151", background: "#fff", fontWeight: 500 }}>
              <Save size={16} /> {isEn ? "Save Draft" : "Lưu nháp"}
            </button>
            <button onClick={handlePublish} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-opacity hover:opacity-90 cursor-pointer border-none" style={{ background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 500 }}>
              <Globe size={16} /> {isEditing ? (isEn ? "Update Test" : "Cập nhật đề thi") : (isEn ? "Publish" : "Xuất bản")}
            </button>
          </div>
        </div>

        <div className="p-6 max-w-[800px] w-full mx-auto pb-24">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>
                {activePartObj.label} - {isEn ? "Question" : "Câu"} {globalQIndex + 1}
              </h3>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value as SkillType)}
                style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#F1F5F9", outline: "none", fontSize: 13, fontWeight: 600, color: "#2563EB" }}
              >
                <option value="Listening">{isEn ? "Skill: Listening" : "Kỹ năng: Nghe (Listening)"}</option>
                <option value="Reading">{isEn ? "Skill: Reading" : "Kỹ năng: Đọc (Reading)"}</option>
                <option value="Writing">{isEn ? "Skill: Writing" : "Kỹ năng: Viết (Writing)"}</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setGlobalQIndex(Math.max(0, globalQIndex - 1))}
                disabled={globalQIndex <= 0}
                className="w-8 h-8 flex items-center justify-center rounded border border-border bg-white disabled:opacity-50 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium mx-2" style={{ fontSize: 14 }}>{isEn ? "Question" : "Câu"} {globalQIndex + 1}/{totalCau}</span>
              <button 
                onClick={() => setGlobalQIndex(Math.min(totalCau - 1, globalQIndex + 1))}
                disabled={globalQIndex >= totalCau - 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-border bg-white disabled:opacity-50 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-6" style={{ background: "#fff" }}>
            <div className="flex justify-between items-center mb-4">
              <label style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>
                {selectedSkill === "Writing" ? (isEn ? "Essay Prompt" : "Đề bài tự luận (Essay Prompt)") : (isEn ? "Question Content" : "Nội dung câu hỏi")}
              </label>
              <button onClick={saveCurrentQuestion} className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-blue-100 cursor-pointer" style={{ fontSize: 13, background: "#EFF6FF", color: "#2563EB", fontWeight: 500, border: "none" }}>
                <CheckCircle size={14} /> {isEn ? "Save Question" : "Lưu Câu Này"}
              </button>
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={selectedSkill === "Writing" ? (isEn ? "Enter essay prompt (e.g. Write a paragraph about...)" : "Nhập đề bài cho bài viết tự luận (vd: Viết 1 đoạn văn về...)") : (isEn ? "Enter question content..." : "Nhập nội dung câu hỏi...")}
              style={{ width: "100%", height: 120, padding: 12, borderRadius: 8, border: "1px solid #E2E8F0", outline: "none", fontSize: 14, resize: "none", boxSizing: "border-box" }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {selectedSkill === "Listening" && (
                <div className="p-4 rounded-lg flex items-center gap-4" style={{ background: "#F8FAFC", border: "1px dashed #CBD5E1" }}>
                  <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 40, height: 40, background: "#DBEAFE" }}>
                    <Music2 size={18} style={{ color: "#2563EB" }} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate" style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{audioFile || (isEn ? "Upload Audio" : "Tải âm thanh")}</p>
                    <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>MP3, WAV</p>
                  </div>
                  <input type="file" accept="audio/*" ref={audioInputRef} className="hidden" style={{ display: "none" }} onChange={handleAudioUpload} />
                  <button onClick={() => audioInputRef.current?.click()} className="px-3 py-1.5 rounded-md border border-border flex items-center gap-2 transition-colors hover:bg-slate-50 cursor-pointer bg-white">
                    <Upload size={14} /> {isEn ? "Select" : "Chọn"}
                  </button>
                </div>
              )}

              {/* Tải lên ảnh */}
              <div className="p-4 rounded-lg flex items-center gap-4" style={{ background: "#F8FAFC", border: "1px dashed #CBD5E1" }}>
                <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 40, height: 40, background: "#FEF3C7" }}>
                  <ImageIcon size={18} style={{ color: "#D97706" }} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate" style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{imageFile || (isEn ? "Upload Image" : "Tải ảnh đính kèm")}</p>
                  <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>JPG, PNG</p>
                </div>
                <input type="file" accept="image/*" ref={imageInputRef} className="hidden" style={{ display: "none" }} onChange={handleImageUpload} />
                <button onClick={() => imageInputRef.current?.click()} className="px-3 py-1.5 rounded-md border border-border flex items-center gap-2 transition-colors hover:bg-slate-50 cursor-pointer bg-white">
                  <Upload size={14} /> {isEn ? "Select" : "Chọn"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {selectedSkill !== "Writing" ? (
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm" style={{ background: "#fff" }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1E293B", marginBottom: 16 }}>
                  {isEn ? "Multiple Choice Answers" : "Đáp án trắc nghiệm"}
                </label>
                <div className="space-y-3 flex flex-col gap-3">
                  {(["A", "B", "C", "D"] as Answer[]).map((opt) => (
                    <div key={opt} className="flex items-center gap-3">
                      <button
                        onClick={() => setCorrectAnswer(opt)}
                        className="flex items-center justify-center rounded-full shrink-0 transition-colors"
                        style={{
                          width: 28, height: 28,
                          background: correctAnswer === opt ? "#2563EB" : "#F1F5F9",
                          color: correctAnswer === opt ? "#fff" : "#64748B",
                          fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer"
                        }}
                      >
                        {opt}
                      </button>
                      <input
                        type="text"
                        value={options[opt]}
                        onChange={(e) => setOptions({ ...options, [opt]: e.target.value })}
                        placeholder={isEn ? `Option ${opt}` : `Lựa chọn ${opt}`}
                        style={{
                          flex: 1, padding: "8px 12px", borderRadius: 6,
                          border: correctAnswer === opt ? "1px solid #BFDBFE" : "1px solid #E2E8F0",
                          outline: "none", fontSize: 14, boxSizing: "border-box",
                          background: correctAnswer === opt ? "#EFF6FF" : "#fff"
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm" style={{ background: "#fff" }}>
                <div className="flex items-center gap-3 mb-3">
                  <Globe size={20} style={{ color: "#2563EB" }} />
                  <label style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{isEn ? "AI Grading Integration" : "Tích hợp AI Chấm điểm"}</label>
                </div>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 12 }}>{isEn ? "For Writing tasks, the system comes with built-in AI to analyze vocabulary, grammar, and coherence automatically." : "Với kỹ năng Viết (Writing), hệ thống đã tích hợp sẵn AI để tự động phân tích từ vựng, ngữ pháp và lập luận để đưa ra điểm số mô phỏng chính xác nhất."}</p>
                <div style={{ padding: "12px", borderRadius: 8, background: "#EFF6FF", border: "1px dashed #BFDBFE" }}>
                  <p style={{ fontSize: 13, color: "#1E3A8A", fontWeight: 500 }}>{isEn ? "AI Grading is ready for this question type." : "Tính năng AI chấm bài đã được tích hợp sẵn cho loại câu hỏi này."}</p>
                </div>
              </div>
            )}

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm" style={{ background: "#fff" }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1E293B", marginBottom: 16 }}>
                {isEn ? "Classification & Tags" : "Phân loại & Gắn thẻ"}
              </label>
              <div className="space-y-4 flex flex-col gap-4">
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#64748B", marginBottom: 6 }}>{isEn ? "Grammar/Vocab Topic" : "Chủ đề ngữ pháp / Từ vựng"}</label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #E2E8F0", outline: "none", fontSize: 13, color: "#334155", boxSizing: "border-box" }}
                  >
                    <option value="">{isEn ? "-- Select Topic --" : "-- Chọn chủ đề --"}</option>
                    {grammarTopics.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#64748B", marginBottom: 6 }}>{isEn ? "Difficulty Level" : "Mức độ khó"}</label>
                  <div className="flex flex-wrap gap-2">
                    {difficultyLevels.map(d => (
                      <button
                        key={d.value}
                        onClick={() => setSelectedDifficulty(d.value)}
                        style={{
                          padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: "pointer",
                          background: selectedDifficulty === d.value ? d.bg : "#F8FAFC",
                          color: selectedDifficulty === d.value ? d.color : "#64748B",
                          border: selectedDifficulty === d.value ? `1px solid ${d.color}` : "1px solid #E2E8F0",
                        }}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showEditParts && (
        <EditStructureModal 
          parts={parts} 
          lang={lang}
          onClose={() => setShowEditParts(false)} 
          onSave={(newParts) => { setParts(newParts); setShowEditParts(false); }} 
        />
      )}
    </div>
  );
}