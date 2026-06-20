import { useApp } from "../context";
import { C } from "./ui";

export function FloatToolbar() {
  const { openModalFn, toggleDark, darkMode, showToast } = useApp();

  const btns = [
    { bg: C.purple, icon: "📘", title: "Ngữ pháp", onClick: () => openModalFn("modal-grammar") },
    { bg: C.warning, icon: "📋", title: "Kanban", onClick: () => openModalFn("modal-kanban") },
    { bg: C.success, icon: "📥", title: "Import/Export", onClick: () => openModalFn("modal-import") },
    {
      bg: "#1a1d2e",
      icon: darkMode ? "☀️" : "🌙",
      title: "Dark mode",
      onClick: () => {
        toggleDark();
        showToast(darkMode ? "☀️ Light mode bật" : "🌙 Dark mode bật");
      },
    },
  ];

  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, display: "flex", flexDirection: "column", gap: 10, zIndex: 90 }}>
      {btns.map((btn, i) => (
        <button
          key={i}
          onClick={btn.onClick}
          title={btn.title}
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            boxShadow: "0 3px 12px rgba(0,0,0,0.18)",
            transition: "all .2s",
            background: btn.bg,
            color: "#fff",
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = "scale(1.12)"}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = ""}
        >
          {btn.icon}
        </button>
      ))}
      {/* Main FAB */}
      <button
        onClick={() => openModalFn("modal-create-test")}
        title="Tạo mới"
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          background: C.primary,
          color: "#fff",
          boxShadow: `0 4px 16px rgba(28,99,234,0.35)`,
          transition: "all .2s",
          alignSelf: "center",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = C.primary2;
          (e.currentTarget as HTMLElement).style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = C.primary;
          (e.currentTarget as HTMLElement).style.transform = "";
        }}
      >
        +
      </button>
    </div>
  );
}
