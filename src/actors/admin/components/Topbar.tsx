import { Search, Bell, ChevronDown } from 'lucide-react';
import type { Page } from '../types';

interface TopbarProps {
  currentPage: Page;
}

const pageTitles: Record<Page, string> = {
  overview:  'Tổng quan',
  users:     'Quản lý người dùng',
  teachers:  'Duyệt Giáo viên',
  roles:     'Phân quyền & Vai trò',
  content:   'Duyệt nội dung',
  courses:   'Quản lý khóa học & Đề thi',
  payments:  'Quản lý thanh toán',
  settings:  'Cài đặt',
};

export function Topbar({ currentPage }: TopbarProps) {
  return (
    <header
      className="fixed top-0 right-0 flex items-center justify-between px-6 z-20"
      style={{ left: 240, height: 64, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #ECECF5', boxShadow: '0 2px 12px rgba(79,70,229,0.05)' }}
    >
      <div>
        <h1 className="text-gray-900" style={{ letterSpacing: '-0.02em', fontSize: 19, fontWeight: 800 }}>{pageTitles[currentPage]}</h1>
        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>TOEIC Learning Platform</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#CBD5E1' }} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-8 pr-4 py-2 text-sm rounded-lg outline-none transition-all"
            style={{ background: '#F8FAFC', border: '1px solid #E8ECF0', width: 220, color: '#1E293B' }}
          />
        </div>

        <button className="relative p-2 rounded-lg transition-colors hover:bg-gray-50" style={{ border: '1px solid #E8ECF0' }}>
          <Bell size={17} style={{ color: '#64748B' }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#4F46E5' }} />
        </button>

        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors" style={{ border: '1px solid #E8ECF0' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', boxShadow: '0 4px 10px rgba(79,70,229,0.3)' }}>
            <span className="text-white text-xs font-bold">SA</span>
          </div>
          <span className="text-sm font-semibold" style={{ color: '#374151' }}>Admin</span>
          <ChevronDown size={13} style={{ color: '#94A3B8' }} />
        </button>
      </div>
    </header>
  );
}
