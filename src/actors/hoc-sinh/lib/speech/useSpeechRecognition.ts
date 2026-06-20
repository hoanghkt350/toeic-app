import { useCallback, useRef, useState } from "react";

/**
 * Hook nhận diện giọng nói dùng Web Speech API (miễn phí, có sẵn trong Chrome/Edge).
 * Không cần API key, không cần backend. Trả về transcript + trạng thái.
 * Dùng chung cho mọi actor (Học sinh, Khách...).
 */
export function useSpeechRecognition(lang = "en-US") {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<any>(null);

  const w = typeof window !== "undefined" ? (window as any) : undefined;
  const supported = !!(w && (w.SpeechRecognition || w.webkitSpeechRecognition));

  const start = useCallback(() => {
    const Ctor = w && (w.SpeechRecognition || w.webkitSpeechRecognition);
    if (!Ctor) {
      setError("unsupported");
      return;
    }
    setTranscript("");
    setError(null);
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      const text = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ")
        .trim();
      setTranscript(text);
    };
    rec.onerror = (e: any) => {
      setError(e?.error || "error");
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      /* đã đang chạy */
    }
  }, [lang, w]);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return { listening, transcript, error, supported, start, stop, reset };
}
