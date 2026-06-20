// src/app/components/Sidebar.tsx
import { LayoutDashboard, Users, BookOpen, PenTool, CheckSquare } from "lucide-react";
import type { Screen } from "../App";

const menuItems = [
  { id: "tongquan", labelVi: "Tổng quan", labelEn: "Dashboard", icon: LayoutDashboard },
  { id: "quanlylophoc", labelVi: "Quản lý Lớp học", labelEn: "Class Management", icon: Users },
  { id: "quanlydeti", labelVi: "Quản lý Đề thi", labelEn: "Test Bank", icon: BookOpen },
  { id: "soanthaode", labelVi: "Soạn thảo Đề", labelEn: "Create Test", icon: PenTool },
  { id: "chamdiemhocvien", labelVi: "Chấm điểm Học viên", labelEn: "Grading", icon: CheckSquare },
];

export function Sidebar({ activeScreen, onNavigate, lang }: { activeScreen: Screen; onNavigate: (id: string) => void, lang: string }) {
  const isEn = lang === "en";
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col relative z-50 shadow-sm" style={{ height: "100vh", background: "#fff" }}>
      <div className="h-16 flex items-center px-6 border-b border-border bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-white font-bold text-sm">AT</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#1E3A8A", letterSpacing: "-0.5px" }}>ActorTeacher</span>
        </div>
      </div>
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        <div className="px-3 mb-2">
          <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {isEn ? "Main Menu" : "Menu chính"}
          </span>
        </div>
        {menuItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left cursor-pointer border-none"
              style={{
                background: isActive ? "#EFF6FF" : "transparent",
                color: isActive ? "#2563EB" : "#475569",
              }}
            >
              <item.icon size={18} style={{ color: isActive ? "#2563EB" : "#64748B", transition: "color 0.2s" }} />
              <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 500, transition: "font-weight 0.2s" }}>
                {isEn ? item.labelEn : item.labelVi}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border bg-slate-50">
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#F1F5F9", border: "1px solid #E2E8F0" }}>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>{isEn ? "ActorTeacher Pro" : "ActorTeacher Pro"}</p>
            <p style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{isEn ? "Subscription active" : "Đang hoạt động"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}