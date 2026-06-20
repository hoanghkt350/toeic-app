import { useState } from "react";
import { useApp } from "../../context";
import { C, Card, CardHeader, CardTitle, Badge, Btn, FilterBar, SearchInput, Pagination, IconBtn } from "../ui";

const initialData = [
  { id: 1, word: "negotiate", pron: "/nɪˈɡoʊʃieɪt/", meaning: "đàm phán, thương lượng", example: "They negotiate a new contract.", topic: "Business", level: "B2", levelBadge: "warning" as const, topicCat: "Business" },
  { id: 2, word: "accomplish", pron: "/əˈkʌmplɪʃ/", meaning: "hoàn thành, đạt được", example: "She accomplished her goals.", topic: "Business", level: "B1", levelBadge: "success" as const, topicCat: "Business" },
  { id: 3, word: "infrastructure", pron: "/ˈɪnfrəˌstrʌktʃər/", meaning: "cơ sở hạ tầng", example: "Digital infrastructure is crucial.", topic: "Technology", level: "C1", levelBadge: "danger" as const, topicCat: "Technology" },
  { id: 4, word: "collaboration", pron: "/kəˌlæbəˈreɪʃn/", meaning: "sự hợp tác", example: "Collaboration is key to success.", topic: "Business", level: "B1", levelBadge: "success" as const, topicCat: "Business" },
  { id: 5, word: "itinerary", pron: "/aɪˈtɪnəreri/", meaning: "lịch trình, hành trình", example: "Please confirm your itinerary.", topic: "Travel", level: "B2", levelBadge: "warning" as const, topicCat: "Travel" },
];

const TOPICS = ["Tất cả", "Business", "Technology", "Travel"];

export function TuVung() {
  const { openModalFn, showToast, setVocabDrawerOpen } = useApp();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState("Tất cả");

  const filtered = data.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.word.toLowerCase().includes(q) || r.meaning.toLowerCase().includes(q);
    const matchTopic = activeTopic === "Tất cả" || r.topicCat === activeTopic;
    return matchSearch && matchTopic;
  });

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa từ vựng này không?")) {
      setData((d) => d.filter((r) => r.id !== id));
      showToast("🗑️ Đã xóa thành công!");
    }
  };

  return (
    <div style={{ padding: "24px 28px" }}>
      <Card>
        <CardHeader>
          <CardTitle>Từ Vựng & Ngữ Pháp</CardTitle>
          <div style={{ display: "flex", gap: 6 }}>
            <Btn variant="outline" style={{ fontSize: 12 }} onClick={() => openModalFn("modal-grammar")}>📘 Ngữ pháp</Btn>
            <Btn variant="outline" style={{ fontSize: 12 }} onClick={() => openModalFn("modal-import")}>📥 Import</Btn>
            <Btn variant="purple" onClick={() => openModalFn("modal-tuvung")}>+ Thêm từ mới</Btn>
          </div>
        </CardHeader>
        <FilterBar>
          <div style={{ display: "flex", gap: 6 }}>
            {TOPICS.map((topic) => (
              <span
                key={topic}
                onClick={() => setActiveTopic(topic)}
                style={{
                  display: "inline-flex", alignItems: "center", padding: "5px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                  border: `1.5px solid ${activeTopic === topic ? C.purple : C.border}`,
                  background: activeTopic === topic ? C.purple : C.white,
                  color: activeTopic === topic ? "#fff" : C.text2,
                  fontWeight: activeTopic === topic ? 600 : 400,
                  transition: "all .15s",
                }}
              >
                {topic}
              </span>
            ))}
          </div>
          <div style={{ marginLeft: "auto" }}>
            <SearchInput placeholder="Tìm từ vựng..." onSearch={setSearch} />
          </div>
        </FilterBar>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["Từ vựng", "Phiên âm", "Nghĩa tiếng Việt", "Ví dụ", "Chủ đề", "Mức độ", ""].map((h) => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11.5, color: C.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F7F9FF")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}>
                  <td
                    style={{ padding: "13px 16px", fontWeight: 700, color: C.text1, borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}
                    onClick={() => setVocabDrawerOpen(true)}
                    title="Nhấn để xem chi tiết"
                  >
                    {row.word}
                  </td>
                  <td style={{ padding: "13px 16px", color: C.text3, fontSize: 12, borderBottom: `1px solid ${C.border}` }}>{row.pron}</td>
                  <td style={{ padding: "13px 16px", color: C.primary, fontWeight: 500, fontSize: 13, borderBottom: `1px solid ${C.border}` }}>{row.meaning}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: C.text2, borderBottom: `1px solid ${C.border}` }}>{row.example}</td>
                  <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                    <Badge variant="purple">{row.topic}</Badge>
                  </td>
                  <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                    <Badge variant={row.levelBadge}>{row.level}</Badge>
                  </td>
                  <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <IconBtn title="Nghe" onClick={() => showToast("🔊 Đang phát âm...")}>🔊</IconBtn>
                      <IconBtn onClick={() => openModalFn("modal-tuvung")}>✏️</IconBtn>
                      <IconBtn del onClick={() => handleDelete(row.id)}>🗑️</IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total="1,240 từ vựng" shown={String(filtered.length)} pages={2} />
      </Card>
    </div>
  );
}
