import { useState } from 'react';
import { ShieldCheck, Lock, User, Users, BarChart3, GraduationCap, ArrowRight } from 'lucide-react';
import BackToHome from '../../../components/BackToHome';

/** Màn đăng nhập Admin (figma-style, split-screen). Tài khoản demo: admin / 12345. */
export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focus, setFocus] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === '12345') {
      setError('');
      onLogin();
    } else {
      setError('Sai tài khoản hoặc mật khẩu.');
    }
  };

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '13px 14px 13px 42px', borderRadius: 12,
    border: '1.5px solid #E5E7EB', outline: 'none', fontSize: 14.5, color: '#1E293B',
    transition: 'border-color .18s, box-shadow .18s', background: '#fff',
  };
  const focusStyle: React.CSSProperties = { border: '1.5px solid #6366F1', boxShadow: '0 0 0 4px rgba(99,102,241,0.15)' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', system-ui, sans-serif", background: '#0B1020' }}>
      <style>{`
        @keyframes admlg-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(0,-26px)} }
        @keyframes admlg-blob { 0%,100%{border-radius:42% 58% 60% 40%/45% 45% 55% 55%} 50%{border-radius:62% 38% 44% 56%/56% 62% 38% 44%} }
        @keyframes admlg-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes admlg-shine { to { background-position: 200% center; } }
        .admlg-in { animation: admlg-in .55s cubic-bezier(.2,.7,.3,1) both; }
        .admlg-d1{animation-delay:.05s}.admlg-d2{animation-delay:.13s}.admlg-d3{animation-delay:.21s}.admlg-d4{animation-delay:.29s}.admlg-d5{animation-delay:.37s}
        .admlg-brand{ position:relative; width:46%; overflow:hidden; display:flex; flex-direction:column; justify-content:center; padding:56px;
          background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 52%,#2563EB 100%); }
        .admlg-form{ flex:1; display:flex; align-items:center; justify-content:center; padding:32px; background:#F7F8FC; }
        .admlg-blob{ position:absolute; filter:blur(2px); opacity:.35; background:rgba(255,255,255,.45); animation:admlg-float 9s ease-in-out infinite, admlg-blob 14s ease-in-out infinite; }
        .admlg-feat{ display:flex; align-items:center; gap:14px; color:#EEF2FF; }
        .admlg-feat .ic{ width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.16);backdrop-filter:blur(4px);flex-shrink:0 }
        .admlg-btn{ position:relative; overflow:hidden; width:100%; padding:14px; margin-top:18px; border:none; cursor:pointer; border-radius:12px; color:#fff; font-weight:700; font-size:15px;
          background:linear-gradient(90deg,#4F46E5,#7C3AED,#4F46E5); background-size:200% auto; transition:background-position .5s, transform .15s, box-shadow .2s; box-shadow:0 10px 24px rgba(79,70,229,.32); }
        .admlg-btn:hover{ background-position:right center; transform:translateY(-1px); box-shadow:0 14px 30px rgba(79,70,229,.42) }
        .admlg-btn:active{ transform:translateY(0) }
        @media (max-width: 900px){ .admlg-brand{ display:none } }
      `}</style>

      <BackToHome />

      {/* Bảng thương hiệu */}
      <div className="admlg-brand">
        <div className="admlg-blob" style={{ width: 260, height: 260, top: -60, right: -40 }} />
        <div className="admlg-blob" style={{ width: 180, height: 180, bottom: 40, left: -50, animationDelay: '1.5s' }} />
        <div className="admlg-blob" style={{ width: 120, height: 120, top: '45%', right: 80, opacity: .2, animationDelay: '.8s' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="admlg-in admlg-d1" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
              <GraduationCap size={26} color="#fff" />
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>TOEIC Pro Admin</span>
          </div>

          <h1 className="admlg-in admlg-d2" style={{ color: '#fff', fontSize: 34, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', margin: 0 }}>
            Quản trị toàn bộ<br />nền tảng luyện thi
          </h1>
          <p className="admlg-in admlg-d3" style={{ color: 'rgba(255,255,255,.78)', marginTop: 14, marginBottom: 36, fontSize: 15, lineHeight: 1.6, maxWidth: 380 }}>
            Người dùng, giáo viên, khóa học, nội dung và thanh toán — tất cả trong một bảng điều khiển.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { Icon: Users, t: 'Quản lý người dùng & phân quyền' },
              { Icon: ShieldCheck, t: 'Duyệt giáo viên & kiểm soát nội dung' },
              { Icon: BarChart3, t: 'Thống kê doanh thu & tăng trưởng' },
            ].map((f, i) => (
              <div key={i} className={`admlg-feat admlg-in admlg-d${i + 3}`}>
                <div className="ic"><f.Icon size={20} color="#fff" /></div>
                <span style={{ fontSize: 14.5, fontWeight: 500 }}>{f.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form đăng nhập */}
      <div className="admlg-form">
        <form onSubmit={submit} className="admlg-in admlg-d2" style={{ width: '100%', maxWidth: 380, background: '#fff', borderRadius: 22, padding: 36, boxShadow: '0 24px 60px rgba(2,6,23,0.12)', border: '1px solid #EEF0F6' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 10px 22px rgba(79,70,229,.3)' }}>
            <ShieldCheck size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: 23, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Chào mừng trở lại 👋</h2>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 6, marginBottom: 26 }}>Đăng nhập vào trang quản trị</p>

          <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tài khoản</label>
          <div style={{ position: 'relative', margin: '7px 0 16px' }}>
            <User size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focus === 'u' ? '#6366F1' : '#94A3B8', transition: 'color .15s' }} />
            <input value={username} onChange={e => setUsername(e.target.value)} onFocus={() => setFocus('u')} onBlur={() => setFocus('')}
              placeholder="admin" style={{ ...inputBase, ...(focus === 'u' ? focusStyle : {}) }} />
          </div>

          <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Mật khẩu</label>
          <div style={{ position: 'relative', margin: '7px 0 4px' }}>
            <Lock size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focus === 'p' ? '#6366F1' : '#94A3B8', transition: 'color .15s' }} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocus('p')} onBlur={() => setFocus('')}
              placeholder="••••••" style={{ ...inputBase, ...(focus === 'p' ? focusStyle : {}) }} />
          </div>

          {error && <p style={{ fontSize: 13.5, color: '#DC2626', margin: '10px 0 0', fontWeight: 600 }}>{error}</p>}

          <button type="submit" className="admlg-btn">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              Đăng nhập <ArrowRight size={17} />
            </span>
          </button>

          <div style={{ marginTop: 18, padding: '10px 12px', borderRadius: 10, background: '#F1F5F9', border: '1px dashed #CBD5E1', fontSize: 12.5, color: '#64748B', textAlign: 'center' }}>
            Demo · tài khoản <b style={{ color: '#4F46E5' }}>admin</b> · mật khẩu <b style={{ color: '#4F46E5' }}>12345</b>
          </div>
        </form>
      </div>
    </div>
  );
}
