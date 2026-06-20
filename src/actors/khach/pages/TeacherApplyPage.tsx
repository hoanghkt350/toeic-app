import { useState } from "react";
import { GraduationCap, Upload, CheckCircle2, FileText } from "lucide-react";
import { addTeacherApplication } from "../lib/classroomStore";

/**
 * Khách đăng ký làm Giáo viên — kèm chứng chỉ (ảnh) để Admin xét duyệt.
 * Đơn được ghi vào kho chung → hiện ở Admin "Duyệt Giáo viên".
 */
export function TeacherApplyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [certName, setCertName] = useState("");
  const [certImage, setCertImage] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCertName(file.name);
    if (file.type.startsWith("image/") && file.size <= 2_500_000) {
      const reader = new FileReader();
      reader.onload = () => setCertImage(String(reader.result));
      reader.readAsDataURL(file);
    } else {
      setCertImage(""); // ảnh quá lớn / không phải ảnh → chỉ lưu tên
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErr("Vui lòng nhập họ tên và email.");
      return;
    }
    if (!certName) {
      setErr("Vui lòng đính kèm chứng chỉ.");
      return;
    }
    addTeacherApplication({
      id: `ta-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      certName,
      certImage: certImage || undefined,
      note: note.trim() || undefined,
      status: "pending",
      createdAt: Date.now(),
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="rounded-3xl border p-10" style={{ background: "#fff", borderColor: "#e2e8f0", boxShadow: "0 8px 30px rgba(2,6,23,0.06)" }}>
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ background: "#ecfdf5" }}>
            <CheckCircle2 size={30} color="#16a34a" />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "#0f172a" }}>Đã gửi đơn đăng ký!</h2>
          <p className="text-sm mt-2" style={{ color: "#64748b" }}>
            Đơn của bạn đã được gửi tới Admin để xét duyệt chứng chỉ. Bạn sẽ trở thành Giáo viên khi được duyệt.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10 w-full">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "#eef2ff", color: "#4f46e5" }}>
          <GraduationCap size={14} /> Trở thành Giáo viên
        </span>
        <h1 className="text-2xl font-bold mt-3" style={{ color: "#0f172a" }}>Đăng ký làm Giáo viên</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>Điền thông tin và đính kèm chứng chỉ để Admin xét duyệt.</p>
      </div>

      <form onSubmit={submit} className="rounded-3xl border p-6 flex flex-col gap-4" style={{ background: "#fff", borderColor: "#e2e8f0", boxShadow: "0 8px 30px rgba(2,6,23,0.06)" }}>
        <div>
          <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "#64748b" }}>Họ và tên</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A"
            className="w-full rounded-xl px-4 py-3 mt-1" style={{ border: "1px solid #e2e8f0", outline: "none" }} />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "#64748b" }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com"
            className="w-full rounded-xl px-4 py-3 mt-1" style={{ border: "1px solid #e2e8f0", outline: "none" }} />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "#64748b" }}>Chứng chỉ (TESOL / IELTS / TOEIC…)</label>
          <label className="w-full rounded-xl px-4 py-3 mt-1 flex items-center gap-2 cursor-pointer" style={{ border: "1.5px dashed #c7d2fe", background: "#f8faff", color: "#4f46e5", fontWeight: 600, fontSize: "0.86rem" }}>
            <Upload size={16} />
            {certName || "Chọn ảnh chứng chỉ để tải lên"}
            <input type="file" accept="image/*" onChange={onPickFile} style={{ display: "none" }} />
          </label>
          {certImage && (
            <img src={certImage} alt="preview" className="mt-2 rounded-lg border" style={{ borderColor: "#e2e8f0", maxHeight: 160, objectFit: "contain", background: "#f8fafc" }} />
          )}
          {certName && !certImage && (
            <div className="mt-2 flex items-center gap-2 text-sm" style={{ color: "#64748b" }}>
              <FileText size={15} /> {certName}
            </div>
          )}
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "#64748b" }}>Giới thiệu ngắn (tuỳ chọn)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Kinh nghiệm giảng dạy, thế mạnh…"
            className="w-full rounded-xl px-4 py-3 mt-1" style={{ border: "1px solid #e2e8f0", outline: "none", resize: "vertical" }} />
        </div>

        {err && <p className="text-sm" style={{ color: "#dc2626" }}>{err}</p>}

        <button type="submit" className="rounded-full py-3 font-semibold" style={{ background: "#4f46e5", color: "#fff", border: "none", cursor: "pointer" }}>
          Gửi đơn đăng ký
        </button>
      </form>
    </div>
  );
}
