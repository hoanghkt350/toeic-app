// src/app/components/ScreenTongQuan.tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from "recharts";
import { Users, BarChart2, Clock, BookOpen, CheckCircle } from "lucide-react";

const chartData = [
  { thang: "T1", diemTB: 520 },
  { thang: "T2", diemTB: 545 },
  { thang: "T3", diemTB: 538 },
  { thang: "T4", diemTB: 572 },
  { thang: "T5", diemTB: 590 },
  { thang: "T6", diemTB: 615 },
];

const chartDataEn = [
  { thang: "Jan", diemTB: 520 },
  { thang: "Feb", diemTB: 545 },
  { thang: "Mar", diemTB: 538 },
  { thang: "Apr", diemTB: 572 },
  { thang: "May", diemTB: 590 },
  { thang: "Jun", diemTB: 615 },
];

const recentActivityVi = [
  { name: "Nguyễn Minh Anh", test: "ETS 2024 – Full Test 3", score: 720, time: "5 phút trước", avatar: "MA" },
  { name: "Trần Quốc Bảo", test: "ETS 2024 – Full Test 3", score: 685, time: "23 phút trước", avatar: "QB" },
  { name: "Lê Thị Cẩm", test: "Mini Test Part 5&6", score: 430, time: "1 giờ trước", avatar: "TC" },
  { name: "Phạm Hoàng Dũng", test: "ETS 2024 – Full Test 2", score: 760, time: "2 giờ trước", avatar: "HD" },
  { name: "Vũ Thanh Hằng", test: "Mini Test Part 1&2", score: 310, time: "3 giờ trước", avatar: "TH" },
];

const recentActivityEn = [
  { name: "Nguyễn Minh Anh", test: "ETS 2024 – Full Test 3", score: 720, time: "5 mins ago", avatar: "MA" },
  { name: "Trần Quốc Bảo", test: "ETS 2024 – Full Test 3", score: 685, time: "23 mins ago", avatar: "QB" },
  { name: "Lê Thị Cẩm", test: "Mini Test Part 5&6", score: 430, time: "1 hour ago", avatar: "TC" },
  { name: "Phạm Hoàng Dũng", test: "ETS 2024 – Full Test 2", score: 760, time: "2 hours ago", avatar: "HD" },
  { name: "Vũ Thanh Hằng", test: "Mini Test Part 1&2", score: 310, time: "3 hours ago", avatar: "TH" },
];

const radarData = [
  { part: "Part 1", lopA: 82, lopB: 68 },
  { part: "Part 2", lopA: 74, lopB: 55 },
  { part: "Part 3", lopA: 60, lopB: 72 },
  { part: "Part 4", lopA: 55, lopB: 60 },
  { part: "Part 5", lopA: 78, lopB: 85 },
  { part: "Part 6", lopA: 65, lopB: 70 },
  { part: "Part 7", lopA: 50, lopB: 62 },
];

export function ScreenTongQuan({ lang = "vi" }: { lang?: string }) {
  const isEn = lang === "en";

  const stats = [
    { label: isEn ? "Active Students" : "Học viên đang dạy", value: "48", icon: Users, color: "#2563EB", bg: "#DBEAFE" },
    { label: isEn ? "Average Score" : "Điểm trung bình lớp", value: "615", icon: BarChart2, color: "#10B981", bg: "#D1FAE5" },
    { label: isEn ? "Pending Grading" : "Bài thi chờ chấm", value: "12", icon: Clock, color: "#F59E0B", bg: "#FEF3C7" },
    { label: isEn ? "Tests Created" : "Đề thi đã tạo", value: "27", icon: BookOpen, color: "#8B5CF6", bg: "#EDE9FE" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-4 gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: "#64748B" }}>{label}</span>
              <div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: bg }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>{value}</span>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4">
          <h3 style={{ fontWeight: 600, color: "#0F172A", fontSize: 15 }}>
            {isEn ? "Class Skills Analysis — 7 TOEIC Parts" : "Phân tích Kỹ năng Lớp — 7 Parts TOEIC"}
          </h3>
          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
            {isEn ? "Compare strengths/weaknesses between classes (%)" : "So sánh điểm mạnh / điểm yếu từng Part giữa các lớp (%)"}
          </p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#F1F5F9" />
            <PolarAngleAxis dataKey="part" tick={{ fontSize: 12, fill: "#64748B", fontWeight: 500 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#94A3B8" }} tickCount={4} />
            <Radar name={isEn ? "Class TOEIC 600+" : "Lớp TOEIC 600+"} dataKey="lopA" stroke="#2563EB" fill="#2563EB" fillOpacity={0.18} strokeWidth={2} dot={{ r: 3, fill: "#2563EB" }} />
            <Radar name={isEn ? "Class TOEIC 750+" : "Lớp TOEIC 750+"} dataKey="lopB" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} dot={{ r: 3, fill: "#10B981" }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} formatter={(value) => <span style={{ color: "#374151" }}>{value}</span>} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }} formatter={(v: number, name: string) => [`${v}%`, name]} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 360px" }}>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4">
            <h3 style={{ fontWeight: 600, color: "#0F172A", fontSize: 15 }}>
              {isEn ? "Average TOEIC Score by Month" : "Điểm TOEIC trung bình theo tháng"}
            </h3>
            <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{isEn ? "Class progress over the last 6 months" : "Tiến độ lớp học trong 6 tháng qua"}</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={isEn ? chartDataEn : chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="thang" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[480, 660]} tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }} formatter={(v: number) => [`${v} ${isEn ? "pts" : "điểm"}`, isEn ? "Avg Score" : "Điểm TB"]} />
              <Line type="monotone" dataKey="diemTB" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: "#2563EB", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 style={{ fontWeight: 600, color: "#0F172A", fontSize: 15, marginBottom: 16 }}>
            {isEn ? "Recent Activity" : "Hoạt động gần đây"}
          </h3>
          <div className="flex flex-col gap-3">
            {(isEn ? recentActivityEn : recentActivityVi).map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 36, height: 36, background: "#DBEAFE" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#2563EB" }}>{item.avatar}</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{item.name}</span>
                  <span style={{ fontSize: 11, color: "#94A3B8" }} className="truncate">{item.test}</span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1">
                    <CheckCircle size={11} style={{ color: "#10B981" }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981" }}>{item.score}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}