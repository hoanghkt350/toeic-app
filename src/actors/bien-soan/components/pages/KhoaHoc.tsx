import { useEffect, useState } from "react";
import { useApp } from "../../context";
import { C, Card, CardHeader, CardTitle, Badge, Btn, FilterBar, SearchInput, IconBtn } from "../ui";
import { getContentSubmissions, addContentSubmission, subscribeStore, type ContentSubmission } from "../../lib/classroomStore";

type BadgeV = "success" | "warning" | "danger" | "draft";
const STORE_LABEL: Record<string, string> = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Bị từ chối" };
const STORE_BADGE: Record<string, BadgeV> = { pending: "warning", approved: "success", rejected: "danger" };

const initialData = [
  { id: 1, name: "TOEIC 500+ – Cơ bản", sub: "Dành cho người mới bắt đầu", lessons: "12 bài", students: "248 👥", progress: 60, progressColor: C.primary, status: "Đang hoạt động" },
  { id: 2, name: "TOEIC 700+ – Nâng cao", sub: "Dành cho người đã có nền tảng", lessons: "18 bài", students: "134 👥", progress: 35, progressColor: C.accent, status: "Đang hoạt động" },
  { id: 3, name: "TOEIC 900+ – Chuyên sâu", sub: "Dành cho người luyện thi cao cấp", lessons: "24 bài", students: "67 👥", progress: 20, progressColor: C.warning, status: "Nháp" },
];

export function KhoaHoc() {
  const { openModalFn, showToast } = useApp();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");

  // Trạng thái duyệt thật từ Admin (khớp theo tên khóa học).
  const [subs, setSubs] = useState<ContentSubmission[]>(getContentSubmissions());
  useEffect(() => {
    const refresh = () => setSubs(getContentSubmissions());
    refresh();
    const unsub = subscribeStore(refresh);
    const poll = setInterval(refresh, 2000);
    return () => { unsub(); clearInterval(poll); };
  }, []);
  const subByTitle: Record<string, ContentSubmission> = {};
  subs.forEach((s) => { subByTitle[s.title] = s; });

  const handleSendReview = (row: typeof initialData[number]) => {
    addContentSubmission({
      id: `bs-khoahoc-${row.id}`,
      title: row.name,
      type: "Khóa học",
      author: "Biên soạn",
      price: 499000,
      description: `${row.lessons} · ${row.sub}`,
      status: "pending",
      createdAt: Date.now(),
    });
    showToast("📤 Đã gửi Admin duyệt để xuất bản!");
  };

  const filtered = data.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa khóa học này không?")) {
      setData((d) => d.filter((r) => r.id !== id));
      showToast("🗑️ Đã xóa thành công!");
    }
  };

  return (
    <div style={{ padding: "24px 28px" }}>
      <Card>
        <CardHeader>
          <CardTitle>Khóa Học & Bài Học</CardTitle>
          <Btn variant="primary" onClick={() => openModalFn("modal-create-lesson")}>+ Tạo khóa học</Btn>
        </CardHeader>
        <FilterBar>
          <SearchInput placeholder="Tìm khóa học..." onSearch={setSearch} />
          <select style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", fontSize: 12.5, color: C.text2, background: C.white, cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
            <option>Tất cả</option>
            <option>Đang hoạt động</option>
            <option>Nháp</option>
          </select>
        </FilterBar>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["Tên khóa học", "Bài học", "Học viên", "Tiến độ", "Trạng thái", "Thao tác"].map((h) => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11.5, color: C.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F7F9FF")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                >
                  <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{row.name}</div>
                    <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{row.sub}</div>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 13, borderBottom: `1px solid ${C.border}` }}>{row.lessons}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, borderBottom: `1px solid ${C.border}` }}>{row.students}</td>
                  <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 100, height: 5, background: C.border, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                        <div className="t-progress-fill" style={{ width: `${row.progress}%`, height: "100%", borderRadius: 10, background: row.progressColor }} />
                      </div>
                      <span style={{ fontSize: 11, color: C.text2 }}>{row.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                    {(() => {
                      const sub = subByTitle[row.name];
                      const label = sub ? STORE_LABEL[sub.status] : row.status;
                      const variant: BadgeV = sub ? STORE_BADGE[sub.status] : (row.status === "Đang hoạt động" ? "success" : "draft");
                      return (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Badge variant={variant}>{label}</Badge>
                          {sub?.status === "approved" && (
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.success }}>• Đang bán {sub.price ? `${sub.price.toLocaleString("vi-VN")}đ` : ""}</span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {(() => {
                        const sub = subByTitle[row.name];
                        if (!sub || sub.status === "rejected") return <IconBtn onClick={() => handleSendReview(row)} title="Gửi Admin duyệt để xuất bản">📤</IconBtn>;
                        if (sub.status === "pending") return <IconBtn title="Đang chờ Admin duyệt">⏳</IconBtn>;
                        return <IconBtn title="Đã được Admin duyệt & đang bán">✅</IconBtn>;
                      })()}
                      <IconBtn onClick={() => openModalFn("modal-create-lesson")} title="Sửa">✏️</IconBtn>
                      <IconBtn del onClick={() => handleDelete(row.id)} title="Xóa">🗑️</IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
