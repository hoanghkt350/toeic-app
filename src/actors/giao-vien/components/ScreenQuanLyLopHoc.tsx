import { useEffect, useState } from "react";
import { Users, Clock, BookOpen, Calendar, Edit2, CheckCircle, ChevronRight, X, UserCheck, AlertCircle, ScanLine } from "lucide-react";
import type { ClassItem, ClassLevel } from "../App";
import {
  startAttendanceSession,
  clearAttendanceSession,
  getAttendanceRecords,
  subscribeStore,
  type AttendanceRecord,
} from "../lib/classroomStore";

interface Props {
  classes: ClassItem[];
  setClasses: React.Dispatch<React.SetStateAction<ClassItem[]>>;
  showToast?: (msg: string) => void;
}

export function ScreenQuanLyLopHoc({ classes, setClasses, showToast }: Props) {
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAutoAttendance, setShowAutoAttendance] = useState(false);
  const [attendanceCode, setAttendanceCode] = useState("");
  const [attendanceTimer, setAttendanceTimer] = useState(60);
  const [checkedIn, setCheckedIn] = useState<AttendanceRecord[]>([]);

  // Theo dõi HS điểm danh (đồng bộ realtime giữa các tab qua localStorage).
  useEffect(() => {
    if (!showAutoAttendance || !attendanceCode) return;
    const refresh = () => setCheckedIn(getAttendanceRecords(attendanceCode));
    refresh();
    const unsub = subscribeStore(refresh);
    const poll = setInterval(refresh, 2000);
    return () => {
      unsub();
      clearInterval(poll);
    };
  }, [showAutoAttendance, attendanceCode]);

  const closeAttendance = () => {
    setShowAutoAttendance(false);
    clearAttendanceSession();
  };

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<ClassItem>>({});

  const handleOpenClass = (cls: ClassItem) => {
    setSelectedClass(cls);
    setIsEditing(false);
    setShowAutoAttendance(false);
  };

  const handleEditClick = () => {
    if (selectedClass) {
      setEditForm(selectedClass);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedClass && editForm.name) {
      const updatedClass = { ...selectedClass, ...editForm } as ClassItem;
      setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
      setSelectedClass(updatedClass);
      setIsEditing(false);
      if (showToast) showToast("Đã cập nhật thông tin lớp học!");
    }
  };

  const handleStartAutoAttendance = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setAttendanceCode(code);
    setAttendanceTimer(60);
    setShowAutoAttendance(true);

    // Ghi phiên điểm danh vào kho chung → Học sinh quét/nhập mã sẽ thấy.
    const DURATION = 60_000;
    startAttendanceSession({
      code,
      className: selectedClass?.name || "Lớp học",
      classId: selectedClass?.id || "",
      startedAt: Date.now(),
      expiresAt: Date.now() + DURATION,
    });

    // Simulate countdown (in a real app, use useEffect)
    let timer = 60;
    const interval = setInterval(() => {
      timer -= 1;
      setAttendanceTimer(timer);
      if (timer <= 0) {
        clearInterval(interval);
        setShowAutoAttendance(false);
        clearAttendanceSession();
        if (showToast) showToast("Đã đóng phiên điểm danh tự động.");
      }
    }, 1000);
  };

  const renderClassList = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A" }}>Quản lý Lớp học</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Theo dõi tiến độ, điểm danh và thông tin các lớp đang mở.</p>
        </div>
        <button className="px-4 py-2 rounded-lg" style={{ background: "#2563EB", color: "#fff", fontSize: 14, fontWeight: 500 }}>
          + Tạo lớp mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => (
          <div 
            key={cls.id} 
            onClick={() => handleOpenClass(cls)}
            className="bg-card rounded-xl border border-border p-5 cursor-pointer transition-all hover:shadow-md hover:border-blue-300"
            style={{ background: "#fff" }}
          >
            <div className="flex justify-between items-start mb-4">
              <span 
                className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: cls.levelBg, color: cls.levelColor }}
              >
                {cls.level}
              </span>
              <button className="text-slate-400 hover:text-slate-600"><Edit2 size={14} /></button>
            </div>
            
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", marginBottom: 8, lineHeight: 1.4 }}>
              {cls.name}
            </h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm" style={{ color: "#475569" }}>
                <Clock size={14} /> <span>{cls.schedule}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "#475569" }}>
                <Users size={14} /> <span>{cls.students} / {cls.maxStudents} học viên</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: "#64748B", fontWeight: 500 }}>Tiến độ ({cls.completedLessons}/{cls.totalLessons} buổi)</span>
                <span style={{ color: "#2563EB", fontWeight: 600 }}>{Math.round((cls.completedLessons/cls.totalLessons)*100)}%</span>
              </div>
              <div style={{ height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(cls.completedLessons/cls.totalLessons)*100}%`, background: "#2563EB", borderRadius: 99 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClassDetail = () => {
    if (!selectedClass) return null;

    return (
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedClass(null)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-slate-50"
            >
              <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />
            </button>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{selectedClass.name}</h2>
              <p style={{ fontSize: 13, color: "#64748B" }}>Mã lớp: {selectedClass.id.toUpperCase()}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleEditClick}
              className="px-4 py-2 rounded-lg border border-border bg-white flex items-center gap-2 hover:bg-slate-50 text-sm font-medium text-slate-700"
            >
              <Edit2 size={16} /> Cập nhật
            </button>
            <button 
              onClick={handleStartAutoAttendance}
              className="px-4 py-2 rounded-lg bg-blue-600 flex items-center gap-2 hover:bg-blue-700 text-sm font-medium text-white shadow-sm"
            >
              <ScanLine size={16} /> Mở Điểm danh Tự động
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Sĩ số</p>
                <p className="text-lg font-bold text-slate-800">{selectedClass.students}/{selectedClass.maxStudents}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <UserCheck size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Chuyên cần</p>
                <p className="text-lg font-bold text-slate-800">92%</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <BookOpen size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Số buổi</p>
                <p className="text-lg font-bold text-slate-800">{selectedClass.completedLessons}/{selectedClass.totalLessons}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Calendar size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Lịch học</p>
                <p className="text-xs font-bold text-slate-800 truncate" title={selectedClass.schedule}>{selectedClass.schedule.split("|")[0]}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4">Danh sách học viên</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-xs font-semibold text-slate-500">STT</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500">Học viên</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500">Trạng thái (Buổi nay)</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500">Số buổi vắng</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="border-b border-slate-100 last:border-none hover:bg-slate-50">
                    <td className="py-3 text-sm text-slate-600 font-medium">0{i}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">HV</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Nguyễn Văn {String.fromCharCode(64 + i)}</p>
                          <p className="text-xs text-slate-500">hv{i}@email.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      {i === 2 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-600">
                          <AlertCircle size={12} /> Vắng mặt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-600">
                          <CheckCircle size={12} /> Có mặt
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-sm text-slate-600 font-medium">{i === 2 ? "2" : "0"}</td>
                    <td className="py-3">
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium bg-blue-50 px-3 py-1.5 rounded">Chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!isEditing || !selectedClass) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setIsEditing(false)}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Cập nhật Lớp học</h3>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên lớp</label>
              <input 
                type="text" 
                value={editForm.name || ""} 
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cấp độ</label>
                <select 
                  value={editForm.level || "Cơ bản"}
                  onChange={e => setEditForm({...editForm, level: e.target.value as ClassLevel})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Cơ bản">Cơ bản</option>
                  <option value="Trung cấp">Trung cấp</option>
                  <option value="Nâng cao">Nâng cao</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tổng số buổi</label>
                <input 
                  type="number" 
                  value={editForm.totalLessons || 0} 
                  onChange={e => setEditForm({...editForm, totalLessons: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lịch học</label>
              <input 
                type="text" 
                value={editForm.schedule || ""} 
                onChange={e => setEditForm({...editForm, schedule: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" 
              />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border bg-slate-50 flex justify-end gap-3">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100">Hủy</button>
            <button onClick={handleSaveEdit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Lưu thay đổi</button>
          </div>
        </div>
      </div>
    );
  };

  const renderAutoAttendanceModal = () => {
    if (!showAutoAttendance) return null;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }} onClick={closeAttendance}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center flex flex-col items-center relative overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
          <button onClick={closeAttendance} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
          
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border-4 border-blue-100">
            <ScanLine size={28} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Điểm danh Tự động</h3>
          <p className="text-sm text-slate-500 mb-6">Yêu cầu học viên quét mã QR hoặc nhập mã PIN trên ứng dụng của họ.</p>

          <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center justify-center mb-6">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ATTENDANCE-${attendanceCode}`} 
              alt="QR Code" 
              className="w-40 h-40 mb-4 rounded shadow-sm border border-slate-200"
            />
            <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Mã PIN 4 số</p>
            <div className="text-4xl font-black text-indigo-600 tracking-widest bg-white px-6 py-2 rounded-lg border border-indigo-100 shadow-inner">
              {attendanceCode}
            </div>
          </div>

          <div className="w-full bg-red-50 rounded-lg p-3 flex items-center justify-center gap-2 text-red-600 border border-red-100">
            <Clock size={16} />
            <span className="text-sm font-semibold">Mã hết hạn sau: {attendanceTimer}s</span>
          </div>

          {/* Danh sách HS đã điểm danh (cập nhật realtime từ kho chung) */}
          <div className="w-full mt-4 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-700">Đã điểm danh</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{checkedIn.length}</span>
            </div>
            {checkedIn.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có học viên nào điểm danh…</p>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                {checkedIn.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-green-50 rounded-lg px-3 py-1.5 border border-green-100">
                    <UserCheck size={15} className="text-green-600" />
                    <span className="font-medium">{r.studentName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      {selectedClass ? renderClassDetail() : renderClassList()}
      {renderEditModal()}
      {renderAutoAttendanceModal()}
    </div>
  );
}