import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { AdminLogin } from './components/AdminLogin';
import { Overview } from './components/pages/Overview';
import { UserManagement } from './components/pages/UserManagement';
import { RolePermission } from './components/pages/RolePermission';
import { ContentReview } from './components/pages/ContentReview';
import { CourseManagement } from './components/pages/CourseManagement';
import { PaymentManagement } from './components/pages/PaymentManagement';
import { TeacherApproval } from './components/pages/TeacherApproval';
import { Settings } from './components/pages/Settings';
import BackToHome from '../../components/BackToHome';
import {
  initialUsers,
  initialCourses,
  initialContent,
  initialPayments,
  initialPermissions,
} from './mockData';
import type { Page, User, Course, ContentItem, Payment, Permissions } from './types';
import {
  getTeacherApplications,
  setTeacherApplicationStatus,
  seedTeacherApplicationsIfEmpty,
  getContentSubmissions,
  setContentSubmissionStatus,
  getAccounts,
  setAccountStatus,
  deleteAccount,
  updateAccount,
  seedAccountsIfEmpty,
  getAdminAuthed,
  setAdminAuthed,
  getPurchases,
  setPurchaseStatus,
  ROLE_LABEL,
  subscribeStore,
  type TeacherApplication,
  type ContentSubmission,
  type Account,
  type Purchase,
} from './lib/classroomStore';

const PUR_PREFIX = 'pur:';

/** Giao dịch chuyển khoản (Học sinh mua) → mục Thanh toán của Admin. */
function purchaseToPayment(p: Purchase): Payment {
  return {
    id: PUR_PREFIX + p.id,
    userName: p.buyerName,
    userEmail: p.buyerEmail,
    courseName: `${p.item} (${p.method})`,
    amount: p.amount,
    status: p.status,
    date: new Date(p.createdAt).toLocaleDateString('vi-VN'),
  };
}

const ACC_PREFIX = 'acc-';

const CS_PREFIX = 'cs:';

/** Nội dung Biên soạn gửi duyệt (kho chung) → mục "Duyệt nội dung" của Admin. */
function submissionToContent(s: ContentSubmission): ContentItem {
  return {
    id: CS_PREFIX + s.id,
    title: s.title,
    type: s.type,
    author: s.author || 'Biên soạn',
    status: s.status,
    submittedAt: new Date(s.createdAt).toLocaleDateString('vi-VN'),
    description: `${s.description || ''}${s.price ? ` · Giá bán ${s.price.toLocaleString('vi-VN')}đ` : ''} — duyệt để xuất bản/bán.`,
  };
}

let userIdCounter = 100;
let courseIdCounter = 100;

function generateAvatar(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(getAdminAuthed());
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [users, setUsers] = useState(initialUsers);
  const [courses, setCourses] = useState(initialCourses);
  const [content, setContent] = useState(initialContent);
  const [payments] = useState(initialPayments);
  const [permissions, setPermissions] = useState<Permissions>(initialPermissions);

  // Kho chung — đơn Giáo viên + nội dung Biên soạn gửi duyệt (realtime).
  const [teacherApps, setTeacherApps] = useState<TeacherApplication[]>([]);
  const [contentSubs, setContentSubs] = useState<ContentSubmission[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  useEffect(() => {
    seedTeacherApplicationsIfEmpty();
    seedAccountsIfEmpty();
    const refresh = () => {
      setTeacherApps(getTeacherApplications());
      setContentSubs(getContentSubmissions());
      setAccounts(getAccounts());
      setPurchases(getPurchases());
    };
    refresh();
    const unsub = subscribeStore(refresh);
    const poll = setInterval(refresh, 2000);
    return () => {
      unsub();
      clearInterval(poll);
    };
  }, []);

  // Gộp nội dung Biên soạn gửi + nội dung mock của admin.
  const mergedContent: ContentItem[] = [...contentSubs.map(submissionToContent), ...content];

  // Tài khoản thật (đăng ký/seed) → hiển thị đầu danh sách Người dùng.
  const accountUsers: User[] = accounts.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    role: ROLE_LABEL[a.role] as User['role'],
    status: a.status,
    createdAt: new Date(a.createdAt).toISOString().split('T')[0],
    avatar: generateAvatar(a.name),
  }));
  const mergedUsers: User[] = [...accountUsers, ...users];

  // Giao dịch chuyển khoản (Học sinh) + thanh toán mock.
  const mergedPayments: Payment[] = [...purchases.map(purchaseToPayment), ...payments];
  function handleConfirmPayment(id: string) {
    if (id.startsWith(PUR_PREFIX)) setPurchaseStatus(id.slice(PUR_PREFIX.length), 'success');
  }

  // User CRUD
  function handleAddUser(data: Omit<User, 'id' | 'createdAt' | 'avatar'>) {
    const newUser: User = {
      ...data,
      id: String(++userIdCounter),
      createdAt: new Date().toISOString().split('T')[0],
      avatar: generateAvatar(data.name),
    };
    setUsers(prev => [newUser, ...prev]);
  }

  function handleEditUser(updated: User) {
    if (updated.id.startsWith(ACC_PREFIX)) {
      updateAccount(updated.id, { name: updated.name, email: updated.email, status: updated.status });
      return;
    }
    setUsers(prev => prev.map(u => u.id === updated.id ? { ...updated, avatar: generateAvatar(updated.name) } : u));
  }

  function handleDeleteUser(id: string) {
    if (id.startsWith(ACC_PREFIX)) { deleteAccount(id); return; }
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  function handleToggleUserStatus(id: string) {
    if (id.startsWith(ACC_PREFIX)) {
      const a = accounts.find(x => x.id === id);
      setAccountStatus(id, a?.status === 'active' ? 'locked' : 'active');
      return;
    }
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'locked' : 'active' } : u
    ));
  }

  // Course CRUD
  function handleAddCourse(data: Omit<Course, 'id' | 'createdAt'>) {
    const newCourse: Course = {
      ...data,
      id: String(++courseIdCounter),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCourses(prev => [newCourse, ...prev]);
  }

  function handleEditCourse(updated: Course) {
    setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
  }

  function handleDeleteCourse(id: string) {
    setCourses(prev => prev.filter(c => c.id !== id));
  }

  // Content review — id 'cs:' là nội dung Biên soạn gửi (ghi ngược kho chung), còn lại là mock admin.
  function handleApproveContent(id: string) {
    if (id.startsWith(CS_PREFIX)) {
      setContentSubmissionStatus(id.slice(CS_PREFIX.length), 'approved');
      return;
    }
    setContent(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' as const } : c));
  }
  function handleRejectContent(id: string) {
    if (id.startsWith(CS_PREFIX)) {
      setContentSubmissionStatus(id.slice(CS_PREFIX.length), 'rejected');
      return;
    }
    setContent(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' as const } : c));
  }

  // Duyệt đơn Giáo viên: duyệt → thêm vào danh sách user với vai trò Giáo viên.
  function handleApproveTeacher(app: TeacherApplication) {
    setTeacherApplicationStatus(app.id, 'approved');
    handleAddUser({ name: app.name, email: app.email, role: 'Giáo viên', status: 'active' });
  }
  function handleRejectTeacher(id: string) {
    setTeacherApplicationStatus(id, 'rejected');
  }

  const pendingTeachers = teacherApps.filter(a => a.status === 'pending').length;

  if (!authed) {
    return <AdminLogin onLogin={() => { setAuthed(true); setAdminAuthed(true); }} />;
  }

  return (
    <div className="theme-admin min-h-screen" style={{ background: '#F8FAFC', fontFamily: "'Inter', 'system-ui', sans-serif" }}>
      <BackToHome />
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} teacherBadge={pendingTeachers} onLogout={() => { setAdminAuthed(false); setAuthed(false); }} />
      <Topbar currentPage={currentPage} />

      <main className="pt-16 min-h-screen" style={{ marginLeft: 240 }}>
        <div className="p-6 adm-page" key={currentPage}>
          {currentPage === 'overview' && (
            <Overview users={mergedUsers} courses={courses} payments={payments} />
          )}
          {currentPage === 'users' && (
            <UserManagement
              users={mergedUsers}
              onAdd={handleAddUser}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onToggleStatus={handleToggleUserStatus}
            />
          )}
          {currentPage === 'teachers' && (
            <TeacherApproval
              applications={teacherApps}
              onApprove={handleApproveTeacher}
              onReject={handleRejectTeacher}
            />
          )}
          {currentPage === 'roles' && (
            <RolePermission permissions={permissions} onSave={setPermissions} />
          )}
          {currentPage === 'content' && (
            <ContentReview
              content={mergedContent}
              onApprove={handleApproveContent}
              onReject={handleRejectContent}
            />
          )}
          {currentPage === 'courses' && (
            <CourseManagement
              courses={courses}
              onAdd={handleAddCourse}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          )}
          {currentPage === 'payments' && (
            <PaymentManagement payments={mergedPayments} onConfirm={handleConfirmPayment} />
          )}
          {currentPage === 'settings' && (
            <Settings />
          )}
        </div>
      </main>
    </div>
  );
}
