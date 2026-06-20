import { useState } from "react";
import { useOutletContext } from "react-router";
import { Volume2, ChevronLeft, ChevronRight, Lock, Sparkles } from "lucide-react";
import { PronunceCheck } from "../lib/speech/PronunceCheck";
import { practiceWords, GUEST_FREE_LIMIT } from "../data/vocab";

/** Đọc mẫu từ bằng speechSynthesis (miễn phí). */
function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export function PronunciationPage() {
  const { openSignup } = useOutletContext<{ openSignup: () => void }>();
  const [index, setIndex] = useState(0);

  // Hết quota miễn phí: chạm tới từ thứ 11 (index = GUEST_FREE_LIMIT).
  const locked = index >= GUEST_FREE_LIMIT;
  const word = practiceWords[Math.min(index, practiceWords.length - 1)];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 w-full">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "#eff6ff", color: "#2563eb" }}>
          <Sparkles size={14} /> Luyện phát âm TOEIC
        </span>
        <h1 className="text-2xl font-bold mt-3" style={{ color: "#0f172a" }}>Đọc theo và để AI chấm phát âm</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          {locked ? "Bản dùng thử đã hết" : `Từ ${index + 1} / ${GUEST_FREE_LIMIT} (dùng thử miễn phí)`}
        </p>
      </div>

      {locked ? (
        <div className="rounded-3xl border p-8 text-center" style={{ background: "#fff", borderColor: "#e2e8f0", boxShadow: "0 8px 30px rgba(2,6,23,0.06)" }}>
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ background: "#2563eb" }}>
            <Lock size={24} color="#fff" />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "#0f172a" }}>Bạn đã dùng hết {GUEST_FREE_LIMIT} từ miễn phí</h2>
          <p className="text-sm mt-2 mb-6" style={{ color: "#64748b" }}>
            Đăng nhập / đăng ký miễn phí để luyện toàn bộ kho từ và lưu tiến độ.
          </p>
          <button
            onClick={openSignup}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold"
            style={{ background: "#2563eb", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 6px 18px rgba(37,99,235,0.3)" }}
          >
            Đăng ký để học tiếp
          </button>
          <div className="mt-4">
            <button
              onClick={() => setIndex(GUEST_FREE_LIMIT - 1)}
              className="text-sm font-medium"
              style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
            >
              ← Quay lại từ trước
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border p-8" style={{ background: "#fff", borderColor: "#e2e8f0", boxShadow: "0 8px 30px rgba(2,6,23,0.06)" }}>
          <div className="flex flex-col items-center text-center gap-3">
            <div style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a" }}>{word.word}</div>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "1rem", color: "#64748b", fontStyle: "italic" }}>{word.phonetic}</span>
              <button
                onClick={() => speak(word.word)}
                className="rounded-full flex items-center justify-center"
                style={{ width: 36, height: 36, background: "#2563eb", border: "none", cursor: "pointer" }}
                title="Nghe mẫu"
              >
                <Volume2 size={16} color="#fff" />
              </button>
            </div>
            <span className="rounded-full px-3 py-1 text-sm" style={{ background: "#f1f5f9", color: "#475569" }}>{word.meaning}</span>

            <div className="mt-4">
              <PronunceCheck target={word.word} />
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium"
              style={{ background: "transparent", border: "none", color: index === 0 ? "#cbd5e1" : "#64748b", cursor: index === 0 ? "default" : "pointer" }}
            >
              <ChevronLeft size={16} /> Trước
            </button>
            <span className="text-xs" style={{ color: "#94a3b8" }}>{index + 1} / {GUEST_FREE_LIMIT}</span>
            <button
              onClick={() => setIndex((i) => i + 1)}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold"
              style={{ background: "transparent", border: "none", color: "#2563eb", cursor: "pointer" }}
            >
              Tiếp <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
