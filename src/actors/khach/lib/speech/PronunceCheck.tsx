import { useEffect, useState } from "react";
import { Mic, Square, CheckCircle2, XCircle } from "lucide-react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { scorePronunciation, type PronScore } from "./scorePronunciation";

/**
 * Nút mic chấm phát âm dùng chung (Web Speech API, miễn phí).
 * Đọc từ `target` → máy nghe → so khớp → hiện đúng/sai + %.
 * Style nội tuyến với màu cố định nên hợp mọi actor (theme var hoặc astraui).
 */
export function PronunceCheck({
  target,
  lang = "en-US",
  onScored,
}: {
  target: string;
  lang?: string;
  onScored?: (result: PronScore) => void;
}) {
  const { listening, transcript, error, supported, start, stop, reset } = useSpeechRecognition(lang);
  const [result, setResult] = useState<PronScore | null>(null);

  // Khi máy nghe xong (dừng) và có transcript → chấm điểm.
  useEffect(() => {
    if (!listening && transcript) {
      const r = scorePronunciation(target, transcript);
      setResult(r);
      onScored?.(r);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, transcript]);

  // Đổi từ thì reset kết quả.
  useEffect(() => {
    setResult(null);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!supported) {
    return (
      <div style={{ fontSize: "0.72rem", color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "6px 10px" }}>
        Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome hoặc Edge.
      </div>
    );
  }

  const toggle = () => {
    if (listening) {
      stop();
    } else {
      setResult(null);
      start();
    }
  };

  const color = result ? (result.ok ? "#16a34a" : "#dc2626") : "#2563eb";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "9px 18px",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          fontWeight: 800,
          fontSize: "0.82rem",
          color: "#fff",
          background: listening ? "#dc2626" : "#2563eb",
          boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
        }}
      >
        {listening ? <Square size={15} /> : <Mic size={15} />}
        {listening ? "Đang nghe… (bấm để dừng)" : "Đọc thử"}
      </button>

      {error === "not-allowed" && (
        <span style={{ fontSize: "0.72rem", color: "#dc2626" }}>Bạn cần cho phép quyền micro.</span>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 800, fontSize: "0.86rem", color }}>
            {result.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {result.ok ? "Phát âm tốt!" : "Chưa chuẩn, thử lại nhé"} · {result.score}%
          </div>
          {transcript && (
            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
              Máy nghe được: “{transcript}”
            </span>
          )}
        </div>
      )}
    </div>
  );
}
