import { useState } from "react";
import { useApp } from "../../context";
import { C, Card, CardHeader, CardTitle, CardBody, Btn, FormGroup, Input } from "../ui";

export function CaiDat() {
  const { showToast } = useApp();
  const [name, setName] = useState("Nguyễn Hoàng Khiêm");
  const [email, setEmail] = useState("khiemnguyen0582@gmail.com");
  const [phone, setPhone] = useState("");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [notif1, setNotif1] = useState(true);
  const [notif2, setNotif2] = useState(true);
  const [notif3, setNotif3] = useState(false);

  const handleSaveProfile = () => {
    if (!name.trim() || !email.trim()) { showToast("⚠️ Vui lòng điền đầy đủ thông tin!"); return; }
    showToast("✅ Đã lưu thông tin cá nhân!");
  };

  const handleChangePassword = () => {
    if (!oldPw || !newPw || !confirmPw) { showToast("⚠️ Vui lòng điền đầy đủ thông tin mật khẩu!"); return; }
    if (newPw !== confirmPw) { showToast("⚠️ Mật khẩu mới không khớp!"); return; }
    if (newPw.length < 6) { showToast("⚠️ Mật khẩu mới phải có ít nhất 6 ký tự!"); return; }
    setOldPw(""); setNewPw(""); setConfirmPw("");
    showToast("✅ Đã đổi mật khẩu thành công!");
  };

  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ maxWidth: 640 }}>
        {/* Profile */}
        <Card style={{ marginBottom: 18 }}>
          <CardHeader><CardTitle>👤 Thông tin cá nhân</CardTitle></CardHeader>
          <CardBody>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 22 }}>K</div>
              <Btn variant="outline" style={{ fontSize: 12 }} onClick={() => showToast("📷 Chọn ảnh đại diện mới...")}>Đổi ảnh đại diện</Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormGroup label="Họ và tên">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormGroup>
              <FormGroup label="Email">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormGroup>
              <FormGroup label="Vai trò">
                <Input value="Người biên soạn nội dung" disabled style={{ background: C.bg, cursor: "not-allowed" }} />
              </FormGroup>
              <FormGroup label="Số điện thoại">
                <Input placeholder="Nhập số điện thoại..." value={phone} onChange={(e) => setPhone(e.target.value)} />
              </FormGroup>
            </div>
            <Btn variant="primary" onClick={handleSaveProfile}>Lưu thay đổi</Btn>
          </CardBody>
        </Card>

        {/* Password */}
        <Card style={{ marginBottom: 18 }}>
          <CardHeader><CardTitle>🔒 Đổi mật khẩu</CardTitle></CardHeader>
          <CardBody>
            <FormGroup label="Mật khẩu hiện tại">
              <Input type="password" placeholder="••••••••" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
            </FormGroup>
            <FormGroup label="Mật khẩu mới">
              <Input type="password" placeholder="••••••••" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
            </FormGroup>
            <FormGroup label="Xác nhận mật khẩu mới">
              <Input type="password" placeholder="••••••••" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
            </FormGroup>
            <Btn variant="primary" onClick={handleChangePassword}>Đổi mật khẩu</Btn>
          </CardBody>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader><CardTitle>🔔 Cài đặt thông báo</CardTitle></CardHeader>
          <CardBody style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Thông báo khi bài thi được duyệt", value: notif1, set: setNotif1 },
              { label: "Thông báo khi có yêu cầu chỉnh sửa", value: notif2, set: setNotif2 },
              { label: "Nhận báo cáo thống kê hàng tuần", value: notif3, set: setNotif3 },
            ].map((n, i) => (
              <label
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: 13.5,
                  color: C.text1,
                }}
              >
                {n.label}
                <input
                  type="checkbox"
                  checked={n.value}
                  onChange={(e) => { n.set(e.target.checked); showToast(`✅ Đã ${e.target.checked ? "bật" : "tắt"} thông báo`); }}
                  style={{ width: 16, height: 16, accentColor: C.primary }}
                />
              </label>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
