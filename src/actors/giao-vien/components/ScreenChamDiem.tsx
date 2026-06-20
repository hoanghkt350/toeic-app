// src/app/components/ScreenChamDiem.tsx
import { useState, useEffect } from "react";
import { X, CheckCircle, XCircle, Bot, Sparkles, Loader2, FileText, Check, ChevronRight } from "lucide-react";
import type { SubmissionItem, StudentItem, TestItem } from "../App";

function toTOEICScore(correctCount: number, total: number): number {
  if (total === 0) return 0;
  const ratio = correctCount / total;
  return Math.round(5 + ratio * 985);
}

const statusStyle: Record<string, { bg: string; text: string }> = {
  "Tốt": { bg: "#D1FAE5", text: "#065F46" },
  "Cần cố gắng": { bg: "#FEF3C7", text: "#B45309" },
  "Chờ chấm": { bg: "#F1F5F9", text: "#475569" },
};

function Typewriter({ text, speed = 20 }: { text: string, speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{displayed}</span>;
}

interface GradingModalProps {
  submission: SubmissionItem;
  student: StudentItem;
  test: TestItem | undefined;
  onClose: () => void;
  onSave: (feedback: string, score: number, newStatus: "Tốt"|"Cần cố gắng") => void;
  showToast?: (msg: string) => void;
  lang: string;
}

function GradingModal({ submission, student, test, onClose, onSave, showToast, lang }: GradingModalProps) {
  const isEn = lang === "en";
  const [feedback, setFeedback] = useState(submission.teacherFeedback || "");
  
  // TOEIC logic
  let correctCount = 0;
  let totalCount = 0;
  const questionLabels: string[] = [];
  const correctAnswersList: string[] = [];
  
  if (submission.skill === "TOEIC" || submission.skill === "Reading" || submission.skill === "Listening") {
    totalCount = test?.questions?.length || 0;
    test?.questions?.forEach((q, i) => {
      questionLabels.push(`Q${i+1}`);
      correctAnswersList.push(q.correctAnswer || "A");
      if (submission.answers?.[i] === q.correctAnswer) {
        correctCount++;
      }
    });
  }
  const toeicScore = toTOEICScore(correctCount, totalCount);

  // Writing AI logic
  const essayText = submission.essayText || "";
  const [aiStep, setAiStep] = useState(0); 
  // 0: Idle, 1: Scanning, 2: Spelling & Grammar, 3: Coherence, 4: Done
  const [aiResult, setAiResult] = useState<{score: number, fv: string, fg: string, fc: string, fs: string} | null>(null);

  const startAIGrading = () => {
    setAiStep(1);
    setTimeout(() => setAiStep(2), 1200);
    setTimeout(() => setAiStep(3), 2400);
    setTimeout(() => {
      setAiStep(4);
      // Generate mock result
      const len = essayText.split(" ").length;
      let score = 80;
      let fs = isEn ? "Minor spelling errors (e.g. 'tecnology' -> 'technology'). Double check before submitting." : "Có một số lỗi chính tả nhỏ (vd: 'tecnology' -> 'technology'). Cần kiểm tra kỹ trước khi nộp.";
      let fv = isEn ? "Basic vocabulary, some repetition. Needs more variety." : "Từ vựng còn cơ bản, có một số chỗ dùng lặp từ. Cần sử dụng đa dạng hơn.";
      let fg = isEn ? "Basic grammar mistakes (e.g. 'It make' -> 'It makes')." : "Vẫn còn mắc một vài lỗi chia động từ cơ bản (vd: 'It make' -> 'It makes').";
      let fc = isEn ? "Flow is not very natural, lacks linking words." : "Cách sắp xếp ý chưa thực sự tự nhiên, thiếu từ nối (linking words).";
      if (len > 30) {
        score = 160;
        fs = isEn ? "No significant spelling errors. Well-written." : "Không phát hiện lỗi chính tả đáng kể. Viết rất cẩn thận.";
        fv = isEn ? "Good use of topical vocabulary. Accurate usage." : "Sử dụng tốt các từ vựng theo chủ đề. Cách dùng từ chính xác.";
        fg = isEn ? "Varied grammatical structures, few mistakes. Good control of tenses." : "Cấu trúc ngữ pháp đa dạng, ít lỗi sai. Kiểm soát tốt các thì.";
        fc = isEn ? "Coherent essay, clear arguments and good supporting examples." : "Bài viết mạch lạc, có luận điểm rõ ràng và ví dụ hỗ trợ tốt.";
      }
      setAiResult({ score, fv, fg, fc, fs });
      setFeedback(isEn 
        ? `[AI Feedback]\n- Spelling: ${fs}\n- Vocabulary: ${fv}\n- Grammar: ${fg}\n- Coherence: ${fc}\n\nEstimated Score: ${score}/200`
        : `[AI Nhận xét]\n- Chính tả: ${fs}\n- Từ vựng: ${fv}\n- Ngữ pháp: ${fg}\n- Mạch lạc: ${fc}\n\nĐiểm ước tính: ${score}/200`);
    }, 3600);
  };

  const isWriting = submission.skill === "Writing";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="rounded-xl bg-card border border-border flex flex-col shadow-2xl" style={{ width: isWriting ? 780 : 640, maxHeight: "90vh", overflow: "hidden", background: "#fff" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50">
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{isEn ? `${student.name}'s Submission` : `Bài làm của ${student.name}`}</h3>
            <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{submission.testName} • {submission.skill}</p>
          </div>
          <button onClick={onClose} className="flex items-center justify-center rounded-lg transition-colors hover:bg-slate-200" style={{ width: 32, height: 32, border: "none", background: "transparent", cursor: "pointer" }}>
            <X size={18} style={{ color: "#64748B" }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {!isWriting ? (
            <>
              <div className="flex items-center gap-6 rounded-xl p-5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <div className="text-center">
                  <p style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{isEn ? "TOEIC Score" : "Điểm TOEIC"}</p>
                  <p style={{ fontSize: 32, fontWeight: 800, color: "#2563EB" }}>{toeicScore}</p>
                  <p style={{ fontSize: 11, color: "#94A3B8" }}>/ 990</p>
                </div>
                <div style={{ width: 1, height: 60, background: "#E2E8F0" }} />
                <div className="text-center">
                  <p style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{isEn ? "Correct / Total" : "Đúng / Tổng"}</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: correctCount === totalCount ? "#10B981" : "#0F172A" }}>{correctCount}/{totalCount}</p>
                  <p style={{ fontSize: 11, color: "#94A3B8" }}>{isEn ? "qs" : "câu"}</p>
                </div>
                <div style={{ width: 1, height: 60, background: "#E2E8F0" }} />
                <div className="text-center">
                  <p style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{isEn ? "Target" : "Mục tiêu"}</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: "#0F172A" }}>{student.targetScore}</p>
                  <p style={{ fontSize: 11, color: toeicScore >= student.targetScore ? "#10B981" : "#F59E0B", fontWeight: 500 }}>
                    {toeicScore >= student.targetScore ? (isEn ? "Target reached" : "Đạt mục tiêu") : (isEn ? `${student.targetScore - toeicScore} pts missing` : `Thiếu ${student.targetScore - toeicScore} điểm`)}
                  </p>
                </div>
                <div style={{ flex: 1, marginLeft: 16 }}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{isEn ? "Accuracy Rate" : "Tỷ lệ chính xác"}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{Math.round((correctCount / (totalCount || 1)) * 100)}%</span>
                  </div>
                  <div style={{ height: 8, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(correctCount / (totalCount || 1)) * 100}%`, background: correctCount === totalCount ? "#10B981" : "#2563EB", borderRadius: 99, transition: "width 0.4s" }} />
                  </div>
                </div>
              </div>

              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12 }}>{isEn ? "Detailed Answer Comparison" : "So sánh đáp án chi tiết"}</p>
                <div className="rounded-lg border border-border overflow-hidden shadow-sm">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#F1F5F9", borderBottom: "1px solid #E2E8F0" }}>
                        {[isEn ? "Q#" : "Câu", isEn ? "Student" : "HV chọn", isEn ? "Key" : "Đáp án đúng", isEn ? "Result" : "Kết quả"].map((h) => (
                          <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {questionLabels.map((q, i) => {
                        const sv = submission.answers?.[i];
                        const ca = correctAnswersList[i];
                        const correct = sv === ca;
                        return (
                          <tr key={q} style={{ borderBottom: i < questionLabels.length - 1 ? "1px solid #E2E8F0" : "none", background: correct ? "#F0FDF4" : sv == null ? "#FAFAFA" : "#FEF2F2" }}>
                            <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "#64748B" }}>{q}</td>
                            <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: sv == null ? "#94A3B8" : correct ? "#065F46" : "#991B1B" }}>{sv ?? "–"}</td>
                            <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#065F46" }}>{ca}</td>
                            <td style={{ padding: "10px 14px" }}>
                              {sv == null ? <span style={{ fontSize: 12, color: "#94A3B8" }}>{isEn ? "Skipped" : "Bỏ qua"}</span> : correct ? <CheckCircle size={16} style={{ color: "#10B981" }} /> : <XCircle size={16} style={{ color: "#EF4444" }} />}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            // WRITING SKILL UI
            <>
              <div className="flex gap-4">
                <div className="w-1/2 flex flex-col gap-4">
                  <div className="rounded-xl border border-border p-5 bg-white shadow-sm flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} style={{ color: "#2563EB" }} />
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{isEn ? "Student's Essay" : "Bài viết của học viên"}</p>
                      </div>
                      <span style={{ fontSize: 12, color: "#64748B", background: "#F1F5F9", padding: "2px 8px", borderRadius: 99 }}>{essayText.split(" ").length} {isEn ? "words" : "từ"}</span>
                    </div>
                    <div style={{ padding: 14, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14, color: "#334155", lineHeight: 1.6, height: "calc(100% - 40px)", overflowY: "auto" }}>
                      {essayText}
                    </div>
                  </div>
                </div>

                <div className="w-1/2 flex flex-col gap-4">
                  <div className="rounded-xl border border-blue-100 p-5 bg-blue-50/50 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Bot size={18} style={{ color: "#2563EB" }} />
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#1E3A8A" }}>{isEn ? "AI Assistant" : "AI Trợ giảng"}</p>
                      </div>
                      {aiStep === 4 && <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981", display: "flex", alignItems: "center", gap: 4 }}><Check size={14}/> {isEn ? "Done" : "Hoàn tất"}</span>}
                    </div>

                    {aiStep === 0 && (
                      <div className="flex flex-col items-center justify-center flex-1 py-8 text-center">
                        <Sparkles size={32} style={{ color: "#60A5FA", marginBottom: 12 }} />
                        <p style={{ fontSize: 13, color: "#475569", marginBottom: 16, maxWidth: 250 }}>{isEn ? "Activate AI to deeply analyze spelling, grammar, vocab, and automatically suggest a score." : "Kích hoạt AI để phân tích sâu lỗi chính tả, ngữ pháp, từ vựng và tự động đề xuất điểm số."}</p>
                        <button onClick={startAIGrading} className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all hover:bg-blue-700 hover:shadow-md" style={{ background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>
                          {isEn ? "Start AI Grading" : "Bắt đầu AI Chấm bài"}
                        </button>
                      </div>
                    )}

                    {aiStep > 0 && aiStep < 4 && (
                      <div className="flex flex-col gap-4 flex-1 justify-center py-4">
                        <div className="flex items-center gap-3">
                          {aiStep > 1 ? <CheckCircle size={18} style={{ color: "#10B981" }} /> : <Loader2 size={18} className="animate-spin" style={{ color: "#2563EB" }} />}
                          <span style={{ fontSize: 14, fontWeight: aiStep >= 1 ? 600 : 400, color: aiStep > 1 ? "#065F46" : "#1E293B" }}>{isEn ? "Scanning essay structure..." : "Quét cấu trúc bài viết..."}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {aiStep > 2 ? <CheckCircle size={18} style={{ color: "#10B981" }} /> : aiStep === 2 ? <Loader2 size={18} className="animate-spin" style={{ color: "#2563EB" }} /> : <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #CBD5E1" }}/>}
                          <span style={{ fontSize: 14, fontWeight: aiStep >= 2 ? 600 : 400, color: aiStep > 2 ? "#065F46" : aiStep === 2 ? "#1E293B" : "#94A3B8" }}>{isEn ? "Analyzing spelling & grammar..." : "Phân tích lỗi chính tả & ngữ pháp..."}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {aiStep > 3 ? <CheckCircle size={18} style={{ color: "#10B981" }} /> : aiStep === 3 ? <Loader2 size={18} className="animate-spin" style={{ color: "#2563EB" }} /> : <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #CBD5E1" }}/>}
                          <span style={{ fontSize: 14, fontWeight: aiStep >= 3 ? 600 : 400, color: aiStep > 3 ? "#065F46" : aiStep === 3 ? "#1E293B" : "#94A3B8" }}>{isEn ? "Evaluating coherence..." : "Đánh giá độ mạch lạc..."}</span>
                        </div>
                      </div>
                    )}

                    {aiStep === 4 && aiResult && (
                      <div className="flex flex-col gap-4 flex-1 overflow-y-auto animate-in fade-in duration-500 pr-2">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100 shadow-sm shrink-0">
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{isEn ? "AI Suggested Score" : "Điểm số AI đề xuất"}</span>
                          <div className="flex items-baseline gap-1">
                            <span style={{ fontSize: 32, fontWeight: 800, color: "#2563EB" }}>{aiResult.score}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8" }}>/ 200</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="bg-white p-3 rounded-lg border border-blue-50">
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A", marginBottom: 4 }}>{isEn ? "Spelling" : "Chính tả (Spelling)"}</p>
                            <p style={{ fontSize: 13, color: "#334155" }}><Typewriter text={aiResult.fs} speed={15} /></p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-blue-50">
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A", marginBottom: 4 }}>{isEn ? "Vocabulary" : "Từ vựng (Vocabulary)"}</p>
                            <p style={{ fontSize: 13, color: "#334155" }}><Typewriter text={aiResult.fv} speed={15} /></p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-blue-50">
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A", marginBottom: 4 }}>{isEn ? "Grammar" : "Ngữ pháp (Grammar)"}</p>
                            <p style={{ fontSize: 13, color: "#334155" }}><Typewriter text={aiResult.fg} speed={15} /></p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-blue-50">
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A", marginBottom: 4 }}>{isEn ? "Coherence" : "Mạch lạc (Coherence)"}</p>
                            <p style={{ fontSize: 13, color: "#334155" }}><Typewriter text={aiResult.fc} speed={15} /></p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 8 }}>
              <span>{isEn ? "Feedback & Comments (Teacher Edit)" : "Nhận xét & Góp ý (Giáo viên điều chỉnh)"}</span>
              {submission.teacherFeedback && <span style={{ fontSize: 11, color: "#10B981", background: "#D1FAE5", padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>{isEn ? "Feedback Added" : "Đã có nhận xét"}</span>}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={isEn ? "You can edit the AI's feedback or write your own here..." : "Bạn có thể sửa lại nội dung AI gợi ý hoặc tự viết nhận xét tại đây..."}
              style={{ width: "100%", height: 120, border: "1px solid #CBD5E1", borderRadius: 8, padding: "14px", fontSize: 14, color: "#0F172A", resize: "none", outline: "none", background: "#F8FAFC", boxSizing: "border-box", lineHeight: 1.6 }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-slate-50 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border transition-colors hover:bg-slate-200" style={{ fontSize: 14, fontWeight: 600, color: "#475569", background: "#fff", cursor: "pointer" }}>{isEn ? "Cancel" : "Hủy bỏ"}</button>
          <button
            onClick={() => { 
              const newScore = isWriting ? (aiResult?.score || 0) : toeicScore;
              const newStatus = newScore >= student.targetScore ? "Tốt" : "Cần cố gắng";
              onSave(feedback, newScore, newStatus); 
              onClose(); 
              if (showToast) showToast(isEn ? `Saved results for ${student.name}!` : `Đã lưu kết quả cho ${student.name}!`); 
            }}
            className="px-6 py-2 rounded-lg transition-opacity hover:opacity-90 flex items-center gap-2"
            style={{ background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            <Check size={16} /> {isEn ? "Finish Grading" : "Hoàn tất chấm bài"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ScreenChamDiem({ showToast, submissions, setSubmissions, students, tests, lang = "vi" }: { showToast?: (msg: string) => void, submissions: SubmissionItem[], setSubmissions: any, students: StudentItem[], tests: TestItem[], lang?: string }) {
  const isEn = lang === "en";
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);

  const viewSubmission = submissions.find(s => s.id === gradingSubId);
  const viewStudent = viewSubmission ? students.find(s => s.id === viewSubmission.studentId) : undefined;
  const viewTest = viewSubmission ? tests.find(t => t.id === viewSubmission.testId) : undefined;

  const handleSaveGrading = (subId: string, feedback: string, score: number, status: "Tốt"|"Cần cố gắng") => {
    setSubmissions((prev: SubmissionItem[]) => prev.map(s => 
      s.id === subId ? { ...s, teacherFeedback: feedback, score, status } : s
    ));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 style={{ fontWeight: 700, fontSize: 24, color: "#0F172A", letterSpacing: "-0.5px" }}>{isEn ? "Grading" : "Chấm điểm Bài nộp"}</h2>
        <p style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>
          {submissions.filter(s => s.status === "Chờ chấm").length} {isEn ? "pending" : "bài chưa chấm"} • {submissions.length} {isEn ? "total submissions" : "tổng số bài"}
        </p>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {submissions.map((sub) => {
          const student = students.find(s => s.id === sub.studentId);
          if (!student) return null;

          const ss = statusStyle[sub.status] || { bg: "#F1F5F9", text: "#475569" };
          const isGraded = sub.status !== "Chờ chấm";
          const progress = sub.score ? Math.min((sub.score / student.targetScore) * 100, 100) : 0;
          
          let displayStatus = sub.status;
          if (isEn) {
            if (sub.status === "Tốt") displayStatus = "Good";
            else if (sub.status === "Cần cố gắng") displayStatus = "Needs Effort";
            else if (sub.status === "Chờ chấm") displayStatus = "Pending";
          }

          return (
            <div key={sub.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4 transition-all hover:shadow-md hover:border-blue-200" style={{ background: "#fff" }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 48, height: 48, background: sub.skill === "Writing" ? "#F5F3FF" : "#DBEAFE" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: sub.skill === "Writing" ? "#7C3AED" : "#2563EB" }}>{student.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }} className="truncate">{student.name}</p>
                  <p style={{ fontSize: 13, color: "#64748B", marginTop: 2 }} className="truncate">{sub.testName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: sub.skill === "Writing" ? "#EDE9FE" : "#E0F2FE", color: sub.skill === "Writing" ? "#6D28D9" : "#0369A1", border: "1px solid", borderColor: sub.skill === "Writing" ? "#DDD6FE" : "#BAE6FD" }}>
                  {sub.skill}
                </span>
                <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: ss.bg, color: ss.text, whiteSpace: "nowrap" }}>
                  {displayStatus}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p style={{ fontSize: 11, color: "#64748B", fontWeight: 500, textTransform: "uppercase" }}>{isEn ? "Score" : "Điểm số"}</p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: isGraded ? "#0F172A" : "#94A3B8" }}>{isGraded ? sub.score : "–"}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: 11, color: "#64748B", fontWeight: 500, textTransform: "uppercase" }}>{isEn ? "Target" : "Mục tiêu"}</p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: "#2563EB" }}>{student.targetScore}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>{isEn ? "Progress" : "Tiến độ"}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: progress >= 100 ? "#10B981" : "#0F172A" }}>{isGraded ? `${Math.round(progress)}%` : "0%"}</span>
                </div>
                <div className="rounded-full" style={{ height: 6, background: "#F1F5F9", overflow: "hidden" }}>
                  <div className="h-full rounded-full" style={{ width: `${progress}%`, background: progress >= 100 ? "#10B981" : "#2563EB", transition: "width 0.4s ease" }} />
                </div>
              </div>

              <button
                onClick={() => setGradingSubId(sub.id)}
                className="w-full mt-2 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                style={{ 
                  fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
                  color: isGraded ? "#065F46" : (sub.skill === "Writing" ? "#fff" : "#2563EB"), 
                  background: isGraded ? "#D1FAE5" : (sub.skill === "Writing" ? "#2563EB" : "#EFF6FF") 
                }}
              >
                {isGraded ? (isEn ? "View Details" : "Xem lại chi tiết") : (sub.skill === "Writing" ? (isEn ? "Start AI Grading" : "Bắt đầu AI Chấm bài") : (isEn ? "Grade & Comment" : "Xem điểm & Nhận xét"))}
                {!isGraded && <ChevronRight size={16}/>}
              </button>
            </div>
          );
        })}
      </div>

      {viewSubmission && viewStudent && (
        <GradingModal
          submission={viewSubmission}
          student={viewStudent}
          test={viewTest}
          lang={lang}
          onClose={() => setGradingSubId(null)}
          onSave={(fb, score, status) => handleSaveGrading(viewSubmission.id, fb, score, status)}
          showToast={showToast}
        />
      )}
    </div>
  );
}