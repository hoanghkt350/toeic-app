import { useState } from 'react';
import { Plus, Edit2, Trash2, X, BookOpen, FileText, Search, Users } from 'lucide-react';
import type { Course, CourseStatus } from '../../types';

interface Props {
  courses: Course[];
  onAdd: (c: Omit<Course, 'id' | 'createdAt'>) => void;
  onEdit: (c: Course) => void;
  onDelete: (id: string) => void;
}

const CARD_SHADOW = '0 1px 2px rgba(16,24,40,0.05), 0 10px 26px rgba(79,70,229,0.07)';
const RADIUS = 14;

const STATUS: Record<CourseStatus, { label: string; bg: string; color: string; dot: string }> = {
  published: { label: 'Đã đăng',  bg: '#F0FDF4', color: '#16A34A', dot: '#22C55E' },
  draft:     { label: 'Bản nháp', bg: '#F8FAFC', color: '#64748B', dot: '#CBD5E1' },
  archived:  { label: 'Lưu trữ', bg: '#FFF7ED', color: '#EA580C', dot: '#F59E0B' },
};

interface FormData {
  title: string; description: string; category: 'Khóa học' | 'Đề thi';
  questionCount: number; studentCount: number; status: CourseStatus; author: string;
}
const emptyForm: FormData = { title: '', description: '', category: 'Khóa học', questionCount: 0, studentCount: 0, status: 'draft', author: '' };

function PillBadge({ bg, color, dot, children }: { bg: string; color: string; dot: string; children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: bg, color, fontSize: 12, fontWeight: 500 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function ActionBtn({ onClick, title, icon, hoverBg, color }: { onClick: () => void; title: string; icon: React.ReactNode; hoverBg: string; color: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: hov ? hoverBg : 'transparent', color, transition: 'background 0.15s' }}>
      {icon}
    </button>
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

function StatCard({ label, value, iconBg, iconEl }: { label: string; value: string | number; iconBg: string; iconEl: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, padding: '16px 20px', boxShadow: hov ? '0 8px 24px rgba(79,70,229,0.10)' : CARD_SHADOW, transition: 'box-shadow 0.2s', cursor: 'default' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        {iconEl}
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, color: '#1E293B', letterSpacing: '-0.03em' }}>{value}</p>
      <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{label}</p>
    </div>
  );
}

export function CourseManagement({ courses, onAdd, onEdit, onDelete }: Props) {
  const [search, setSearch]   = useState('');
  const [catFilter, setCat]   = useState<'all' | 'Khóa học' | 'Đề thi'>('all');
  const [modal, setModal]     = useState(false);
  const [editItem, setEditItem] = useState<Course | null>(null);
  const [delTarget, setDel]   = useState<Course | null>(null);
  const [form, setForm]       = useState<FormData>(emptyForm);
  const [errors, setErrors]   = useState<Partial<Record<keyof FormData, string>>>({});

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    return (c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q))
      && (catFilter === 'all' || c.category === catFilter);
  });

  function openAdd() { setEditItem(null); setForm(emptyForm); setErrors({}); setModal(true); }
  function openEdit(c: Course) {
    setEditItem(c);
    setForm({ title: c.title, description: c.description, category: c.category, questionCount: c.questionCount ?? 0, studentCount: c.studentCount ?? 0, status: c.status, author: c.author });
    setErrors({}); setModal(true);
  }

  function validate() {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim())  e.title  = 'Bắt buộc nhập tiêu đề';
    if (!form.author.trim()) e.author = 'Bắt buộc nhập tác giả';
    setErrors(e);
    return !Object.keys(e).length;
  }

  function handleSubmit() {
    if (!validate()) return;
    editItem ? onEdit({ ...editItem, ...form }) : onAdd(form);
    setModal(false);
  }

  const totalStudents = courses.reduce((s, c) => s + (c.studentCount ?? 0), 0);
  const totalQ        = courses.filter(c => c.status === 'published').reduce((s, c) => s + (c.questionCount ?? 0), 0);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Tổng khóa học"    value={courses.filter(c => c.category === 'Khóa học').length}
          iconBg="linear-gradient(135deg,#EEF2FF,#E0E7FF)" iconEl={<BookOpen size={16} style={{ color: '#4F46E5' }} />} />
        <StatCard label="Tổng đề thi"      value={courses.filter(c => c.category === 'Đề thi').length}
          iconBg="linear-gradient(135deg,#F5F3FF,#EDE9FE)" iconEl={<FileText size={16} style={{ color: '#7C3AED' }} />} />
        <StatCard label="Học viên đăng ký" value={totalStudents.toLocaleString('vi-VN')}
          iconBg="linear-gradient(135deg,#F0F9FF,#DBEAFE)" iconEl={<Users size={16} style={{ color: '#0284C7' }} />} />
        <StatCard label="Câu hỏi (đã đăng)" value={totalQ.toLocaleString('vi-VN')}
          iconBg="linear-gradient(135deg,#F0FDF4,#DCFCE7)" iconEl={<BookOpen size={16} style={{ color: '#16A34A' }} />} />
      </div>

      {/* Controls */}
      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, tác giả..."
            style={{ width: '100%', paddingLeft: 36, paddingRight: 16, paddingTop: 8, paddingBottom: 8, fontSize: 13, borderRadius: 8, border: '1px solid #E8ECF0', background: '#F8FAFC', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'Khóa học', 'Đề thi'] as const).map(c => (
            <ChipBtn key={c} active={catFilter === c} onClick={() => setCat(c)}>
              {c === 'all' ? 'Tất cả' : c}
            </ChipBtn>
          ))}
        </div>
        <PrimaryBtn onClick={openAdd}>
          <Plus size={14} /> Thêm mới
        </PrimaryBtn>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E8ECF0' }}>
              {['Tên', 'Loại', 'Số câu', 'Học viên', 'Trạng thái', 'Tác giả', 'Ngày tạo', 'Hành động'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '56px 0' }}>
                <BookOpen size={32} style={{ color: '#E2E8F0', margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontSize: 13, color: '#CBD5E1' }}>Không tìm thấy kết quả</p>
              </td></tr>
            ) : filtered.map((c, i) => {
              const ss = STATUS[c.status];
              const isCourse = c.category === 'Khóa học';
              return (
                <TableRow key={c.id} last={i === filtered.length - 1}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: isCourse ? 'linear-gradient(135deg,#EEF2FF,#E0E7FF)' : 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {isCourse ? <BookOpen size={15} style={{ color: '#4F46E5' }} /> : <FileText size={15} style={{ color: '#7C3AED' }} />}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{c.title}</p>
                        <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 1, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <PillBadge bg={isCourse ? '#EEF2FF' : '#F5F3FF'} color={isCourse ? '#4F46E5' : '#7C3AED'} dot={isCourse ? '#818CF8' : '#A78BFA'}>
                      {c.category}
                    </PillBadge>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                    {(c.questionCount ?? 0).toLocaleString('vi-VN')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                      <Users size={13} style={{ color: '#94A3B8' }} />
                      {(c.studentCount ?? 0).toLocaleString('vi-VN')}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <PillBadge bg={ss.bg} color={ss.color} dot={ss.dot}>{ss.label}</PillBadge>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748B' }}>{c.author}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#94A3B8' }}>{c.createdAt}</td>
                  {/* Actions — always visible */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ActionBtn onClick={() => openEdit(c)} title="Chỉnh sửa" icon={<Edit2 size={14} />} hoverBg="#EEF2FF" color="#4F46E5" />
                      <ActionBtn onClick={() => setDel(c)} title="Xóa" icon={<Trash2 size={14} />} hoverBg="#FEF2F2" color="#EF4444" />
                    </div>
                  </td>
                </TableRow>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: '10px 16px', borderTop: '1px solid #F1F5F9' }}>
          <p style={{ fontSize: 12, color: '#CBD5E1' }}>Hiển thị {filtered.length} / {courses.length} mục</p>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ position: 'sticky', top: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #F1F5F9' }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#1E293B' }}>{editItem ? 'Chỉnh sửa' : 'Thêm khóa học / đề thi'}</p>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#94A3B8' }}><X size={16} /></button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {([['title', 'Tiêu đề', 'Nhập tiêu đề...'], ['author', 'Tác giả', 'Tên tác giả...']] as const).map(([key, label, ph]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>{label} <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph}
                    style={{ width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 8, border: `1px solid ${errors[key] ? '#EF4444' : '#E2E8F0'}`, background: errors[key] ? '#FEF2F2' : '#F8FAFC', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }} />
                  {errors[key] && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{errors[key]}</p>}
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Mô tả</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Mô tả ngắn..."
                  style={{ width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#1E293B', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Loại', key: 'category', type: 'select', opts: ['Khóa học', 'Đề thi'] },
                  { label: 'Trạng thái', key: 'status', type: 'select', opts: [['draft','Bản nháp'],['published','Đã đăng'],['archived','Lưu trữ']] },
                  { label: 'Số câu hỏi', key: 'questionCount', type: 'number' },
                  { label: 'Số học viên', key: 'studentCount', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>{f.label}</label>
                    {f.type === 'select' ? (
                      <select value={form[f.key as keyof FormData] as string} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#1E293B', outline: 'none' }}>
                        {(f.opts as string[][]).map(o => Array.isArray(o)
                          ? <option key={o[0]} value={o[0]}>{o[1]}</option>
                          : <option key={o as string} value={o as string}>{o}</option>)}
                      </select>
                    ) : (
                      <input type="number" min={0} value={form[f.key as keyof FormData] as number}
                        onChange={e => setForm(p => ({ ...p, [f.key]: parseInt(e.target.value) || 0 }))}
                        style={{ width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 24px', borderTop: '1px solid #F1F5F9' }}>
              <button onClick={() => setModal(false)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#F1F5F9', color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleSubmit} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#4F46E5', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{editItem ? 'Lưu thay đổi' : 'Thêm mới'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {delTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: 360, padding: 24, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={20} style={{ color: '#EF4444' }} />
            </div>
            <p style={{ fontWeight: 600, fontSize: 14, color: '#1E293B', marginBottom: 6 }}>Xác nhận xóa?</p>
            <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 24 }}>Xóa <strong style={{ color: '#1E293B' }}>"{delTarget.title}"</strong>?</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDel(null)} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', background: '#F1F5F9', color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Hủy</button>
              <button onClick={() => { onDelete(delTarget.id); setDel(null); }} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', background: '#EF4444', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChipBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${active ? '#4F46E5' : '#E8ECF0'}`, background: active ? '#4F46E5' : '#F8FAFC', color: active ? '#fff' : '#64748B', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}>
      {children}
    </button>
  );
}

function PrimaryBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 999, border: 'none', background: 'linear-gradient(90deg,#4F46E5,#7C3AED)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'transform .15s, box-shadow .2s, filter .15s', marginLeft: 'auto', boxShadow: '0 6px 16px rgba(79,70,229,0.3)', transform: hov ? 'translateY(-1px)' : 'none', filter: hov ? 'brightness(1.05)' : 'none' }}>
      {children}
    </button>
  );
}
