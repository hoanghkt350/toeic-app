import { useEffect, useState } from "react";
import { FileText, Inbox, Clock, Headphones, BookOpen, PenLine } from "lucide-react";
import { getAssignments, subscribeStore, type Assignment } from "../lib/classroomStore";

function typeStyle(type: string) {
  if (type === "Listening") return { bg: "#eff6ff", color: "#1d4ed8", Icon: Headphones };
  if (type === "Writing") return { bg: "#fef3c7", color: "#b45309", Icon: PenLine };
  return { bg: "#ecfdf5", color: "#047857", Icon: BookOpen };
}

export function Assignments() {
  const [list, setList] = useState<Assignment[]>(getAssignments());

  useEffect(() => {
    const refresh = () => setList(getAssignments());
    refresh();
    const unsub = subscribeStore(refresh);
    const poll = setInterval(refresh, 2000);
    return () => {
      unsub();
      clearInterval(poll);
    };
  }, []);

  if (list.length === 0) {
    return (
      <div style={{ maxWidth: 560, margin: "40px auto", textAlign: "center" }}>
        <div className="rounded-3xl border border-border p-10" style={{ background: "var(--card)" }}>
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ background: "var(--muted)" }}>
            <Inbox size={28} style={{ color: "var(--muted-foreground)" }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--foreground)" }}>Chưa có bài tập nào được giao</div>
          <p style={{ fontSize: "0.84rem", color: "var(--muted-foreground)", marginTop: 6 }}>
            Khi giáo viên xuất bản đề thi / bài tập, nó sẽ tự động xuất hiện ở đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
      <div className="flex items-center gap-2 mb-4" style={{ color: "var(--muted-foreground)", fontSize: "0.8rem", fontWeight: 700 }}>
        <FileText size={16} /> {list.length} bài được giao
      </div>
      <div className="flex flex-col gap-3">
        {list.map((a) => {
          const ts = typeStyle(a.type);
          const Icon = ts.Icon;
          const date = new Date(a.createdAt).toLocaleDateString("vi-VN");
          return (
            <div key={a.id} className="rounded-2xl border border-border p-4 flex items-center gap-4" style={{ background: "var(--card)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: ts.bg }}>
                <Icon size={20} style={{ color: ts.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--foreground)" }}>{a.title}</div>
                <div className="flex items-center gap-3 mt-1" style={{ fontSize: "0.74rem", color: "var(--muted-foreground)" }}>
                  <span className="rounded-full px-2 py-0.5" style={{ background: ts.bg, color: ts.color, fontWeight: 700 }}>{a.type}</span>
                  {a.questionCount ? <span>{a.questionCount} câu</span> : null}
                  {a.by ? <span>· GV: {a.by}</span> : null}
                  <span className="inline-flex items-center gap-1"><Clock size={12} /> {date}</span>
                </div>
              </div>
              <span className="rounded-full px-3 py-1 flex-shrink-0" style={{ background: "var(--accent)", color: "var(--primary)", fontSize: "0.72rem", fontWeight: 800 }}>
                {a.status || "Đã giao"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
