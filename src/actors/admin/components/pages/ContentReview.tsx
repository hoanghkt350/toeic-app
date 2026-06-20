import { useState } from 'react';
import { Check, X, Eye, Clock, CheckCircle, XCircle, FileText, MessageSquare } from 'lucide-react';
import type { ContentItem, ContentStatus } from '../../types';

interface Props { content: ContentItem[]; onApprove: (id: string) => void; onReject: (id: string) => void }

const CARD_SHADOW = '0 1px 2px rgba(16,24,40,0.05), 0 10px 26px rgba(79,70,229,0.07)';
const RADIUS = 14;

const STATUS: Record<ContentStatus, { label: string; bg: string; color: string; dot: string }> = {
  pending:  { label: 'Chờ duyệt', bg: '#FFFBEB', color: '#D97706', dot: '#F59E0B' },
  approved: { label: 'Đã duyệt',  bg: '#F0FDF4', color: '#16A34A', dot: '#22C55E' },
  rejected: { label: 'Từ chối',   bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444' },
};
const TYPE_COLORS: Record<string, { bg: string; color: string; grad: string }> = {
  'Bài giảng': { bg: '#EEF2FF', color: '#4F46E5', grad: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)' },
  'Câu hỏi':   { bg: '#F5F3FF', color: '#7C3AED', grad: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)' },
  'Đề thi':    { bg: '#FFF7ED', color: '#EA580C', grad: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)' },
  'Audio':     { bg: '#F0FDFA', color: '#0D9488', grad: 'linear-gradient(135deg,#F0FDFA,#CCFBF1)' },
  'Flashcard': { bg: '#FDF4FF', color: '#A21CAF', grad: 'linear-gradient(135deg,#FDF4FF,#F5D0FE)' },
};

function PillBadge({ bg, color, dot, children }: { bg: string; color: string; dot: string; children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: bg, color, fontSize: 12, fontWeight: 500, flexShrink: 0 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      {children}
    </span>
  );
}

interface RejectModal { id: string; title: string; reason: string }

export function ContentReview({ content, onApprove, onReject }: Props) {
  const [filter, setFilter]           = useState<ContentStatus | 'all'>('all');
  const [rejectModal, setRejectModal] = useState<RejectModal | null>(null);
  const [preview, setPreview]         = useState<ContentItem | null>(null);

  const filtered = filter === 'all' ? content : content.filter(c => c.status === filter);
  const counts = { pending: content.filter(c => c.status === 'pending').length, approved: content.filter(c => c.status === 'approved').length, rejected: content.filter(c => c.status === 'rejected').length };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {(['pending', 'approved', 'rejected'] as ContentStatus[]).map(s => {
          const st = STATUS[s];
          const icons = { pending: Clock, approved: CheckCircle, rejected: XCircle };
          const Icon = icons[s];
          const grads = { pending: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', approved: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', rejected: 'linear-gradient(135deg,#FEF2F2,#FEE2E2)' };
          return (
            <StatCard key={s} onClick={() => setFilter(filter === s ? 'all' : s)} active={filter === s} dotColor={st.dot}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: grads[s], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color: st.color }} />
              </div>
              <div>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#1E293B', letterSpacing: '-0.03em' }}>{counts[s]}</p>
                <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{st.label}</p>
              </div>
            </StatCard>
          );
        })}
      </div>

      {/* List */}
      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontWeight: 600, fontSize: 13, color: '#1E293B' }}>
            Danh sách nội dung {filter !== 'all' && <span style={{ color: STATUS[filter].color }}>· {STATUS[filter].label}</span>}
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
              <button key={s} onClick={() => setFilter(s)}
                style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${filter === s ? '#4F46E5' : '#E8ECF0'}`, background: filter === s ? '#4F46E5' : '#F8FAFC', color: filter === s ? '#fff' : '#64748B', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}>
                {s === 'all' ? 'Tất cả' : STATUS[s].label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '56px 0', textAlign: 'center' }}>
            <FileText size={32} style={{ color: '#E2E8F0', margin: '0 auto 8px', display: 'block' }} />
            <p style={{ fontSize: 13, color: '#CBD5E1' }}>Không có nội dung nào</p>
          </div>
        ) : filtered.map((item, i) => (
          <ContentRow key={item.id} item={item} last={i === filtered.length - 1}
            onApprove={() => onApprove(item.id)}
            onRejectClick={() => setRejectModal({ id: item.id, title: item.title, reason: '' })}
            onPreview={() => setPreview(item)}
            onUndo={() => item.status === 'approved' ? setRejectModal({ id: item.id, title: item.title, reason: '' }) : onApprove(item.id)}
          />
        ))}
      </div>

      {/* Preview Modal */}
      {preview && (
        <Overlay onClose={() => setPreview(null)} title="Xem trước nội dung">
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <InfoRow label="Tiêu đề"><strong style={{ color: '#1E293B' }}>{preview.title}</strong></InfoRow>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <InfoRow label="Loại"><PillBadge bg={(TYPE_COLORS[preview.type] || { bg: '#F8FAFC', color: '#64748B' }).bg} color={(TYPE_COLORS[preview.type] || { bg: '#F8FAFC', color: '#64748B' }).color} dot={(TYPE_COLORS[preview.type] || { bg: '#F8FAFC', color: '#CBD5E1' }).bg}>{preview.type}</PillBadge></InfoRow>
              <InfoRow label="Trạng thái"><PillBadge bg={STATUS[preview.status].bg} color={STATUS[preview.status].color} dot={STATUS[preview.status].dot}>{STATUS[preview.status].label}</PillBadge></InfoRow>
              <InfoRow label="Tác giả"><span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{preview.author}</span></InfoRow>
              <InfoRow label="Ngày gửi"><span style={{ fontSize: 13, color: '#374151' }}>{preview.submittedAt}</span></InfoRow>
            </div>
            <InfoRow label="Mô tả">
              <div style={{ borderRadius: 8, padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E8ECF0', fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{preview.description}</div>
            </InfoRow>
          </div>
          {preview.status === 'pending' && (
            <div style={{ display: 'flex', gap: 12, padding: '0 24px 24px' }}>
              <ActionBtnLg bg="#EF4444" onClick={() => { setRejectModal({ id: preview.id, title: preview.title, reason: '' }); setPreview(null); }}>
                <X size={14} /> Từ chối
              </ActionBtnLg>
              <ActionBtnLg bg="#16A34A" onClick={() => { onApprove(preview.id); setPreview(null); }}>
                <Check size={14} /> Phê duyệt
              </ActionBtnLg>
            </div>
          )}
        </Overlay>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <Overlay onClose={() => setRejectModal(null)} title="Nhập lý do từ chối">
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: '12px 14px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 3 }}>Nội dung</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{rejectModal.title}</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Lý do <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <textarea rows={4} value={rejectModal.reason} onChange={e => setRejectModal(p => p ? { ...p, reason: e.target.value } : null)}
                placeholder="Nhập lý do để Content Manager có thể chỉnh sửa..."
                style={{ width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#1E293B', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, padding: '0 24px 24px' }}>
            <button onClick={() => setRejectModal(null)} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', background: '#F1F5F9', color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Hủy</button>
            <button disabled={!rejectModal.reason.trim()} onClick={() => { onReject(rejectModal.id); setRejectModal(null); }}
              style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', background: rejectModal.reason.trim() ? '#EF4444' : '#94A3B8', color: '#fff', fontSize: 13, fontWeight: 500, cursor: rejectModal.reason.trim() ? 'pointer' : 'not-allowed' }}>
              Xác nhận từ chối
            </button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function ContentRow({ item, last, onApprove, onRejectClick, onPreview, onUndo }: { item: ContentItem; last: boolean; onApprove: () => void; onRejectClick: () => void; onPreview: () => void; onUndo: () => void }) {
  const [hov, setHov] = useState(false);
  const st = STATUS[item.status];
  const tc = TYPE_COLORS[item.type] || { grad: 'linear-gradient(135deg,#F8FAFC,#F1F5F9)', color: '#64748B', bg: '#F8FAFC' };
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 20px', borderBottom: last ? 'none' : '1px solid #F8FAFC', background: hov ? '#F5F7FF' : 'transparent', transition: 'background 0.15s' }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: tc.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
        <FileText size={16} style={{ color: tc.color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{item.title}</p>
          <PillBadge bg={tc.bg} color={tc.color} dot={tc.color}>{item.type}</PillBadge>
        </div>
        <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#CBD5E1' }}>
          <span>Tác giả: <strong style={{ color: '#64748B' }}>{item.author}</strong></span>
          <span>Gửi: {item.submittedAt}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginTop: 2 }}>
        <PillBadge bg={st.bg} color={st.color} dot={st.dot}>{st.label}</PillBadge>
        <IconBtn onClick={onPreview} title="Xem trước" hoverBg="#EEF2FF" color="#4F46E5"><Eye size={14} /></IconBtn>
        {item.status === 'pending' && (
          <>
            <SmallBtn bg="#16A34A" onClick={onApprove}><Check size={12} /> Duyệt</SmallBtn>
            <SmallBtn bg="#EF4444" onClick={onRejectClick}><X size={12} /> Từ chối</SmallBtn>
          </>
        )}
        {item.status !== 'pending' && (
          <button onClick={onUndo} style={{ fontSize: 11, color: '#CBD5E1', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#64748B')} onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}>
            {item.status === 'approved' ? 'Hoàn tác' : 'Duyệt lại'}
          </button>
        )}
      </div>
    </div>
  );
}

function StatCard({ children, onClick, active, dotColor }: { children: React.ReactNode; onClick: () => void; active: boolean; dotColor: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', border: `1px solid ${active ? dotColor + '66' : '#E8ECF0'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', boxShadow: hov ? '0 8px 24px rgba(79,70,229,0.10)' : CARD_SHADOW, transition: 'box-shadow 0.2s, transform 0.2s', transform: hov ? 'translateY(-2px)' : 'none' }}>
      {children}
    </div>
  );
}

function IconBtn({ onClick, title, hoverBg, color, children }: { onClick: () => void; title: string; hoverBg: string; color: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} title={title} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', background: hov ? hoverBg : 'transparent', color, transition: 'background 0.15s' }}>
      {children}
    </button>
  );
}

function SmallBtn({ bg, onClick, children }: { bg: string; onClick: () => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 7, border: 'none', background: hov ? bg + 'EE' : bg, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'opacity 0.15s' }}>
      {children}
    </button>
  );
}

function ActionBtnLg({ bg, onClick, children }: { bg: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 0', borderRadius: 8, border: 'none', background: bg, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
      {children}
    </button>
  );
}

function Overlay({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: 500 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={14} style={{ color: '#4F46E5' }} />
            <p style={{ fontWeight: 600, fontSize: 14, color: '#1E293B' }}>{title}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#94A3B8' }}><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 500, color: '#94A3B8', marginBottom: 4 }}>{label}</p>
      {children}
    </div>
  );
}
