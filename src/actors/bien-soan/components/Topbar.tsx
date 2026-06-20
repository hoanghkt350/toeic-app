import { useApp, pageTitles } from "../context";
import { C } from "./ui";
import { useState } from "react";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { currentPage, showToast, notifOpen, setNotifOpen } = useApp();
  const [search, setSearch] = useState("");

  return (
    <div
      style={{
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        padding: "0 28px",
        height: 62,
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 2px 12px rgba(28,99,234,0.07)",
      }}
    >
      {/* Mobile menu btn */}
      <button
        onClick={onMenuClick}
        className="mobile-only"
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: C.primary,
          color: "#fff",
          border: "none",
          fontSize: 18,
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        ☰
      </button>

      <h1 style={{ fontSize: 19, fontWeight: 700, flex: 1, margin: 0, color: C.text1 }}>
        {pageTitles[currentPage]}
      </h1>

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: "7px 14px",
          fontSize: 12.5,
          color: C.text3,
          width: 220,
        }}
      >
        <span>🔍</span>
        <input
          type="text"
          placeholder="Tìm kiếm nội dung..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: "none",
            background: "none",
            outline: "none",
            fontSize: 12.5,
            color: C.text1,
            width: 160,
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Notif */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setNotifOpen(!notifOpen);
        }}
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: C.bg,
          border: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 16,
          position: "relative",
          flexShrink: 0,
        }}
      >
        🔔
        <span
          id="notif-dot"
          style={{
            width: 8,
            height: 8,
            background: C.danger,
            borderRadius: "50%",
            position: "absolute",
            top: 6,
            right: 6,
          }}
        />
      </div>

      {/* Avatar */}
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
          fontSize: 13,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        K
      </div>
    </div>
  );
}
