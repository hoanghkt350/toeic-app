import { useState } from 'react';
import { GraduationCap, Check, X, FileText, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { TeacherApplication } from '../../lib/classroomStore';

interface Props {
  applications: TeacherApplication[];
  onApprove: (app: TeacherApplication) => void;
  onReject: (id: string) => void;
}

const STATUS = {
  pending: { label: 'Chờ duyệt', bg: '#FFFBEB', color: '#D97706' },
  approved: { label: 'Đã duyệt', bg: '#F0FDF4', color: '#16A34A' },
  rejected: { label: 'Từ chối', bg: '#FEF2F2', color: '#DC2626' },
};

export function TeacherApproval({ applications, onApprove, onReject }: Props) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [preview, setPreview] = useState<TeacherApplication | null>(null);

  const counts = {
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };
  const list = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  return (
    <div>
      <div className="mb-5">
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>Duyệt Giáo viên</h1>
        <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>
          Xét duyệt đơn đăng ký làm giáo viên kèm chứng chỉ. Duyệt xong người dùng sẽ được thêm vào hệ thống với vai trò Giáo viên.
        </p>
      </div>

      {/* Bộ lọc */}
      <div className="flex gap-2 mb-5">
        {(['pending', 'approved', 'rejected', 'all'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${filter === s ? '#4F46E5' : '#E8ECF0'}`,
              background: filter === s ? '#4F46E5' : '#fff',
              color: filter === s ? '#fff' : '#64748B',
            }}
          >
            {s === 'all' ? 'Tất cả' : STATUS[s].label}
            {s !== 'all' && ` (${counts[s]})`}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center" style={{ borderColor: '#E2E8F0', background: '#fff' }}>
          <GraduationCap size={40} style={{ color: '#CBD5E1', margin: '0 auto 12px' }} />
          <p style={{ color: '#64748B', fontWeight: 600 }}>Không có đơn nào ở mục này.</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {list.map(app => {
            const st = STATUS[app.status];
            return (
              <div key={app.id} className="rounded-2xl border p-5" style={{ borderColor: '#E8ECF0', background: '#fff' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                      <GraduationCap size={22} style={{ color: '#4F46E5' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{app.name}</div>
                      <div className="flex items-center gap-1" style={{ fontSize: 12.5, color: '#64748B' }}>
                        <Mail size={12} /> {app.email}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full px-2.5 py-1" style={{ background: st.bg, color: st.color, fontSize: 11.5, fontWeight: 700 }}>
                    {st.label}
                  </span>
                </div>

                {/* Chứng chỉ */}
                <button
                  onClick={() => setPreview(app)}
                  className="w-full rounded-xl border flex items-center gap-2 px-3 py-2.5 mb-2 text-left"
                  style={{ borderColor: '#E8ECF0', background: '#F8FAFC', cursor: 'pointer' }}
                >
                  <FileText size={16} style={{ color: '#4F46E5' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#334155', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.certName || 'Chứng chỉ đính kèm'}
                  </span>
                  <span style={{ fontSize: 12, color: '#4F46E5', fontWeight: 700 }}>Xem</span>
                </button>

                {app.note && <p style={{ fontSize: 13, color: '#64748B', marginBottom: 12, lineHeight: 1.5 }}>“{app.note}”</p>}

                {app.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApprove(app)}
                      className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5 text-white font-semibold"
                      style={{ background: '#16A34A', border: 'none', cursor: 'pointer', fontSize: 13 }}
                    >
                      <Check size={15} /> Duyệt
                    </button>
                    <button
                      onClick={() => onReject(app.id)}
                      className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5 font-semibold"
                      style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', cursor: 'pointer', fontSize: 13 }}
                    >
                      <X size={15} /> Từ chối
                    </button>
                  </div>
                )}
                {app.status !== 'pending' && (
                  <div className="flex items-center gap-1.5" style={{ fontSize: 13, fontWeight: 600, color: st.color }}>
                    {app.status === 'approved' ? <CheckCircle size={15} /> : <XCircle size={15} />}
                    {app.status === 'approved' ? 'Đã thêm vào hệ thống' : 'Đã từ chối đơn này'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal xem chứng chỉ */}
      {preview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.6)' }} onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontWeight: 800, color: '#0F172A' }}>Chứng chỉ — {preview.name}</h3>
              <button onClick={() => setPreview(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
            </div>
            {preview.certImage ? (
              <img src={preview.certImage} alt="Chứng chỉ" className="w-full rounded-xl border" style={{ borderColor: '#E2E8F0', maxHeight: 420, objectFit: 'contain', background: '#F8FAFC' }} />
            ) : (
              <div className="rounded-xl border border-dashed p-10 text-center" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <FileText size={40} style={{ color: '#CBD5E1', margin: '0 auto 10px' }} />
                <p style={{ color: '#64748B', fontWeight: 600 }}>{preview.certName || 'Chứng chỉ (không có ảnh xem trước)'}</p>
                <p style={{ color: '#94A3B8', fontSize: 12.5, marginTop: 4 }}>Đơn demo — người dùng có thể tải ảnh chứng chỉ khi đăng ký.</p>
              </div>
            )}
            <div className="flex items-center gap-2 mt-3" style={{ fontSize: 12.5, color: '#94A3B8' }}>
              <Clock size={13} /> Nộp ngày {new Date(preview.createdAt).toLocaleString('vi-VN')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
