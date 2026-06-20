// src/app/App.tsx
import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { ScreenTongQuan } from "./components/ScreenTongQuan";
import { ScreenQuanLyDeThi } from "./components/ScreenQuanLyDeThi";
import { ScreenSoanThaoDe } from "./components/ScreenSoanThaoDe";
import { ScreenChamDiem } from "./components/ScreenChamDiem";
import { ScreenQuanLyLopHoc } from "./components/ScreenQuanLyLopHoc";
import BackToHome from "../../components/BackToHome";
import ZaloButton from "../../components/ZaloButton";
import { Auth } from "./components/Auth";
import { addAssignment, getSession, clearSession } from "./lib/classroomStore";

export type Screen = "tongquan" | "quanlylophoc" | "quanlydeti" | "soanthaode" | "chamdiemhocvien";
export type ClassLevel = "Cơ bản" | "Trung cấp" | "Nâng cao" | "Cao cấp" | "Mọi cấp độ" | "Mới bắt đầu";
export type SkillType = "Listening" | "Reading" | "Writing";
export type StatusType = "Cần cố gắng" | "Tốt" | "Chờ chấm";

export interface ClassItem {
  id: string;
  name: string;
  schedule: string;
  students: number;
  maxStudents: number;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  level: ClassLevel;
  levelColor: string;
  levelBg: string;
  attendanceRecord?: Record<string, Record<number, string>>;
}

export interface QuestionItem {
  id: string;
  partId: string;
  skill: SkillType;
  text: string;
  options?: Record<string, string>;
  correctAnswer?: string;
  topic?: string;
  difficulty?: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface TestItem {
  id: string;
  ten: string;
  soCau: number;
  trangThai: "Nháp" | "Xuất bản";
  ngayTao: string;
  parts?: { id: string; label: string; sub: string; count: number; defaultSkill?: SkillType }[];
  questions?: QuestionItem[];
}

export interface StudentItem {
  id: number;
  name: string;
  avatar: string;
  targetScore: number;
}

export interface SubmissionItem {
  id: string;
  studentId: number;
  testId: string;
  testName: string;
  skill: SkillType;
  status: StatusType;
  answers?: ("A"|"B"|"C"|"D"|null)[]; // For TOEIC
  essayText?: string; // For Writing
  teacherFeedback?: string;
  score?: number;
}

export const defaultParts = [
  { id: "p1", label: "Part 1", sub: "Photographs", count: 6 },
  { id: "p2", label: "Part 2", sub: "Question-Response", count: 25 },
  { id: "p3", label: "Part 3", sub: "Conversations", count: 39 },
  { id: "p4", label: "Part 4", sub: "Short Talks", count: 30 },
  { id: "p5", label: "Part 5", sub: "Incomplete Sentences", count: 30 },
  { id: "p6", label: "Part 6", sub: "Text Completion", count: 16 },
  { id: "p7", label: "Part 7", sub: "Reading Comprehension", count: 54 },
];

const generateFullToeicQuestions = (): QuestionItem[] => {
  const qs: QuestionItem[] = [];
  let index = 0;
  for (const part of defaultParts) {
    const isListening = part.id.match(/p[1-4]/);
    for (let i = 0; i < part.count; i++) {
      qs.push({
        id: `q${index}`,
        partId: part.id,
        skill: isListening ? "Listening" : "Reading",
        correctAnswer: ["A","B","C","D"][index % 4],
        text: `Nội dung câu hỏi ${index + 1} (${part.label})...`,
        options: { A: `Lựa chọn A câu ${index + 1}`, B: `Lựa chọn B câu ${index + 1}`, C: `Lựa chọn C câu ${index + 1}`, D: `Lựa chọn D câu ${index + 1}` },
      });
      index++;
    }
  }
  return qs;
};

export const mockDatabase = {
  students: [
    { id: 1, name: "Nguyễn Minh Anh", avatar: "MA", targetScore: 750 },
    { id: 2, name: "Trần Quốc Bảo", avatar: "QB", targetScore: 700 },
    { id: 3, name: "Lê Thị Cẩm", avatar: "TC", targetScore: 150 },
    { id: 4, name: "Phạm Hoàng Dũng", avatar: "HD", targetScore: 750 },
    { id: 5, name: "Vũ Thanh Hằng", avatar: "TH", targetScore: 500 },
    { id: 6, name: "Đặng Quỳnh Như", avatar: "QN", targetScore: 120 },
    { id: 7, name: "Bùi Văn Khoa", avatar: "VK", targetScore: 800 },
    { id: 8, name: "Ngô Thị Lan", avatar: "TL", targetScore: 700 },
    { id: 9, name: "Lý Gia Hân", avatar: "GH", targetScore: 650 },
    { id: 10, name: "Hoàng Tấn Phát", avatar: "TP", targetScore: 900 },
    { id: 11, name: "Võ Thị Yến", avatar: "TY", targetScore: 450 },
    { id: 12, name: "Đỗ Gia Bảo", avatar: "GB", targetScore: 550 },
    { id: 13, name: "Mai Thảo Vân", avatar: "TV", targetScore: 850 },
  ] as StudentItem[],
  
  tests: [
    { id: "ETS-2024-01", ten: "ETS 2024 Full Test 1", soCau: 200, trangThai: "Xuất bản", ngayTao: "10/01/2024", parts: defaultParts, questions: generateFullToeicQuestions() },
    { id: "ETS-2024-02", ten: "ETS 2024 Full Test 2", soCau: 200, trangThai: "Xuất bản", ngayTao: "15/02/2024", parts: defaultParts, questions: generateFullToeicQuestions() },
    { id: "HACKER-01", ten: "Hacker TOEIC Test 1", soCau: 200, trangThai: "Xuất bản", ngayTao: "20/02/2024", parts: defaultParts, questions: generateFullToeicQuestions() },
    { id: "HACKER-02", ten: "Hacker TOEIC Test 2", soCau: 200, trangThai: "Xuất bản", ngayTao: "21/02/2024", parts: defaultParts, questions: generateFullToeicQuestions() },
    { id: "HACKER-03", ten: "Hacker TOEIC Test 3", soCau: 200, trangThai: "Xuất bản", ngayTao: "22/02/2024", parts: defaultParts, questions: generateFullToeicQuestions() },
    { id: "ECONOMY-V1", ten: "Economy TOEIC Vol 1", soCau: 200, trangThai: "Xuất bản", ngayTao: "01/03/2024", parts: defaultParts, questions: generateFullToeicQuestions() },
    { id: "ECONOMY-V2", ten: "Economy TOEIC Vol 2", soCau: 200, trangThai: "Xuất bản", ngayTao: "02/03/2024", parts: defaultParts, questions: generateFullToeicQuestions() },
    { id: "ECONOMY-V3", ten: "Economy TOEIC Vol 3", soCau: 200, trangThai: "Xuất bản", ngayTao: "03/03/2024", parts: defaultParts, questions: generateFullToeicQuestions() },
    { id: "ECONOMY-V4", ten: "Economy TOEIC Vol 4", soCau: 200, trangThai: "Nháp", ngayTao: "04/03/2024", parts: defaultParts, questions: [] },
    { id: "ECONOMY-V5", ten: "Economy TOEIC Vol 5", soCau: 200, trangThai: "Nháp", ngayTao: "05/03/2024", parts: defaultParts, questions: [] },
    { id: "WRITING-01", ten: "Bài kiểm tra Viết (Writing) T6", soCau: 1, trangThai: "Xuất bản", ngayTao: "05/03/2024", parts: [{ id: "p-write", label: "Essay", sub: "Writing Task", count: 1 }], questions: [{ id: "q1", partId: "p-write", skill: "Writing", text: "Write an essay about technology." }] },
    { id: "WRITING-02", ten: "Bài tập Viết tự do (Tháng 4)", soCau: 1, trangThai: "Xuất bản", ngayTao: "10/04/2024", parts: [{ id: "p-write", label: "Email Response", sub: "Writing Task", count: 1 }], questions: [{ id: "q1", partId: "p-write", skill: "Writing", text: "Respond to the customer email regarding the shipping delay." }] },
  ],

  submissions: [
    { id: "sub-1", studentId: 1, testId: "ETS-2024-01", testName: "ETS 2024 Full Test 1", skill: "TOEIC", status: "Chờ chấm", answers: Array.from({length: 200}, (_, i) => ["A","B","C","D"][i%4]) },
    { id: "sub-2", studentId: 2, testId: "ETS-2024-01", testName: "ETS 2024 Full Test 1", skill: "TOEIC", status: "Chờ chấm", answers: Array.from({length: 200}, (_, i) => ["A","B","C","D"][(i+1)%4]) },
    { id: "sub-3", studentId: 9, testId: "HACKER-01", testName: "Hacker TOEIC Test 1", skill: "TOEIC", status: "Chờ chấm", answers: Array.from({length: 200}, (_, i) => ["A","B","C","D"][Math.floor(Math.random()*4)]) },
    { id: "sub-4", studentId: 3, testId: "WRITING-01", testName: "Writing Task 2", skill: "Writing", status: "Chờ chấm", essayText: "I think that technology is very important in our life. It make everything easier and faster. But some people said it is bad for children. I disagree because children can learn many things from internet. For example they can watch educational videos and read articles. But their grammar might be bad." },
  ] as SubmissionItem[]
};

const initialClassData: ClassItem[] = [
  { id: "c1", name: "Lớp TOEIC 600+ Tối 2-4-6", schedule: "Tối Thứ 2, 4, 6 | 19:00 – 21:00", students: 24, maxStudents: 30, progress: 65, totalLessons: 40, completedLessons: 26, level: "Trung cấp", levelColor: "#F59E0B", levelBg: "#FEF3C7" },
  { id: "c2", name: "Lớp TOEIC 750+ Sáng Thứ 7", schedule: "Sáng Thứ 7 | 08:00 – 11:30", students: 18, maxStudents: 25, progress: 40, totalLessons: 50, completedLessons: 20, level: "Nâng cao", levelColor: "#8B5CF6", levelBg: "#EDE9FE" },
  { id: "c3", name: "Lớp TOEIC Mới Bắt Đầu", schedule: "Tối Thứ 3, 5 | 18:30 – 20:30", students: 30, maxStudents: 30, progress: 20, totalLessons: 36, completedLessons: 7, level: "Cơ bản", levelColor: "#10B981", levelBg: "#D1FAE5" },
];

function LoginScreen({ onLogin, lang }: { onLogin: () => void, lang: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isEn = lang === "en";

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <BackToHome /><ZaloButton />
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-2xl font-bold text-white">AT</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{isEn ? "Welcome Back" : "Chào mừng trở lại"}</h2>
          <p className="text-sm text-slate-500 mt-2">{isEn ? "Sign in to Actor Teacher" : "Đăng nhập vào hệ thống Actor Teacher"}</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{isEn ? "Email Address" : "Địa chỉ Email"}</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="teacher@actorteacher.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{isEn ? "Password" : "Mật khẩu"}</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700" 
            />
          </div>
          <button 
            onClick={onLogin}
            className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {isEn ? "Sign In" : "Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const initialSession = getSession("giao-vien");
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialSession);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [activeScreen, setActiveScreen] = useState<Screen>("tongquan");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [tests, setTests] = useState<TestItem[]>(mockDatabase.tests as TestItem[]);
  const [classes, setClasses] = useState<ClassItem[]>(initialClassData);
  const [editingTest, setEditingTest] = useState<TestItem | null>(null);

  // Global Settings State
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Global Profile State (lấy tên/email từ tài khoản đăng nhập nếu có)
  const [profile, setProfile] = useState({
    name: initialSession?.name || "Người Tạo",
    email: initialSession?.email || "teacher@actorteacher.com",
    phone: "0123 456 789"
  });

  // Global Submissions State
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(mockDatabase.submissions);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handlePublishTest = (newTest: TestItem) => {
    setTests((prev) => {
      const exists = prev.find((t) => t.id === newTest.id);
      if (exists) return prev.map((t) => t.id === newTest.id ? newTest : t);
      return [newTest, ...prev];
    });
    // Khi đề được XUẤT BẢN → đẩy vào kho chung để Học sinh thấy ở "Bài được giao".
    if (newTest.trangThai === "Xuất bản") {
      addAssignment({
        id: newTest.id,
        title: newTest.ten,
        type: newTest.soCau <= 1 ? "Writing" : "TOEIC",
        questionCount: newTest.soCau,
        status: "Đã giao",
        createdAt: Date.now(),
        by: profile.name,
      });
    }
    setActiveScreen("quanlydeti");
    showToast(lang === "en" ? "Test saved successfully!" : "Đã lưu đề thi thành công!");
  };

  const navigateToScreen = (screen: Screen) => {
    if (screen === "soanthaode") {
      setEditingTest(null);
    }
    setActiveScreen(screen);
  };

  if (!isLoggedIn) {
    return <Auth onAuthed={(a) => { setIsLoggedIn(true); setProfile((p) => ({ ...p, name: a.name, email: a.email })); }} />;
  }

  return (
    <>
      <style>{`
        ${isDarkMode ? `
          .theme-wrapper {
            filter: invert(1) hue-rotate(180deg);
            background: #000;
            min-height: 100vh;
          }
          .theme-wrapper img, .theme-wrapper video {
            filter: invert(1) hue-rotate(180deg);
          }
        ` : `
          .theme-wrapper {
            min-height: 100vh;
          }
        `}
      `}</style>
      
      <div className={`theme-wrapper theme-giao-vien flex relative`} style={{ background: "#F8FAFC", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <BackToHome /><ZaloButton />
        <Sidebar activeScreen={activeScreen} onNavigate={(id) => setActiveScreen(id as Screen)} lang={lang} />

        <div className="flex flex-col flex-1 min-w-0">
          <Topbar 
            activeScreen={activeScreen} 
            showToast={showToast} 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode}
            profile={profile}
            setProfile={setProfile}
            onNavigate={navigateToScreen}
            onLogout={() => { clearSession("giao-vien"); setIsLoggedIn(false); }}
            lang={lang}
            setLang={setLang as any}
          />
          <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#CBD5E1 transparent" }}>
            {activeScreen === "tongquan" && <ScreenTongQuan lang={lang} />}
            {activeScreen === "quanlylophoc" && (
              <ScreenQuanLyLopHoc classes={classes} setClasses={setClasses} showToast={showToast} lang={lang} />
            )}
            {activeScreen === "quanlydeti" && (
              <ScreenQuanLyDeThi
                tests={tests}
                setTests={setTests}
                onNavigate={navigateToScreen}
                onEditTest={(test) => { setEditingTest(test); setActiveScreen("soanthaode"); }}
                showToast={showToast}
                lang={lang}
              />
            )}
            {activeScreen === "soanthaode" && (
              <ScreenSoanThaoDe
                showToast={showToast}
                editingTest={editingTest}
                onPublish={handlePublishTest}
                onBack={() => { setEditingTest(null); setActiveScreen("quanlydeti"); }}
                lang={lang}
              />
            )}
            {activeScreen === "chamdiemhocvien" && (
              <ScreenChamDiem 
                showToast={showToast} 
                submissions={submissions}
                setSubmissions={setSubmissions}
                students={mockDatabase.students}
                tests={tests}
                lang={lang}
              />
            )}
          </main>
        </div>

        {toastMessage && (
          <div style={{ position: "fixed", bottom: 24, right: 24, background: "#10B981", color: "#fff", padding: "12px 24px", borderRadius: 8, fontWeight: 500, fontSize: 14, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", zIndex: 9999 }}>
            {toastMessage}
          </div>
        )}
      </div>
    </>
  );
}