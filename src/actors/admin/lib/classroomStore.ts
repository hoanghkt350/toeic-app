/**
 * Kho dữ liệu lớp học DÙNG CHUNG giữa các actor qua localStorage (cùng key).
 * Self-contained: copy y hệt vào mỗi actor để vẫn chạy độc lập khi đẩy lên Figma.
 * Trong app gộp (cùng origin) → các actor đọc/ghi chung 1 localStorage = nối thật.
 */

export interface Assignment {
  id: string;
  title: string;
  type: string; // "Reading" | "Listening" | "Writing" ...
  questionCount?: number;
  status?: string;
  createdAt: number;
  by?: string;
}

export interface AttendanceSession {
  code: string;
  className: string;
  classId: string;
  startedAt: number;
  expiresAt: number;
}

export interface AttendanceRecord {
  code: string;
  studentName: string;
  at: number;
}

export interface TeacherApplication {
  id: string;
  name: string;
  email: string;
  certName?: string; // tên file chứng chỉ
  certImage?: string; // ảnh chứng chỉ (data URL) để Admin xem
  note?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
}

const K_ASSIGN = "toeic:assignments";
const K_SESSION = "toeic:attendanceSession";
const K_RECORDS = "toeic:attendanceRecords";
const K_TEACHER_APPS = "toeic:teacherApplications";
const EVENT = "toeic-store-change";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* noop */
  }
}

/* ---------- Bài tập / Đề thi GV giao cho HS ---------- */
export function getAssignments(): Assignment[] {
  return read<Assignment[]>(K_ASSIGN, []);
}
export function addAssignment(a: Assignment) {
  const list = getAssignments();
  write(K_ASSIGN, [a, ...list.filter((x) => x.id !== a.id)]);
}

/* ---------- Phiên điểm danh ---------- */
export function getAttendanceSession(): AttendanceSession | null {
  const s = read<AttendanceSession | null>(K_SESSION, null);
  if (s && s.expiresAt < Date.now()) return null;
  return s;
}
export function startAttendanceSession(s: AttendanceSession) {
  write(K_SESSION, s);
  const records = read<AttendanceRecord[]>(K_RECORDS, []).filter((r) => r.code !== s.code);
  write(K_RECORDS, records);
}
export function clearAttendanceSession() {
  write(K_SESSION, null);
}

/* ---------- Bản ghi điểm danh ---------- */
export function getAttendanceRecords(code?: string): AttendanceRecord[] {
  const all = read<AttendanceRecord[]>(K_RECORDS, []);
  return code ? all.filter((r) => r.code === code) : all;
}
export function addAttendanceRecord(r: AttendanceRecord): { ok: boolean; reason?: string } {
  const all = read<AttendanceRecord[]>(K_RECORDS, []);
  if (all.some((x) => x.code === r.code && x.studentName.toLowerCase() === r.studentName.toLowerCase())) {
    return { ok: false, reason: "duplicate" };
  }
  write(K_RECORDS, [...all, r]);
  return { ok: true };
}

export function checkAttendanceCode(input: string): {
  ok: boolean;
  reason?: "empty" | "no-session" | "wrong";
  session?: AttendanceSession;
} {
  const code = (input || "").replace(/[^0-9]/g, "").trim();
  if (!code) return { ok: false, reason: "empty" };
  const s = getAttendanceSession();
  if (!s) return { ok: false, reason: "no-session" };
  if (s.code !== code) return { ok: false, reason: "wrong" };
  return { ok: true, session: s };
}

/* ---------- Đơn đăng ký làm Giáo viên (kèm chứng chỉ) ---------- */
export function getTeacherApplications(): TeacherApplication[] {
  return read<TeacherApplication[]>(K_TEACHER_APPS, []);
}
export function addTeacherApplication(a: TeacherApplication) {
  const list = getTeacherApplications();
  write(K_TEACHER_APPS, [a, ...list.filter((x) => x.id !== a.id)]);
}
export function setTeacherApplicationStatus(id: string, status: "approved" | "rejected" | "pending") {
  const list = getTeacherApplications();
  write(
    K_TEACHER_APPS,
    list.map((a) => (a.id === id ? { ...a, status } : a))
  );
}
/** Seed vài đơn demo nếu kho đang rỗng (để Admin có dữ liệu duyệt khi demo). */
export function seedTeacherApplicationsIfEmpty() {
  if (getTeacherApplications().length > 0) return;
  const now = Date.now();
  write(K_TEACHER_APPS, [
    {
      id: "ta-demo-1",
      name: "Nguyễn Thị Hồng",
      email: "hong.nguyen@email.com",
      certName: "TESOL_Certificate.jpg",
      note: "Chứng chỉ TESOL + 5 năm dạy TOEIC.",
      status: "pending",
      createdAt: now - 3600_000,
    },
    {
      id: "ta-demo-2",
      name: "Trần Quốc Bảo",
      email: "bao.tran@email.com",
      certName: "IELTS_8.0.png",
      note: "IELTS 8.0, muốn dạy luyện nói.",
      status: "pending",
      createdAt: now - 7200_000,
    },
  ] as TeacherApplication[]);
}

/* ---------- Nội dung Biên soạn gửi Admin duyệt để xuất bản/bán ---------- */
export interface ContentSubmission {
  id: string;
  title: string;
  type: string; // "Bài thi" | "Khóa học" | "Từ vựng" | "Bài học"
  author: string;
  price?: number;
  description?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
}
const K_CONTENT = "toeic:contentSubmissions";

export function getContentSubmissions(): ContentSubmission[] {
  return read<ContentSubmission[]>(K_CONTENT, []);
}
export function addContentSubmission(s: ContentSubmission) {
  const list = getContentSubmissions();
  write(K_CONTENT, [s, ...list.filter((x) => x.id !== s.id)]);
}
export function setContentSubmissionStatus(id: string, status: "approved" | "rejected" | "pending") {
  const list = getContentSubmissions();
  write(K_CONTENT, list.map((s) => (s.id === id ? { ...s, status } : s)));
}

/* ---------- Tài khoản đăng nhập/đăng ký (dùng chung, Admin quản lý) ---------- */
export type AccountRole = "hoc-sinh" | "giao-vien" | "bien-soan";
export interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AccountRole;
  status: "active" | "locked";
  createdAt: number;
}
const K_ACCOUNTS = "toeic:accounts";

export const ROLE_LABEL: Record<AccountRole, string> = {
  "hoc-sinh": "Học viên",
  "giao-vien": "Giáo viên",
  "bien-soan": "Content Manager",
};

export function getAccounts(): Account[] {
  return read<Account[]>(K_ACCOUNTS, []);
}
/** Tạo tài khoản mới (đăng ký). Trả về lỗi nếu email đã tồn tại trong cùng vai trò. */
export function addAccount(a: Account): { ok: boolean; reason?: string } {
  const list = getAccounts();
  if (list.some((x) => x.role === a.role && x.email.toLowerCase() === a.email.toLowerCase())) {
    return { ok: false, reason: "exists" };
  }
  write(K_ACCOUNTS, [a, ...list]);
  return { ok: true };
}
/** Đăng nhập: khớp email + mật khẩu + vai trò. */
export function authenticate(email: string, password: string, role: AccountRole): { ok: boolean; reason?: string; account?: Account } {
  const acc = getAccounts().find((x) => x.role === role && x.email.toLowerCase() === email.trim().toLowerCase());
  if (!acc) return { ok: false, reason: "notfound" };
  if (acc.password !== password) return { ok: false, reason: "wrongpass" };
  if (acc.status === "locked") return { ok: false, reason: "locked" };
  return { ok: true, account: acc };
}
export function setAccountStatus(id: string, status: "active" | "locked") {
  write(K_ACCOUNTS, getAccounts().map((a) => (a.id === id ? { ...a, status } : a)));
}
export function deleteAccount(id: string) {
  write(K_ACCOUNTS, getAccounts().filter((a) => a.id !== id));
}
/** Seed 2 tài khoản demo cho mỗi actor (chỉ khi kho rỗng). */
export function seedAccountsIfEmpty() {
  if (getAccounts().length > 0) return;
  const t = Date.now();
  const mk = (id: string, name: string, email: string, role: AccountRole, i: number): Account => ({
    id, name, email, password: "123456", role, status: "active", createdAt: t - i * 86_400_000,
  });
  write(K_ACCOUNTS, [
    mk("acc-hs-1", "Nguyễn Minh", "hocsinh1@toeic.vn", "hoc-sinh", 1),
    mk("acc-hs-2", "Trần Thị Mai", "hocsinh2@toeic.vn", "hoc-sinh", 2),
    mk("acc-gv-1", "Lê Văn Khoa", "giaovien1@toeic.vn", "giao-vien", 3),
    mk("acc-gv-2", "Phạm Thu Hà", "giaovien2@toeic.vn", "giao-vien", 4),
    mk("acc-bs-1", "Hoàng Nam", "biensoan1@toeic.vn", "bien-soan", 5),
    mk("acc-bs-2", "Vũ Thị Lan", "biensoan2@toeic.vn", "bien-soan", 6),
  ]);
}

/** Cập nhật thông tin tài khoản (Admin sửa). */
export function updateAccount(id: string, patch: Partial<Account>) {
  write(K_ACCOUNTS, getAccounts().map((a) => (a.id === id ? { ...a, ...patch, id: a.id } : a)));
}

/* ---------- Phiên đăng nhập (nhớ khi refresh) ---------- */
const K_SESS = "toeic:session:";
export function getSession(role: AccountRole): Account | null {
  return read<Account | null>(K_SESS + role, null);
}
export function setSession(role: AccountRole, acc: Account) {
  write(K_SESS + role, acc);
}
export function clearSession(role: AccountRole) {
  write(K_SESS + role, null);
}

/* ---------- Phiên đăng nhập Admin ---------- */
export function getAdminAuthed(): boolean {
  try { return localStorage.getItem("toeic:adminAuthed") === "1"; } catch { return false; }
}
export function setAdminAuthed(v: boolean) {
  try { v ? localStorage.setItem("toeic:adminAuthed", "1") : localStorage.removeItem("toeic:adminAuthed"); } catch { /* noop */ }
}

/* ---------- Giao dịch thanh toán (chuyển khoản) — Admin xem ---------- */
export interface Purchase {
  id: string;
  buyerName: string;
  buyerEmail: string;
  item: string;
  amount: number;
  method: string; // "Chuyển khoản"
  status: "pending" | "success";
  createdAt: number;
}
const K_PURCHASES = "toeic:purchases";

export function getPurchases(): Purchase[] {
  return read<Purchase[]>(K_PURCHASES, []);
}
export function addPurchase(p: Purchase) {
  write(K_PURCHASES, [p, ...getPurchases().filter((x) => x.id !== p.id)]);
}
export function setPurchaseStatus(id: string, status: "pending" | "success") {
  write(K_PURCHASES, getPurchases().map((p) => (p.id === id ? { ...p, status } : p)));
}

/* ---------- Lắng nghe thay đổi (cùng tab + khác tab) ---------- */
export function subscribeStore(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
