// src/app/components/Topbar.tsx
import { useState, useRef, useEffect } from "react";
import { Search, Bell, LogOut, User, Settings, X, CheckCircle } from "lucide-react";
import type { Screen } from "../App";

const screenTitlesVi: Record<string, string> = {
  tongquan: "Tổng quan",
  quanlydeti: "Quản lý Đề thi",
  soanthaode: "Soạn thảo Đề",
  chamdiemhocvien: "Chấm điểm Học viên",
  quanlylophoc: "Quản lý Lớp học",
};

const screenTitlesEn: Record<string, string> = {
  tongquan: "Dashboard",
  quanlydeti: "Test Bank",
  soanthaode: "Create Test",
  chamdiemhocvien: "Grading",
  quanlylophoc: "Class Management",
};

interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

interface TopbarProps {
  activeScreen: string;
  showToast?: (msg: string) => void;
  isDarkMode?: boolean;
  setIsDarkMode?: React.Dispatch<React.SetStateAction<boolean>>;
  profile?: ProfileData;
  setProfile?: React.Dispatch<React.SetStateAction<ProfileData>>;
  onNavigate?: (screen: Screen) => void;
  onLogout?: () => void;
  lang?: string;
  setLang?: (lang: "vi" | "en") => void;
}

export function Topbar({ 
  activeScreen, 
  showToast, 
  isDarkMode = false, 
  setIsDarkMode, 
  profile = { name: "Người Tạo", email: "teacher@actorteacher.com", phone: "0123 456 789" }, 
  setProfile,
  onNavigate,
  onLogout,
  lang = "vi",
  setLang
}: TopbarProps) {
  const isEn = lang === "en";
  const screenTitles = isEn ? screenTitlesEn : screenTitlesVi;

  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Modals state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Temp profile state for editing
  const [tempProfile, setTempProfile] = useState<ProfileData>(profile);

  useEffect(() => {
    setTempProfile(profile);
  }, [profile, showProfileModal]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearchResults(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (msg: string, modalSetter?: React.Dispatch<React.SetStateAction<boolean>>, navigateTo?: Screen) => {
    setShowProfileMenu(false);
    setShowNotif(false);
    setShowSearchResults(false);
    
    if (modalSetter) {
      modalSetter(true);
    } else {
      if (navigateTo && onNavigate) {
        onNavigate(navigateTo);
      }
      if (showToast && msg) {
        showToast(msg);
      }
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setShowSearchResults(true);
    }
  }

  const handleSaveProfile = () => {
    if (setProfile) setProfile(tempProfile);
    setShowProfileModal(false);
    if (showToast) showToast(isEn ? "Profile saved successfully!" : "Đã lưu hồ sơ thành công!");
  };

  return (
    <>
    <header
      className="flex items-center justify-between px-6 py-4 border-b border-border bg-card relative z-40 shrink-0"
      style={{ height: 64 }}
    >
      <h1 style={{ fontSize: 18, fontWeight: 600, color: "#0F172A" }}>
        {screenTitles[activeScreen] ?? (isEn ? "Dashboard" : "Tổng quan")}
      </h1>

      <div className="flex items-center gap-3 relative">
        <div className="relative" ref={searchRef}>
          <div
            className="flex items-center gap-2 px-3 rounded-lg border border-border"
            style={{ background: "#F8FAFC", height: 36, width: 220 }}
          >
            <Search size={15} style={{ color: "#94A3B8" }} />
            <input
              placeholder={isEn ? "Search (Enter)..." : "Tìm kiếm (Enter)..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim().length > 0) setShowSearchResults(true);
                else setShowSearchResults(false);
              }}
              onKeyDown={handleSearch}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
                color: "#0F172A",
                width: "100%",
              }}
            />
          </div>
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50">
              <div className="p-3 border-b border-border bg-slate-50">
                <span className="font-semibold text-xs text-slate-500 uppercase">{isEn ? `Search results for "${searchQuery}"` : `Kết quả tìm kiếm cho "${searchQuery}"`}</span>
              </div>
              <div className="p-3 hover:bg-slate-50 border-b border-border cursor-pointer" onClick={() => handleAction(isEn ? "Opened ETS Test" : "Đã mở bài thi ETS", undefined, "quanlydeti")}>
                <p className="text-sm text-slate-700 font-medium truncate">ETS 2024 Full Test 1</p>
                <p className="text-xs text-slate-500 mt-1">{isEn ? "TOEIC Test • Go to Test Bank" : "Đề thi TOEIC • Chuyển đến Quản lý đề thi"}</p>
              </div>
              <div className="p-3 hover:bg-slate-50 cursor-pointer" onClick={() => handleAction(isEn ? "Opened Student Submission" : "Đã mở bài nộp của học viên", undefined, "chamdiemhocvien")}>
                <p className="text-sm text-slate-700 font-medium truncate">Nguyễn Minh Anh</p>
                <p className="text-xs text-slate-500 mt-1">{isEn ? "Student - Class TOEIC 600+ • Go to Grading" : "Học viên - Lớp TOEIC 600+ • Chuyển đến Chấm điểm"}</p>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative flex items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted cursor-pointer"
            style={{ width: 36, height: 36, background: showNotif ? "#F1F5F9" : "#fff" }}
          >
            <Bell size={16} style={{ color: "#64748B" }} />
            <span
              className="absolute top-1 right-1 rounded-full"
              style={{ width: 7, height: 7, background: "#EF4444" }}
            />
          </button>
          
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50">
              <div className="p-3 border-b border-border bg-slate-50">
                <span className="font-semibold text-sm text-slate-700">{isEn ? "Notifications" : "Thông báo"}</span>
              </div>
              <div className="p-4 hover:bg-slate-50 border-b border-border cursor-pointer transition-colors" onClick={() => handleAction(isEn ? "Opened submission" : "Đã mở bài thi của học viên", undefined, "chamdiemhocvien")}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex flex-shrink-0 items-center justify-center">
                    <User size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700"><span className="font-semibold">Nguyễn Minh Anh</span> {isEn ? "submitted" : "vừa nộp bài"} <strong>ETS 2024 Full Test 1</strong></p>
                    <p className="text-xs text-slate-500 mt-1">{isEn ? "5 minutes ago" : "5 phút trước"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-border mx-1" style={{ background: "#E2E8F0" }} />

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-2 rounded-full transition-colors cursor-pointer border-none bg-transparent"
          >
            <div
              className="rounded-full flex items-center justify-center overflow-hidden"
              style={{ width: 32, height: 32, background: "#DBEAFE", border: "2px solid #BFDBFE" }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1D4ED8" }}>{profile.name.charAt(0)}</span>
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>{profile.name}</span>
              <span style={{ fontSize: 11, color: "#64748B" }}>{isEn ? "Teacher" : "Giáo viên"}</span>
            </div>
          </button>

          {showProfileMenu && (
            <div
              className="absolute right-0 top-full mt-2 rounded-xl shadow-lg border border-border bg-card overflow-hidden z-50"
              style={{ width: 220, background: "#fff" }}
            >
              <div className="px-4 py-3 border-b border-border bg-slate-50">
                <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{profile.name}</p>
                <p style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{profile.email}</p>
              </div>
              <div className="p-2 flex flex-col gap-1">
                <button 
                  onClick={() => handleAction("", setShowProfileModal)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-slate-50 rounded-lg cursor-pointer border-none bg-transparent"
                >
                  <User size={15} style={{ color: "#475569" }} />
                  <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{isEn ? "Profile" : "Hồ sơ cá nhân"}</span>
                </button>
                <button 
                  onClick={() => handleAction("", setShowSettingsModal)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-slate-50 rounded-lg cursor-pointer border-none bg-transparent"
                >
                  <Settings size={15} style={{ color: "#475569" }} />
                  <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{isEn ? "Settings" : "Cài đặt chung"}</span>
                </button>
              </div>
              <div className="p-2 border-t border-border">
                <button 
                  onClick={() => handleAction("", setShowLogoutModal)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-red-50 rounded-lg cursor-pointer border-none bg-transparent"
                >
                  <LogOut size={15} style={{ color: "#EF4444" }} />
                  <span style={{ fontSize: 13, color: "#DC2626", fontWeight: 600 }}>{isEn ? "Log Out" : "Đăng xuất"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Profile Modal */}
    {showProfileModal && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setShowProfileModal(false)}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 text-lg">{isEn ? "Edit Profile" : "Hồ sơ cá nhân"}</h3>
            <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{isEn ? "Full Name" : "Họ và tên"}</label>
              <input 
                type="text" 
                value={tempProfile.name}
                onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{isEn ? "Email Address" : "Email"}</label>
              <input 
                type="email" 
                value={tempProfile.email}
                onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{isEn ? "Phone Number" : "Số điện thoại"}</label>
              <input 
                type="text" 
                value={tempProfile.phone}
                onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" 
              />
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button onClick={() => setShowProfileModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 bg-white cursor-pointer">
              {isEn ? "Cancel" : "Hủy"}
            </button>
            <button onClick={handleSaveProfile} className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors border-none cursor-pointer">
              {isEn ? "Save Changes" : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Settings Modal */}
    {showSettingsModal && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setShowSettingsModal(false)}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 text-lg">{isEn ? "System Settings" : "Cài đặt chung"}</h3>
            <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{isEn ? "Language" : "Ngôn ngữ hệ thống"}</p>
                <p className="text-sm text-slate-500 mt-1">{isEn ? "Choose your preferred language" : "Thay đổi ngôn ngữ hiển thị"}</p>
              </div>
              <select 
                value={lang} 
                onChange={(e) => setLang && setLang(e.target.value as "vi" | "en")}
                className="border border-slate-300 rounded-lg p-2 outline-none focus:border-blue-500 font-medium text-slate-700 cursor-pointer bg-white"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <p className="font-medium text-slate-800">{isEn ? "Dark Mode" : "Giao diện tối (Dark Mode)"}</p>
                <p className="text-sm text-slate-500 mt-1">{isEn ? "Switch to dark theme" : "Chuyển đổi giao diện sáng/tối"}</p>
              </div>
              <button 
                onClick={() => setIsDarkMode && setIsDarkMode(!isDarkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer border-none ${isDarkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button onClick={() => setShowSettingsModal(false)} className="px-5 py-2 bg-slate-800 text-white font-medium hover:bg-slate-900 rounded-lg transition-colors border-none cursor-pointer">
              {isEn ? "Close" : "Đóng"}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Logout Confirmation Modal */}
    {showLogoutModal && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setShowLogoutModal(false)}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden text-center" onClick={e => e.stopPropagation()}>
          <div className="p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={28} className="text-red-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-xl mb-2">{isEn ? "Sign Out?" : "Xác nhận Đăng xuất"}</h3>
            <p className="text-slate-500 text-sm mb-6">
              {isEn ? "Are you sure you want to sign out of your account? You will need to login again to access your classes." : "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống Actor Teacher? Bạn sẽ cần đăng nhập lại ở lần sau."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition-colors border border-slate-300 bg-white cursor-pointer">
                {isEn ? "Cancel" : "Hủy"}
              </button>
              <button onClick={() => { setShowLogoutModal(false); if(onLogout) onLogout(); }} className="flex-1 py-2.5 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg transition-colors border-none cursor-pointer">
                {isEn ? "Sign Out" : "Đăng xuất"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    </>
  );
}