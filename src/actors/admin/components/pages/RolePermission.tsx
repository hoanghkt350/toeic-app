import { useState } from 'react';
import { Save, ShieldCheck, Info, Check } from 'lucide-react';
import type { Permissions, PermissionKey, Role } from '../../types';

interface Props { permissions: Permissions; onSave: (p: Permissions) => void }

const ROLES: Role[] = ['Khách', 'Học viên', 'Giáo viên', 'Content Manager'];
const PERM_LABELS: Record<PermissionKey, { label: string; desc: string; icon: string }> = {
  viewLessons:   { label: 'Xem bài học',          desc: 'Truy cập nội dung bài học',              icon: '📖' },
  takeExams:     { label: 'Làm bài thi',           desc: 'Tham gia làm đề thi thử',               icon: '📝' },
  createExams:   { label: 'Tạo đề thi',            desc: 'Soạn thảo và tạo đề thi mới',           icon: '✏️' },
  gradeExams:    { label: 'Chấm bài',              desc: 'Chấm điểm và nhận xét bài làm',         icon: '✅' },
  reviewContent: { label: 'Duyệt nội dung',        desc: 'Phê duyệt hoặc từ chối nội dung',       icon: '🔍' },
  manageUsers:   { label: 'Quản lý người dùng',    desc: 'Xem, thêm, sửa, xóa tài khoản',        icon: '👥' },
};
const PERM_KEYS = Object.keys(PERM_LABELS) as PermissionKey[];

const ROLE_STYLE: Record<Role, { bg: string; color: string; dot: string }> = {
  'Khách':           { bg: '#F8FAFC', color: '#64748B', dot: '#94A3B8' },
  'Học viên':        { bg: '#EEF2FF', color: '#4F46E5', dot: '#818CF8' },
  'Giáo viên':       { bg: '#F5F3FF', color: '#7C3AED', dot: '#A78BFA' },
  'Content Manager': { bg: '#FFF7ED', color: '#EA580C', dot: '#FB923C' },
};

const CARD_SHADOW = '0 1px 2px rgba(16,24,40,0.05), 0 10px 26px rgba(79,70,229,0.07)';
const RADIUS = 14;

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      style={{ width: 40, height: 22, borderRadius: 11, background: checked ? '#4F46E5' : '#E2E8F0', position: 'relative', transition: 'background 0.2s', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 2, left: checked ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
    </button>
  );
}

function PillBadge({ bg, color, dot, children }: { bg: string; color: string; dot: string; children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: bg, color, fontSize: 12, fontWeight: 500 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      {children}
    </span>
  );
}

export function RolePermission({ permissions, onSave }: Props) {
  const [local, setLocal] = useState<Permissions>(() => JSON.parse(JSON.stringify(permissions)));
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  function toggle(role: Role, key: PermissionKey) {
    setLocal(prev => ({ ...prev, [role]: { ...prev[role], [key]: !prev[role][key] } }));
    setDirty(true); setSaved(false);
  }

  function handleSave() { onSave(local); setSaved(true); setDirty(false); setTimeout(() => setSaved(false), 2500); }

  const totalEnabled = ROLES.reduce((s, r) => s + PERM_KEYS.filter(k => local[r]?.[k]).length, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={19} style={{ color: '#4F46E5' }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13, color: '#1E293B' }}>Ma trận phân quyền</p>
            <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Đang bật {totalEnabled} / {ROLES.length * PERM_KEYS.length} quyền</p>
          </div>
        </div>
        <SaveBtn saved={saved} dirty={dirty} onClick={handleSave} />
      </div>

      {/* Info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderRadius: RADIUS, background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
        <Info size={14} style={{ color: '#4F46E5', flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: '#4338CA' }}>Bấm toggle để thay đổi. Nhớ bấm <strong>Lưu phân quyền</strong> để áp dụng.</p>
      </div>

      {/* Matrix */}
      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E8ECF0' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8', width: 300 }}>Quyền hạn</th>
                {ROLES.map(role => {
                  const st = ROLE_STYLE[role];
                  const cnt = PERM_KEYS.filter(k => local[role]?.[k]).length;
                  return (
                    <th key={role} style={{ textAlign: 'center', padding: '14px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <PillBadge bg={st.bg} color={st.color} dot={st.dot}>{role}</PillBadge>
                        <span style={{ fontSize: 10, color: '#CBD5E1' }}>{cnt}/{PERM_KEYS.length}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {PERM_KEYS.map((key, idx) => (
                <MatrixRow key={key} idx={idx} last={idx === PERM_KEYS.length - 1} label={PERM_LABELS[key].label} desc={PERM_LABELS[key].desc} icon={PERM_LABELS[key].icon}>
                  {ROLES.map(role => {
                    const on = local[role]?.[key] ?? false;
                    return (
                      <td key={role} style={{ textAlign: 'center', padding: '14px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                          <Toggle checked={on} onChange={() => toggle(role, key)} />
                          <span style={{ fontSize: 11, fontWeight: 500, color: on ? '#4F46E5' : '#CBD5E1' }}>{on ? 'Bật' : 'Tắt'}</span>
                        </div>
                      </td>
                    );
                  })}
                </MatrixRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {ROLES.map(role => {
          const st = ROLE_STYLE[role];
          const cnt = PERM_KEYS.filter(k => local[role]?.[k]).length;
          return (
            <div key={role} style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, padding: '16px', boxShadow: CARD_SHADOW }}>
              <PillBadge bg={st.bg} color={st.color} dot={st.dot}>{role}</PillBadge>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#1E293B', letterSpacing: '-0.03em', marginTop: 12 }}>{cnt}</p>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8 }}>/ {PERM_KEYS.length} quyền</p>
              <div style={{ height: 6, borderRadius: 3, background: '#F1F5F9' }}>
                <div style={{ height: 6, borderRadius: 3, background: st.color, width: `${(cnt / PERM_KEYS.length) * 100}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MatrixRow({ idx, last, label, desc, icon, children }: { idx: number; last: boolean; label: string; desc: string; icon: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: last ? 'none' : '1px solid #F8FAFC', background: hov ? '#F5F7FF' : idx % 2 === 1 ? '#FAFBFF' : 'transparent', transition: 'background 0.15s' }}>
      <td style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{label}</p>
            <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{desc}</p>
          </div>
        </div>
      </td>
      {children}
    </tr>
  );
}

function SaveBtn({ saved, dirty, onClick }: { saved: boolean; dirty: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const bg = saved ? '#16A34A' : dirty ? '#4F46E5' : '#94A3B8';
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, border: 'none', background: hov ? (saved ? '#15803D' : dirty ? '#4338CA' : '#64748B') : bg, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s' }}>
      {saved ? <Check size={14} /> : <Save size={14} />}
      {saved ? 'Đã lưu!' : 'Lưu phân quyền'}
    </button>
  );
}
