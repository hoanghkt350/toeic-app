import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Lock, Unlock, X, Users, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import type { User, Role, UserStatus } from '../../types';

interface Props {
  users: User[];
  onAdd: (u: Omit<User, 'id' | 'createdAt' | 'avatar'>) => void;
  onEdit: (u: User) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const ROLES: Role[] = ['Khách', 'Học viên', 'Giáo viên', 'Content Manager'];
const PAGE_SIZE = 8;

// Stable color palette by first character code
const AVATAR_PALETTE = [
  '#4F46E5', '#7C3AED', '#0891B2', '#059669',
  '#D97706', '#EA580C', '#E11D48', '#0284C7',
  '#6D28D9', '#0F766E', '#B45309', '#1D4ED8',
];
function avatarBg(name: string) {
  return AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];
}

const ROLE_BADGE: Record<Role, { bg: string; color: string; dot: string }> = {
  'Khách':           { bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' },
  'Học viên':        { bg: '#EEF2FF', color: '#4F46E5', dot: '#818CF8' },
  'Giáo viên':       { bg: '#F5F3FF', color: '#7C3AED', dot: '#A78BFA' },
  'Content Manager': { bg: '#FFF7ED', color: '#EA580C', dot: '#FB923C' },
};

interface FormData { name: string; email: string; role: Role; status: UserStatus }
const emptyForm: FormData = { name: '', email: '', role: 'Học viên', status: 'active' };

const CARD_SHADOW = '0 1px 2px rgba(16,24,40,0.05), 0 10px 26px rgba(79,70,229,0.07)';
const CARD_SHADOW_HOVER = '0 8px 24px rgba(79,70,229,0.10)';
const RADIUS = 14;

function ActionBtn({
  onClick, title, icon, hoverBg, color,
}: { onClick: () => void; title: string; icon: React.ReactNode; hoverBg: string; color: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '6px', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: hov ? hoverBg : 'transparent',
        color, transition: 'background 0.15s',
      }}
    >
      {icon}
    </button>
  );
}

export function UserManagement({ users, onAdd, onEdit, onDelete, onToggleStatus }: Props) {
  const [search, setSearch]     = useState('');
  const [roleFilter, setRole]   = useState<Role | 'all'>('all');
  const [page, setPage]         = useState(1);
  const [modalOpen, setModal]   = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [delTarget, setDelTarget] = useState<User | null>(null);
  const [form, setForm]         = useState<FormData>(emptyForm);
  const [errors, setErrors]     = useState<Partial<FormData>>({});

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      && (roleFilter === 'all' || u.role === roleFilter);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageRows   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function openAdd()       { setEditUser(null); setForm(emptyForm); setErrors({}); setModal(true); }
  function openEdit(u: User) { setEditUser(u); setForm({ name: u.name, email: u.email, role: u.role, status: u.status }); setErrors({}); setModal(true); }

  function validate() {
    const e: Partial<FormData> = {};
    if (!form.name.trim())  e.name  = 'Bắt buộc nhập họ tên';
    if (!form.email.trim()) e.email = 'Bắt buộc nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ';
    setErrors(e);
    return !Object.keys(e).length;
  }

  function handleSubmit() {
    if (!validate()) return;
    editUser ? onEdit({ ...editUser, ...form }) : onAdd(form);
    setModal(false);
  }

  function changeRole(r: Role | 'all') { setRole(r); setPage(1); }
  function changeSearch(v: string)     { setSearch(v); setPage(1); }

  // Hover state for card
  const [cardHov, setCardHov] = useState(false);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div
        style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, padding: '12px 16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}
      >
        <div style={{ position: 'relative', width: 260 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
          <input
            value={search}
            onChange={e => changeSearch(e.target.value)}
            placeholder="Tìm theo tên, email..."
            style={{ width: '100%', paddingLeft: 36, paddingRight: 16, paddingTop: 8, paddingBottom: 8, fontSize: 13, borderRadius: 8, border: '1px solid #E8ECF0', background: '#F8FAFC', color: '#1E293B', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={13} style={{ color: '#94A3B8' }} />
          {(['all', ...ROLES] as const).map(r => (
            <FilterChip key={r} active={roleFilter === r} onClick={() => changeRole(r)}>
              {r === 'all' ? 'Tất cả' : r}
            </FilterChip>
          ))}
        </div>

        <PrimaryBtn onClick={openAdd} style={{ marginLeft: 'auto' }}>
          <Plus size={14} /> Thêm người dùng
        </PrimaryBtn>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E8ECF0' }}>
              {['Người dùng', 'Email', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Hành động'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '56px 0' }}>
                  <Users size={32} style={{ color: '#E2E8F0', margin: '0 auto 8px', display: 'block' }} />
                  <p style={{ fontSize: 13, color: '#CBD5E1' }}>Không tìm thấy người dùng</p>
                </td>
              </tr>
            ) : pageRows.map((u, i) => (
              <TableRow key={u.id} last={i === pageRows.length - 1}>
                {/* Avatar + Name */}
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: avatarBg(u.name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{u.avatar}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{u.name}</span>
                  </div>
                </td>
                {/* Email */}
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748B' }}>{u.email}</td>
                {/* Role badge */}
                <td style={{ padding: '14px 20px' }}>
                  <PillBadge bg={ROLE_BADGE[u.role].bg} color={ROLE_BADGE[u.role].color} dot={ROLE_BADGE[u.role].dot}>
                    {u.role}
                  </PillBadge>
                </td>
                {/* Status badge */}
                <td style={{ padding: '14px 20px' }}>
                  <PillBadge
                    bg={u.status === 'active' ? '#F0FDF4' : '#FEF2F2'}
                    color={u.status === 'active' ? '#16A34A' : '#DC2626'}
                    dot={u.status === 'active' ? '#22C55E' : '#EF4444'}
                  >
                    {u.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                  </PillBadge>
                </td>
                {/* Date */}
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#94A3B8' }}>{u.createdAt}</td>
                {/* Actions — always visible */}
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ActionBtn
                      onClick={() => onToggleStatus(u.id)}
                      title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                      icon={u.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                      hoverBg={u.status === 'active' ? '#FEF2F2' : '#F0FDF4'}
                      color={u.status === 'active' ? '#EF4444' : '#16A34A'}
                    />
                    <ActionBtn
                      onClick={() => openEdit(u)}
                      title="Chỉnh sửa"
                      icon={<Edit2 size={14} />}
                      hoverBg="#EEF2FF"
                      color="#4F46E5"
                    />
                    <ActionBtn
                      onClick={() => setDelTarget(u)}
                      title="Xóa tài khoản"
                      icon={<Trash2 size={14} />}
                      hoverBg="#FEF2F2"
                      color="#EF4444"
                    />
                  </div>
                </td>
              </TableRow>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 12, color: '#94A3B8' }}>
            Hiển thị {Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(safePage * PAGE_SIZE, filtered.length)} / {filtered.length} người dùng
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <PageBtn disabled={safePage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
              <ChevronLeft size={15} />
            </PageBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <PageNumBtn key={p} active={safePage === p} onClick={() => setPage(p)}>{p}</PageNumBtn>
            ))}
            <PageBtn disabled={safePage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
              <ChevronRight size={15} />
            </PageBtn>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <Modal onClose={() => setModal(false)} title={editUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(['name', 'email'] as const).map(key => (
              <ModalField key={key} label={key === 'name' ? 'Họ và tên' : 'Email'} required error={errors[key]}>
                <input
                  type={key === 'email' ? 'email' : 'text'}
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={key === 'name' ? 'Nhập họ và tên...' : 'example@email.com'}
                  style={inputStyle(!!errors[key])}
                />
              </ModalField>
            ))}
            <ModalField label="Vai trò">
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as Role }))} style={inputStyle(false)}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </ModalField>
            <ModalField label="Trạng thái">
              <div style={{ display: 'flex', gap: 12 }}>
                {(['active', 'locked'] as UserStatus[]).map(s => {
                  const sel = form.status === s;
                  const c = s === 'active' ? '#22C55E' : '#EF4444';
                  return (
                    <label key={s} onClick={() => setForm(p => ({ ...p, status: s }))}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${sel ? c : '#E2E8F0'}`, background: sel ? (s === 'active' ? '#F0FDF4' : '#FEF2F2') : '#F8FAFC' }}>
                      <span style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${sel ? c : '#CBD5E1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {sel && <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: sel ? (s === 'active' ? '#16A34A' : '#DC2626') : '#64748B' }}>
                        {s === 'active' ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </ModalField>
          </div>
          <ModalFooter onCancel={() => setModal(false)} onConfirm={handleSubmit} confirmLabel={editUser ? 'Lưu thay đổi' : 'Thêm người dùng'} />
        </Modal>
      )}

      {/* Delete Confirm */}
      {delTarget && (
        <Modal onClose={() => setDelTarget(null)} title="">
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={20} style={{ color: '#EF4444' }} />
            </div>
            <p style={{ fontWeight: 600, fontSize: 14, color: '#1E293B', marginBottom: 6 }}>Xác nhận xóa tài khoản?</p>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>Tài khoản <strong style={{ color: '#1E293B' }}>{delTarget.name}</strong> sẽ bị xóa vĩnh viễn.</p>
          </div>
          <div style={{ padding: '0 24px 24px', display: 'flex', gap: 12 }}>
            <button onClick={() => setDelTarget(null)} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', background: '#F1F5F9', color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Hủy</button>
            <button onClick={() => { onDelete(delTarget.id); setDelTarget(null); }} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', background: '#EF4444', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Xóa</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── Shared micro-components ──────────────────────────────── */

function TableRow({ children, last }: { children: React.ReactNode; last: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ borderBottom: last ? 'none' : '1px solid #F8FAFC', background: hov ? '#F5F7FF' : 'transparent', transition: 'background 0.15s' }}
    >
      {children}
    </tr>
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

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${active ? '#4F46E5' : '#E8ECF0'}`, background: active ? '#4F46E5' : '#F8FAFC', color: active ? '#fff' : '#64748B', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}>
      {children}
    </button>
  );
}

function PrimaryBtn({ onClick, children, style }: { onClick: () => void; children: React.ReactNode; style?: React.CSSProperties }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 999, border: 'none', background: 'linear-gradient(90deg,#4F46E5,#7C3AED)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'transform .15s, box-shadow .2s, filter .15s', boxShadow: '0 6px 16px rgba(79,70,229,0.3)', transform: hov ? 'translateY(-1px)' : 'none', filter: hov ? 'brightness(1.05)' : 'none', ...style }}>
      {children}
    </button>
  );
}

function PageBtn({ disabled, onClick, children }: { disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 'none', background: hov && !disabled ? '#F8FAFC' : 'transparent', color: disabled ? '#E2E8F0' : '#64748B', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}>
      {children}
    </button>
  );
}

function PageNumBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 'none', background: active ? '#4F46E5' : hov ? '#F8FAFC' : 'transparent', color: active ? '#fff' : '#64748B', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s' }}>
      {children}
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: 440 }}>
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #F1F5F9' }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: '#1E293B' }}>{title}</p>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, color: '#94A3B8' }}><X size={16} /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function ModalField({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function ModalFooter({ onCancel, onConfirm, confirmLabel }: { onCancel: () => void; onConfirm: () => void; confirmLabel: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 24px', borderTop: '1px solid #F1F5F9' }}>
      <button onClick={onCancel} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#F1F5F9', color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Hủy</button>
      <button onClick={onConfirm} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#4F46E5', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{confirmLabel}</button>
    </div>
  );
}

function inputStyle(error: boolean): React.CSSProperties {
  return { width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 8, border: `1px solid ${error ? '#EF4444' : '#E2E8F0'}`, background: error ? '#FEF2F2' : '#F8FAFC', color: '#1E293B', outline: 'none', boxSizing: 'border-box' };
}
