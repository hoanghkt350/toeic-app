import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

export type PageId = "dashboard" | "baothi" | "khoahoc" | "nganhang" | "tuvung" | "thongke" | "caidat";
export type ModalId =
  | "modal-baothi"
  | "modal-khoahoc"
  | "modal-cauhoi"
  | "modal-tuvung"
  | "modal-create-test"
  | "modal-create-lesson"
  | "modal-grammar"
  | "modal-import"
  | "modal-kanban"
  | "modal-preview"
  | null;

interface AppContextValue {
  currentPage: PageId;
  setCurrentPage: (id: PageId) => void;
  darkMode: boolean;
  toggleDark: () => void;
  toastMsg: string;
  showToast: (msg: string) => void;
  openModal: ModalId;
  openModalFn: (id: ModalId) => void;
  closeModal: () => void;
  vocabDrawerOpen: boolean;
  setVocabDrawerOpen: (v: boolean) => void;
  notifOpen: boolean;
  setNotifOpen: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue>(null!);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [openModal, setOpenModal] = useState<ModalId>(null);
  const [vocabDrawerOpen, setVocabDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const toggleDark = useCallback(() => {
    setDarkMode((d) => {
      const next = !d;
      document.body.classList.toggle("dark-mode", next);
      return next;
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
  }, []);

  const openModalFn = useCallback((id: ModalId) => {
    setOpenModal(id);
    if (id) document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setOpenModal(null);
    document.body.style.overflow = "";
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        darkMode,
        toggleDark,
        toastMsg: toastVisible ? toastMsg : "",
        showToast,
        openModal,
        openModalFn,
        closeModal,
        vocabDrawerOpen,
        setVocabDrawerOpen,
        notifOpen,
        setNotifOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

export const pageTitles: Record<PageId, string> = {
  dashboard: "Bảng tin",
  baothi: "Bài Thi TOEIC",
  khoahoc: "Khóa Học & Bài Học",
  nganhang: "Ngân Hàng Câu Hỏi",
  tuvung: "Từ Vựng & Ngữ Pháp",
  thongke: "Thống Kê & Báo Cáo",
  caidat: "Cài Đặt",
};
