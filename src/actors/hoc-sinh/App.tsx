import { useState, useEffect } from "react";
import {
  LayoutDashboard, BookOpenCheck, GraduationCap, Settings,
  Languages, LineChart, Map, UserSearch, Bell, Zap,
  ChevronRight, Headphones, BookOpen, ClipboardList, CalendarDays,
  QrCode, FileText, Crown, LogOut,
} from "lucide-react";
import { Dashboard }      from "./components/Dashboard";
import { PracticeHub }    from "./components/PracticeHub";
import { VocabFlashcard } from "./components/VocabFlashcard";
import { Analytics }      from "./components/Analytics";
import { Roadmap }        from "./components/Roadmap";
import { FindTutor }      from "./components/FindTutor";
import { MySchedule }     from "./components/MySchedule";
import { Courses }        from "./components/Courses";
import { Attendance }     from "./components/Attendance";
import { Assignments }    from "./components/Assignments";
import { Auth }           from "./components/Auth";
import { Upgrade }        from "./components/Upgrade";
import { getSession, clearSession, type Account } from "./lib/classroomStore";
import BackToHome from "../../components/BackToHome";
import ZaloButton from "../../components/ZaloButton";

type Tab = "dashboard" | "practice" | "vocab" | "courses" | "analytics" | "roadmap" | "tutors" | "schedule" | "attendance" | "assignments" | "upgrade";

const NAV_GROUPS = [
  {
    label: "Học Tập",
    items: [
      { id: "dashboard" as Tab, label: "Tổng Quan",  icon: LayoutDashboard, badge: 2 },
      { id: "roadmap"   as Tab, label: "Lộ Trình",   icon: Map },
      { id: "courses"   as Tab, label: "Khóa Học",   icon: BookOpen, badge: 5 },
      { id: "practice"  as Tab, label: "Luyện Tập",  icon: BookOpenCheck, badge: 3 },
      { id: "vocab"     as Tab, label: "Từ Vựng",    icon: Languages },
    ],
  },
  {
    label: "Lớp Học",
    items: [
      { id: "attendance"  as Tab, label: "Điểm Danh",     icon: QrCode },
      { id: "assignments" as Tab, label: "Bài Được Giao", icon: FileText },
    ],
  },
  {
    label: "Gia Sư",
    items: [
      { id: "tutors"    as Tab, label: "Tìm Gia Sư", icon: UserSearch },
      { id: "schedule"  as Tab, label: "Lịch Học",   icon: CalendarDays, badge: 1 },
    ],
  },
  {
    label: "Theo Dõi",
    items: [
      { id: "analytics" as Tab, label: "Phân Tích",  icon: LineChart },
    ],
  },
  {
    label: "Tài Khoản",
    items: [
      { id: "upgrade" as Tab, label: "Nâng Cấp", icon: Crown },
    ],
  },
];

const HEADER: Record<Tab, { title: string; sub: string; icon: any }> = {
  dashboard: { title: "Tổng Quan",                    sub: "Chào mừng trở lại, Nguyễn Minh!",                    icon: LayoutDashboard },
  roadmap:   { title: "Lộ Trình Học Tập",             sub: "Tiến từng bước theo lộ trình cá nhân hoá",           icon: Map },
  courses:   { title: "Khóa Học",                     sub: "Xem danh sách khóa học và chi tiết từng buổi học",   icon: BookOpen },
  practice:  { title: "Luyện Tập & Kiểm Tra",         sub: "Chọn bài tập và bắt đầu luyện ngay",                 icon: BookOpenCheck },
  vocab:     { title: "Học Từ Vựng",                  sub: "600 Essential TOEIC Words · Lật thẻ để ghi nhớ",     icon: Languages },
  analytics: { title: "Phân Tích Kết Quả",            sub: "Biểu đồ tiến độ và chi tiết lỗi sai từng phần thi", icon: LineChart },
  tutors:    { title: "Tìm Gia Sư TOEIC",             sub: "Đặt lịch 1-1 với gia sư phù hợp",                   icon: UserSearch },
  schedule:  { title: "Lịch Học Với Gia Sư",          sub: "Xem và quản lý các buổi học đã đặt",                 icon: CalendarDays },
  attendance:  { title: "Điểm Danh",        sub: "Quét QR hoặc nhập mã PIN giáo viên đưa",          icon: QrCode },
  assignments: { title: "Bài Được Giao",    sub: "Đề thi / bài tập giáo viên giao cho lớp",         icon: FileText },
  upgrade:     { title: "Nâng Cấp Tài Khoản", sub: "Mua gói Premium / khóa học · thanh toán chuyển khoản", icon: Crown },
};

/* quick-access shortcuts shown in the header for learning tabs */
const QUICK: Record<string, { label: string; icon: any; tab: Tab }[]> = {
  practice: [
    { label: "Nghe",        icon: Headphones,  tab: "practice" },
    { label: "Đọc",         icon: BookOpen,    tab: "practice" },
    { label: "Mini Test",   icon: ClipboardList, tab: "practice" },
  ],
};

export default function App() {
  const [account, setAccount]       = useState<Account | null>(getSession("hoc-sinh"));
  const [activeTab, setActiveTab]   = useState<Tab>("dashboard");
  const [notifOpen, setNotifOpen]   = useState(false);

  const logout = () => { clearSession("hoc-sinh"); setAccount(null); };
  const initials = (account?.name || "")
    .trim().split(/\s+/).map((w) => w[0]).slice(-2).join("").toUpperCase() || "HV";

  useEffect(() => {
    if (activeTab !== "vocab") return;
    const h = (e: KeyboardEvent) => { if (e.key === " ") e.preventDefault(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [activeTab]);

  if (!account) return <Auth onAuthed={setAccount} />;

  const info = HEADER[activeTab];

  return (
    <div className="theme-hoc-sinh" style={{ minHeight: "100vh", background: "var(--background)", display: "flex" }}>
      <BackToHome /><ZaloButton />

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside style={{ width: 232, flexShrink: 0, background: "var(--card)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}
        className="hidden sm:flex"
      >
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <GraduationCap size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.01em" }}>TOEIC Prep</div>
              <div style={{ fontSize: "0.62rem", color: "var(--muted-foreground)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Cổng Học Viên</div>
            </div>
          </div>
        </div>

        {/* User XP Card */}
        <div style={{ margin: "12px 12px 4px", background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", borderRadius: 14, padding: "14px 14px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff", marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{account.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Zap size={10} style={{ color: "#fbbf24" }} />
                <span style={{ fontSize: "0.65rem", color: "#93c5fd", fontWeight: 600 }}>Level 8 · 1 240 XP</span>
              </div>
            </div>
            <LogOut size={14} onClick={logout} style={{ color: "rgba(255,255,255,0.7)", cursor: "pointer", flexShrink: 0 }} aria-label="Đăng xuất" />
          </div>
          {/* XP bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.6)" }}>Tiến tới Level 9</span>
              <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.6)" }}>1 240 / 1 500 XP</span>
            </div>
            <div style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,0.2)" }}>
              <div style={{ height: "100%", width: "82.7%", borderRadius: 999, background: "#fbbf24" }} />
            </div>
          </div>
        </div>

        {/* Nav groups */}
        <nav style={{ flex: 1, padding: "8px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-foreground)", padding: "10px 8px 6px" }}>
                {group.label}
              </div>
              {group.items.map(({ id, label, icon: Icon, badge }) => {
                const active = activeTab === id;
                return (
                  <button key={id} onClick={() => setActiveTab(id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px",
                      borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
                      background: active ? "var(--accent)" : "transparent",
                      color: active ? "var(--primary)" : "var(--muted-foreground)",
                      fontWeight: active ? 700 : 500, fontSize: "0.84rem",
                      transition: "background 0.12s, color 0.12s",
                      position: "relative",
                    }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: active ? "var(--primary)" : "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.12s" }}>
                      <Icon size={14} color={active ? "#fff" : "var(--muted-foreground)"} />
                    </div>
                    <span style={{ flex: 1 }}>{label}</span>
                    {badge && !active && (
                      <span style={{ fontSize: "0.6rem", fontWeight: 800, background: "var(--primary)", color: "#fff", borderRadius: 999, padding: "1px 6px", minWidth: 18, textAlign: "center" }}>
                        {badge}
                      </span>
                    )}
                    {active && <ChevronRight size={13} />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Streak footer */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: "1rem" }}>🔥</span>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#ea580c" }}>7 ngày liên tiếp</div>
              <div style={{ fontSize: "0.6rem", color: "var(--muted-foreground)" }}>Tiếp tục chuỗi streak!</div>
            </div>
          </div>
          <div style={{ fontSize: "0.62rem", color: "var(--muted-foreground)", background: "var(--muted)", borderRadius: 8, padding: "3px 8px", fontWeight: 600 }}>
            🏆 Top 12%
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top header */}
        <header style={{ height: 64, background: "var(--card)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <info.icon size={16} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <h1 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)" }}>{info.title}</h1>
            </div>
            <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--muted-foreground)", marginTop: 1 }}>{info.sub}</p>
          </div>

          {/* Header actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {/* XP badge visible in header */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#fef9c3", border: "1px solid #fde68a", borderRadius: 999, padding: "4px 10px" }}>
              <Zap size={12} style={{ color: "#ca8a04" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#92400e" }}>1 240 XP</span>
            </div>

            {/* Notification bell */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setNotifOpen(v => !v)}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Bell size={15} style={{ color: "var(--muted-foreground)" }} />
              </button>
              <span style={{ position: "absolute", top: 3, right: 3, width: 8, height: 8, borderRadius: "50%", background: "#dc2626", border: "1.5px solid var(--card)" }} />
              {notifOpen && (
                <div style={{ position: "absolute", top: 44, right: 0, width: 300, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 50, overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>Thông Báo</span>
                    <span style={{ fontSize: "0.65rem", color: "var(--primary)", cursor: "pointer", fontWeight: 600 }}>Đánh dấu tất cả đã đọc</span>
                  </div>
                  {[
                    { text: "Cô Trần Hương đã chấm Mini Test #2 của bạn", time: "2 giờ trước", unread: true },
                    { text: "Bạn có bài tập mới: Nghe Phần 4", time: "5 giờ trước", unread: true },
                    { text: "Nhắc nhở: Thi thử vào Thứ Bảy 9:00", time: "1 ngày trước", unread: false },
                  ].map((n, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "12px 16px", borderBottom: i < 2 ? "1px solid var(--border)" : "none", background: n.unread ? "var(--accent)" : "transparent" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.unread ? "var(--primary)" : "transparent", flexShrink: 0, marginTop: 5 }} />
                      <div>
                        <div style={{ fontSize: "0.78rem", color: "var(--foreground)", lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: "0.65rem", color: "var(--muted-foreground)", marginTop: 3 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, color: "#fff", cursor: "pointer", border: "2px solid var(--accent)" }}>
              NM
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px", ...(activeTab === "vocab" ? { display: "flex", justifyContent: "center" } : {}) }}>
          {activeTab === "dashboard" && <Dashboard onNavigate={setActiveTab} />}
          {activeTab === "roadmap"   && <Roadmap />}
          {activeTab === "courses"   && <Courses />}
          {activeTab === "practice"  && <PracticeHub />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "tutors"    && <FindTutor />}
          {activeTab === "schedule"  && <MySchedule />}
          {activeTab === "attendance"  && <Attendance />}
          {activeTab === "assignments" && <Assignments />}
          {activeTab === "upgrade"     && <Upgrade account={account} />}
          {activeTab === "vocab"     && (
            <div style={{ width: "100%", maxWidth: 1160 }}>
              <VocabFlashcard />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
