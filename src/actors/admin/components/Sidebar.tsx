import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileSearch,
  BookOpen,
  CreditCard,
  Settings,
  GraduationCap,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import type { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  teacherBadge?: number;
  onLogout?: () => void;
}

const menuItems: { id: Page; label: string; icon: React.ComponentType<{ className?: string; size?: number }> }[] = [
  { id: 'overview',  label: 'Tổng quan',              icon: LayoutDashboard },
  { id: 'users',     label: 'Quản lý người dùng',      icon: Users },
  { id: 'teachers',  label: 'Duyệt Giáo viên',         icon: GraduationCap },
  { id: 'roles',     label: 'Phân quyền & Vai trò',    icon: ShieldCheck },
  { id: 'content',   label: 'Duyệt nội dung',          icon: FileSearch },
  { id: 'courses',   label: 'Khóa học & Đề thi',       icon: BookOpen },
  { id: 'payments',  label: 'Quản lý thanh toán',       icon: CreditCard },
  { id: 'settings',  label: 'Cài đặt',                  icon: Settings },
];

export function Sidebar({ currentPage, onNavigate, teacherBadge = 0, onLogout }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-30"
      style={{ width: 240, background: 'linear-gradient(180deg,#4F46E5 0%,#5B3FE0 55%,#7C3AED 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <GraduationCap size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight" style={{ letterSpacing: '-0.01em' }}>TOEIC Admin</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>Quản trị hệ thống</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Menu chính
        </p>
        {menuItems.map(item => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="adm-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm group"
              style={{
                background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon
                size={17}
                style={{ color: active ? '#fff' : 'rgba(255,255,255,0.5)', flexShrink: 0 }}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'teachers' && teacherBadge > 0 && (
                <span style={{ background: '#F59E0B', color: '#fff', fontSize: 10.5, fontWeight: 800, borderRadius: 999, padding: '1px 7px', minWidth: 18, textAlign: 'center' }}>
                  {teacherBadge}
                </span>
              )}
              {active && <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.5)' }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom profile */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.25)' }}>
            <span className="text-white text-xs font-bold">SA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">Admin</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>admin@toeic.vn</p>
          </div>
          <button onClick={onLogout} title="Đăng xuất" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', flexShrink: 0, display: 'flex' }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
