import { ReactNode, CSSProperties } from "react";

const C = {
  primary: "#1C63EA",
  primary2: "#0D46BA",
  accent: "#0EC59C",
  purple: "#7B3FED",
  bg: "var(--t-bg)",
  white: "var(--t-white)",
  border: "var(--t-border)",
  text1: "var(--t-text1)",
  text2: "var(--t-text2)",
  text3: "var(--t-text3)",
  success: "#1EBA7B",
  warning: "#FDB218",
  danger: "#EF4444",
  sidebarBg: "#121830",
  tagBlue: "var(--t-tag-blue)",
  tagGreen: "var(--t-tag-green)",
  tagOrange: "var(--t-tag-orange)",
  tagPurple: "var(--t-tag-purple)",
};
export { C };

type BtnVariant = "primary" | "outline" | "danger" | "success" | "purple";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  children: ReactNode;
  style?: CSSProperties;
}

export function Btn({ variant = "outline", children, style, ...rest }: BtnProps) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    transition: "all .18s",
    fontFamily: "inherit",
    lineHeight: 1.4,
    ...style,
  };
  const variants: Record<BtnVariant, CSSProperties> = {
    primary: { background: C.primary, color: "#fff" },
    outline: { background: C.white, color: C.text2, border: `1.5px solid ${C.border}` },
    danger: { background: "#FEE2E2", color: C.danger },
    success: { background: C.tagGreen, color: C.success },
    purple: { background: C.purple, color: "#fff" },
  };
  return (
    <button style={{ ...base, ...variants[variant] }} {...rest}>
      {children}
    </button>
  );
}

type BadgeVariant = "success" | "warning" | "danger" | "draft" | "blue" | "purple" | "accent";

export function Badge({ variant, children, style }: { variant: BadgeVariant; children: ReactNode; style?: CSSProperties }) {
  const map: Record<BadgeVariant, CSSProperties> = {
    success: { background: C.tagGreen, color: C.success },
    warning: { background: C.tagOrange, color: C.warning },
    danger: { background: "#FEE2E2", color: C.danger },
    draft: { background: C.bg, color: C.text3 },
    blue: { background: C.tagBlue, color: C.primary },
    purple: { background: C.tagPurple, color: C.purple },
    accent: { background: "#d6f7f0", color: C.accent },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        ...map[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: C.white,
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(28,99,234,0.07)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        padding: "18px 20px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text1, margin: 0 }}>{children}</h3>;
}

export function CardBody({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ padding: 20, ...style }}>{children}</div>;
}

interface FormGroupProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}

export function FormGroup({ label, required, children, style }: FormGroupProps) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: C.text1,
          marginBottom: 6,
        }}
      >
        {label} {required && <span style={{ color: C.danger }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: `1.5px solid ${C.border}`,
  borderRadius: 8,
  fontSize: 13,
  color: C.text1,
  background: C.white,
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color .15s",
  boxSizing: "border-box",
};

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      style={inputStyle}
      onFocus={(e) => (e.target.style.borderColor = C.primary)}
      onBlur={(e) => (e.target.style.borderColor = C.border)}
      {...props}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
      onFocus={(e) => (e.target.style.borderColor = C.primary)}
      onBlur={(e) => (e.target.style.borderColor = C.border)}
      {...props}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      style={{ ...inputStyle, cursor: "pointer" }}
      onFocus={(e) => (e.target.style.borderColor = C.primary)}
      onBlur={(e) => (e.target.style.borderColor = C.border)}
      {...props}
    />
  );
}

export function IconBtn({
  children,
  del,
  onClick,
  title,
}: {
  children: ReactNode;
  del?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 30,
        height: 30,
        borderRadius: 7,
        border: `1px solid ${C.border}`,
        background: C.white,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        transition: "all .15s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        if (del) {
          el.style.borderColor = C.danger;
          el.style.background = "#FEE2E2";
        } else {
          el.style.borderColor = C.primary;
          el.style.background = C.tagBlue;
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = C.border;
        el.style.background = C.white;
      }}
    >
      {children}
    </button>
  );
}

export function ModalOverlay({
  open,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
        padding: wide ? "20px 0" : 0,
        overflowY: wide ? "auto" : undefined,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.white,
          borderRadius: 12,
          padding: 28,
          width: wide ? 720 : 540,
          maxWidth: "95vw",
          maxHeight: wide ? undefined : "90vh",
          overflowY: wide ? undefined : "auto",
          boxShadow: "0 4px 24px rgba(28,99,234,0.10)",
          margin: wide ? "auto" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: C.text1 }}>{title}</h3>
      <button
        onClick={onClose}
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          border: "none",
          background: C.bg,
          cursor: "pointer",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.text2,
        }}
      >
        ✕
      </button>
    </div>
  );
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        justifyContent: "flex-end",
        marginTop: 20,
        paddingTop: 16,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      {children}
    </div>
  );
}

export function RadioOpt({
  active,
  success,
  onClick,
  children,
}: {
  active?: boolean;
  success?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <span
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        fontSize: 13,
        padding: "6px 14px",
        border: `1.5px solid ${active ? (success ? C.success : C.primary) : C.border}`,
        borderRadius: 20,
        background: active ? (success ? C.tagGreen : C.tagBlue) : C.white,
        color: active ? (success ? C.success : C.primary) : C.text2,
        fontWeight: active ? 600 : 400,
        transition: "all .15s",
      }}
    >
      {children}
    </span>
  );
}

export function TagPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      style={{
        background: C.tagBlue,
        color: C.primary,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {label}
      <span onClick={onRemove} style={{ cursor: "pointer", fontSize: 14, lineHeight: 1 }}>
        ×
      </span>
    </span>
  );
}

export function UploadZone({ label, icon = "📄", sub = "Kéo thả hoặc nhấn để chọn" }: { label?: string; icon?: string; sub?: string }) {
  return (
    <div
      style={{
        border: `2px dashed ${C.border}`,
        borderRadius: 8,
        padding: 24,
        textAlign: "center",
        cursor: "pointer",
        background: C.bg,
        transition: "all .2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = C.primary;
        (e.currentTarget as HTMLElement).style.background = C.tagBlue;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = C.border;
        (e.currentTarget as HTMLElement).style.background = C.bg;
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
      <p style={{ fontSize: 13, color: C.text2 }}>{label || sub}</p>
      {label && <span style={{ fontSize: 11.5, color: C.text3 }}>{sub}</span>}
    </div>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "16px 0" }} />;
}

export function SearchInput({ placeholder, onSearch }: { placeholder: string; onSearch?: (v: string) => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        border: `1.5px solid ${C.border}`,
        borderRadius: 20,
        padding: "7px 14px",
        background: C.bg,
        flex: 1,
        minWidth: 200,
        maxWidth: 300,
      }}
    >
      <span>🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        style={{
          border: "none",
          background: "none",
          outline: "none",
          fontSize: 12.5,
          color: C.text1,
          width: "100%",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 20px",
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
}

export function Chip({
  active,
  purple,
  onClick,
  children,
}: {
  active?: boolean;
  purple?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 14px",
        borderRadius: 20,
        fontSize: 12,
        cursor: "pointer",
        border: `1.5px solid ${active ? (purple ? C.purple : C.primary) : C.border}`,
        background: active ? (purple ? C.purple : C.primary) : C.white,
        color: active ? "#fff" : C.text2,
        transition: "all .15s",
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </span>
  );
}

export function Pagination({ total, shown, pages = 8 }: { total: string; shown: string; pages?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <span style={{ fontSize: 12, color: C.text2 }}>
        Hiển thị {shown} / {total}
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        {["←", "1", "2", "3", "...", String(pages), "→"].map((p, i) => (
          <button
            key={i}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: `1.5px solid ${p === "1" ? C.primary : C.border}`,
              background: p === "1" ? C.primary : C.white,
              color: p === "1" ? "#fff" : C.text2,
              cursor: "pointer",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: p === "1" ? 700 : 400,
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepBar({ current }: { current: number }) {
  const steps = ["Thông tin", "Cấu trúc", "Câu hỏi", "Xuất bản"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 28 }}>
      {steps.map((label, i) => {
        const num = i + 1;
        const isDone = num < current;
        const isActive = num === current;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  border: `2.5px solid ${isDone ? C.success : isActive ? C.primary : C.border}`,
                  background: isDone ? C.success : isActive ? C.primary : C.white,
                  color: isDone || isActive ? "#fff" : C.text3,
                  boxShadow: isActive ? `0 0 0 4px rgba(28,99,234,0.15)` : undefined,
                  transition: "all .3s",
                }}
              >
                {isDone ? "✓" : num}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: isDone ? C.success : isActive ? C.primary : C.text3,
                  marginTop: 4,
                  whiteSpace: "nowrap",
                  fontWeight: isActive || isDone ? 600 : 400,
                }}
              >
                {label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  width: 60,
                  height: 2,
                  background: isDone ? C.success : C.border,
                  margin: "0 4px 16px",
                  flexShrink: 0,
                  transition: "background .3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
