import { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context";
import { C } from "./components/ui";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { Toast } from "./components/Toast";
import { NotifCenter } from "./components/NotifCenter";
import { VocabDrawer } from "./components/VocabDrawer";
import { FloatToolbar } from "./components/FloatToolbar";
import BackToHome from "../../components/BackToHome";
import ZaloButton from "../../components/ZaloButton";
import { Auth } from "./components/Auth";
import { getSession, clearSession, type Account } from "./lib/classroomStore";
import "./theme.css";

// Pages
import { Dashboard } from "./components/pages/Dashboard";
import { BaiThi } from "./components/pages/BaiThi";
import { KhoaHoc } from "./components/pages/KhoaHoc";
import { NganHang } from "./components/pages/NganHang";
import { TuVung } from "./components/pages/TuVung";
import { ThongKe } from "./components/pages/ThongKe";
import { CaiDat } from "./components/pages/CaiDat";

// Modals
import { ModalBaiThi } from "./components/modals/ModalBaiThi";
import { ModalKhoaHoc } from "./components/modals/ModalKhoaHoc";
import { ModalCauHoi } from "./components/modals/ModalCauHoi";
import { ModalTuVung } from "./components/modals/ModalTuVung";
import { ModalCreateTest } from "./components/modals/ModalCreateTest";
import { ModalCreateLesson } from "./components/modals/ModalCreateLesson";
import { ModalGrammar } from "./components/modals/ModalGrammar";
import { ModalImport } from "./components/modals/ModalImport";
import { ModalKanban } from "./components/modals/ModalKanban";
import { ModalPreview } from "./components/modals/ModalPreview";

function AppInner({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  const { currentPage, notifOpen, setNotifOpen } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState<boolean | undefined>(undefined);

  // Close notif on outside click
  useEffect(() => {
    const handler = () => setNotifOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [setNotifOpen]);

  // Close sidebar on outside click (mobile)
  const handleMainClick = () => {
    if (sidebarOpen === true) setSidebarOpen(false);
  };

  const pageMap = {
    dashboard: <Dashboard />,
    baothi: <BaiThi />,
    khoahoc: <KhoaHoc />,
    nganhang: <NganHang />,
    tuvung: <TuVung />,
    thongke: <ThongKe />,
    caidat: <CaiDat />,
  };

  return (
    <div className="theme-bien-soan" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: C.bg, color: C.text1, minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
        onLogout={onLogout}
      />

      {/* Main content */}
      <main
        className="bs-main"
        onClick={handleMainClick}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div style={{ flex: 1 }}>
          {pageMap[currentPage]}
        </div>
      </main>

      {/* Overlay components */}
      <NotifCenter />
      <VocabDrawer />
      <FloatToolbar />
      <Toast />

      {/* Modals */}
      <ModalBaiThi />
      <ModalKhoaHoc />
      <ModalCauHoi />
      <ModalTuVung />
      <ModalCreateTest />
      <ModalCreateLesson />
      <ModalGrammar />
      <ModalImport />
      <ModalKanban />
      <ModalPreview />

      <BackToHome /><ZaloButton />
    </div>
  );
}

export default function App() {
  const [account, setAccount] = useState<Account | null>(getSession("bien-soan"));
  if (!account) return <Auth onAuthed={setAccount} />;
  return (
    <AppProvider>
      <AppInner userName={account.name} onLogout={() => { clearSession("bien-soan"); setAccount(null); }} />
    </AppProvider>
  );
}
