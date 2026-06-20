import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Video, MessageCircle,
  Clock, MapPin, RotateCcw, X, CheckCircle2,
  BadgeCheck, CalendarDays, Bell, Zap, Star,
  BookOpen, Headphones, Target, AlertTriangle,
} from "lucide-react";

/* ── palette ─────────────────────────────────────────────── */
const C = {
  blue:"#1d4ed8", blueL:"#eff6ff", blueB:"#bfdbfe",
  green:"#16a34a", greenL:"#f0fdf4", greenB:"#bbf7d0",
  orange:"#d97706", orangeL:"#fffbeb",
  red:"#dc2626", redL:"#fef2f2",
  violet:"#7c3aed", violetL:"#f5f3ff",
  muted:"#64748b", border:"#e2e8f0", bg:"#f8faff", card:"#fff", text:"#111827",
  gold:"#f59e0b",
};

/* ── types ───────────────────────────────────────────────── */
type SessionStatus = "upcoming" | "today" | "completed" | "cancelled";

interface Session {
  id: number;
  tutorName: string;
  tutorAvatar: string;
  tutorPhoto: string;
  specialty: string;
  specialtyIcon: "listening" | "reading" | "grammar" | "target";
  topic: string;
  date: string;        // "2026-06-14"
  dayLabel: string;    // "Thứ Bảy"
  time: string;        // "09:00"
  endTime: string;     // "10:00"
  duration: number;    // minutes
  mode: "online" | "offline";
  location: string;
  status: SessionStatus;
  rating?: number;
  notes?: string;
  price: number;
  xp: number;
}

/* ── data ────────────────────────────────────────────────── */
const sessions: Session[] = [
  {
    id:1, tutorName:"Sarah Kim", tutorAvatar:"SK",
    tutorPhoto:"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&auto=format",
    specialty:"Grammar Specialist", specialtyIcon:"grammar",
    topic:"Ngữ pháp: Mệnh đề quan hệ & Thì phức hợp",
    date:"2026-06-14", dayLabel:"Thứ Bảy", time:"09:00", endTime:"10:00", duration:60,
    mode:"online", location:"Zoom · Link sẽ gửi trước 10 phút",
    status:"today", price:320000, xp:50,
    notes:"Ôn lại bài tập Part 5 tuần trước, chuẩn bị 5 câu sai để hỏi cô.",
  },
  {
    id:2, tutorName:"David Carter", tutorAvatar:"DC",
    tutorPhoto:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&auto=format",
    specialty:"Listening Expert", specialtyIcon:"listening",
    topic:"Nghe Phần 3–4: Chiến lược hội thoại & bài nói ngắn",
    date:"2026-06-17", dayLabel:"Thứ Ba", time:"18:30", endTime:"19:30", duration:60,
    mode:"online", location:"Google Meet · meet.google.com/abc-xyz",
    status:"upcoming", price:350000, xp:50,
  },
  {
    id:3, tutorName:"James Nguyen", tutorAvatar:"JN",
    tutorPhoto:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
    specialty:"Target 900+", specialtyIcon:"target",
    topic:"Thi thử toàn bộ: Phân tích & Chiến lược thi",
    date:"2026-06-21", dayLabel:"Chủ Nhật", time:"10:00", endTime:"12:00", duration:120,
    mode:"offline", location:"Quận 1, TP.HCM · Trung tâm Anh ngữ ABC",
    status:"upcoming", price:450000, xp:100,
    notes:"Mang theo kết quả thi thử #4 và #5 để thầy phân tích.",
  },
  {
    id:4, tutorName:"Rachel Pham", tutorAvatar:"RP",
    tutorPhoto:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
    specialty:"Business TOEIC", specialtyIcon:"grammar",
    topic:"Từ vựng thương mại: Finance & HR",
    date:"2026-06-10", dayLabel:"Thứ Ba", time:"19:00", endTime:"20:00", duration:60,
    mode:"online", location:"Zoom · Đã kết thúc",
    status:"completed", rating:5, price:330000, xp:50,
    notes:"Đã học 60 từ vựng Finance. Bài tập: ôn lại Anki deck trước buổi tiếp theo.",
  },
  {
    id:5, tutorName:"Emily Tran", tutorAvatar:"ET",
    tutorPhoto:"https://images.unsplash.com/photo-1699899657680-421c2c2d5064?w=80&h=80&fit=crop&auto=format",
    specialty:"Reading Expert", specialtyIcon:"reading",
    topic:"Đọc Phần 7: Kỹ thuật đọc nhanh",
    date:"2026-06-07", dayLabel:"Chủ Nhật", time:"14:00", endTime:"15:00", duration:60,
    mode:"online", location:"Zoom · Đã kết thúc",
    status:"completed", rating:4, price:300000, xp:50,
    notes:"Kỹ năng skimming đã cải thiện. Cần luyện thêm dạng bài nhiều văn bản.",
  },
];

/* ── helpers ─────────────────────────────────────────────── */
const specialtyMeta = {
  listening: { color:"#7c3aed", bg:"#f5f3ff", Icon:Headphones },
  reading:   { color:C.blue,   bg:C.blueL,   Icon:BookOpen },
  grammar:   { color:C.orange, bg:C.orangeL, Icon:BookOpen },
  target:    { color:C.green,  bg:C.greenL,  Icon:Target },
};

const statusStyle: Record<SessionStatus, { label:string; color:string; bg:string; border:string }> = {
  today:     { label:"Hôm Nay",    color:"#fff",  bg:C.blue,     border:C.blue },
  upcoming:  { label:"Sắp Tới",    color:C.blue,  bg:C.blueL,    border:C.blueB },
  completed: { label:"Hoàn Thành", color:C.green, bg:C.greenL,   border:C.greenB },
  cancelled: { label:"Đã Hủy",     color:C.red,   bg:C.redL,     border:"#fecaca" },
};

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display:"inline-flex", gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} style={{ color:i<=n?C.gold:"#d1d5db", fill:i<=n?C.gold:"#d1d5db" }} />
      ))}
    </span>
  );
}

/* ── Week calendar ───────────────────────────────────────── */
const WEEK_DAYS = ["CN","T2","T3","T4","T5","T6","T7"];
const HOURS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

function getWeekDates(baseDate: Date) {
  const day = baseDate.getDay(); // 0=Sun
  return Array.from({ length:7 }, (_,i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - day + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

/* ── Session card ────────────────────────────────────────── */
function SessionCard({ s, onDetail }: { s:Session; onDetail:()=>void }) {
  const ss  = statusStyle[s.status];
  const sm  = specialtyMeta[s.specialtyIcon];
  const Icon = sm.Icon;
  return (
    <div
      onClick={onDetail}
      style={{
        background:C.card, border:`1px solid ${s.status==="today"?C.blueB:C.border}`,
        borderLeft:`4px solid ${s.status==="today"?C.blue:s.status==="completed"?C.green:s.status==="cancelled"?C.red:C.blueB}`,
        borderRadius:16, padding:"16px 18px", cursor:"pointer", transition:"box-shadow 0.2s",
        boxShadow:s.status==="today"?"0 4px 20px rgba(29,78,216,0.12)":"none",
      }}
      onMouseEnter={e=>(e.currentTarget.style.boxShadow="0 6px 24px rgba(0,0,0,0.10)")}
      onMouseLeave={e=>(e.currentTarget.style.boxShadow=s.status==="today"?"0 4px 20px rgba(29,78,216,0.12)":"none")}
    >
      <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
        {/* Avatar */}
        <div style={{ position:"relative", flexShrink:0 }}>
          <img src={s.tutorPhoto} alt={s.tutorName}
            style={{ width:48, height:48, borderRadius:14, objectFit:"cover", display:"block" }}/>
          <div style={{ position:"absolute", bottom:-4, right:-4, width:18, height:18, borderRadius:"50%", background:sm.bg, border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon size={9} style={{ color:sm.color }}/>
          </div>
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          {/* Header row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:"0.88rem", fontWeight:700, color:C.text }}>{s.tutorName}</span>
              <BadgeCheck size={14} style={{ color:C.blue }}/>
            </div>
            <span style={{ fontSize:"0.65rem", fontWeight:700, background:ss.bg, color:ss.color, border:`1px solid ${ss.border}`, borderRadius:999, padding:"2px 9px" }}>
              {ss.label}
            </span>
          </div>

          <p style={{ margin:"0 0 8px", fontSize:"0.8rem", color:C.text, fontWeight:600, lineHeight:1.35 }}>{s.topic}</p>

          {/* Meta row */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 16px" }}>
            <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.72rem", color:C.muted }}>
              <CalendarDays size={11}/> {s.dayLabel}, {s.date.split("-").slice(1).reverse().join("/")}
            </span>
            <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.72rem", color:C.muted }}>
              <Clock size={11}/> {s.time} – {s.endTime} ({s.duration} phút)
            </span>
            <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.72rem", color:C.muted }}>
              <MapPin size={11}/> {s.mode==="online"?"🌐 Online":"📍 Trực tiếp"}
            </span>
          </div>

          {/* Completed: rating */}
          {s.status==="completed" && s.rating && (
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}>
              <Stars n={s.rating}/>
              <span style={{ fontSize:"0.7rem", color:C.muted }}>Đánh giá của bạn</span>
              {s.notes && <span style={{ fontSize:"0.7rem", color:C.muted }}>· Ghi chú buổi học có sẵn</span>}
            </div>
          )}

          {/* Today: action buttons */}
          {s.status==="today" && (
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button onClick={e=>{e.stopPropagation();}}
                style={{ flex:2, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px 0", borderRadius:10, border:"none", background:C.blue, color:"#fff", fontSize:"0.78rem", fontWeight:700, cursor:"pointer", boxShadow:"0 3px 10px rgba(29,78,216,0.30)" }}>
                <Video size={14}/> Vào Phòng Học
              </button>
              <button onClick={e=>{e.stopPropagation();}}
                style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px 0", borderRadius:10, border:`1px solid ${C.border}`, background:C.card, color:C.text, fontSize:"0.78rem", fontWeight:600, cursor:"pointer" }}>
                <MessageCircle size={14}/> Nhắn Tin
              </button>
            </div>
          )}

          {/* Upcoming: action buttons */}
          {s.status==="upcoming" && (
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button onClick={e=>{e.stopPropagation();}}
                style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"7px 0", borderRadius:10, border:`1px solid ${C.border}`, background:C.card, color:C.muted, fontSize:"0.72rem", fontWeight:600, cursor:"pointer" }}>
                <RotateCcw size={12}/> Đổi Lịch
              </button>
              <button onClick={e=>{e.stopPropagation();}}
                style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"7px 0", borderRadius:10, border:`1px solid #fecaca`, background:C.redL, color:C.red, fontSize:"0.72rem", fontWeight:600, cursor:"pointer" }}>
                <X size={12}/> Hủy Buổi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Detail Modal ────────────────────────────────────────── */
function DetailModal({ s, onClose }: { s:Session; onClose:()=>void }) {
  const ss = statusStyle[s.status];
  const sm = specialtyMeta[s.specialtyIcon];
  const Icon = sm.Icon;
  const [userRating, setUserRating] = useState(s.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(15,23,42,0.45)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={onClose}>
      <div style={{ background:C.card, borderRadius:24, width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,0.18)" }}
        onClick={e=>e.stopPropagation()}>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#1e3a8a,#1d4ed8,#3b82f6)", borderRadius:"24px 24px 0 0", padding:"24px 24px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <span style={{ fontSize:"0.68rem", fontWeight:800, background:"rgba(255,255,255,0.2)", color:"#fff", borderRadius:999, padding:"3px 10px" }}>{ss.label}</span>
            <button onClick={onClose} style={{ width:30, height:30, borderRadius:"50%", border:"none", background:"rgba(255,255,255,0.2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <X size={14} color="#fff"/>
            </button>
          </div>
          <div style={{ display:"flex", gap:14, alignItems:"center" }}>
            <img src={s.tutorPhoto} alt={s.tutorName} style={{ width:60, height:60, borderRadius:16, objectFit:"cover", border:"2.5px solid rgba(255,255,255,0.35)" }}/>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                <span style={{ fontSize:"1rem", fontWeight:800, color:"#fff" }}>{s.tutorName}</span>
                <BadgeCheck size={15} style={{ color:"#93c5fd" }}/>
              </div>
              <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(255,255,255,0.18)", color:"#e0f2fe", borderRadius:999, padding:"3px 10px", fontSize:"0.72rem", fontWeight:600 }}>
                <Icon size={11}/> {s.specialty}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:"22px 24px 28px", display:"flex", flexDirection:"column", gap:20 }}>

          {/* Topic */}
          <div>
            <div style={{ fontSize:"0.65rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:C.muted, marginBottom:6 }}>Chủ đề buổi học</div>
            <div style={{ fontSize:"0.92rem", fontWeight:700, color:C.text, lineHeight:1.4 }}>{s.topic}</div>
          </div>

          {/* Details grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              { icon:CalendarDays, label:"Ngày học",    val:`${s.dayLabel}, ${s.date.split("-").slice(1).reverse().join("/")}` },
              { icon:Clock,        label:"Giờ học",     val:`${s.time} – ${s.endTime}` },
              { icon:Clock,        label:"Thời lượng",  val:`${s.duration} phút` },
              { icon:MapPin,       label:"Hình thức",   val:s.mode==="online"?"🌐 Online":"📍 Trực tiếp" },
            ].map(d => (
              <div key={d.label} style={{ background:C.bg, borderRadius:12, padding:"10px 12px" }}>
                <div style={{ fontSize:"0.6rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:C.muted, marginBottom:4 }}>{d.label}</div>
                <div style={{ fontSize:"0.82rem", fontWeight:600, color:C.text }}>{d.val}</div>
              </div>
            ))}
          </div>

          {/* Location */}
          <div style={{ background:C.blueL, border:`1px solid ${C.blueB}`, borderRadius:12, padding:"12px 14px" }}>
            <div style={{ fontSize:"0.65rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.07em", color:C.blue, marginBottom:4 }}>Địa điểm / Link học</div>
            <div style={{ fontSize:"0.82rem", color:C.text }}>{s.location}</div>
          </div>

          {/* Price + XP */}
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ flex:1, background:C.bg, borderRadius:12, padding:"12px 14px", textAlign:"center" }}>
              <div style={{ fontSize:"1.1rem", fontWeight:800, color:C.blue }}>{s.price.toLocaleString("vi-VN")}đ</div>
              <div style={{ fontSize:"0.65rem", color:C.muted, marginTop:2 }}>Học phí buổi học</div>
            </div>
            <div style={{ flex:1, background:"#fef9c3", borderRadius:12, padding:"12px 14px", textAlign:"center" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                <Zap size={15} style={{ color:"#ca8a04" }}/>
                <span style={{ fontSize:"1.1rem", fontWeight:800, color:"#92400e" }}>+{s.xp} XP</span>
              </div>
              <div style={{ fontSize:"0.65rem", color:"#a16207", marginTop:2 }}>Nhận sau buổi học</div>
            </div>
          </div>

          {/* Notes */}
          {s.notes && (
            <div style={{ background:C.orangeL, border:"1px solid #fde68a", borderRadius:12, padding:"12px 14px" }}>
              <div style={{ fontSize:"0.65rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.07em", color:C.orange, marginBottom:5 }}>📝 Ghi Chú Buổi Học</div>
              <p style={{ margin:0, fontSize:"0.8rem", color:"#78350f", lineHeight:1.55 }}>{s.notes}</p>
            </div>
          )}

          {/* Completed — rating */}
          {s.status==="completed" && (
            <div style={{ background:C.bg, borderRadius:14, padding:"14px 16px" }}>
              <div style={{ fontSize:"0.65rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.07em", color:C.muted, marginBottom:10 }}>Đánh Giá Buổi Học</div>
              <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                {[1,2,3,4,5].map(i=>(
                  <Star key={i} size={28} onMouseEnter={()=>setHoverRating(i)} onMouseLeave={()=>setHoverRating(0)} onClick={()=>setUserRating(i)}
                    style={{ cursor:"pointer", color:(hoverRating||userRating)>=i?C.gold:"#d1d5db", fill:(hoverRating||userRating)>=i?C.gold:"#d1d5db", transition:"color 0.1s" }}/>
                ))}
              </div>
              <div style={{ fontSize:"0.75rem", color:C.muted }}>
                {userRating===5?"⭐ Xuất sắc!":userRating===4?"✅ Rất tốt":userRating===3?"👍 Bình thường":userRating>0?"💬 Cần cải thiện":"Nhấn sao để đánh giá"}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {s.status==="today" && (
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ flex:2, display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"13px 0", borderRadius:14, border:"none", background:C.blue, color:"#fff", fontSize:"0.9rem", fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(29,78,216,0.30)" }}>
                <Video size={16}/> Vào Phòng Học Ngay
              </button>
              <button style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"13px 0", borderRadius:14, border:`1px solid ${C.border}`, background:C.card, color:C.text, fontSize:"0.82rem", fontWeight:600, cursor:"pointer" }}>
                <MessageCircle size={15}/> Chat
              </button>
            </div>
          )}
          {s.status==="upcoming" && (
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"11px 0", borderRadius:12, border:`1px solid ${C.border}`, background:C.card, color:C.muted, fontSize:"0.8rem", fontWeight:600, cursor:"pointer" }}>
                <RotateCcw size={14}/> Đổi Lịch
              </button>
              <button style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"11px 0", borderRadius:12, border:"1px solid #fecaca", background:C.redL, color:C.red, fontSize:"0.8rem", fontWeight:600, cursor:"pointer" }}>
                <X size={14}/> Hủy Buổi
              </button>
            </div>
          )}
          {s.status==="completed" && (
            <button style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"12px 0", borderRadius:14, border:"none", background:C.blue, color:"#fff", fontSize:"0.88rem", fontWeight:700, cursor:"pointer" }}>
              <CalendarDays size={15}/> Đặt Lịch Buổi Tiếp Theo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────── */
export function MySchedule() {
  const today    = new Date(2026, 5, 14); // 14/06/2026
  const [weekBase, setWeekBase] = useState(today);
  const [view,    setView]      = useState<"calendar"|"list">("calendar");
  const [filter,  setFilter]    = useState<"all"|"upcoming"|"completed">("all");
  const [detail,  setDetail]    = useState<Session|null>(null);

  const weekDates = getWeekDates(weekBase);
  const prevWeek  = () => { const d=new Date(weekBase); d.setDate(d.getDate()-7); setWeekBase(d); };
  const nextWeek  = () => { const d=new Date(weekBase); d.setDate(d.getDate()+7); setWeekBase(d); };

  const sessionsByDate = (date: Date) => sessions.filter(s => isSameDay(new Date(s.date), date));

  const todaySessions  = sessions.filter(s => s.status==="today");
  const upcoming       = sessions.filter(s => s.status==="upcoming");
  const completed      = sessions.filter(s => s.status==="completed");

  const listFiltered = filter==="all" ? sessions
    : filter==="upcoming" ? [...todaySessions,...upcoming]
    : completed;

  const totalSpent = sessions.filter(s=>s.status==="completed"||s.status==="today").reduce((a,s)=>a+s.price,0);
  const totalXP    = sessions.filter(s=>s.status==="completed").reduce((a,s)=>a+s.xp,0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, maxWidth:1000, margin:"0 auto" }}>

      {/* ── KPI bar ──────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:14 }}>
        {[
          { label:"Buổi Hôm Nay",  value:todaySessions.length, sub:"Sắp bắt đầu",        icon:Bell,        color:C.blue,   bg:C.blueL },
          { label:"Sắp Tới",       value:upcoming.length,       sub:"Trong 2 tuần tới",    icon:CalendarDays,color:"#7c3aed",bg:C.violetL },
          { label:"Đã Hoàn Thành", value:completed.length,      sub:"Buổi học tích lũy",  icon:CheckCircle2,color:C.green,  bg:C.greenL },
          { label:"XP Tích Lũy",   value:`+${totalXP}`,         sub:"Từ các buổi học",     icon:Zap,         color:C.orange, bg:C.orangeL },
        ].map(k => (
          <div key={k.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 18px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:"0.65rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:C.muted }}>{k.label}</span>
              <div style={{ width:28, height:28, borderRadius:8, background:k.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <k.icon size={13} style={{ color:k.color }}/>
              </div>
            </div>
            <div style={{ fontSize:"1.8rem", fontWeight:800, color:C.text, lineHeight:1 }}>{k.value}</div>
            <div style={{ fontSize:"0.68rem", color:C.muted, marginTop:4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Today alert ──────────────────────────────── */}
      {todaySessions.length > 0 && (
        <div style={{ background:"linear-gradient(135deg,#1e3a8a,#1d4ed8)", borderRadius:18, padding:"18px 22px", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <div style={{ width:42, height:42, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, animation:"pulse 2s infinite" }}>
            <Video size={20} color="#fff"/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"0.75rem", color:"#93c5fd", fontWeight:600, marginBottom:2 }}>📅 Buổi Học Hôm Nay</div>
            <div style={{ fontSize:"0.92rem", fontWeight:700, color:"#fff" }}>
              {todaySessions[0].time} — {todaySessions[0].topic}
            </div>
            <div style={{ fontSize:"0.75rem", color:"#bfdbfe", marginTop:2 }}>Với {todaySessions[0].tutorName} · {todaySessions[0].location}</div>
          </div>
          <button onClick={()=>setDetail(todaySessions[0])}
            style={{ padding:"10px 20px", borderRadius:12, border:"none", background:"rgba(255,255,255,0.95)", color:C.blue, fontSize:"0.82rem", fontWeight:800, cursor:"pointer", flexShrink:0 }}>
            Xem Chi Tiết →
          </button>
        </div>
      )}

      {/* ── View toggle + controls ────────────────────── */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:`1px solid ${C.border}`, flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:"0.9rem", fontWeight:700, color:C.text }}>
              {view==="calendar" ? "Lịch Tuần" : "Danh Sách Buổi Học"}
            </span>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {/* View toggle */}
            <div style={{ display:"flex", gap:2, padding:3, background:"#f1f5f9", borderRadius:10 }}>
              {(["calendar","list"] as const).map(v=>(
                <button key={v} onClick={()=>setView(v)}
                  style={{ padding:"5px 12px", borderRadius:8, border:"none", fontSize:"0.72rem", fontWeight:600, cursor:"pointer", background:view===v?C.card:"transparent", color:view===v?C.blue:C.muted, boxShadow:view===v?"0 1px 3px rgba(0,0,0,0.08)":"none" }}>
                  {v==="calendar"?"📅 Lịch Tuần":"📋 Danh Sách"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CALENDAR VIEW ────────────────────────────── */}
        {view==="calendar" && (
          <div>
            {/* Week nav */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 20px", background:C.bg, borderBottom:`1px solid ${C.border}` }}>
              <button onClick={prevWeek} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${C.border}`, background:C.card, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <ChevronLeft size={15} style={{ color:C.muted }}/>
              </button>
              <span style={{ fontSize:"0.85rem", fontWeight:700, color:C.text }}>
                {weekDates[0].getDate()}/{weekDates[0].getMonth()+1} – {weekDates[6].getDate()}/{weekDates[6].getMonth()+1}/2026
              </span>
              <button onClick={nextWeek} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${C.border}`, background:C.card, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <ChevronRight size={15} style={{ color:C.muted }}/>
              </button>
            </div>

            {/* Day columns header */}
            <div style={{ display:"grid", gridTemplateColumns:`60px repeat(7,1fr)`, borderBottom:`1px solid ${C.border}` }}>
              <div style={{ padding:"8px 0", background:C.bg }}/>
              {weekDates.map((d,i) => {
                const isToday2 = isSameDay(d, today);
                const hasSess  = sessionsByDate(d).length > 0;
                return (
                  <div key={i} style={{ padding:"8px 4px", textAlign:"center", background:isToday2?C.blueL:C.bg, borderLeft:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:"0.65rem", fontWeight:700, color:isToday2?C.blue:C.muted, textTransform:"uppercase" }}>{WEEK_DAYS[i]}</div>
                    <div style={{ fontSize:"0.95rem", fontWeight:isToday2?800:500, color:isToday2?C.blue:C.text, lineHeight:1, marginTop:2 }}>{d.getDate()}</div>
                    {hasSess && <div style={{ width:6, height:6, borderRadius:"50%", background:C.blue, margin:"3px auto 0" }}/>}
                  </div>
                );
              })}
            </div>

            {/* Time rows */}
            <div style={{ overflowY:"auto", maxHeight:420 }}>
              {HOURS.map(hr => (
                <div key={hr} style={{ display:"grid", gridTemplateColumns:`60px repeat(7,1fr)`, borderBottom:`1px solid ${C.border}`, minHeight:56 }}>
                  <div style={{ padding:"4px 8px", fontSize:"0.65rem", color:C.muted, borderRight:`1px solid ${C.border}`, display:"flex", alignItems:"flex-start", paddingTop:6, fontWeight:500, background:C.bg }}>
                    {hr}
                  </div>
                  {weekDates.map((d,di) => {
                    const isToday2   = isSameDay(d, today);
                    const cellSess   = sessionsByDate(d).filter(s => s.time.startsWith(hr.split(":")[0].padStart(2,"0")));
                    return (
                      <div key={di} style={{ borderLeft:`1px solid ${C.border}`, padding:3, background:isToday2?"#fafcff":"transparent", position:"relative", minHeight:56 }}>
                        {cellSess.map(s => {
                          const sm2 = specialtyMeta[s.specialtyIcon];
                          return (
                            <div key={s.id} onClick={()=>setDetail(s)}
                              style={{ background:s.status==="today"?C.blue:sm2.bg, border:`1px solid ${s.status==="today"?C.blue:sm2.color+"40"}`, borderRadius:7, padding:"4px 6px", cursor:"pointer", marginBottom:2 }}>
                              <div style={{ fontSize:"0.62rem", fontWeight:700, color:s.status==="today"?"#fff":sm2.color, lineHeight:1.3 }}>{s.time}</div>
                              <div style={{ fontSize:"0.6rem", color:s.status==="today"?"rgba(255,255,255,0.85)":C.muted, lineHeight:1.3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.tutorName}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LIST VIEW ────────────────────────────────── */}
        {view==="list" && (
          <div>
            {/* Filter */}
            <div style={{ display:"flex", gap:6, padding:"12px 20px", borderBottom:`1px solid ${C.border}` }}>
              {([["all","Tất Cả"],["upcoming","Sắp Tới"],["completed","Đã Xong"]] as const).map(([v,l])=>(
                <button key={v} onClick={()=>setFilter(v)}
                  style={{ padding:"5px 14px", borderRadius:999, fontSize:"0.72rem", fontWeight:600, border:`1.5px solid ${filter===v?C.blue:C.border}`, background:filter===v?C.blue:"transparent", color:filter===v?"#fff":C.muted, cursor:"pointer" }}>
                  {l}
                </button>
              ))}
              <span style={{ fontSize:"0.72rem", color:C.muted, alignSelf:"center", marginLeft:"auto" }}>{listFiltered.length} buổi học</span>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {listFiltered.length===0 ? (
                <div style={{ padding:"48px 0", textAlign:"center", color:C.muted }}>
                  <CalendarDays size={32} style={{ opacity:0.3, marginBottom:10 }}/>
                  <div style={{ fontSize:"0.88rem" }}>Không có buổi học nào</div>
                </div>
              ) : listFiltered.map((s,i)=>(
                <div key={s.id} style={{ padding:"14px 20px", borderBottom:i<listFiltered.length-1?`1px solid ${C.border}`:"none" }}>
                  <SessionCard s={s} onDetail={()=>setDetail(s)}/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Session history summary ───────────────────── */}
      {completed.length > 0 && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"20px 22px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <span style={{ width:3, height:18, background:C.blue, borderRadius:2, display:"block" }}/>
            <h3 style={{ margin:0, fontSize:"0.9rem" }}>Tổng Kết Học Với Gia Sư</h3>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:16 }}>
            {[
              { label:"Tổng buổi học",     value:`${sessions.filter(s=>s.status==="completed"||s.status==="today").length} buổi`, color:C.blue },
              { label:"Tổng thời gian",    value:`${sessions.filter(s=>s.status==="completed"||s.status==="today").reduce((a,s)=>a+s.duration,0)/60} giờ`, color:"#7c3aed" },
              { label:"XP đã nhận",         value:`+${totalXP} XP`, color:C.orange },
              { label:"Đã chi",             value:`${(totalSpent/1000000).toFixed(1)}M đ`, color:C.green },
            ].map(k=>(
              <div key={k.label} style={{ background:C.bg, borderRadius:12, padding:"12px 14px", textAlign:"center" }}>
                <div style={{ fontSize:"1.1rem", fontWeight:800, color:k.color }}>{k.value}</div>
                <div style={{ fontSize:"0.65rem", color:C.muted, marginTop:2 }}>{k.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {completed.map(s=>(
              <div key={s.id} onClick={()=>setDetail(s)}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:C.bg, borderRadius:12, cursor:"pointer" }}>
                <img src={s.tutorPhoto} alt={s.tutorName} style={{ width:36, height:36, borderRadius:10, objectFit:"cover", flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"0.8rem", fontWeight:600 }}>{s.tutorName} — <span style={{ color:C.muted, fontWeight:400 }}>{s.topic}</span></div>
                  <div style={{ fontSize:"0.65rem", color:C.muted, marginTop:1 }}>{s.dayLabel}, {s.date.split("-").slice(1).reverse().join("/")} · {s.duration} phút</div>
                </div>
                {s.rating && <Stars n={s.rating}/>}
                <span style={{ fontSize:"0.7rem", fontWeight:700, color:C.green, background:C.greenL, borderRadius:999, padding:"2px 8px" }}>+{s.xp} XP</span>
                <ChevronRight size={14} style={{ color:C.muted, flexShrink:0 }}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detail && <DetailModal s={detail} onClose={()=>setDetail(null)}/>}
    </div>
  );
}
