import { Suspense, lazy } from "react";
import { HashRouter, Routes, Route } from "react-router";
import RoleSelect from "./pages/RoleSelect";

/**
 * App chung: HashRouter + Routes.
 * "/" = trang chọn vai trò. Mỗi actor một route "/<slug>/*".
 *
 * Mỗi actor được lazy-load → Vite tách riêng JS + CSS theo từng route.
 * Nhờ vậy CSS riêng của Khách (@figma/astraui) chỉ tải khi vào /khach,
 * không đè lên các actor khác. Thêm actor thứ 5 chỉ cần 1 dòng lazy + 1 <Route>.
 */
const KhachApp = lazy(() => import("./actors/khach/App"));
const HocSinhApp = lazy(() => import("./actors/hoc-sinh/App"));
const GiaoVienApp = lazy(() => import("./actors/giao-vien/App"));
const AdminApp = lazy(() => import("./actors/admin/App"));
const BienSoanApp = lazy(() => import("./actors/bien-soan/App"));

function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      Đang tải…
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<RoleSelect />} />
          <Route path="/khach/*" element={<KhachApp />} />
          <Route path="/hoc-sinh/*" element={<HocSinhApp />} />
          <Route path="/giao-vien/*" element={<GiaoVienApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/bien-soan/*" element={<BienSoanApp />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
