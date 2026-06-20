import { useState } from 'react';
import { Search, TrendingUp, DollarSign, CheckCircle2, XCircle, Clock, CreditCard, Filter } from 'lucide-react';
import type { Payment } from '../../types';

interface Props { payments: Payment[]; onConfirm?: (id: string) => void }

const CARD_SHADOW = '0 1px 2px rgba(16,24,40,0.05), 0 10px 26px rgba(79,70,229,0.07)';
const RADIUS = 14;

const STATUS = {
  success: { label: 'Thành công', bg: '#F0FDF4', color: '#16A34A', dot: '#22C55E', icon: CheckCircle2 },
  pending: { label: 'Đang xử lý', bg: '#FFFBEB', color: '#D97706', dot: '#F59E0B', icon: Clock },
  failed:  { label: 'Thất bại',   bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444', icon: XCircle },
};

function fmt(n: number) { return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n); }

function PillBadge({ bg, color, dot, children }: { bg: string; color: string; dot: string; children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: bg, color, fontSize: 12, fontWeight: 500 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function StatCard({ label, value, iconGrad, iconEl }: { label: string; value: string; iconGrad: string; iconEl: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, padding: '16px 20px', boxShadow: hov ? '0 8px 24px rgba(79,70,229,0.10)' : CARD_SHADOW, transition: 'box-shadow 0.2s, transform 0.2s', transform: hov ? 'translateY(-2px)' : 'none', cursor: 'default' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{iconEl}</div>
        <CreditCard size={13} style={{ color: '#E2E8F0' }} />
      </div>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', letterSpacing: '-0.02em' }}>{value}</p>
      <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{label}</p>
    </div>
  );
}

function TableRow({ children, last }: { children: React.ReactNode; last: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: last ? 'none' : '1px solid #F8FAFC', background: hov ? '#F5F7FF' : 'transparent', transition: 'background 0.15s' }}>
      {children}
    </tr>
  );
}

export function PaymentManagement({ payments, onConfirm }: Props) {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    return (p.userName.toLowerCase().includes(q) || p.userEmail.toLowerCase().includes(q) || p.courseName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
      && (filter === 'all' || p.status === filter);
  });

  const revenue      = payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0) + 143_150_000;
  const successCount = payments.filter(p => p.status === 'success').length + 215;
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const failedCount  = payments.filter(p => p.status === 'failed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <StatCard label="Tổng doanh thu"         value={fmt(revenue)}
          iconGrad="linear-gradient(135deg,#EEF2FF,#E0E7FF)" iconEl={<DollarSign size={16} style={{ color: '#4F46E5' }} />} />
        <StatCard label="Giao dịch thành công"   value={String(successCount)}
          iconGrad="linear-gradient(135deg,#F0FDF4,#DCFCE7)" iconEl={<CheckCircle2 size={16} style={{ color: '#16A34A' }} />} />
        <StatCard label="Đang xử lý"             value={String(pendingCount)}
          iconGrad="linear-gradient(135deg,#FFFBEB,#FEF3C7)" iconEl={<Clock size={16} style={{ color: '#D97706' }} />} />
        <StatCard label="Thất bại"               value={String(failedCount)}
          iconGrad="linear-gradient(135deg,#FEF2F2,#FEE2E2)" iconEl={<XCircle size={16} style={{ color: '#DC2626' }} />} />
      </div>

      {/* Revenue banner */}
      <div style={{ borderRadius: RADIUS, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginBottom: 4 }}>Doanh thu tháng này</p>
          <p style={{ color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>{fmt(revenue)}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.15)' }}>
          <TrendingUp size={14} style={{ color: '#fff' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>+23% so với tháng trước</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo người dùng, khóa học, mã GD..."
            style={{ width: '100%', paddingLeft: 36, paddingRight: 16, paddingTop: 8, paddingBottom: 8, fontSize: 13, borderRadius: 8, border: '1px solid #E8ECF0', background: '#F8FAFC', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={13} style={{ color: '#94A3B8' }} />
          {(['all', 'success', 'pending', 'failed'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${filter === s ? '#4F46E5' : '#E8ECF0'}`, background: filter === s ? '#4F46E5' : '#F8FAFC', color: filter === s ? '#fff' : '#64748B', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}>
              {s === 'all' ? 'Tất cả' : STATUS[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E8ECF0' }}>
              {['Mã GD', 'Người dùng', 'Khóa học / Đề thi', 'Số tiền', 'Trạng thái', 'Ngày'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '56px 0' }}>
                <TrendingUp size={32} style={{ color: '#E2E8F0', margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontSize: 13, color: '#CBD5E1' }}>Không tìm thấy giao dịch</p>
              </td></tr>
            ) : filtered.map((p, i) => {
              const st = STATUS[p.status];
              return (
                <TableRow key={p.id} last={i === filtered.length - 1}>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#F1F5F9', color: '#64748B' }}>{p.id}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{p.userName}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{p.userEmail}</p>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748B', maxWidth: 220 }}>
                    <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.courseName}</p>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{fmt(p.amount)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <PillBadge bg={st.bg} color={st.color} dot={st.dot}>{st.label}</PillBadge>
                      {p.status === 'pending' && onConfirm && (
                        <button onClick={() => onConfirm(p.id)}
                          style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999, border: 'none', background: '#16A34A', color: '#fff', cursor: 'pointer' }}>
                          Xác nhận
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#94A3B8' }}>{p.date}</td>
                </TableRow>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: '10px 20px', borderTop: '1px solid #F1F5F9' }}>
          <p style={{ fontSize: 12, color: '#CBD5E1' }}>Hiển thị {filtered.length} / {payments.length} giao dịch</p>
        </div>
      </div>
    </div>
  );
}
