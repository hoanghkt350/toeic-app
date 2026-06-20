import { MessageCircle } from "lucide-react";

/**
 * Nút Zalo liên hệ hỗ trợ — hình tròn nổi góc phải dưới.
 * Ai gặp lỗi bấm vào sẽ mở chat Zalo nhắn cho chủ web.
 *
 * 👉 ĐỔI số điện thoại Zalo của bạn ở dòng ZALO_PHONE bên dưới.
 */
const ZALO_PHONE = "0945392167"; // số Zalo liên hệ hỗ trợ

export default function ZaloButton() {
  const href = `https://zalo.me/${ZALO_PHONE}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Liên hệ hỗ trợ qua Zalo"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 9999,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#0068FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        boxShadow: "0 8px 22px rgba(0,104,255,0.45)",
      }}
    >
      {/* vòng nhịp cho dễ thấy */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "#0068FF",
          opacity: 0.45,
          animation: "zalo-pulse 1.8s ease-out infinite",
        }}
      />
      <MessageCircle size={26} color="#fff" style={{ position: "relative" }} />
      <span
        style={{
          position: "absolute",
          top: -4,
          right: -4,
          background: "#fff",
          color: "#0068FF",
          fontSize: 9,
          fontWeight: 900,
          padding: "1px 5px",
          borderRadius: 999,
          letterSpacing: "0.02em",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        Zalo
      </span>
      <style>{`@keyframes zalo-pulse { 0%{transform:scale(1);opacity:.45} 70%{transform:scale(1.9);opacity:0} 100%{opacity:0} }`}</style>
    </a>
  );
}
