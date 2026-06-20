import { useState } from "react";
import {
  Lock,
  CheckCircle2,
  PlayCircle,
  Star,
  Trophy,
  Zap,
  BookOpen,
  Headphones,
  PenLine,
  Brain,
  Flame,
  ChevronRight,
  X,
  Clock,
  Target,
} from "lucide-react";
import { motion } from "motion/react";

/* ─── Types ─────────────────────────────────────────────── */
type NodeStatus = "completed" | "current" | "locked";
type NodeType = "lesson" | "quiz" | "milestone" | "boss";

interface LessonNode {
  id: number;
  title: string;
  subtitle: string;
  type: NodeType;
  status: NodeStatus;
  xp: number;
  duration: string;
  unit: number;
  icon: "grammar" | "listening" | "reading" | "vocab" | "test";
  stars?: number; // 0-3 for completed
  streak?: boolean;
}

/* ─── Data ───────────────────────────────────────────────── */
const nodes: LessonNode[] = [
  // Unit 1
  { id: 1,  title: "Ngữ Pháp: Danh Từ",        subtitle: "Nhận biết danh từ trong câu",          type: "lesson",    status: "completed", xp: 20,  duration: "8 phút",   unit: 1, icon: "grammar",   stars: 3 },
  { id: 2,  title: "Từ Vựng: Văn Phòng",        subtitle: "50 từ thiết yếu nơi làm việc",         type: "lesson",    status: "completed", xp: 20,  duration: "10 phút",  unit: 1, icon: "vocab",     stars: 3 },
  { id: 3,  title: "Nghe: Mô Tả Hình Ảnh",      subtitle: "Phần 1 — Nhận dạng đồ vật & hành động",type: "lesson",    status: "completed", xp: 25,  duration: "12 phút",  unit: 1, icon: "listening", stars: 2 },
  { id: 4,  title: "Kiểm Tra Unit 1",            subtitle: "Ôn tập toàn bộ Unit 1",               type: "quiz",      status: "completed", xp: 50,  duration: "15 phút",  unit: 1, icon: "test",      stars: 3, streak: true },
  // Milestone
  { id: 5,  title: "🏆 Cột Mốc: Khởi Đầu!",    subtitle: "Hoàn thành Unit 1 — +100 XP thưởng",  type: "milestone", status: "completed", xp: 100, duration: "",         unit: 1, icon: "test",      stars: 3 },
  // Unit 2
  { id: 6,  title: "Ngữ Pháp: Động Từ",         subtitle: "Thì hiện tại & quá khứ đơn",           type: "lesson",    status: "completed", xp: 20,  duration: "10 phút",  unit: 2, icon: "grammar",   stars: 2 },
  { id: 7,  title: "Nghe: Hỏi & Đáp",           subtitle: "Phần 2 — Chọn câu trả lời đúng",      type: "lesson",    status: "completed", xp: 25,  duration: "12 phút",  unit: 2, icon: "listening", stars: 3 },
  { id: 8,  title: "Đọc: Hoàn Thành Câu",       subtitle: "Phần 5 — Điền từ vào chỗ trống",      type: "lesson",    status: "current",   xp: 30,  duration: "15 phút",  unit: 2, icon: "reading" },
  { id: 9,  title: "Từ Vựng: Tài Chính",        subtitle: "40 từ về kinh doanh & tài chính",      type: "lesson",    status: "locked",    xp: 20,  duration: "10 phút",  unit: 2, icon: "vocab" },
  { id: 10, title: "Kiểm Tra Unit 2",            subtitle: "Ôn tập toàn bộ Unit 2",               type: "quiz",      status: "locked",    xp: 50,  duration: "20 phút",  unit: 2, icon: "test" },
  // Milestone
  { id: 11, title: "🔥 Cột Mốc: Lên Cấp!",     subtitle: "Mở khóa Thử Thách Boss đầu tiên",     type: "milestone", status: "locked",    xp: 150, duration: "",         unit: 2, icon: "test" },
  // Unit 3
  { id: 12, title: "Ngữ Pháp: Giới Từ",        subtitle: "In, on, at, by — dùng đúng hoàn cảnh", type: "lesson",    status: "locked",    xp: 20,  duration: "10 phút",  unit: 3, icon: "grammar" },
  { id: 13, title: "Nghe: Đoạn Hội Thoại",     subtitle: "Phần 3 — Hiểu ý chính đoạn thoại",    type: "lesson",    status: "locked",    xp: 30,  duration: "15 phút",  unit: 3, icon: "listening" },
  { id: 14, title: "Đọc: Hoàn Thành Đoạn",     subtitle: "Phần 6 — Chọn câu phù hợp",           type: "lesson",    status: "locked",    xp: 30,  duration: "15 phút",  unit: 3, icon: "reading" },
  { id: 15, title: "Từ Vựng: Nhân Sự",         subtitle: "45 từ về tuyển dụng & quản lý",        type: "lesson",    status: "locked",    xp: 20,  duration: "10 phút",  unit: 3, icon: "vocab" },
  { id: 16, title: "BOSS: Thi Thử Mini #1",    subtitle: "50 câu — Nghe + Đọc kết hợp",          type: "boss",      status: "locked",    xp: 200, duration: "35 phút",  unit: 3, icon: "test" },
  // Unit 4
  { id: 17, title: "Ngữ Pháp: Mệnh Đề",        subtitle: "Mệnh đề quan hệ & trạng ngữ",         type: "lesson",    status: "locked",    xp: 25,  duration: "12 phút",  unit: 4, icon: "grammar" },
  { id: 18, title: "Nghe: Bài Nói Ngắn",        subtitle: "Phần 4 — Announcements & talks",      type: "lesson",    status: "locked",    xp: 30,  duration: "15 phút",  unit: 4, icon: "listening" },
  { id: 19, title: "Đọc: Đọc Hiểu",            subtitle: "Phần 7 — Đọc đơn & đa văn bản",       type: "lesson",    status: "locked",    xp: 40,  duration: "20 phút",  unit: 4, icon: "reading" },
  { id: 20, title: "🏆 Thi Thử Toàn Bộ",       subtitle: "200 câu — Định dạng chính thức",      type: "boss",      status: "locked",    xp: 500, duration: "120 phút", unit: 4, icon: "test" },
];

const units = [
  { id: 1, title: "Unit 1: Nền Tảng",     color: "#1d4ed8", bg: "#eff6ff" },
  { id: 2, title: "Unit 2: Xây Dựng",    color: "#7c3aed", bg: "#f5f3ff" },
  { id: 3, title: "Unit 3: Thực Chiến",  color: "#0891b2", bg: "#ecfeff" },
  { id: 4, title: "Unit 4: Đỉnh Cao",   color: "#d97706", bg: "#fffbeb" },
];

const iconMap = {
  grammar:   { Icon: PenLine,    color: "#1d4ed8", bg: "#dbeafe" },
  listening: { Icon: Headphones, color: "#7c3aed", bg: "#ede9fe" },
  reading:   { Icon: BookOpen,   color: "#0891b2", bg: "#cffafe" },
  vocab:     { Icon: Brain,      color: "#059669", bg: "#d1fae5" },
  test:      { Icon: Target,     color: "#d97706", bg: "#fde68a" },
};

/* ─── zig-zag horizontal offsets ─────────────────────────── */
const zigzag = [0, 60, 100, 60, 0, -60, -100, -60];

/* ─── Helpers ────────────────────────────────────────────── */
function StarsRow({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((s) => (
        <Star
          key={s}
          size={10}
          style={{ color: s <= stars ? "#f59e0b" : "#d1d5db", fill: s <= stars ? "#f59e0b" : "#d1d5db" }}
        />
      ))}
    </div>
  );
}

/* ─── Node bubble ─────────────────────────────────────────── */
function NodeBubble({ node, onClick }: { node: LessonNode; onClick: () => void }) {
  const completed = node.status === "completed";
  const current   = node.status === "current";
  const locked    = node.status === "locked";

  const unit = units.find((u) => u.id === node.unit)!;

  // Boss / milestone sizes differ
  if (node.type === "milestone") {
    return (
      <button
        onClick={onClick}
        disabled={locked}
        className="flex flex-col items-center gap-1 group"
        style={{ cursor: locked ? "default" : "pointer", border: "none", background: "transparent", padding: 0 }}
      >
        <motion.div
          whileHover={!locked ? { scale: 1.08 } : {}}
          whileTap={!locked ? { scale: 0.95 } : {}}
          className="rounded-2xl flex items-center justify-center"
          style={{
            width: 72,
            height: 72,
            background: locked ? "var(--muted)" : unit.bg,
            border: `3px solid ${locked ? "var(--border)" : unit.color}`,
            boxShadow: completed ? `0 0 0 6px ${unit.color}28` : "none",
            opacity: locked ? 0.45 : 1,
          }}
        >
          <Trophy size={28} style={{ color: locked ? "var(--muted-foreground)" : unit.color }} />
        </motion.div>
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: locked ? "var(--muted-foreground)" : unit.color, textAlign: "center", maxWidth: 90 }}>
          {node.title.replace(/^[^\s]+\s/, "")}
        </span>
      </button>
    );
  }

  if (node.type === "boss") {
    return (
      <button
        onClick={onClick}
        disabled={locked}
        className="flex flex-col items-center gap-1"
        style={{ cursor: locked ? "default" : "pointer", border: "none", background: "transparent", padding: 0 }}
      >
        <motion.div
          whileHover={!locked ? { scale: 1.06, rotate: [0, -3, 3, 0] } : {}}
          whileTap={!locked ? { scale: 0.93 } : {}}
          className="rounded-2xl flex flex-col items-center justify-center gap-1"
          style={{
            width: 80,
            height: 80,
            background: locked ? "var(--muted)" : "linear-gradient(135deg, #f97316, #ef4444)",
            border: `3px solid ${locked ? "var(--border)" : "#ef4444"}`,
            boxShadow: !locked ? "0 6px 24px rgba(239,68,68,0.35)" : "none",
            opacity: locked ? 0.4 : 1,
          }}
        >
          {locked ? (
            <Lock size={22} style={{ color: "var(--muted-foreground)" }} />
          ) : (
            <>
              <Flame size={20} color="#fff" />
              <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>BOSS</span>
            </>
          )}
        </motion.div>
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: locked ? "var(--muted-foreground)" : "#ef4444", textAlign: "center", maxWidth: 90 }}>
          {node.title}
        </span>
      </button>
    );
  }

  const { Icon, color, bg } = iconMap[node.icon];

  return (
    <button
      onClick={onClick}
      disabled={locked}
      className="flex flex-col items-center gap-1.5"
      style={{ cursor: locked ? "default" : "pointer", border: "none", background: "transparent", padding: 0 }}
    >
      {/* Pulse ring for current */}
      <div className="relative">
        {current && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `3px solid ${unit.color}`, borderRadius: "50%" }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        )}
        <motion.div
          whileHover={!locked ? { scale: 1.1, y: -2 } : {}}
          whileTap={!locked ? { scale: 0.92 } : {}}
          className="rounded-full flex items-center justify-center"
          style={{
            width: 58,
            height: 58,
            background: locked ? "var(--muted)" : completed ? bg : `linear-gradient(135deg, ${unit.color}dd, ${unit.color})`,
            border: `3px solid ${locked ? "var(--border)" : completed ? color : unit.color}`,
            boxShadow: current ? `0 4px 18px ${unit.color}55` : completed ? `0 2px 8px ${color}30` : "none",
            opacity: locked ? 0.38 : 1,
            transition: "box-shadow 0.2s",
          }}
        >
          {locked ? (
            <Lock size={18} style={{ color: "var(--muted-foreground)" }} />
          ) : completed ? (
            <CheckCircle2 size={22} style={{ color }} />
          ) : (
            <Icon size={20} color="#fff" />
          )}
        </motion.div>
      </div>

      {/* Stars for completed */}
      {completed && node.stars !== undefined && <StarsRow stars={node.stars} />}

      {/* Streak badge */}
      {node.streak && (
        <span className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5" style={{ background: "#fff7ed", border: "1px solid #fed7aa", fontSize: "0.6rem", fontWeight: 700, color: "#ea580c" }}>
          <Flame size={8} style={{ color: "#ea580c" }} /> x2
        </span>
      )}

      {/* Label */}
      <span
        style={{
          fontSize: "0.68rem",
          fontWeight: current ? 700 : 500,
          color: locked ? "var(--muted-foreground)" : current ? unit.color : "var(--foreground)",
          textAlign: "center",
          maxWidth: 80,
          lineHeight: 1.3,
        }}
      >
        {node.title}
      </span>
    </button>
  );
}

/* ─── Detail drawer ───────────────────────────────────────── */
function NodeDrawer({ node, onClose, onStart }: { node: LessonNode; onClose: () => void; onStart: () => void }) {
  const { Icon, color, bg } = iconMap[node.icon];
  const unit = units.find((u) => u.id === node.unit)!;
  const locked = node.status === "locked";
  const completed = node.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="w-full rounded-t-3xl sm:rounded-2xl flex flex-col gap-5 p-6"
        style={{ background: "var(--card)", maxWidth: 420, maxHeight: "80vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl flex items-center justify-center" style={{ width: 48, height: 48, background: bg }}>
              <Icon size={22} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: unit.color }}>
                Unit {node.unit}
              </div>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>{node.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted transition-colors" style={{ border: "none", background: "transparent", cursor: "pointer" }}>
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: 0, lineHeight: 1.6 }}>
          {node.subtitle}
        </p>

        {/* Meta pills */}
        <div className="flex gap-2 flex-wrap">
          {node.duration && (
            <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "var(--muted)", fontSize: "0.75rem", color: "var(--foreground)", fontWeight: 500 }}>
              <Clock size={12} className="text-muted-foreground" /> {node.duration}
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "var(--muted)", fontSize: "0.75rem", color: "var(--foreground)", fontWeight: 500 }}>
            <Zap size={12} style={{ color: "#f59e0b" }} /> +{node.xp} XP
          </span>
          {completed && node.stars !== undefined && (
            <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: "#fef9c3", fontSize: "0.75rem", color: "#854d0e", fontWeight: 600 }}>
              <StarsRow stars={node.stars} /> {node.stars}/3 sao
            </span>
          )}
        </div>

        {/* Status */}
        <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: locked ? "var(--muted)" : completed ? "#f0fdf4" : "#eff6ff" }}>
          {locked ? <Lock size={16} className="text-muted-foreground" /> : completed ? <CheckCircle2 size={16} style={{ color: "#16a34a" }} /> : <PlayCircle size={16} style={{ color: unit.color }} />}
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: locked ? "var(--muted-foreground)" : completed ? "#15803d" : unit.color }}>
            {locked ? "Hoàn thành bài trước để mở khóa" : completed ? "Đã hoàn thành — thử lại để cải thiện điểm" : "Đang học — tiếp tục ngay!"}
          </span>
        </div>

        {/* CTA */}
        {!locked && (
          <button
            onClick={() => { onClose(); }}
            className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-opacity hover:opacity-85"
            style={{ background: completed ? "var(--muted)" : `linear-gradient(135deg, ${unit.color}, ${unit.color}cc)`, color: completed ? "var(--foreground)" : "#fff", border: "none", cursor: "pointer", fontSize: "0.92rem", fontWeight: 700 }}
          >
            {completed ? <><RotateCcwIcon /> Làm Lại</> : <><PlayCircle size={18} /> Bắt Đầu Học</>}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function RotateCcwIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

/* ─── Main ────────────────────────────────────────────────── */
export function Roadmap() {
  const [selected, setSelected] = useState<LessonNode | null>(null);

  const currentNode = nodes.find((n) => n.status === "current");
  const totalXP = nodes.filter((n) => n.status === "completed").reduce((s, n) => s + n.xp, 0);
  const completedCount = nodes.filter((n) => n.status === "completed").length;

  // Group nodes by unit for section headers
  const unitBoundaries = new Set(nodes.map((n) => n.unit));

  let prevUnit = 0;

  return (
    <div className="flex flex-col items-center w-full relative" style={{ maxWidth: 480, margin: "0 auto" }}>
      {/* Sticky top stats bar */}
      <div
        className="sticky top-0 z-20 w-full rounded-2xl px-5 py-3 flex items-center justify-between gap-4 mb-6"
        style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <div className="rounded-lg flex items-center justify-center" style={{ width: 30, height: 30, background: "#fef9c3" }}>
            <Zap size={14} style={{ color: "#ca8a04" }} />
          </div>
          <div>
            <div style={{ fontSize: "0.62rem", color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Tổng XP</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#ca8a04" }}>{totalXP} XP</div>
          </div>
        </div>

        <div className="flex-1 mx-2">
          <div className="flex justify-between mb-1" style={{ fontSize: "0.62rem", color: "var(--muted-foreground)", fontWeight: 600 }}>
            <span>Tiến độ lộ trình</span>
            <span>{completedCount}/{nodes.length}</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: "var(--muted)" }}>
            <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${(completedCount / nodes.length) * 100}%`, background: "linear-gradient(90deg, #1d4ed8, #7c3aed)" }} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg flex items-center justify-center" style={{ width: 30, height: 30, background: "#fff7ed" }}>
            <Flame size={14} style={{ color: "#ea580c" }} />
          </div>
          <div>
            <div style={{ fontSize: "0.62rem", color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Streak</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#ea580c" }}>7 ngày</div>
          </div>
        </div>
      </div>

      {/* Path */}
      <div className="w-full flex flex-col items-center gap-0 relative pb-32">
        {nodes.map((node, idx) => {
          const showUnitHeader = node.unit !== prevUnit;
          if (showUnitHeader) prevUnit = node.unit;
          const unit = units.find((u) => u.id === node.unit)!;
          const offset = zigzag[idx % zigzag.length];
          const isMilestone = node.type === "milestone" || node.type === "boss";

          return (
            <div key={node.id} className="flex flex-col items-center w-full">
              {/* Unit header banner */}
              {showUnitHeader && (
                <div
                  className="w-full rounded-2xl px-4 py-2.5 flex items-center gap-3 mb-4 mt-2"
                  style={{ background: unit.bg, border: `1.5px solid ${unit.color}40` }}
                >
                  <div className="rounded-full" style={{ width: 8, height: 8, background: unit.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: unit.color, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    {unit.title}
                  </span>
                  <div className="flex-1 h-px" style={{ background: `${unit.color}30` }} />
                </div>
              )}

              {/* Connector line above (except first) */}
              {idx > 0 && (
                <div
                  className="rounded-full"
                  style={{
                    width: 3,
                    height: isMilestone ? 28 : 24,
                    background: node.status === "locked"
                      ? "var(--border)"
                      : `linear-gradient(to bottom, ${units.find(u => u.id === nodes[idx-1].unit)!.color}, ${unit.color})`,
                    opacity: node.status === "locked" ? 0.4 : 1,
                  }}
                />
              )}

              {/* Node row */}
              <div
                className="flex items-center gap-3 w-full"
                style={{
                  justifyContent: isMilestone ? "center" : offset > 0 ? "flex-end" : offset < 0 ? "flex-start" : "center",
                  paddingLeft: offset < 0 ? `${Math.abs(offset) * 0.5}px` : 0,
                  paddingRight: offset > 0 ? `${offset * 0.5}px` : 0,
                }}
              >
                {/* Left label for right-offset nodes */}
                {!isMilestone && offset > 0 && (
                  <div className="text-right flex-1" style={{ paddingRight: 8 }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 600, color: node.status === "locked" ? "var(--muted-foreground)" : "var(--foreground)" }}>
                      {node.title}
                    </div>
                    <div style={{ fontSize: "0.62rem", color: "var(--muted-foreground)" }}>{node.duration}</div>
                  </div>
                )}

                <NodeBubble node={node} onClick={() => setSelected(node)} />

                {/* Right label for left-offset or center nodes */}
                {!isMilestone && offset <= 0 && (
                  <div className="flex-1" style={{ paddingLeft: 8 }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 600, color: node.status === "locked" ? "var(--muted-foreground)" : "var(--foreground)" }}>
                      {node.title}
                    </div>
                    <div style={{ fontSize: "0.62rem", color: "var(--muted-foreground)" }}>{node.duration}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* End of path */}
        <div className="flex flex-col items-center gap-3 mt-8">
          <div className="rounded-full flex items-center justify-center" style={{ width: 56, height: 56, background: "var(--muted)", border: "3px dashed var(--border)" }}>
            <Star size={22} className="text-muted-foreground opacity-40" />
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", textAlign: "center" }}>
            Hoàn thành lộ trình để mở khóa bài học tiếp theo!
          </span>
        </div>
      </div>

      {/* Floating Action Button */}
      {currentNode && (
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setSelected(currentNode)}
          className="fixed bottom-6 flex items-center gap-3 rounded-2xl px-6 py-4 shadow-xl z-30"
          style={{
            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(29,78,216,0.45)",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          <div className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32, background: "rgba(255,255,255,0.2)" }}>
            <PlayCircle size={18} color="#fff" />
          </div>
          <div className="text-left">
            <div style={{ fontSize: "0.65rem", opacity: 0.8, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Bài Tiếp Theo</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 800 }}>{currentNode.title}</div>
          </div>
          <ChevronRight size={18} style={{ opacity: 0.7 }} />
        </motion.button>
      )}

      {/* Node detail drawer */}
      {selected && (
        <NodeDrawer
          node={selected}
          onClose={() => setSelected(null)}
          onStart={() => setSelected(null)}
        />
      )}
    </div>
  );
}
