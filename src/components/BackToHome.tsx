import { Link } from "react-router";
import { Home } from "lucide-react";

/** Nút nổi "về trang chọn vai trò" — dùng chung cho mọi actor. */
export default function BackToHome() {
  return (
    <Link
      to="/"
      title="Về trang chọn vai trò"
      style={{
        position: "fixed",
        left: 16,
        bottom: 16,
        zIndex: 9999,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 999,
        background: "rgba(15,23,42,0.88)",
        color: "#fff",
        fontSize: "0.78rem",
        fontWeight: 700,
        textDecoration: "none",
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <Home size={14} />
      Đổi vai trò
    </Link>
  );
}
