import { useEffect, useState } from "react";
import { useApp } from "../../context";
import { C, Card, CardHeader, CardTitle, Badge, Btn, FilterBar, SearchInput, Pagination, IconBtn } from "../ui";
import {
  getContentSubmissions,
  addContentSubmission,
  subscribeStore,
  type ContentSubmission,
} from "../../lib/classroomStore";

const STORE_LABEL: Record<string, string> = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Bị từ chối" };
const STORE_BADGE: Record<string, BadgeV> = { pending: "warning", approved: "success", rejected: "danger" };

const initialData = [
  { id: 1, name: "TOEIC Full Test #001", sub: "7 Parts đầy đủ", type: "Full Test", count: "200 câu", score: "990đ", status: "Đã duyệt", date: "12/06/2025" },
  { id: 2, name: "TOEIC Mini Test – Listening", sub: "4 Parts Listening", type: "Mini Test", count: "100 câu", score: "495đ", status: "Chờ duyệt", date: "11/06/2025" },
  { id: 3, name: "TOEIC Practice – Reading", sub: "3 Parts Reading", type: "Practice", count: "100 câu", score: "495đ", status: "Nháp", date: "10/06/2025" },
  { id: 4, name: "TOEIC Full Test #002", sub: "7 Parts đầy đủ", type: "Full Test", count: "200 câu", score: "990đ", status: "Đã duyệt", date: "09/06/2025" },
  { id: 5, name: "TOEIC Listening Part 1–2", sub: "2 Parts Listening", type: "Part Test", count: "50 câu", score: "200đ", status: "Đã duyệt", date: "08/06/2025" },
  { id: 6, name: "TOEIC Grammar Focus", sub: "Grammar chuyên sâu", type: "Practice", count: "60 câu", score: "—", status: "Chờ duyệt", date: "07/06/2025" },
];

type BadgeV = "success" | "warning" | "draft" | "danger";
const statusBadge: Record<string, BadgeV> = {
  "Đã duyệt": "success",
  "Chờ duyệt": "warning",
  Nháp: "draft",
};

export function BaiThi() {
  const { openModalFn, showToast } = useApp();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Trạng thái duyệt THẬT từ Admin (qua kho chung) — khớp theo tên bài thi.
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
      id: `bs-baithi-${row.id}`,
      title: row.name,
      type: "Bài thi",
      author: "Biên soạn",
      price: 199000,
      description: `${row.type} · ${row.count}`,
      status: "pending",
      createdAt: Date.now(),
    });
    showToast("📤 Đã gửi Admin duyệt để xuất bản!");
  };

  const filtered = data.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q);
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchType = !typeFilter || r.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa mục này không?")) {
      setData((d) => d.filter((r) => r.id !== id));
      showToast("🗑️ Đã xóa thành công!");
    }
  };

  return (
    <div style={{ padding: "24px 28px" }}>
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Bài Thi TOEIC</CardTitle>
          <Btn variant="primary" onClick={() => openModalFn("modal-create-test")}>+ Tạo bài thi mới</Btn>
        </CardHeader>
        <FilterBar>
          <SearchInput placeholder="Tìm bài thi..." onSearch={setSearch} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", fontSize: 12.5, color: C.text2, background: C.white, cursor: "pointer", outline: "none", fontFamily: "inherit" }}
          >
            <option value="">Trạng thái</option>
            <option>Đã duyệt</option>
            <option>Chờ duyệt</option>
            <option>Nháp</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", fontSize: 12.5, color: C.text2, background: C.white, cursor: "pointer", outline: "none", fontFamily: "inherit" }}
          >
            <option value="">Dạng bài</option>
            <option>Full Test</option>
            <option>Mini Test</option>
            <option>Practice</option>
            <option>Part Test</option>
          </select>
        </FilterBar>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["Tên bài thi", "Dạng bài", "Số câu", "Điểm tối đa", "Trạng thái", "Ngày tạo", "Thao tác"].map((h) => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11.5, color: C.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "48px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                    <p style={{ color: C.text2, fontSize: 14 }}>Không tìm thấy bài thi nào</p>
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    onClick={(e) => {
                      const tr = e.currentTarget as HTMLElement;
                      tr.closest("tbody")?.querySelectorAll("tr").forEach((r) => r.classList.remove("t-highlight-row"));
                      tr.classList.add("t-highlight-row");
                    }}
                    onMouseEnter={(e) => { if (!(e.currentTarget as HTMLElement).classList.contains("t-highlight-row")) (e.currentTarget as HTMLElement).style.background = "#F7F9FF"; }}
                    onMouseLeave={(e) => { if (!(e.currentTarget as HTMLElement).classList.contains("t-highlight-row")) (e.currentTarget as HTMLElement).style.background = ""; }}
                  >
                    <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{row.name}</div>
                      <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{row.sub}</div>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 13, borderBottom: `1px solid ${C.border}` }}>{row.type}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, borderBottom: `1px solid ${C.border}` }}>{row.count}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: row.score === "—" ? C.text3 : C.primary, borderBottom: `1px solid ${C.border}` }}>{row.score}</td>
                    <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                      {(() => {
                        const sub = subByTitle[row.name];
                        const label = sub ? STORE_LABEL[sub.status] : row.status;
                        const variant = sub ? STORE_BADGE[sub.status] : (statusBadge[row.status] || "draft");
                        return (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Badge variant={variant}>{label}</Badge>
                            {sub?.status === "approved" && (
                              <span style={{ fontSize: 11, fontWeight: 700, color: C.success }}>
                                • Đang bán {sub.price ? `${sub.price.toLocaleString("vi-VN")}đ` : ""}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 12, color: C.text2, borderBottom: `1px solid ${C.border}` }}>{row.date}</td>
                    <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {(() => {
                          const sub = subByTitle[row.name];
                          if (!sub || sub.status === "rejected") {
                            return <IconBtn onClick={() => handleSendReview(row)} title="Gửi Admin duyệt để xuất bản">📤</IconBtn>;
                          }
                          if (sub.status === "pending") {
                            return <IconBtn title="Đang chờ Admin duyệt">⏳</IconBtn>;
                          }
                          return <IconBtn title="Đã được Admin duyệt & đang bán">✅</IconBtn>;
                        })()}
                        <IconBtn onClick={() => openModalFn("modal-create-test")} title="Sửa">✏️</IconBtn>
                        <IconBtn del onClick={() => handleDelete(row.id)} title="Xóa">🗑️</IconBtn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination total="48 bài thi" shown={String(filtered.length)} pages={8} />
      </Card>
    </div>
  );
}
