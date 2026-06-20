import { useState } from 'react';
import { Globe, Bell, Shield, Database, Mail, Palette, Save, Check, ChevronRight, Upload } from 'lucide-react';

type Section = 'general' | 'notifications' | 'security' | 'email' | 'appearance' | 'backup';

const SECTIONS: { id: Section; label: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }[] = [
  { id: 'general',       label: 'Thông tin chung',  icon: Globe },
  { id: 'notifications', label: 'Thông báo',         icon: Bell },
  { id: 'security',      label: 'Bảo mật',           icon: Shield },
  { id: 'email',         label: 'Email & SMTP',       icon: Mail },
  { id: 'appearance',    label: 'Giao diện',          icon: Palette },
  { id: 'backup',        label: 'Sao lưu',            icon: Database },
];

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

function SwitchRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #F8FAFC' }}>
      <div style={{ flex: 1, paddingRight: 24, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>{label}</p>
        <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function Field({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
        {label} {req && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT_STYLE: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#1E293B', outline: 'none', boxSizing: 'border-box' };

export function Settings() {
  const [section, setSection] = useState<Section>('general');
  const [saved, setSaved]     = useState(false);

  const [general, setG]   = useState({ siteName: 'TOEIC Learning Platform', siteUrl: 'https://toeic-platform.vn', description: 'Nền tảng luyện thi TOEIC hàng đầu Việt Nam', language: 'vi', timezone: 'Asia/Ho_Chi_Minh', allowRegister: true, maintenanceMode: false });
  const [notif, setN]     = useState({ emailNewUser: true, emailPayment: true, emailContent: true, pushEnabled: false, weeklyReport: true, smsAlerts: false });
  const [security, setSec] = useState({ twoFactor: false, sessionTimeout: '60', forceHttps: true, loginAttempts: '5', captcha: true });
  const [email, setEmail]  = useState({ smtpHost: 'smtp.gmail.com', smtpPort: '587', smtpUser: 'noreply@toeic-platform.vn', smtpPassword: '••••••••••', fromName: 'TOEIC Platform', replyTo: 'support@toeic-platform.vn' });

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2200); }

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* Side nav */}
      <div style={{ width: 200, flexShrink: 0 }}>
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
          {SECTIONS.map((sec, i) => {
            const Icon = sec.icon;
            const active = section === sec.id;
            return (
              <NavItem key={sec.id} active={active} last={i === SECTIONS.length - 1} onClick={() => setSection(sec.id)}>
                <Icon size={15} style={{ color: active ? '#4F46E5' : '#94A3B8', flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{sec.label}</span>
                {active && <ChevronRight size={13} style={{ color: '#A5B4FC' }} />}
              </NavItem>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Panel>
          {section === 'general' && <>
            <PanelHeader title="Thông tin chung" desc="Cấu hình cơ bản của nền tảng" />
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff' }}>T</div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#64748B', fontSize: 13, cursor: 'pointer' }}>
                  <Upload size={13} /> Tải logo mới
                </button>
              </div>
              <Field label="Tên hệ thống"><input style={INPUT_STYLE} value={general.siteName} onChange={e => setG(g => ({ ...g, siteName: e.target.value }))} /></Field>
              <Field label="URL website"><input style={INPUT_STYLE} value={general.siteUrl} onChange={e => setG(g => ({ ...g, siteUrl: e.target.value }))} /></Field>
              <Field label="Mô tả"><textarea rows={2} style={{ ...INPUT_STYLE, resize: 'none' }} value={general.description} onChange={e => setG(g => ({ ...g, description: e.target.value }))} /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Ngôn ngữ">
                  <select style={INPUT_STYLE} value={general.language} onChange={e => setG(g => ({ ...g, language: e.target.value }))}>
                    <option value="vi">Tiếng Việt</option><option value="en">English</option>
                  </select>
                </Field>
                <Field label="Múi giờ">
                  <select style={INPUT_STYLE} value={general.timezone} onChange={e => setG(g => ({ ...g, timezone: e.target.value }))}>
                    <option value="Asia/Ho_Chi_Minh">GMT+7 (Hà Nội/TP.HCM)</option><option value="UTC">UTC</option>
                  </select>
                </Field>
              </div>
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 8 }}>
                <SwitchRow label="Cho phép đăng ký tài khoản mới" desc="Mở đăng ký công khai cho người dùng" checked={general.allowRegister} onChange={() => setG(g => ({ ...g, allowRegister: !g.allowRegister }))} />
                <SwitchRow label="Chế độ bảo trì" desc="Tạm thời đóng truy cập ngoại trừ admin" checked={general.maintenanceMode} onChange={() => setG(g => ({ ...g, maintenanceMode: !g.maintenanceMode }))} />
              </div>
            </div>
          </>}

          {section === 'notifications' && <>
            <PanelHeader title="Cài đặt thông báo" desc="Quản lý các loại thông báo hệ thống" />
            <div style={{ padding: '4px 24px 16px' }}>
              <SwitchRow label="Email khi có người dùng mới đăng ký" desc="Nhận email mỗi khi có tài khoản mới" checked={notif.emailNewUser} onChange={() => setN(n => ({ ...n, emailNewUser: !n.emailNewUser }))} />
              <SwitchRow label="Email khi có giao dịch thanh toán" desc="Nhận thông báo mỗi giao dịch" checked={notif.emailPayment} onChange={() => setN(n => ({ ...n, emailPayment: !n.emailPayment }))} />
              <SwitchRow label="Email khi có nội dung chờ duyệt" desc="Nhắc nhở khi Content Manager gửi nội dung" checked={notif.emailContent} onChange={() => setN(n => ({ ...n, emailContent: !n.emailContent }))} />
              <SwitchRow label="Thông báo đẩy (Push Notification)" desc="Thông báo trên trình duyệt web" checked={notif.pushEnabled} onChange={() => setN(n => ({ ...n, pushEnabled: !n.pushEnabled }))} />
              <SwitchRow label="Báo cáo tuần" desc="Gửi báo cáo tổng hợp mỗi thứ Hai" checked={notif.weeklyReport} onChange={() => setN(n => ({ ...n, weeklyReport: !n.weeklyReport }))} />
              <SwitchRow label="Cảnh báo SMS" desc="Gửi SMS cho các sự kiện quan trọng" checked={notif.smsAlerts} onChange={() => setN(n => ({ ...n, smsAlerts: !n.smsAlerts }))} />
            </div>
          </>}

          {section === 'security' && <>
            <PanelHeader title="Bảo mật" desc="Cấu hình các tùy chọn bảo mật" />
            <div style={{ padding: '4px 24px 0' }}>
              <SwitchRow label="Xác thực 2 yếu tố (2FA)" desc="Yêu cầu OTP khi đăng nhập" checked={security.twoFactor} onChange={() => setSec(s => ({ ...s, twoFactor: !s.twoFactor }))} />
              <SwitchRow label="Bắt buộc HTTPS" desc="Chuyển hướng tất cả HTTP sang HTTPS" checked={security.forceHttps} onChange={() => setSec(s => ({ ...s, forceHttps: !s.forceHttps }))} />
              <SwitchRow label="Xác minh CAPTCHA" desc="Hiển thị CAPTCHA khi đăng nhập và đăng ký" checked={security.captcha} onChange={() => setSec(s => ({ ...s, captcha: !s.captcha }))} />
            </div>
            <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: '1px solid #F8FAFC' }}>
              <Field label="Thời gian hết phiên (phút)"><input type="number" style={INPUT_STYLE} value={security.sessionTimeout} onChange={e => setSec(s => ({ ...s, sessionTimeout: e.target.value }))} /></Field>
              <Field label="Số lần đăng nhập sai tối đa"><input type="number" style={INPUT_STYLE} value={security.loginAttempts} onChange={e => setSec(s => ({ ...s, loginAttempts: e.target.value }))} /></Field>
            </div>
          </>}

          {section === 'email' && <>
            <PanelHeader title="Cấu hình Email & SMTP" desc="Thiết lập máy chủ gửi email" />
            <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="SMTP Host"><input style={INPUT_STYLE} value={email.smtpHost} onChange={e => setEmail(em => ({ ...em, smtpHost: e.target.value }))} /></Field>
              <Field label="Port"><input type="number" style={INPUT_STYLE} value={email.smtpPort} onChange={e => setEmail(em => ({ ...em, smtpPort: e.target.value }))} /></Field>
              <Field label="Tài khoản SMTP"><input type="email" style={INPUT_STYLE} value={email.smtpUser} onChange={e => setEmail(em => ({ ...em, smtpUser: e.target.value }))} /></Field>
              <Field label="Mật khẩu SMTP"><input type="password" style={INPUT_STYLE} value={email.smtpPassword} onChange={e => setEmail(em => ({ ...em, smtpPassword: e.target.value }))} /></Field>
              <Field label="Tên người gửi"><input style={INPUT_STYLE} value={email.fromName} onChange={e => setEmail(em => ({ ...em, fromName: e.target.value }))} /></Field>
              <Field label="Reply-To"><input type="email" style={INPUT_STYLE} value={email.replyTo} onChange={e => setEmail(em => ({ ...em, replyTo: e.target.value }))} /></Field>
            </div>
          </>}

          {section === 'appearance' && <>
            <PanelHeader title="Giao diện" desc="Tuỳ chỉnh màu sắc và bố cục" />
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 12 }}>Màu chủ đề</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[{ name: 'Tím (mặc định)', c: '#4F46E5', active: true }, { name: 'Xanh dương', c: '#2563EB', active: false }, { name: 'Xanh lá', c: '#16A34A', active: false }, { name: 'Cam đỏ', c: '#EA580C', active: false }].map(t => (
                    <div key={t.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: t.c, boxShadow: t.active ? `0 0 0 3px ${t.c}40, 0 0 0 5px ${t.c}` : 'none', transition: 'box-shadow 0.15s' }} />
                      <span style={{ fontSize: 11, color: t.active ? '#1E293B' : '#94A3B8', fontWeight: t.active ? 600 : 400 }}>{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 8 }}>
                <SwitchRow label="Sidebar thu gọn mặc định" desc="Ẩn nhãn menu khi khởi động" checked={false} onChange={() => {}} />
                <SwitchRow label="Hiệu ứng chuyển trang" desc="Hoạt ảnh khi điều hướng" checked={true} onChange={() => {}} />
              </div>
            </div>
          </>}

          {section === 'backup' && <>
            <PanelHeader title="Sao lưu dữ liệu" desc="Quản lý sao lưu và khôi phục" />
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)', border: '1px solid #C7D2FE' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={17} style={{ color: '#fff' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>Sao lưu lần cuối</p>
                  <p style={{ fontSize: 12, color: '#4F46E5', marginTop: 2 }}>12/04/2024 lúc 03:00 SA — thành công</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 4 }}>
                <SwitchRow label="Tự động sao lưu hàng ngày" desc="Chạy lúc 3:00 SA mỗi ngày" checked={true} onChange={() => {}} />
                <SwitchRow label="Sao lưu trước khi nâng cấp" desc="Tự động backup trước mỗi lần cập nhật" checked={true} onChange={() => {}} />
              </div>
              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 8, border: 'none', background: '#4F46E5', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                  <Database size={14} /> Sao lưu ngay
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                  Xem lịch sử sao lưu
                </button>
              </div>
            </div>
          </>}
        </Panel>

        {/* Save Bar */}
        <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 12, color: '#94A3B8' }}>Thay đổi sẽ được áp dụng ngay sau khi lưu.</p>
          <SaveBtn saved={saved} onClick={save} />
        </div>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: RADIUS, boxShadow: CARD_SHADOW, overflow: 'hidden' }}>{children}</div>;
}

function PanelHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ padding: '16px 24px', borderBottom: '1px solid #F1F5F9' }}>
      <p style={{ fontWeight: 600, fontSize: 14, color: '#1E293B' }}>{title}</p>
      <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{desc}</p>
    </div>
  );
}

function NavItem({ active, last, onClick, children }: { active: boolean; last: boolean; onClick: () => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: active ? '#EEF2FF' : hov ? '#F8FAFC' : 'transparent', color: active ? '#4F46E5' : '#64748B', fontSize: 13, fontWeight: active ? 600 : 400, borderBottom: last ? 'none' : '1px solid #F8FAFC', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}>
      {children}
    </button>
  );
}

function SaveBtn({ saved, onClick }: { saved: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 8, border: 'none', background: saved ? '#16A34A' : hov ? '#4338CA' : '#4F46E5', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s' }}>
      {saved ? <Check size={14} /> : <Save size={14} />}
      {saved ? 'Đã lưu!' : 'Lưu cài đặt'}
    </button>
  );
}
