import { useEffect, useState } from "react";
import { Presentation, Mail, Lock, User } from "lucide-react";
import BackToHome from "../../../components/BackToHome";
import ZaloButton from "../../../components/ZaloButton";
import { authenticate, addAccount, seedAccountsIfEmpty, setSession, type Account } from "../lib/classroomStore";

const ROLE = "giao-vien" as const;
const ACCENT = "#2563eb";
const TITLE = "Giáo viên";
const DEMO = "giaovien1@toeic.vn / 123456";

/** Đăng nhập / Đăng ký cho actor Giáo viên. */
export function Auth({ onAuthed }: { onAuthed: (a: Account) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { seedAccountsIfEmpty(); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      const r = authenticate(email, password, ROLE);
      if (!r.ok || !r.account) {
        setError(r.reason === "wrongpass" ? "Sai mật khẩu." : r.reason === "locked" ? "Tài khoản đã bị khóa." : "Không tìm thấy tài khoản.");
        return;
      }
      setSession(ROLE, r.account); onAuthed(r.account);
    } else {
      if (!name.trim() || !email.trim() || !password) { setError("Vui lòng điền đủ thông tin."); return; }
      const acc: Account = { id: `acc-${ROLE}-${Date.now()}`, name: name.trim(), email: email.trim(), password, role: ROLE, status: "active", createdAt: Date.now() };
      const r = addAccount(acc);
      if (!r.ok) { setError("Email này đã được đăng ký."); return; }
      setSession(ROLE, acc); onAuthed(acc);
    }
  };

  const inp: React.CSSProperties = { width: "100%", padding: "11px 12px 11px 38px", borderRadius: 10, border: "1px solid #d6dced", outline: "none", fontSize: 14, color: "#1e293b" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#eef4ff,#dbe7ff)", fontFamily: "'Inter', system-ui, sans-serif", padding: 20 }}>
      <BackToHome /><ZaloButton />
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 380, background: "#fff", borderRadius: 18, padding: 30, boxShadow: "0 16px 44px rgba(37,99,235,0.14)" }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Presentation size={26} color="#fff" />
        </div>
        <h2 style={{ fontSize: 21, fontWeight: 800, color: "#0f172a", margin: 0 }}>
          {mode === "login" ? `Đăng nhập ${TITLE}` : `Đăng ký ${TITLE}`}
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 5, marginBottom: 20 }}>
          {mode === "login" ? "Đăng nhập để vào khu vực giảng dạy" : "Tạo tài khoản giáo viên mới"}
        </p>

        {mode === "register" && (
          <div style={{ position: "relative", marginBottom: 12 }}>
            <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input style={inp} placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div style={{ position: "relative", marginBottom: 12 }}>
          <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input style={inp} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={{ position: "relative", marginBottom: 6 }}>
          <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input style={inp} type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <p style={{ color: "#dc2626", fontSize: 13, margin: "8px 0 0", fontWeight: 600 }}>{error}</p>}

        <button type="submit" style={{ width: "100%", marginTop: 16, padding: 12, borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: 14.5, cursor: "pointer" }}>
          {mode === "login" ? "Đăng nhập" : "Đăng ký"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 14 }}>
          {mode === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: ACCENT, fontWeight: 700, cursor: "pointer" }}>
            {mode === "login" ? "Đăng ký" : "Đăng nhập"}
          </button>
        </p>
        {mode === "login" && <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Demo: {DEMO}</p>}
      </form>
    </div>
  );
}
