import { useState } from "react";
import { Crown, Check, X, Building2, Copy, CheckCircle2 } from "lucide-react";
import { addPurchase, type Account } from "../lib/classroomStore";

const PLANS = [
  { id: "p1", name: "Premium 1 tháng", price: 199000, perks: ["Mở khóa toàn bộ đề thi", "Chấm phát âm không giới hạn", "Lộ trình cá nhân hoá"] },
  { id: "p2", name: "Premium 1 năm", price: 1490000, perks: ["Tất cả quyền lợi Premium", "Tiết kiệm 38%", "Ưu tiên hỗ trợ gia sư"], best: true },
  { id: "p3", name: "Khóa TOEIC 700+", price: 899000, perks: ["48 buổi học có lộ trình", "Tài liệu + đề luyện", "Chứng nhận hoàn thành"] },
];

const BANK = { name: "Vietcombank", acc: "0123456789", holder: "CONG TY TOEIC PRO" };

export function Upgrade({ account }: { account: Account | null }) {
  const [pay, setPay] = useState<(typeof PLANS)[number] | null>(null);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState("");

  const note = account ? `TOEIC ${account.email.split("@")[0]}` : "TOEIC PRO";

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(""), 1500); }).catch(() => {});
  };

  const confirmPaid = () => {
    if (!pay) return;
    addPurchase({
      id: `pur-${Date.now()}`,
      buyerName: account?.name || "Học viên",
      buyerEmail: account?.email || "",
      item: pay.name,
      amount: pay.price,
      method: "Chuyển khoản",
      status: "pending",
      createdAt: Date.now(),
    });
    setDone(true);
  };

  const closeModal = () => { setPay(null); setDone(false); };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", width: "100%" }}>
      <div className="rounded-2xl p-6 mb-6" style={{ background: "linear-gradient(120deg,#1d4ed8,#2563eb,#3b82f6)", color: "#fff" }}>
        <div className="flex items-center gap-2" style={{ fontWeight: 800, fontSize: 20 }}><Crown size={22} /> Nâng cấp tài khoản</div>
        <p style={{ opacity: 0.85, marginTop: 6, fontSize: 13.5 }}>Mở khóa toàn bộ tính năng luyện thi TOEIC. Thanh toán bằng chuyển khoản ngân hàng.</p>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
        {PLANS.map((p) => (
          <div key={p.id} className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: p.best ? "#1d4ed8" : "var(--border)", position: "relative", boxShadow: p.best ? "0 10px 30px rgba(29,78,216,0.18)" : "none" }}>
            {p.best && <span style={{ position: "absolute", top: -10, right: 16, background: "#1d4ed8", color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 999 }}>Phổ biến</span>}
            <div style={{ fontWeight: 800, fontSize: 16, color: "var(--foreground)" }}>{p.name}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#1d4ed8", margin: "8px 0 14px" }}>{p.price.toLocaleString("vi-VN")}đ</div>
            <div className="flex flex-col gap-2 mb-5">
              {p.perks.map((k, i) => (
                <div key={i} className="flex items-center gap-2" style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
                  <Check size={15} style={{ color: "#16a34a" }} /> {k}
                </div>
              ))}
            </div>
            <button onClick={() => { setPay(p); setDone(false); }} className="w-full rounded-xl py-2.5" style={{ background: "#1d4ed8", color: "#fff", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
              Mua ngay
            </button>
          </div>
        ))}
      </div>

      {/* Modal chuyển khoản */}
      {pay && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 80, padding: 16 }} onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 420, padding: 24, position: "relative" }}>
            <button onClick={closeModal} style={{ position: "absolute", top: 14, right: 14, border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>

            {!done ? (
              <>
                <div className="flex items-center gap-2" style={{ fontWeight: 800, fontSize: 17, color: "#0f172a" }}><Building2 size={20} style={{ color: "#1d4ed8" }} /> Chuyển khoản</div>
                <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 16px" }}>{pay.name} · <b style={{ color: "#1d4ed8" }}>{pay.price.toLocaleString("vi-VN")}đ</b></p>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                  <img alt="QR chuyển khoản" width={170} height={170} style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(`${BANK.name} ${BANK.acc} ${pay.price} ${note}`)}`} />
                </div>

                {[
                  { label: "Ngân hàng", value: BANK.name, k: "bank" },
                  { label: "Số tài khoản", value: BANK.acc, k: "acc" },
                  { label: "Chủ tài khoản", value: BANK.holder, k: "holder" },
                  { label: "Số tiền", value: `${pay.price.toLocaleString("vi-VN")}đ`, k: "amt" },
                  { label: "Nội dung", value: note, k: "note" },
                ].map((r) => (
                  <div key={r.k} className="flex items-center justify-between" style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 12.5, color: "#94a3b8" }}>{r.label}</span>
                    <span className="flex items-center gap-2" style={{ fontSize: 13.5, fontWeight: 700, color: "#1e293b" }}>
                      {r.value}
                      <button onClick={() => copy(r.value, r.k)} style={{ border: "none", background: "none", cursor: "pointer", color: copied === r.k ? "#16a34a" : "#94a3b8" }}>
                        {copied === r.k ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      </button>
                    </span>
                  </div>
                ))}

                <button onClick={confirmPaid} className="w-full rounded-xl py-3 mt-5" style={{ background: "#16a34a", color: "#fff", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                  Tôi đã chuyển khoản
                </button>
                <p style={{ fontSize: 11.5, color: "#94a3b8", textAlign: "center", marginTop: 8 }}>Admin sẽ xác nhận giao dịch của bạn.</p>
              </>
            ) : (
              <div className="text-center" style={{ padding: "20px 0" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <CheckCircle2 size={32} color="#16a34a" />
                </div>
                <div style={{ fontWeight: 800, fontSize: 17, color: "#0f172a" }}>Đã gửi yêu cầu!</div>
                <p style={{ fontSize: 13.5, color: "#64748b", marginTop: 6 }}>Giao dịch <b>{pay.name}</b> đang chờ Admin xác nhận. Theo dõi trạng thái sau khi Admin duyệt.</p>
                <button onClick={closeModal} className="rounded-xl px-6 py-2.5 mt-5" style={{ background: "#1d4ed8", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>Đóng</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
