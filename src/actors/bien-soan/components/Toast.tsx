import { useApp } from "../context";
import { C } from "./ui";

export function Toast() {
  const { toastMsg } = useApp();
  if (!toastMsg) return null;
  return (
    <div
      className="t-toast-anim"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: C.text1,
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 10,
        fontSize: 13.5,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 4px 24px rgba(28,99,234,0.10)",
      }}
    >
      {toastMsg}
    </div>
  );
}
