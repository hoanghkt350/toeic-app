import { LogOut } from "lucide-react";
import { useApp, PageId } from "../context";
import { C } from "./ui";

const navItems: { id: PageId; icon: string; label: string; badge?: string }[] = [
  { id: "dashboard", icon: "⊞", label: "Bảng tin" },
  { id: "baothi", icon: "✏️", label: "Bài thi TOEIC" },
  { id: "khoahoc", icon: "📖", label: "Khóa học" },
  { id: "nganhang", icon: "❓", label: "Ngân hàng câu hỏi", badge: "86" },
  { id: "tuvung", icon: "🔤", label: "Từ vựng & Ngữ pháp" },
  { id: "thongke", icon: "📊", label: "Thống kê" },
  { id: "caidat", icon: "⚙️", label: "Cài đặt" },
];

export function Sidebar({ mobileOpen, onClose, userName, onLogout }: { mobileOpen?: boolean; onClose?: () => void; userName?: string; onLogout?: () => void }) {
  const { currentPage, setCurrentPage } = useApp();
  const initials = (userName || "").trim().split(/\s+/).map((w) => w[0]).slice(-2).join("").toUpperCase() || "BS";

  const navigate = (id: PageId) => {
    setCurrentPage(id);
    onClose?.();
    window.scrollTo(0, 0);
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onClose}
          className="bs-sidebar-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 99,
          }}
        />
      )}
      <aside
        className={"bs-sidebar" + (mobileOpen ? " bs-sidebar--open" : "")}
        style={{
          width: 240,
          background: C.sidebarBg,
          minHeight: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: 20,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 24 }}>📚</span>
          <div>
            <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: 0 }}>TOEIC Studio</h2>
            <p style={{ color: C.text3, fontSize: 10, marginTop: 2 }}>Content Creator Platform</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 0" }}>
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <div
                key={item.id}
                onClick={() => navigate(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 20px",
                  color: isActive ? "#fff" : "#8A93B4",
                  fontSize: 13.5,
                  cursor: "pointer",
                  transition: "all .2s",
                  borderLeft: `3px solid ${isActive ? C.primary : "transparent"}`,
                  background: isActive ? "rgba(28,99,234,0.15)" : "transparent",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#8A93B4";
                  }
                }}
              >
                <span style={{ fontSize: 17, width: 22, textAlign: "center" }}>{item.icon}</span>
                {item.label}
                {item.badge && (
                  <span
                    style={{
                      background: C.danger,
                      color: "#fff",
                      fontSize: 9,
                      padding: "2px 6px",
                      borderRadius: 10,
                      marginLeft: "auto",
                      fontWeight: 600,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: C.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "#fff", fontSize: 11.5, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName || "Biên soạn"}</p>
            <span style={{ color: C.text3, fontSize: 10 }}>Biên soạn nội dung</span>
          </div>
          <button onClick={onLogout} title="Đăng xuất" style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", flexShrink: 0, display: "flex" }}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
