import { useState } from "react";
import {
  Bell, BookOpen, Headphones, Target, TrendingUp, Calendar,
  CheckCircle2, ArrowRight, Zap, Flame, Clock, Star,
  BarChart2, ChevronRight, PlayCircle, BookMarked, Trophy,
} from "lucide-react";

/* ─── types ────────────────────────────────────────── */
type Tab = "dashboard" | "practice" | "vocab" | "analytics" | "roadmap" | "tutors";

interface Props { onNavigate?: (tab: Tab) => void }

/* ─── data ─────────────────────────────────────────── */
const skillData = [
  { skill: "Nghe", score: 340, maxScore: 495, parts: ["P1 88%","P2 72%","P3 65%","P4 58%"], icon: Headphones, color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe", trend: +15 },
  { skill: "Đọc",  score: 300, maxScore: 495, parts: ["P5 74%","P6 62%","P7 50%"],          icon: BookOpen,   color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", trend: +20 },
];

const todayTasks = [
  { id: "t1", label: "Nghe Phần 3 — Đoạn hội thoại", xp: 25, duration: "20 phút", icon: Headphones, color: "#1d4ed8", done: false, tab: "practice" as Tab },
  { id: "t2", label: "Từ vựng: 12 thẻ hôm nay",      xp: 15, duration: "10 phút", icon: BookMarked, color: "#059669", done: false, tab: "vocab" as Tab },
  { id: "t3", label: "Đọc Phần 5 — Hoàn thành câu",  xp: 30, duration: "25 phút", icon: BookOpen,   color: "#7c3aed", done: false, tab: "practice" as Tab },
];

const weekSchedule = [
  { day: "T2", date: "9/6",  task: "Nghe P1-2",       done: true  },
  { day: "T3", date: "10/6", task: "Đọc P5",           done: true  },
  { day: "T4", date: "11/6", task: "Mini Test #3",     done: false, today: false },
  { day: "T5", date: "12/6", task: "Nghe P3-4",        done: false },
  { day: "T6", date: "13/6", task: "Đọc P6-7",         done: false },
  { day: "T7", date: "14/6", task: "Thi Thử Toàn Bộ", done: false, today: true  },
  { day: "CN", date: "15/6", task: "Ôn tập & nghỉ",   done: false },
];

const notifications = [
  { id: 1, avatar: "TH", name: "Cô Trần Hương", type: "feedback",  message: "Đã chấm Mini Test #2 — tiến bộ rõ ở Phần 5! Xem chi tiết nhận xét.",    time: "2 giờ trước", unread: true  },
  { id: 2, avatar: "TH", name: "Cô Trần Hương", type: "comment",   message: "Nhận xét mới về bài Nghe Phần 4: cần chú ý ngữ điệu câu hỏi đuôi.",       time: "Hôm qua",     unread: true  },
  { id: 3, avatar: "SY", name: "Hệ Thống",       type: "reminder",  message: "Nhắc nhở: Thi thử toàn bộ vào Thứ Bảy lúc 9:00 sáng — còn 1 ngày!",    time: "2 ngày trước",unread: false },
];

const recentActivity = [
  { label: "Hoàn thành Từ vựng", detail: "Học 12/12 thẻ hôm nay",     xp: +15, icon: BookMarked, color: "#059669", time: "30 phút trước" },
  { label: "Nghe Phần 2 — 88%", detail: "25 câu · 22 đúng",          xp: +20, icon: Headphones, color: "#1d4ed8", time: "1 giờ trước"   },
  { label: "Mini Test #2 — 620",  detail: "L:325 / R:295 · +10 điểm", xp: +50, icon: Trophy,     color: "#d97706", time: "Hôm qua"       },
];

/* ─── helpers ──────────────────────────────────────── */
function SectionTitle({ icon: Icon, title, action, onAction }: { icon: any; title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ display: "block", width: 3, height: 18, background: "#1d4ed8", borderRadius: 2 }} />
        <Icon size={15} style={{ color: "#1d4ed8" }} />
        <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700 }}>{title}</h3>
      </div>
      {action && (
        <button onClick={onAction} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem", fontWeight: 600, color: "#1d4ed8", border: "none", background: "transparent", cursor: "pointer" }}>
          {action} <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

/* ─── Dashboard ────────────────────────────────────── */
export function Dashboard({ onNavigate }: Props) {
  const [doneTasks, setDoneTasks]   = useState<Record<string, boolean>>({});
  const [readNotif, setReadNotif]   = useState<Record<number, boolean>>({});

  const today = weekSchedule.find(d => d.today);
  const completedToday = Object.values(doneTasks).filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1100, margin: "0 auto" }}>

      {/* ── Welcome banner ───────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 55%,#3b82f6 100%)", borderRadius: 20, padding: "24px 28px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: "0.72rem", color: "#93c5fd", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
            Thứ Bảy, 14 tháng 6 năm 2026
          </div>
          <h2 style={{ margin: "0 0 6px", color: "#fff", fontSize: "1.25rem" }}>Chào buổi sáng, Nguyễn Minh! 👋</h2>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "#bfdbfe", lineHeight: 1.5 }}>
            Bạn đang học rất tốt — hãy hoàn thành {todayTasks.length} nhiệm vụ hôm nay để duy trì streak 7 ngày!
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Điểm hiện tại", value: "640", sub: "/ 990 tối đa", accent: "#fbbf24" },
            { label: "Còn cần",        value: "160",  sub: "để đạt 800",   accent: "#34d399" },
            { label: "Streak",          value: "7🔥",  sub: "ngày liên tiếp", accent: "#fb923c" },
          ].map(k => (
            <div key={k.label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: "12px 16px", backdropFilter: "blur(4px)", minWidth: 100, textAlign: "center" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: k.accent, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{k.sub}</div>
              <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.45)", marginTop: 1 }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Today's tasks + Skills (2 col) ───────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Today's tasks */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "20px 20px 16px" }}>
          <SectionTitle icon={Target} title="Nhiệm Vụ Hôm Nay" action="Xem tất cả" onAction={() => onNavigate?.("practice")} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {todayTasks.map((t) => {
              const done = !!doneTasks[t.id];
              return (
                <div key={t.id}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${done ? "#bbf7d0" : "var(--border)"}`, background: done ? "#f0fdf4" : "var(--background)", cursor: "pointer", transition: "all 0.15s" }}
                  onClick={() => setDoneTasks(p => ({ ...p, [t.id]: !done }))}
                >
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${done ? "#16a34a" : "var(--border)"}`, background: done ? "#16a34a" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                    {done && <CheckCircle2 size={12} color="#fff" />}
                  </div>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: done ? "#f0fdf4" : `${t.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <t.icon size={14} style={{ color: done ? "#16a34a" : t.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: done ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: done ? "line-through" : "none" }}>{t.label}</div>
                    <div style={{ fontSize: "0.65rem", color: "var(--muted-foreground)", marginTop: 1 }}>{t.duration}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, background: "#fef9c3", borderRadius: 999, padding: "2px 8px", flexShrink: 0 }}>
                    <Zap size={9} style={{ color: "#ca8a04" }} />
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#92400e" }}>+{t.xp}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div style={{ background: "var(--muted)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--foreground)" }}>Tiến độ hôm nay</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1d4ed8" }}>{completedToday}/{todayTasks.length} nhiệm vụ</span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: "var(--border)" }}>
              <div style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#1d4ed8,#3b82f6)", width: `${(completedToday / todayTasks.length) * 100}%`, transition: "width 0.4s ease" }} />
            </div>
            {completedToday === todayTasks.length && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
                <Trophy size={12} style={{ color: "#d97706" }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#d97706" }}>Hoàn thành xuất sắc! +70 XP thưởng</span>
              </div>
            )}
          </div>
        </div>

        {/* Skill scores */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "20px 20px 16px" }}>
          <SectionTitle icon={BarChart2} title="Điểm Kỹ Năng" action="Phân tích chi tiết" onAction={() => onNavigate?.("analytics")} />

          {/* Total score ring-like display */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 14, marginBottom: 14 }}>
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#1d4ed8", lineHeight: 1 }}>640</div>
              <div style={{ fontSize: "0.6rem", color: "#3b82f6", fontWeight: 600, marginTop: 2 }}>TỔNG ĐIỂM</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: "0.68rem", color: "#1e3a8a" }}>Tiến độ đến mục tiêu 800</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#1d4ed8" }}>80%</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: "#bfdbfe" }}>
                <div style={{ height: "100%", width: "80%", borderRadius: 999, background: "linear-gradient(90deg,#1d4ed8,#3b82f6)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: "0.6rem", color: "#3b82f6" }}>Hiện tại: 640</span>
                <span style={{ fontSize: "0.6rem", color: "#3b82f6" }}>Mục tiêu: 800</span>
              </div>
            </div>
          </div>

          {/* Skill breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {skillData.map((s) => {
              const pct = Math.round((s.score / s.maxScore) * 100);
              return (
                <div key={s.skill} style={{ border: `1px solid ${s.border}`, background: s.bg, borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <s.icon size={14} style={{ color: s.color }} />
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: s.color }}>Kỹ Năng {s.skill}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <TrendingUp size={11} style={{ color: "#16a34a" }} />
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#16a34a" }}>+{s.trend} điểm tháng này</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.score}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>/ {s.maxScore} điểm ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: "rgba(0,0,0,0.08)", marginBottom: 8 }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999, background: s.color }} />
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {s.parts.map(p => (
                      <span key={p} style={{ fontSize: "0.62rem", background: "rgba(255,255,255,0.7)", border: `1px solid ${s.border}`, borderRadius: 999, padding: "2px 7px", color: s.color, fontWeight: 600 }}>{p}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Weekly schedule + Notifications (2 col) ──── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Weekly schedule */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "20px 20px 16px" }}>
          <SectionTitle icon={Calendar} title="Lịch Học Tuần Này" />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {weekSchedule.map((item) => (
              <div key={item.day}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: item.today ? "#eff6ff" : "transparent", border: item.today ? "1.5px solid #bfdbfe" : "1.5px solid transparent" }}
              >
                {/* Day + date */}
                <div style={{ width: 42, flexShrink: 0, textAlign: "center" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: item.today ? "#1d4ed8" : item.done ? "var(--muted-foreground)" : "var(--foreground)" }}>{item.day}</div>
                  <div style={{ fontSize: "0.6rem", color: "var(--muted-foreground)" }}>{item.date}</div>
                </div>

                {/* Status dot */}
                <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: item.done ? "#16a34a" : item.today ? "#1d4ed8" : "var(--border)" }} />

                {/* Task */}
                <span style={{ flex: 1, fontSize: "0.8rem", color: item.done ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: item.done ? "line-through" : "none", fontWeight: item.today ? 600 : 400 }}>
                  {item.task}
                </span>

                {/* Badge */}
                {item.done && <CheckCircle2 size={14} style={{ color: "#16a34a", flexShrink: 0 }} />}
                {item.today && !item.done && (
                  <span style={{ fontSize: "0.62rem", fontWeight: 800, background: "#1d4ed8", color: "#fff", borderRadius: 999, padding: "2px 8px", flexShrink: 0 }}>Hôm nay</span>
                )}
              </div>
            ))}
          </div>
          {today && (
            <button onClick={() => onNavigate?.("practice")}
              style={{ marginTop: 12, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 10, border: "none", background: "#1d4ed8", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
              <PlayCircle size={14} /> Bắt đầu {today.task}
            </button>
          )}
        </div>

        {/* Notifications + Activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Notifications */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "20px 20px 16px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "block", width: 3, height: 18, background: "#1d4ed8", borderRadius: 2 }} />
                <Bell size={15} style={{ color: "#1d4ed8" }} />
                <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700 }}>Thông Báo Từ Gia Sư</h3>
              </div>
              <span style={{ fontSize: "0.65rem", fontWeight: 800, background: "#dc2626", color: "#fff", borderRadius: 999, padding: "2px 8px" }}>
                {notifications.filter(n => n.unread && !readNotif[n.id]).length} mới
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {notifications.map((n) => {
                const read = !!readNotif[n.id];
                return (
                  <div key={n.id} onClick={() => setReadNotif(p => ({ ...p, [n.id]: true }))}
                    style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10, background: (n.unread && !read) ? "#eff6ff" : "transparent", border: `1px solid ${(n.unread && !read) ? "#bfdbfe" : "var(--border)"}`, cursor: "pointer", opacity: read ? 0.6 : 1, transition: "opacity 0.2s" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>{n.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, marginBottom: 2 }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{n.name}</span>
                        <span style={{ fontSize: "0.6rem", color: "var(--muted-foreground)", flexShrink: 0 }}>{n.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--muted-foreground)", lineHeight: 1.4 }}>{n.message}</p>
                    </div>
                    {(n.unread && !read) && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1d4ed8", flexShrink: 0, marginTop: 6 }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent activity */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "20px 20px 16px" }}>
            <SectionTitle icon={Flame} title="Hoạt Động Gần Đây" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentActivity.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "var(--background)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${a.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <a.icon size={14} style={{ color: a.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--foreground)" }}>{a.label}</div>
                    <div style={{ fontSize: "0.65rem", color: "var(--muted-foreground)" }}>{a.detail} · {a.time}</div>
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 999, padding: "2px 8px", flexShrink: 0 }}>+{a.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick actions ─────────────────────────────── */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "20px 20px 16px" }}>
        <SectionTitle icon={Star} title="Truy Cập Nhanh" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
          {[
            { label: "Luyện Nghe",       sub: "Parts 1–4",        tab: "practice" as Tab,  icon: Headphones,   color: "#1d4ed8", bg: "#eff6ff" },
            { label: "Luyện Đọc",        sub: "Parts 5–7",        tab: "practice" as Tab,  icon: BookOpen,     color: "#7c3aed", bg: "#f5f3ff" },
            { label: "Học Từ Vựng",      sub: "12 thẻ còn lại",   tab: "vocab"    as Tab,  icon: BookMarked,   color: "#059669", bg: "#f0fdf4" },
            { label: "Xem Lộ Trình",     sub: "Unit 2 đang học",  tab: "roadmap"  as Tab,  icon: Target,       color: "#d97706", bg: "#fffbeb" },
            { label: "Phân Tích Điểm",   sub: "5 bài thi đã làm", tab: "analytics" as Tab, icon: BarChart2,    color: "#0891b2", bg: "#ecfeff" },
            { label: "Tìm Gia Sư",       sub: "6 gia sư sẵn sàng",tab: "tutors"   as Tab,  icon: Clock,        color: "#e11d48", bg: "#fff1f2" },
          ].map(q => (
            <button key={q.label} onClick={() => onNavigate?.(q.tab)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--background)", cursor: "pointer", textAlign: "left", transition: "border-color 0.12s,background 0.12s" }}
              onMouseEnter={e => { e.currentTarget.style.background = q.bg; e.currentTarget.style.borderColor = q.color + "60"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--background)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 9, background: q.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <q.icon size={15} style={{ color: q.color }} />
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--foreground)" }}>{q.label}</div>
                <div style={{ fontSize: "0.62rem", color: "var(--muted-foreground)" }}>{q.sub}</div>
              </div>
              <ArrowRight size={12} style={{ color: "var(--muted-foreground)", marginLeft: "auto" }} />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
