import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, XCircle, ScanLine, KeyRound, X, Radio } from "lucide-react";
import {
  checkAttendanceCode,
  addAttendanceRecord,
  getAttendanceSession,
  subscribeStore,
  type AttendanceSession,
} from "../lib/classroomStore";

export function Attendance() {
  const [name, setName] = useState("Nguyễn Minh");
  const [code, setCode] = useState("");
  const [session, setSession] = useState<AttendanceSession | null>(getAttendanceSession());
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | undefined>(undefined);

  // Theo dõi phiên điểm danh GV mở (realtime giữa các tab).
  useEffect(() => {
    const refresh = () => setSession(getAttendanceSession());
    refresh();
    const unsub = subscribeStore(refresh);
    const poll = setInterval(refresh, 2000);
    return () => {
      unsub();
      clearInterval(poll);
    };
  }, []);

  const stopScan = () => {
    setScanning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };
  useEffect(() => () => stopScan(), []);

  const submit = (raw: string) => {
    if (!name.trim()) {
      setResult({ ok: false, msg: "Hãy nhập tên của bạn trước." });
      return;
    }
    const chk = checkAttendanceCode(raw);
    if (!chk.ok || !chk.session) {
      const msg =
        chk.reason === "no-session"
          ? "Hiện chưa có phiên điểm danh nào đang mở (hoặc đã hết hạn)."
          : chk.reason === "wrong"
          ? "Mã không đúng. Kiểm tra lại nhé."
          : "Hãy nhập mã điểm danh.";
      setResult({ ok: false, msg });
      return;
    }
    const rec = addAttendanceRecord({ code: chk.session.code, studentName: name.trim(), at: Date.now() });
    setResult({
      ok: true,
      msg:
        !rec.ok && rec.reason === "duplicate"
          ? `Bạn đã điểm danh lớp ${chk.session.className} rồi.`
          : `Điểm danh thành công lớp ${chk.session.className}!`,
    });
    stopScan();
  };

  const startScan = async () => {
    setResult(null);
    const AnyWin = window as any;
    if (!("BarcodeDetector" in window)) {
      setResult({ ok: false, msg: "Trình duyệt không hỗ trợ quét QR. Hãy nhập mã tay bên dưới." });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setScanning(true);
      const detector = new AnyWin.BarcodeDetector({ formats: ["qr_code"] });
      setTimeout(async () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        const tick = async () => {
          if (!videoRef.current || !streamRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes && codes.length) {
              const val: string = codes[0].rawValue || "";
              setCode(val.replace(/[^0-9]/g, ""));
              submit(val);
              return;
            }
          } catch {
            /* bỏ qua frame lỗi */
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      }, 120);
    } catch {
      setResult({ ok: false, msg: "Không mở được camera. Hãy nhập mã tay bên dưới." });
      setScanning(false);
    }
  };

  return (
    <div style={{ maxWidth: 460, margin: "0 auto", width: "100%" }}>
      {/* Trạng thái phiên */}
      <div
        className="rounded-2xl p-4 mb-5 flex items-center gap-3"
        style={{
          background: session ? "#ecfdf5" : "var(--muted)",
          border: `1px solid ${session ? "#a7f3d0" : "var(--border)"}`,
        }}
      >
        <Radio size={20} style={{ color: session ? "#059669" : "var(--muted-foreground)" }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--foreground)" }}>
            {session ? `Lớp "${session.className}" đang mở điểm danh` : "Chưa có phiên điểm danh"}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--muted-foreground)" }}>
            {session ? "Quét QR hoặc nhập mã PIN giáo viên đưa." : "Khi giáo viên mở điểm danh, mục này sẽ sáng lên."}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border p-6" style={{ background: "var(--card)" }}>
        {/* Tên học viên */}
        <label style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--muted-foreground)" }}>Tên của bạn</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl px-4 py-3 mt-1 mb-4"
          style={{ border: "1px solid var(--border)", background: "var(--muted)", color: "var(--foreground)", fontSize: "0.9rem", outline: "none" }}
        />

        {/* Khu vực camera quét QR */}
        {scanning ? (
          <div className="rounded-2xl overflow-hidden mb-4 relative" style={{ background: "#000" }}>
            <video ref={videoRef} playsInline muted style={{ width: "100%", height: 240, objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 160, height: 160, border: "3px solid #fff", borderRadius: 16, boxShadow: "0 0 0 9999px rgba(0,0,0,0.35)" }} />
            </div>
            <button
              onClick={stopScan}
              className="absolute top-2 right-2 rounded-full p-1.5"
              style={{ background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer", color: "#fff" }}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={startScan}
            className="w-full rounded-2xl py-3 flex items-center justify-center gap-2 mb-3"
            style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 800, fontSize: "0.86rem" }}
          >
            <Camera size={18} /> Quét mã QR
          </button>
        )}

        {/* Nhập mã tay (luôn dùng được nếu quét không tới) */}
        <div className="flex items-center gap-2 mb-1" style={{ color: "var(--muted-foreground)", fontSize: "0.74rem", fontWeight: 700 }}>
          <KeyRound size={14} /> Hoặc nhập mã PIN 4 số
        </div>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
            placeholder="1234"
            inputMode="numeric"
            className="flex-1 rounded-xl px-4 py-3"
            style={{ border: "1px solid var(--border)", background: "var(--muted)", color: "var(--foreground)", fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.3em", textAlign: "center", outline: "none" }}
          />
          <button
            onClick={() => submit(code)}
            className="rounded-xl px-5 flex items-center gap-2"
            style={{ background: "#16a34a", color: "#fff", border: "none", cursor: "pointer", fontWeight: 800, fontSize: "0.86rem" }}
          >
            <ScanLine size={16} /> Điểm danh
          </button>
        </div>

        {/* Kết quả */}
        {result && (
          <div
            className="rounded-xl p-3 mt-4 flex items-center gap-2"
            style={{
              background: result.ok ? "#ecfdf5" : "#fef2f2",
              border: `1px solid ${result.ok ? "#a7f3d0" : "#fecaca"}`,
              color: result.ok ? "#047857" : "#dc2626",
              fontWeight: 700,
              fontSize: "0.84rem",
            }}
          >
            {result.ok ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {result.msg}
          </div>
        )}
      </div>
    </div>
  );
}
