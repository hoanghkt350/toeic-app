import { useState, useMemo, useEffect } from "react";
import {
  Search, Star, BookOpen, Headphones, Target, MessageSquare,
  PlayCircle, X, ChevronLeft, ChevronRight, Check,
  BadgeCheck, Clock, Users, Filter, SlidersHorizontal,
  CalendarDays, Globe, GraduationCap, ThumbsUp,
  PenLine, Send, RotateCcw, Sparkles,
} from "lucide-react";

/* ── palette ─────────────────────────────────────────────── */
const C = {
  blue:        "#1d4ed8",
  blueMid:     "#3b82f6",
  blueLight:   "#eff6ff",
  blueBorder:  "#bfdbfe",
  green:       "#16a34a",
  greenLight:  "#f0fdf4",
  greenBorder: "#bbf7d0",
  orange:      "#d97706",
  orangeLight: "#fffbeb",
  gold:        "#f59e0b",
  goldLight:   "#fef9c3",
  text:        "#111827",
  muted:       "#64748b",
  border:      "#e2e8f0",
  bg:          "#f8faff",
  card:        "#ffffff",
  red:         "#dc2626",
};

/* ── types ───────────────────────────────────────────────── */
interface ReviewCriteria {
  clarity: number;
  attitude: number;
  punctuality: number;
  materials: number;
  homework: number;
}

interface Review {
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  lesson?: string;
  criteria?: ReviewCriteria;
  recommend?: boolean;
  isUserReview?: boolean;
}
interface Tutor {
  id: number;
  name: string;
  title: string;
  bio: string;
  photo: string;
  rating: number;
  reviews: number;
  students: number;
  sessions: number;
  specialty: string;
  specialtyIcon: "listening" | "reading" | "target" | "grammar" | "speaking" | "vocab";
  expertise: string[];
  availability: "Hôm nay" | "Tuần này" | "Tuần tới";
  price: number;
  languages: string[];
  experience: number;
  badge?: string;
  reviewList: Review[];
}

/* ── data ────────────────────────────────────────────────── */
const tutors: Tutor[] = [
  {
    id: 1,
    name: "David Carter",
    title: "TOEIC Listening Specialist",
    bio: "Cựu giám khảo ETS với 12 năm kinh nghiệm. Chuyên sâu phần Nghe Parts 1–4. Học viên trung bình cải thiện 80 điểm sau 8 buổi.",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&auto=format",
    rating: 4.9, reviews: 312, students: 840, sessions: 2100,
    specialty: "Listening Expert", specialtyIcon: "listening",
    expertise: ["Nghe", "Phần 1-4", "Phát âm"],
    availability: "Hôm nay", price: 350000,
    languages: ["Anh", "Việt"],
    experience: 12, badge: "Top Tutor",
    reviewList: [
      { author: "Minh Anh", avatar: "MA", rating: 5, date: "12/05/2026", text: "Thầy David dạy rất rõ ràng, tôi tăng 95 điểm phần Nghe chỉ sau 6 buổi!" },
      { author: "Tuấn Kiệt", avatar: "TK", rating: 5, date: "28/04/2026", text: "Phương pháp của thầy rất khoa học, giúp tôi nhận ra lỗi sai chủ quan." },
      { author: "Lan Phương", avatar: "LP", rating: 4, date: "15/04/2026", text: "Dạy kỹ, có tài liệu riêng. Giờ mình tự tin hơn hẳn ở phần nghe hội thoại." },
    ],
  },
  {
    id: 2,
    name: "Sarah Kim",
    title: "Reading & Grammar Coach",
    bio: "Thạc sĩ Ngôn ngữ học ứng dụng tại ĐH Melbourne. Chuyên luyện Đọc Parts 5-7 và ngữ pháp TOEIC cho người đi làm.",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&auto=format",
    rating: 4.8, reviews: 278, students: 620, sessions: 1850,
    specialty: "Grammar Specialist", specialtyIcon: "grammar",
    expertise: ["Đọc", "Ngữ pháp", "Phần 5-7"],
    availability: "Hôm nay", price: 320000,
    languages: ["Anh", "Hàn", "Việt"],
    experience: 9,
    reviewList: [
      { author: "Hải Đăng", avatar: "HD", rating: 5, date: "10/05/2026", text: "Cô Sarah phân tích cấu trúc ngữ pháp cực kỳ chi tiết và dễ hiểu." },
      { author: "Thu Hà", avatar: "TH", rating: 5, date: "02/05/2026", text: "Mình đã tăng từ 550 lên 710 sau 10 buổi học với cô Sarah." },
      { author: "Bảo Long", avatar: "BL", rating: 4, date: "20/04/2026", text: "Tài liệu luyện tập rất phong phú, sát với đề thi thực tế." },
    ],
  },
  {
    id: 3,
    name: "James Nguyen",
    title: "TOEIC 990 Full-Score Mentor",
    bio: "Đạt 990/990 điểm TOEIC hai lần liên tiếp. Mentor chiến lược thi cho mục tiêu 850+. Chuyên làm việc với các bạn muốn đột phá điểm số nhanh.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format",
    rating: 5.0, reviews: 195, students: 410, sessions: 1320,
    specialty: "Target 900+", specialtyIcon: "target",
    expertise: ["Full Test", "Chiến lược thi", "Nghe + Đọc"],
    availability: "Tuần này", price: 450000,
    languages: ["Anh", "Việt"],
    experience: 7, badge: "990 Scorer",
    reviewList: [
      { author: "Ngọc Bích", avatar: "NB", rating: 5, date: "08/05/2026", text: "Thầy James truyền cảm hứng ghê lắm! Mình target 900 và đã đạt được." },
      { author: "Đức Thịnh", avatar: "DT", rating: 5, date: "25/04/2026", text: "Chiến lược quản lý thời gian của thầy là thứ mình cần nhất." },
      { author: "Khánh Vy", avatar: "KV", rating: 5, date: "10/04/2026", text: "Thầy rất tận tâm, luôn trả lời câu hỏi ngoài giờ học." },
    ],
  },
  {
    id: 4,
    name: "Emily Tran",
    title: "Reading Comprehension Expert",
    bio: "8 năm dạy luyện thi TOEIC cho nhân viên doanh nghiệp. Chuyên tăng tốc độ đọc và kỹ năng skimming/scanning cho Part 7.",
    photo: "https://images.unsplash.com/photo-1699899657680-421c2c2d5064?w=200&h=200&fit=crop&auto=format",
    rating: 4.7, reviews: 241, students: 530, sessions: 1600,
    specialty: "Reading Expert", specialtyIcon: "reading",
    expertise: ["Đọc hiểu", "Part 7", "Skimming"],
    availability: "Tuần này", price: 300000,
    languages: ["Anh", "Việt"],
    experience: 8,
    reviewList: [
      { author: "Minh Tú", avatar: "MT", rating: 5, date: "07/05/2026", text: "Cô Emily dạy kỹ thuật đọc rất thực tế, mình tiết kiệm được rất nhiều thời gian." },
      { author: "Anh Khoa", avatar: "AK", rating: 4, date: "29/04/2026", text: "Bài tập phong phú, được luyện nhiều dạng văn bản khác nhau." },
      { author: "Hương Giang", avatar: "HG", rating: 5, date: "18/04/2026", text: "Sau 8 buổi mình tăng 60 điểm phần Đọc, rất hài lòng." },
    ],
  },
  {
    id: 5,
    name: "Rachel Pham",
    title: "Business English & TOEIC Coach",
    bio: "Chuyên luyện tiếng Anh thương mại và từ vựng TOEIC trong bối cảnh kinh doanh thực tế. Phù hợp cho người đi làm cần thi nhanh.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format",
    rating: 4.8, reviews: 189, students: 380, sessions: 980,
    specialty: "Business TOEIC", specialtyIcon: "vocab",
    expertise: ["Từ vựng", "Business English", "Nghe + Đọc"],
    availability: "Hôm nay", price: 330000,
    languages: ["Anh", "Việt", "Nhật"],
    experience: 6, badge: "Hot",
    reviewList: [
      { author: "Thanh Bình", avatar: "TB", rating: 5, date: "11/05/2026", text: "Cô Rachel rất vui tính, bài học luôn thú vị và thực tế với công việc." },
      { author: "Hoàng Linh", avatar: "HL", rating: 5, date: "03/05/2026", text: "Học với cô 2 tháng, mình thi đạt 750, đủ yêu cầu công ty đề ra." },
      { author: "Phú Quý", avatar: "PQ", rating: 4, date: "22/04/2026", text: "Từ vựng phong phú, cách dạy linh hoạt theo nhu cầu cá nhân." },
    ],
  },
  {
    id: 6,
    name: "Linda Ho",
    title: "TOEIC Intensive Prep Specialist",
    bio: "Chuyên lộ trình ôn thi cấp tốc 4–6 tuần. Học viên đạt mục tiêu với tỉ lệ 94%. Phương pháp tập trung vào dạng bài hay ra nhất.",
    photo: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=200&h=200&fit=crop&auto=format",
    rating: 4.9, reviews: 334, students: 720, sessions: 2400,
    specialty: "Intensive 4-Week", specialtyIcon: "target",
    expertise: ["Lộ trình cấp tốc", "Full Test", "Mock Test"],
    availability: "Tuần tới", price: 400000,
    languages: ["Anh", "Việt"],
    experience: 11, badge: "Top Tutor",
    reviewList: [
      { author: "Việt Anh", avatar: "VA", rating: 5, date: "09/05/2026", text: "Cô Linda lên kế hoạch rất bài bản, mình biết chính xác mình thiếu gì." },
      { author: "Thùy Dương", avatar: "TD", rating: 5, date: "01/05/2026", text: "Ôn 5 tuần với cô, đạt 810 điểm. Mọi thứ vượt kỳ vọng!" },
      { author: "Công Minh", avatar: "CM", rating: 4, date: "14/04/2026", text: "Giáo viên rất chuyên nghiệp, lịch học linh hoạt." },
    ],
  },
];

const specialtyMeta: Record<string, { color: string; bg: string; border: string; Icon: any }> = {
  listening: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", Icon: Headphones },
  reading:   { color: C.blue,   bg: C.blueLight, border: C.blueBorder, Icon: BookOpen },
  target:    { color: C.green,  bg: C.greenLight, border: C.greenBorder, Icon: Target },
  grammar:   { color: C.orange, bg: C.orangeLight, border: "#fde68a", Icon: MessageSquare },
  speaking:  { color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc", Icon: Globe },
  vocab:     { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", Icon: GraduationCap },
};

/* ── calendar data ──────────────────────────────────────── */
function buildCalendar(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const days  = new Date(year, month + 1, 0).getDate();
  return { first, days };
}

const SLOTS = ["08:00", "09:30", "11:00", "13:00", "14:30", "16:00", "18:00", "19:30"];
// randomly mark some slots unavailable per tutor
function slotAvail(tutorId: number, day: number, slot: string) {
  const seed = (tutorId * 7 + day * 3 + slot.charCodeAt(0)) % 5;
  return seed !== 0;
}

/* ── Stars ───────────────────────────────────────────────── */
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={size} style={{ color: s <= Math.round(rating) ? C.gold : "#d1d5db", fill: s <= Math.round(rating) ? C.gold : "#d1d5db" }} />
      ))}
    </span>
  );
}

const REVIEW_STORAGE_KEY = "toeic_tutor_reviews_v2";
const CRITERIA_LABELS: Record<keyof ReviewCriteria, string> = {
  clarity: "Giảng dễ hiểu",
  attitude: "Nhiệt tình",
  punctuality: "Đúng giờ",
  materials: "Tài liệu tốt",
  homework: "Bài tập sát đề",
};

const defaultCriteria: ReviewCriteria = {
  clarity: 0,
  attitude: 0,
  punctuality: 0,
  materials: 0,
  homework: 0,
};

function todayVi() {
  return new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function criteriaAverage(criteria?: ReviewCriteria) {
  if (!criteria) return 0;
  const vals = Object.values(criteria);
  const valid = vals.filter(v => v > 0);
  if (!valid.length) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

function RatingPicker({ label, value, onChange, helper }: { label: string; value: number; onChange: (v: number) => void; helper?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: C.text }}>{label}</span>
        {value > 0 && <span style={{ fontSize: "0.68rem", fontWeight: 800, color: C.orange }}>{value}/5</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {[1,2,3,4,5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: 2, display: "flex" }}
            title={`${s} sao`}
          >
            <Star size={22} style={{ color: s <= value ? C.gold : "#cbd5e1", fill: s <= value ? C.gold : "transparent" }} />
          </button>
        ))}
        {value > 0 && (
          <button
            type="button"
            onClick={() => onChange(0)}
            style={{ marginLeft: 6, border: `1px solid ${C.border}`, background: C.card, borderRadius: 999, padding: "3px 8px", fontSize: "0.62rem", color: C.muted, cursor: "pointer" }}
          >
            xóa
          </button>
        )}
      </div>
      {helper && <span style={{ fontSize: "0.66rem", color: C.muted, lineHeight: 1.5 }}>{helper}</span>}
    </div>
  );
}

/* ── Tutor Card ──────────────────────────────────────────── */
function TutorCard({ tutor, onView, onBook, onReview }: { tutor: Tutor; onView: () => void; onBook: () => void; onReview: () => void }) {
  const sm = specialtyMeta[tutor.specialtyIcon];
  const Icon = sm.Icon;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", gap: 0, position: "relative", transition: "box-shadow 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(29,78,216,0.10)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)")}
    >
      {/* Badge */}
      {tutor.badge && (
        <div style={{ position: "absolute", top: 16, right: 16, background: tutor.badge === "Top Tutor" ? C.blue : tutor.badge === "990 Scorer" ? C.gold : "#f97316", color: "#fff", fontSize: "0.62rem", fontWeight: 800, borderRadius: 999, padding: "3px 10px", letterSpacing: "0.05em" }}>
          {tutor.badge}
        </div>
      )}

      {/* Avatar row */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img src={tutor.photo} alt={tutor.name} style={{ width: 68, height: 68, borderRadius: 16, objectFit: "cover", display: "block" }} />
          {/* Video play button */}
          <button onClick={onView}
            style={{ position: "absolute", bottom: -6, right: -6, width: 26, height: 26, borderRadius: "50%", background: C.blue, border: "2.5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <PlayCircle size={13} color="#fff" />
          </button>
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: C.text }}>{tutor.name}</span>
            <BadgeCheck size={15} style={{ color: C.blue, flexShrink: 0 }} />
          </div>
          <div style={{ fontSize: "0.72rem", color: C.muted, marginBottom: 8 }}>{tutor.title}</div>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Stars rating={tutor.rating} />
            <span style={{ fontSize: "0.82rem", fontWeight: 800, color: C.text }}>{tutor.rating.toFixed(1)}</span>
            <span style={{ fontSize: "0.72rem", color: C.muted }}>({tutor.reviews} đánh giá)</span>
          </div>
        </div>
      </div>

      {/* Specialty tag */}
      <div style={{ marginBottom: 12 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: sm.bg, color: sm.color, border: `1px solid ${sm.border}`, borderRadius: 999, padding: "4px 12px", fontSize: "0.72rem", fontWeight: 700 }}>
          <Icon size={11} />
          {tutor.specialty}
        </span>
      </div>

      {/* Bio */}
      <p style={{ fontSize: "0.8rem", color: C.muted, lineHeight: 1.65, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {tutor.bio}
      </p>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 0, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 16 }}>
        {[
          { label: "Học viên", value: tutor.students, Icon: Users },
          { label: "Buổi học", value: tutor.sessions, Icon: BookOpen },
          { label: "Kinh nghiệm", value: `${tutor.experience}n`, Icon: Clock },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, padding: "10px 8px", textAlign: "center", borderLeft: i > 0 ? `1px solid ${C.border}` : "none", background: C.bg }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: C.text }}>{s.value}</div>
            <div style={{ fontSize: "0.62rem", color: C.muted, marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Availability + price */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: tutor.availability === "Hôm nay" ? C.green : tutor.availability === "Tuần này" ? C.gold : C.muted }} />
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: tutor.availability === "Hôm nay" ? C.green : tutor.availability === "Tuần này" ? C.orange : C.muted }}>
            {tutor.availability === "Hôm nay" ? "Còn lịch hôm nay" : tutor.availability === "Tuần này" ? "Còn lịch tuần này" : "Lịch tuần tới"}
          </span>
        </div>
        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: C.blue }}>{tutor.price.toLocaleString("vi-VN")}đ<span style={{ fontSize: "0.65rem", fontWeight: 500, color: C.muted }}>/buổi</span></span>
      </div>

      {/* Expertise tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {tutor.expertise.map((e) => (
          <span key={e} style={{ fontSize: "0.65rem", fontWeight: 600, background: C.bg, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 999, padding: "3px 9px" }}>{e}</span>
        ))}
        {tutor.languages.map((l) => (
          <span key={l} style={{ fontSize: "0.65rem", fontWeight: 600, background: "#f0fdf4", border: "1px solid #bbf7d0", color: C.green, borderRadius: 999, padding: "3px 9px" }}>🌐 {l}</span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onView}
          style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.card, color: C.text, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "border-color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.blue)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
        >
          Hồ Sơ
        </button>
        <button onClick={onReview}
          style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: `1.5px solid ${C.gold}`, background: C.goldLight, color: "#92400e", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
        >
          <PenLine size={13} /> Đánh Giá
        </button>
        <button onClick={onBook}
          style={{ flex: 1.45, padding: "10px 0", borderRadius: 12, border: "none", background: C.blue, color: "#fff", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(29,78,216,0.28)", transition: "opacity 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Đặt Lịch
        </button>
      </div>
    </div>
  );
}

/* ── Profile Modal ───────────────────────────────────────── */
function ProfileModal({ tutor, defaultTab, onClose, onAddReview }: { tutor: Tutor; defaultTab: "profile" | "book" | "review"; onClose: () => void; onAddReview: (tutorId: number, review: Review) => void }) {
  const sm = specialtyMeta[tutor.specialtyIcon];
  const Icon = sm.Icon;

  const now  = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selDay, setSelDay]   = useState<number | null>(null);
  const [selSlot, setSelSlot] = useState<string | null>(null);
  const [booked, setBooked]   = useState(false);
  const [tab, setTab] = useState<"profile" | "book" | "review">(defaultTab);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewLesson, setReviewLesson] = useState("Buổi học 1-1 TOEIC");
  const [reviewRecommend, setReviewRecommend] = useState(true);
  const [reviewCriteria, setReviewCriteria] = useState<ReviewCriteria>(defaultCriteria);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const criteriaScore = criteriaAverage(reviewCriteria);
  const criteriaComplete = Object.values(reviewCriteria).every(v => v > 0);
  const canSubmitReview = reviewRating > 0 && criteriaComplete && reviewText.trim().length >= 12;

  const resetReviewForm = () => {
    setReviewRating(0);
    setReviewText("");
    setReviewLesson("Buổi học 1-1 TOEIC");
    setReviewRecommend(true);
    setReviewCriteria(defaultCriteria);
    setReviewSuccess(false);
  };

  const submitReview = () => {
    if (!canSubmitReview) return;
    onAddReview(tutor.id, {
      author: "Nguyễn Minh",
      avatar: "NM",
      rating: reviewRating,
      date: todayVi(),
      text: reviewText.trim(),
      lesson: reviewLesson.trim() || "Buổi học 1-1 TOEIC",
      criteria: reviewCriteria,
      recommend: reviewRecommend,
      isUserReview: true,
    });
    setReviewSuccess(true);
    setReviewText("");
    setReviewRating(0);
    setReviewCriteria(defaultCriteria);
  };

  const { first, days } = buildCalendar(year, month);
  const monthNames = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
  const dayNames = ["CN","T2","T3","T4","T5","T6","T7"];

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelDay(null); setSelSlot(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0);  setYear(y => y + 1); } else setMonth(m => m + 1); setSelDay(null); setSelSlot(null); };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)", padding: 16 }}
      onClick={onClose}
    >
      <div style={{ background: C.card, borderRadius: 24, width: "100%", maxWidth: 680, maxHeight: "92vh", overflowY: "auto", position: "relative", boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 34, height: 34, borderRadius: "50%", border: "none", background: "#f1f5f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
          <X size={16} style={{ color: C.muted }} />
        </button>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #3b82f6 100%)", padding: "28px 28px 0", borderRadius: "24px 24px 0 0" }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
            {/* Avatar with video overlay */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img src={tutor.photo} alt={tutor.name} style={{ width: 90, height: 90, borderRadius: 20, objectFit: "cover", border: "3px solid rgba(255,255,255,0.3)" }} />
              <button onClick={() => setVideoPlaying(v => !v)}
                style={{ position: "absolute", inset: 0, borderRadius: 20, border: "none", background: videoPlaying ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(1px)" }}
              >
                {videoPlaying
                  ? <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} style={{ color: C.text }} /></div>
                  : <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}><PlayCircle size={18} style={{ color: C.blue }} /></div>}
              </button>
            </div>
            <div style={{ flex: 1, paddingBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <h2 style={{ margin: 0, color: "#fff", fontSize: "1.15rem" }}>{tutor.name}</h2>
                <BadgeCheck size={17} style={{ color: "#93c5fd" }} />
                {tutor.badge && <span style={{ fontSize: "0.62rem", fontWeight: 800, background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 999, padding: "2px 8px" }}>{tutor.badge}</span>}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#93c5fd", marginBottom: 10 }}>{tutor.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Stars rating={tutor.rating} size={14} />
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fef9c3" }}>{tutor.rating.toFixed(1)}</span>
                <span style={{ fontSize: "0.72rem", color: "#93c5fd" }}>({tutor.reviews} đánh giá)</span>
              </div>
            </div>
          </div>

          {/* Video mock */}
          {videoPlaying && (
            <div style={{ background: "rgba(0,0,0,0.7)", borderRadius: 14, marginTop: 16, height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <PlayCircle size={36} style={{ color: "rgba(255,255,255,0.6)" }} />
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>Video giới thiệu của {tutor.name}</span>
              <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>2:34 phút</span>
            </div>
          )}

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 0, marginTop: 20 }}>
            {(["profile", "review", "book"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, padding: "12px 0", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, color: tab === t ? "#fff" : "rgba(255,255,255,0.5)", borderBottom: tab === t ? "3px solid #fff" : "3px solid transparent", transition: "all 0.15s" }}
              >
                {t === "profile" ? "Hồ Sơ" : t === "review" ? "⭐ Đánh Giá" : "📅 Đặt Lịch"}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px 28px" }}>
          {tab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { label: "Học viên", value: tutor.students, color: C.blue, bg: C.blueLight },
                  { label: "Buổi học", value: tutor.sessions, color: "#7c3aed", bg: "#f5f3ff" },
                  { label: "Kinh nghiệm", value: `${tutor.experience} năm`, color: C.green, bg: C.greenLight },
                ].map((s) => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "0.68rem", color: C.muted, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>Giới thiệu</div>
                <p style={{ fontSize: "0.85rem", color: C.text, lineHeight: 1.7, margin: 0 }}>{tutor.bio}</p>
              </div>

              {/* Specialty */}
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>Chuyên môn</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: sm.bg, color: sm.color, border: `1.5px solid ${sm.border}`, borderRadius: 999, padding: "5px 14px", fontSize: "0.78rem", fontWeight: 700 }}>
                    <Icon size={13} />{tutor.specialty}
                  </span>
                  {tutor.expertise.map((e) => (
                    <span key={e} style={{ fontSize: "0.72rem", fontWeight: 600, background: C.bg, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 999, padding: "4px 12px" }}>{e}</span>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted }}>Đánh giá gần đây</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.goldLight, borderRadius: 10, padding: "5px 12px" }}>
                    <Star size={13} style={{ color: C.gold, fill: C.gold }} />
                    <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#92400e" }}>{tutor.rating.toFixed(1)}</span>
                    <span style={{ fontSize: "0.7rem", color: "#a16207" }}>/ {tutor.reviews} đánh giá</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {tutor.reviewList.map((r, i) => (
                    <div key={i} style={{ background: C.bg, borderRadius: 14, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>{r.avatar}</div>
                          <div>
                            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: C.text }}>{r.author}</div>
                            <Stars rating={r.rating} size={11} />
                          </div>
                        </div>
                        <span style={{ fontSize: "0.65rem", color: C.muted }}>{r.date}</span>
                      </div>
                      {r.lesson && <div style={{ fontSize: "0.66rem", color: C.blue, fontWeight: 700, marginBottom: 6 }}>Đã học: {r.lesson}</div>}
                      <p style={{ fontSize: "0.8rem", color: C.text, lineHeight: 1.6, margin: 0 }}>"{r.text}"</p>
                      {r.criteria && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 6, marginTop: 10 }}>
                          {(Object.keys(CRITERIA_LABELS) as Array<keyof ReviewCriteria>).map((k) => (
                            <div key={k} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, padding: "6px 8px", display: "flex", justifyContent: "space-between", gap: 8 }}>
                              <span style={{ fontSize: "0.62rem", color: C.muted }}>{CRITERIA_LABELS[k]}</span>
                              <span style={{ fontSize: "0.62rem", fontWeight: 800, color: C.orange }}>{r.criteria?.[k]}/5</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {r.isUserReview && <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, background: C.greenLight, border: `1px solid ${C.greenBorder}`, color: C.green, borderRadius: 999, padding: "3px 9px", fontSize: "0.62rem", fontWeight: 800 }}><Check size={10} /> Đánh giá của bạn</div>}
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                        <ThumbsUp size={11} style={{ color: C.muted }} />
                        <span style={{ fontSize: "0.65rem", color: C.muted }}>Hữu ích</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setTab("review")}
                  style={{ flex: 1, padding: "14px 0", borderRadius: 14, border: `1.5px solid ${C.gold}`, background: C.goldLight, color: "#92400e", fontSize: "0.9rem", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <PenLine size={16} /> Viết Đánh Giá
                </button>
                <button onClick={() => setTab("book")}
                  style={{ flex: 1, padding: "14px 0", borderRadius: 14, border: "none", background: C.blue, color: "#fff", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 18px rgba(29,78,216,0.3)" }}
                >
                  Đặt Lịch Học Ngay
                </button>
              </div>
            </div>
          )}


          {tab === "review" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "linear-gradient(135deg,#fef9c3,#fff7ed)", border: `1px solid ${C.gold}`, borderRadius: 18, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: C.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={18} color="#fff" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: C.text, fontSize: "1rem" }}>Đánh giá gia sư {tutor.name}</h3>
                    <p style={{ margin: "2px 0 0", color: C.muted, fontSize: "0.74rem" }}>Nhận xét của bạn giúp hệ thống gợi ý gia sư phù hợp hơn cho học sinh khác.</p>
                  </div>
                </div>
              </div>

              {reviewSuccess && (
                <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <Check size={18} style={{ color: C.green }} />
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: C.green }}>Đã gửi đánh giá thành công!</div>
                    <div style={{ fontSize: "0.68rem", color: C.muted }}>Điểm trung bình và danh sách đánh giá đã được cập nhật trên giao diện.</div>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
                  <RatingPicker
                    label="Mức độ hài lòng chung"
                    value={reviewRating}
                    onChange={setReviewRating}
                    helper="Chấm theo cảm nhận tổng thể sau buổi học."
                  />
                </div>
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: C.text, marginBottom: 8 }}>Buổi học đã tham gia</div>
                  <input
                    value={reviewLesson}
                    onChange={(e) => setReviewLesson(e.target.value)}
                    placeholder="Ví dụ: Buổi chữa đề Listening Part 3"
                    style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${C.border}`, outline: "none", background: C.card, fontSize: "0.8rem", color: C.text }}
                    onFocus={(e) => (e.target.style.borderColor = C.blue)}
                    onBlur={(e) => (e.target.style.borderColor = C.border)}
                  />
                </div>
              </div>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: "0.86rem", fontWeight: 800, color: C.text }}>Chấm chi tiết theo tiêu chí</div>
                    <div style={{ fontSize: "0.68rem", color: C.muted, marginTop: 2 }}>Cần chấm đủ 5 tiêu chí để gửi đánh giá.</div>
                  </div>
                  <div style={{ background: criteriaComplete ? C.greenLight : C.bg, border: `1px solid ${criteriaComplete ? C.greenBorder : C.border}`, borderRadius: 999, padding: "5px 10px", fontSize: "0.68rem", fontWeight: 800, color: criteriaComplete ? C.green : C.muted }}>
                    TB tiêu chí: {criteriaScore ? criteriaScore.toFixed(1) : "--"}/5
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
                  {(Object.keys(CRITERIA_LABELS) as Array<keyof ReviewCriteria>).map((k) => (
                    <RatingPicker
                      key={k}
                      label={CRITERIA_LABELS[k]}
                      value={reviewCriteria[k]}
                      onChange={(v) => setReviewCriteria(prev => ({ ...prev, [k]: v }))}
                    />
                  ))}
                </div>
              </div>

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18 }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: C.text, marginBottom: 8 }}>Nhận xét của bạn</div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Ví dụ: Thầy/cô giảng rất dễ hiểu, chỉ rõ lỗi sai của em ở Part 5 và giao bài tập sát đề..."
                  rows={5}
                  style={{ width: "100%", boxSizing: "border-box", resize: "vertical", padding: 12, borderRadius: 14, border: `1.5px solid ${C.border}`, outline: "none", background: C.bg, fontSize: "0.82rem", color: C.text, lineHeight: 1.6 }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, gap: 12, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.74rem", color: C.text, cursor: "pointer" }}>
                    <input type="checkbox" checked={reviewRecommend} onChange={(e) => setReviewRecommend(e.target.checked)} />
                    Em muốn giới thiệu gia sư này cho bạn khác
                  </label>
                  <span style={{ fontSize: "0.68rem", color: reviewText.trim().length >= 12 ? C.green : C.muted }}>
                    {reviewText.trim().length}/12 ký tự tối thiểu
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={resetReviewForm}
                  style={{ flex: 1, padding: "13px 0", borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.card, color: C.muted, fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                >
                  <RotateCcw size={15} /> Nhập lại
                </button>
                <button disabled={!canSubmitReview} onClick={submitReview}
                  style={{ flex: 2, padding: "13px 0", borderRadius: 14, border: "none", background: canSubmitReview ? C.blue : "#e2e8f0", color: canSubmitReview ? "#fff" : C.muted, fontSize: "0.86rem", fontWeight: 800, cursor: canSubmitReview ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: canSubmitReview ? "0 4px 18px rgba(29,78,216,0.26)" : "none" }}
                >
                  <Send size={15} /> Gửi Đánh Giá Gia Sư
                </button>
              </div>

              <div style={{ background: C.blueLight, border: `1px solid ${C.blueBorder}`, borderRadius: 14, padding: 14, fontSize: "0.72rem", color: C.muted, lineHeight: 1.6 }}>
                <strong style={{ color: C.blue }}>Mô phỏng frontend:</strong> đánh giá được lưu bằng localStorage trên trình duyệt. Khi tải lại trang, điểm và nhận xét vẫn còn mà không cần backend.
              </div>
            </div>
          )}

          {tab === "book" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {booked ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "40px 0" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.greenLight, border: `2px solid ${C.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={28} style={{ color: C.green }} />
                  </div>
                  <h3 style={{ margin: 0, color: C.text }}>Đặt lịch thành công!</h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: C.muted, textAlign: "center", lineHeight: 1.6 }}>
                    Buổi học với <strong>{tutor.name}</strong> vào lúc <strong>{selSlot}</strong> ngày <strong>{selDay}/{month + 1}/{year}</strong> đã được xác nhận.<br />Bạn sẽ nhận email xác nhận sớm.
                  </p>
                  <button onClick={() => { setBooked(false); setSelDay(null); setSelSlot(null); }}
                    style={{ marginTop: 8, padding: "10px 24px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.card, color: C.text, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}
                  >
                    Đặt thêm buổi học
                  </button>
                </div>
              ) : (
                <>
                  {/* Price info */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.blueLight, borderRadius: 14, padding: "14px 18px", border: `1px solid ${C.blueBorder}` }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: C.muted, marginBottom: 2 }}>Học phí mỗi buổi (60 phút)</div>
                      <div style={{ fontSize: "1.3rem", fontWeight: 800, color: C.blue }}>{tutor.price.toLocaleString("vi-VN")}đ</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: tutor.availability === "Hôm nay" ? C.green : C.gold }} />
                        <span style={{ fontSize: "0.72rem", fontWeight: 600, color: tutor.availability === "Hôm nay" ? C.green : C.orange }}>{tutor.availability === "Hôm nay" ? "Còn lịch hôm nay" : "Còn lịch tuần này"}</span>
                      </div>
                      <div style={{ fontSize: "0.65rem", color: C.muted, marginTop: 2 }}>{tutor.languages.join(" · ")}</div>
                    </div>
                  </div>

                  {/* Calendar */}
                  <div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 12 }}>Chọn ngày học</div>
                    <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
                      {/* Month nav */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                        <button onClick={prevMonth} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4, borderRadius: 8, display: "flex" }}><ChevronLeft size={16} style={{ color: C.muted }} /></button>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: C.text }}>{monthNames[month]} {year}</span>
                        <button onClick={nextMonth} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4, borderRadius: 8, display: "flex" }}><ChevronRight size={16} style={{ color: C.muted }} /></button>
                      </div>
                      {/* Day names */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "10px 12px 4px" }}>
                        {dayNames.map((d) => (
                          <div key={d} style={{ textAlign: "center", fontSize: "0.65rem", fontWeight: 700, color: C.muted, padding: "4px 0" }}>{d}</div>
                        ))}
                      </div>
                      {/* Day cells */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, padding: "4px 12px 12px" }}>
                        {Array.from({ length: first }).map((_, i) => <div key={`e${i}`} />)}
                        {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                          const isPast = new Date(year, month, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate());
                          const isSel = selDay === d;
                          const hasSlots = !isPast && [0,1,2,3,4,5,6,7].some(s => slotAvail(tutor.id, d, SLOTS[s % SLOTS.length]));
                          return (
                            <button key={d} disabled={isPast || !hasSlots}
                              onClick={() => { setSelDay(d); setSelSlot(null); }}
                              style={{
                                padding: "7px 0", borderRadius: 10, border: isSel ? `2px solid ${C.blue}` : "2px solid transparent",
                                background: isSel ? C.blue : isPast ? "transparent" : hasSlots ? C.card : "#f1f5f9",
                                color: isSel ? "#fff" : isPast ? "#d1d5db" : hasSlots ? C.text : "#d1d5db",
                                cursor: isPast || !hasSlots ? "default" : "pointer",
                                fontSize: "0.78rem", fontWeight: isSel ? 700 : 500,
                                transition: "all 0.12s",
                              }}
                            >{d}</button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Time slots */}
                  {selDay && (
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 12 }}>
                        Chọn giờ học — {selDay}/{month + 1}/{year}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                        {SLOTS.map((slot) => {
                          const avail = slotAvail(tutor.id, selDay, slot);
                          const isSel = selSlot === slot;
                          return (
                            <button key={slot} disabled={!avail}
                              onClick={() => setSelSlot(slot)}
                              style={{
                                padding: "9px 4px", borderRadius: 10, fontSize: "0.78rem", fontWeight: 600,
                                border: isSel ? `2px solid ${C.blue}` : `1.5px solid ${avail ? C.border : "#f1f5f9"}`,
                                background: isSel ? C.blue : avail ? C.card : "#f8faff",
                                color: isSel ? "#fff" : avail ? C.text : "#d1d5db",
                                cursor: avail ? "pointer" : "default",
                                transition: "all 0.12s",
                              }}
                            >{slot}</button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Confirm */}
                  <button
                    disabled={!selDay || !selSlot}
                    onClick={() => setBooked(true)}
                    style={{
                      width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
                      background: selDay && selSlot ? C.blue : "#e2e8f0",
                      color: selDay && selSlot ? "#fff" : C.muted,
                      fontSize: "0.9rem", fontWeight: 700,
                      cursor: selDay && selSlot ? "pointer" : "not-allowed",
                      boxShadow: selDay && selSlot ? "0 4px 18px rgba(29,78,216,0.30)" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    <CalendarDays size={16} />
                    {selDay && selSlot ? `Xác Nhận — ${selSlot}, ${selDay}/${month + 1}` : "Chọn ngày và giờ học"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────── */
export function FindTutor() {
  const [query,    setQuery]    = useState("");
  const [expertise, setExpertise] = useState("Tất cả");
  const [rating,   setRating]   = useState("Tất cả");
  const [avail,    setAvail]    = useState("Tất cả");
  const [sort,     setSort]     = useState("Đánh giá");
  const [modal,    setModal]    = useState<{ tutor: Tutor; tab: "profile" | "book" | "review" } | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [userReviews, setUserReviews] = useState<Record<number, Review[]>>(() => {
    try {
      const raw = localStorage.getItem(REVIEW_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(userReviews));
  }, [userReviews]);

  const addReview = (tutorId: number, review: Review) => {
    setUserReviews(prev => ({ ...prev, [tutorId]: [review, ...(prev[tutorId] || [])] }));
  };

  const tutorsWithReviews = useMemo(() => tutors.map((t) => {
    const local = userReviews[t.id] || [];
    const extraSum = local.reduce((sum, r) => sum + r.rating, 0);
    const reviewCount = t.reviews + local.length;
    const ratingSum = t.rating * t.reviews + extraSum;
    return {
      ...t,
      rating: reviewCount ? ratingSum / reviewCount : t.rating,
      reviews: reviewCount,
      reviewList: [...local, ...t.reviewList],
    };
  }), [userReviews]);

  const totalUserReviews = Object.values(userReviews).reduce((sum, arr) => sum + arr.length, 0);

  const expertiseOpts = ["Tất cả", "Nghe", "Đọc", "Ngữ pháp", "Từ vựng", "Full Test"];
  const ratingOpts    = ["Tất cả", "5 sao", "4.5+", "4.0+"];
  const availOpts     = ["Tất cả", "Hôm nay", "Tuần này", "Tuần tới"];
  const sortOpts      = ["Đánh giá", "Giá thấp nhất", "Nhiều học viên nhất"];

  const filtered = useMemo(() => {
    let res = tutorsWithReviews;
    if (query.trim()) res = res.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()) || t.bio.toLowerCase().includes(query.toLowerCase()) || t.specialty.toLowerCase().includes(query.toLowerCase()));
    if (expertise !== "Tất cả") res = res.filter((t) => t.expertise.some((e) => e.includes(expertise)) || t.specialty.includes(expertise));
    if (rating !== "Tất cả") {
      const min = rating === "5 sao" ? 5 : rating === "4.5+" ? 4.5 : 4.0;
      res = res.filter((t) => t.rating >= min);
    }
    if (avail !== "Tất cả") res = res.filter((t) => t.availability === avail);
    if (sort === "Đánh giá")          res = [...res].sort((a, b) => b.rating - a.rating);
    if (sort === "Giá thấp nhất")     res = [...res].sort((a, b) => a.price - b.price);
    if (sort === "Nhiều học viên nhất") res = [...res].sort((a, b) => b.students - a.students);
    return res;
  }, [query, expertise, rating, avail, sort, tutorsWithReviews]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1100, margin: "0 auto", paddingBottom: 40 }}>

      {/* Header stat bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        {[
          { label: "Gia sư đang hoạt động", value: tutorsWithReviews.length, color: C.blue },
          { label: "Lịch rảnh hôm nay", value: tutorsWithReviews.filter(t => t.availability === "Hôm nay").length, color: C.green },
          { label: "Đánh giá trung bình", value: (tutorsWithReviews.reduce((s, t) => s + t.rating, 0) / tutorsWithReviews.length).toFixed(1) + " ⭐", color: C.orange },
          { label: "Đánh giá của bạn", value: totalUserReviews, color: C.gold },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", items: "center", gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 20px" }}>
            <span style={{ fontSize: "1.15rem", fontWeight: 800, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: "0.72rem", color: C.muted, marginLeft: 6, alignSelf: "center" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Search row */}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.muted, pointerEvents: "none" }} />
            <input
              type="text" placeholder="Tìm gia sư theo tên, kỹ năng, chuyên môn..."
              value={query} onChange={(e) => setQuery(e.target.value)}
              style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: "0.85rem", color: C.text, background: C.bg, outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = C.blue)}
              onBlur={(e) => (e.target.style.borderColor = C.border)}
            />
          </div>
          <button onClick={() => setFiltersOpen(f => !f)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 16px", borderRadius: 12, border: `1.5px solid ${filtersOpen ? C.blue : C.border}`, background: filtersOpen ? C.blueLight : C.card, color: filtersOpen ? C.blue : C.muted, cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, whiteSpace: "nowrap" }}>
            <SlidersHorizontal size={14} />
            Bộ lọc {filtersOpen ? "▲" : "▼"}
          </button>
        </div>

        {/* Filter pills */}
        {filtersOpen && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, paddingTop: 4, borderTop: `1px solid ${C.border}` }}>
            {[
              { label: "Chuyên môn", opts: expertiseOpts, val: expertise, set: setExpertise },
              { label: "Đánh giá", opts: ratingOpts, val: rating, set: setRating },
              { label: "Lịch rảnh", opts: availOpts, val: avail, set: setAvail },
            ].map((f) => (
              <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Filter size={11} style={{ color: C.muted }} />
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</span>
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {f.opts.map((o) => (
                    <button key={o} onClick={() => f.set(o)}
                      style={{ padding: "5px 12px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 600, border: `1.5px solid ${f.val === o ? C.blue : C.border}`, background: f.val === o ? C.blue : C.card, color: f.val === o ? "#fff" : C.muted, cursor: "pointer", transition: "all 0.12s" }}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sort + result count */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: "0.78rem", color: C.muted }}>
            Tìm thấy <strong style={{ color: C.text }}>{filtered.length}</strong> gia sư phù hợp
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.72rem", color: C.muted }}>Sắp xếp:</span>
            <div style={{ display: "flex", gap: 4 }}>
              {sortOpts.map((s) => (
                <button key={s} onClick={() => setSort(s)}
                  style={{ padding: "4px 10px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 600, border: `1.5px solid ${sort === s ? C.blue : C.border}`, background: sort === s ? C.blue : C.card, color: sort === s ? "#fff" : C.muted, cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
          <Users size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <div style={{ fontSize: "0.9rem" }}>Không tìm thấy gia sư phù hợp. Thử thay đổi bộ lọc.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {filtered.map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              onView={() => setModal({ tutor, tab: "profile" })}
              onReview={() => setModal({ tutor, tab: "review" })}
              onBook={() => setModal({ tutor, tab: "book" })}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <ProfileModal
          tutor={modal.tutor}
          defaultTab={modal.tab}
          onClose={() => setModal(null)}
          onAddReview={addReview}
        />
      )}
    </div>
  );
}
