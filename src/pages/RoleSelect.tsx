import { Link } from "react-router";
import {
  BookOpen,
  GraduationCap,
  Presentation,
  ShieldCheck,
  PenSquare,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type Role = {
  slug: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  accent: string;
  ready: boolean;
};

const ROLES: Role[] = [
  {
    slug: "khach",
    title: "Khách",
    desc: "Trải nghiệm thử, thư viện đề thi & bảng giá",
    icon: BookOpen,
    accent: "#2563EB",
    ready: true,
  },
  {
    slug: "hoc-sinh",
    title: "Học sinh",
    desc: "Lộ trình học, luyện tập, từ vựng & gia sư",
    icon: GraduationCap,
    accent: "#1d4ed8",
    ready: true,
  },
  {
    slug: "giao-vien",
    title: "Giáo viên",
    desc: "Quản lý lớp, soạn đề, chấm điểm học viên",
    icon: Presentation,
    accent: "#2563EB",
    ready: true,
  },
  {
    slug: "admin",
    title: "Admin",
    desc: "Quản trị người dùng, khoá học, nội dung & thanh toán",
    icon: ShieldCheck,
    accent: "#030213",
    ready: true,
  },
  {
    slug: "bien-soan",
    title: "Biên soạn",
    desc: "Tạo khóa học, ngân hàng câu hỏi, đề thi & từ vựng",
    icon: PenSquare,
    accent: "#1C63EA",
    ready: true,
  },
];

export default function RoleSelect() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#0f172a 0%,#1e3a8a 55%,#2563eb 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 20px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: "#fff",
            fontWeight: 800,
            fontSize: "1.6rem",
            letterSpacing: "-0.02em",
          }}
        >
          <BookOpen size={28} />
          TOEIC Pro
        </div>
        <p style={{ color: "#bfdbfe", marginTop: 10, fontSize: "0.95rem" }}>
          Chọn vai trò để bắt đầu
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 18,
          width: "100%",
          maxWidth: 920,
        }}
      >
        {ROLES.map((r) => {
          const Icon = r.icon;
          const card = (
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: "22px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                height: "100%",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                opacity: r.ready ? 1 : 0.55,
                cursor: r.ready ? "pointer" : "not-allowed",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (r.ready) e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: r.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={24} color="#fff" />
              </div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a" }}>
                {r.title}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b", flex: 1 }}>{r.desc}</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: r.ready ? r.accent : "#94a3b8",
                }}
              >
                {r.ready ? "Vào ngay" : "Sắp có"}
                {r.ready && <ArrowRight size={15} />}
              </div>
            </div>
          );

          return r.ready ? (
            <Link key={r.slug} to={`/${r.slug}`} style={{ textDecoration: "none" }}>
              {card}
            </Link>
          ) : (
            <div key={r.slug}>{card}</div>
          );
        })}
      </div>

      <p style={{ color: "#93c5fd", marginTop: 36, fontSize: "0.8rem" }}>
        © 2026 TOEIC Pro · Đồ án web luyện thi TOEIC
      </p>
    </div>
  );
}
