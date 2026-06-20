import { useState } from 'react';
import { Users, BookOpen, FileText, TrendingUp, UserCheck, Clock, CreditCard, Activity } from 'lucide-react';
import { chartData } from '../../mockData';
import type { User, Course, Payment } from '../../types';

const CARD_SHADOW       = '0 1px 2px rgba(16,24,40,0.05), 0 10px 26px rgba(79,70,229,0.07)';
const CARD_SHADOW_HOVER = '0 8px 28px rgba(79,70,229,0.12)';
const RADIUS = 14;

interface OverviewProps { users: User[]; courses: Course[]; payments: Payment[] }

const activityIcons: Record<string, React.ReactNode> = {
  register: <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><UserCheck size={14} style={{ color: '#4F46E5' }} /></div>,
  payment:  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CreditCard size={14} style={{ color: '#16A34A' }} /></div>,
  content:  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FileText size={14} style={{ color: '#D97706' }} /></div>,
  exam:     <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Activity size={14} style={{ color: '#7C3AED' }} /></div>,
};

function StatCard({ label, value, change, iconGrad, iconEl, accent }: { label: string; value: string; change: string; iconGrad: string; iconEl: React.ReactNode; accent: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', overflow: 'hidden', background: '#fff', border: '1px solid #E8ECF0', borderRadius: 16, padding: '20px', boxShadow: hov ? CARD_SHADOW_HOVER : CARD_SHADOW, transition: 'box-shadow 0.22s, transform 0.22s', transform: hov ? 'translateY(-4px)' : 'none', cursor: 'default' }}
    >
      {/* dải gradient mảnh phía trên */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: accent }} />
      {/* vầng sáng góc khi hover */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 110, height: 110, borderRadius: '50%', background: accent, opacity: hov ? 0.1 : 0.05, transition: 'opacity .22s' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: iconGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 16px ${accent}33` }}>
          {iconEl}
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 999, background: '#F0FDF4', color: '#16A34A', display: 'inline-flex', alignItems: 'center', gap: 3 }}>▲ {change}</span>
      </div>
      <p style={{ position: 'relative', fontSize: 27, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>{value}</p>
      <p style={{ position: 'relative', fontSize: 12.5, color: '#94A3B8', marginTop: 3, fontWeight: 500 }}>{label}</p>
    </div>
  );
}

function AreaChartSVG({ data }: { data: { month: string; luotThi: number }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const W = 540, H = 200, PL = 50, PR = 16, PT = 12, PB = 32;
  const iW = W - PL - PR, iH = H - PT - PB;
  const maxVal = Math.max(...data.map(d => d.luotThi));
  const xs = data.map((_, i) => PL + (i / (data.length - 1)) * iW);
  const ys = data.map(d => PT + iH - (d.luotThi / (maxVal || 1)) * iH);
  const line = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const area = `${line} L${xs[xs.length - 1]},${PT + iH} L${xs[0]},${PT + iH} Z`;
  const yTicks = [0, 1000, 2000, 3000, 4000];
  return (
    <div style={{ position: 'relative', height: H, userSelect: 'none' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {yTicks.map((t, i) => {
          const cy = PT + iH - (t / (maxVal || 1)) * iH;
          return (
            <g key={i}>
              <line x1={PL} y1={cy} x2={W - PR} y2={cy} stroke="#F1F5F9" strokeWidth={1} />
              <text x={PL - 6} y={cy + 4} textAnchor="end" fontSize={9} fill="#CBD5E1">{t >= 1000 ? `${t / 1000}k` : t}</text>
            </g>
          );
        })}
        <path d={area} fill="#4F46E5" fillOpacity={0.07} />
        <path d={line} fill="none" stroke="#4F46E5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={i}>
            <text x={xs[i]} y={H - 6} textAnchor="middle" fontSize={10} fill="#CBD5E1">{d.month}</text>
            <circle cx={xs[i]} cy={ys[i]} r={14} fill="transparent" style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
            <circle cx={xs[i]} cy={ys[i]} r={hovered === i ? 5 : 3.5}
              fill={hovered === i ? '#4F46E5' : '#fff'} stroke="#4F46E5" strokeWidth={2}
              style={{ transition: 'r 0.15s', pointerEvents: 'none' }} />
            {hovered === i && (
              <g>
                <rect x={xs[i] - 42} y={ys[i] - 40} width={84} height={30} rx={7} fill="#1E293B" />
                <text x={xs[i]} y={ys[i] - 23} textAnchor="middle" fontSize={11} fill="#fff" fontWeight={700}>{d.luotThi.toLocaleString('vi-VN')}</text>
                <text x={xs[i]} y={ys[i] - 11} textAnchor="middle" fontSize={9} fill="#94A3B8">{d.month}</text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function BarChartSVG({ data }: { data: { name: string; count: number }[] }) {
  const [hov, setHov] = useState<number | null>(null);
  const W = 220, H = 200, PL = 12, PR = 12, PT = 12, PB = 32;
  const iW = W - PL - PR, iH = H - PT - PB;
  const maxVal = Math.max(...data.map(d => d.count), 1);
  const gap = iW / data.length;
  const barW = gap * 0.58;
  const cols = ['#4F46E5', '#7C3AED', '#0891B2', '#059669'];
  return (
    <div style={{ position: 'relative', height: H, userSelect: 'none' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {[0, 0.5, 1].map((t, i) => {
          const cy = PT + iH - t * iH;
          return <line key={i} x1={PL} y1={cy} x2={W - PR} y2={cy} stroke="#F1F5F9" strokeWidth={1} />;
        })}
        {data.map((d, i) => {
          const cx = PL + gap * i + gap / 2;
          const bh = (d.count / maxVal) * iH;
          const by = PT + iH - bh;
          return (
            <g key={i}>
              <rect x={cx - barW / 2} y={by} width={barW} height={Math.max(bh, 2)}
                fill={hov === i ? cols[i] : cols[i] + 'CC'} rx={4}
                style={{ cursor: 'pointer', transition: 'fill 0.15s' }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
              <text x={cx} y={H - 8} textAnchor="middle" fontSize={9} fill="#CBD5E1">{d.name}</text>
              {hov === i && <text x={cx} y={by - 5} textAnchor="middle" fontSize={10} fill={cols[i]} fontWeight={700}>{d.count}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function Overview({ users, courses, payments }: OverviewProps) {
  // Số liệu THẬT, tính trực tiếp từ dữ liệu Admin đang quản lý (tự cập nhật khi thêm/xoá).
  const totalStudents  = users.filter(u => u.role === 'Học viên').length;
  const totalTeachers  = users.filter(u => u.role === 'Giáo viên').length;
  const publishedCourses = courses.filter(c => c.status === 'published').length;
  const totalRevenue   = payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);

  const roleData = [
    { name: 'Khách',   count: users.filter(u => u.role === 'Khách').length },
    { name: 'Học viên',count: totalStudents },
    { name: 'GV',      count: totalTeachers },
    { name: 'CM',      count: users.filter(u => u.role === 'Content Manager').length },
  ];

  // Hoạt động gần đây = lấy từ dữ liệu thật (đăng ký mới + thanh toán), sắp theo thời gian.
  const recent = [
    ...users.map(u => ({ id: 'u' + u.id, type: 'register', user: u.name, action: `đăng ký tài khoản · ${u.role}`, time: u.createdAt })),
    ...payments.filter(p => p.status === 'success').map(p => ({ id: 'p' + p.id, type: 'payment', user: p.userName, action: `thanh toán "${p.courseName}"`, time: p.date })),
  ]
    .sort((a, b) => (a.time < b.time ? 1 : -1))
    .slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Banner chào mừng */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 18, padding: '22px 26px', background: 'linear-gradient(120deg,#4F46E5 0%,#7C3AED 55%,#2563EB 100%)', boxShadow: '0 14px 34px rgba(79,70,229,0.28)' }}>
        <div style={{ position: 'absolute', top: -50, right: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 90, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <p style={{ position: 'relative', color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Chào mừng trở lại, Admin</p>
        <p style={{ position: 'relative', color: 'rgba(255,255,255,0.82)', fontSize: 13.5, marginTop: 5 }}>Tổng quan hoạt động nền tảng luyện thi TOEIC hôm nay.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <StatCard label="Tổng học viên" value={totalStudents.toLocaleString('vi-VN')} change="+8%" accent="#4F46E5"
          iconGrad="linear-gradient(135deg,#EEF2FF,#E0E7FF)" iconEl={<Users size={20} style={{ color: '#4F46E5' }} />} />
        <StatCard label="Giáo viên" value={String(totalTeachers)} change="+3%" accent="#16A34A"
          iconGrad="linear-gradient(135deg,#F0FDF4,#DCFCE7)" iconEl={<UserCheck size={20} style={{ color: '#16A34A' }} />} />
        <StatCard label="Đề đã đăng" value={String(publishedCourses)} change="+12%" accent="#7C3AED"
          iconGrad="linear-gradient(135deg,#F5F3FF,#EDE9FE)" iconEl={<BookOpen size={20} style={{ color: '#7C3AED' }} />} />
        <StatCard label="Doanh thu" value={totalRevenue >= 1_000_000 ? `${(totalRevenue / 1_000_000).toFixed(1)}M ₫` : `${totalRevenue.toLocaleString('vi-VN')} ₫`} change="+23%" accent="#EA580C"
          iconGrad="linear-gradient(135deg,#FFF7ED,#FFEDD5)" iconEl={<TrendingUp size={20} style={{ color: '#EA580C' }} />} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, padding: 20, boxShadow: CARD_SHADOW }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 13, color: '#1E293B' }}>Lượt thi thử theo tháng</p>
              <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>7 tháng gần nhất · số liệu minh hoạ</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 14, height: 3, borderRadius: 2, background: '#4F46E5' }} />
              <span style={{ fontSize: 11, color: '#94A3B8' }}>Lượt thi</span>
            </div>
          </div>
          <AreaChartSVG data={chartData} />
        </div>

        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, padding: 20, boxShadow: CARD_SHADOW }}>
          <p style={{ fontWeight: 600, fontSize: 13, color: '#1E293B', marginBottom: 4 }}>Phân bố vai trò</p>
          <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 12 }}>Người dùng hiện tại</p>
          <BarChartSVG data={roleData} />
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontWeight: 600, fontSize: 13, color: '#1E293B' }}>Hoạt động gần đây</p>
          <button style={{ fontSize: 12, fontWeight: 500, color: '#4F46E5', background: 'none', border: 'none', cursor: 'pointer' }}>Xem tất cả</button>
        </div>
        {recent.map((act, i) => (
          <ActivityRow key={act.id} act={act} last={i === recent.length - 1} />
        ))}
      </div>
    </div>
  );
}

function ActivityRow({ act, last }: { act: { id: string | number; type: string; user: string; action: string; time: string }; last: boolean }) {
  const [hov, setHov] = useState(false);
  const icons: Record<string, React.ReactNode> = {
    register: <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><UserCheck size={14} style={{ color: '#4F46E5' }} /></div>,
    payment:  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CreditCard size={14} style={{ color: '#16A34A' }} /></div>,
    content:  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FileText size={14} style={{ color: '#D97706' }} /></div>,
    exam:     <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Activity size={14} style={{ color: '#7C3AED' }} /></div>,
  };
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: last ? 'none' : '1px solid #F8FAFC', background: hov ? '#F5F7FF' : 'transparent', transition: 'background 0.15s' }}>
      {icons[act.type]}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, color: '#475569' }}>
          <strong style={{ color: '#1E293B' }}>{act.user}</strong> {act.action}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        <Clock size={11} style={{ color: '#CBD5E1' }} />
        <span style={{ fontSize: 11, color: '#CBD5E1' }}>{act.time}</span>
      </div>
    </div>
  );
}
