import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, Headphones, FileText, GraduationCap, Clock, Users,
  Star, PlayCircle, CheckCircle2, Circle, Lock, Target, Award,
  CalendarDays, ChevronRight, Search, Filter, ClipboardList, Download,
  MessageCircle, Zap, BarChart3, BookMarked, ShieldCheck, RefreshCcw,
} from "lucide-react";

const C = {
  blue: "#1d4ed8", blueL: "#eff6ff", blueB: "#bfdbfe",
  green: "#16a34a", greenL: "#f0fdf4", greenB: "#bbf7d0",
  purple: "#7c3aed", purpleL: "#f5f3ff", purpleB: "#ddd6fe",
  orange: "#d97706", orangeL: "#fffbeb", orangeB: "#fed7aa",
  red: "#dc2626", redL: "#fef2f2", redB: "#fecaca",
  slate: "#475569", muted: "#64748b", border: "#e2e8f0",
};

type CourseStatus = "Đang học" | "Đề xuất" | "Hoàn thành" | "Sắp mở";
type Difficulty = "Cơ bản" | "Trung bình" | "Nâng cao";
type LessonType = "Video" | "Bài tập" | "Mini test" | "Tài liệu" | "Live class";
type LessonStatus = "done" | "active" | "locked";

interface Lesson {
  title: string;
  duration: string;
  type: LessonType;
  status: LessonStatus;
  detail: string;
  focus: string;
  material: string;
  quiz: string;
  tasks: string[];
}

interface LessonPlan {
  title: string;
  duration: string;
  type: LessonType;
  detail: string;
  focus: string;
  material: string;
  quiz: string;
  tasks: string[];
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  status: CourseStatus;
  difficulty: Difficulty;
  duration: string;
  students: number;
  rating: number;
  teacher: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  goal: string;
  suitableFor: string;
  outcomes: string[];
  lessons: Lesson[];
  homework: string[];
  schedule: string[];
  resources: string[];
  assessment: string[];
  nextAction: string;
}

const filters = ["Tất cả", "Đang học", "Đề xuất", "Hoàn thành", "Sắp mở"];

function withStatuses(plan: LessonPlan[], completed: number, activeIndex?: number): Lesson[] {
  return plan.map((lesson, index) => ({
    ...lesson,
    status: index < completed ? "done" : index === activeIndex ? "active" : "locked",
  }));
}

const foundationLessons: LessonPlan[] = [
  { title: "Buổi 1: Làm quen cấu trúc đề TOEIC", duration: "45 phút", type: "Video", detail: "Giới thiệu format đề, thang điểm, thời gian làm bài và cách đọc phiếu trả lời.", focus: "Biết đề thi TOEIC gồm 7 Part và không bị lúng túng khi vào phòng thi.", material: "Sơ đồ 7 phần thi TOEIC, bảng quy đổi điểm tham khảo, checklist chuẩn bị trước khi học.", quiz: "10 câu kiểm tra nhanh về số câu, thời gian và thứ tự các Part.", tasks: ["Xem video định hướng", "Ghi mục tiêu điểm cá nhân", "Làm quiz cấu trúc đề"] },
  { title: "Buổi 2: Từ loại và vị trí trong câu", duration: "60 phút", type: "Bài tập", detail: "Ôn danh từ, động từ, tính từ, trạng từ và cách nhìn vị trí chỗ trống để chọn đáp án nhanh.", focus: "Nhận diện được câu hỏi từ loại trong Part 5.", material: "Bảng vị trí Noun / Verb / Adjective / Adverb kèm ví dụ thường gặp.", quiz: "30 câu Part 5 mức cơ bản có giải thích từng đáp án.", tasks: ["Học bảng vị trí từ loại", "Làm 30 câu Part 5", "Ghi lại 5 lỗi sai"] },
  { title: "Buổi 3: Nghe tranh Part 1", duration: "50 phút", type: "Mini test", detail: "Luyện nhận diện hành động, đồ vật, giới từ vị trí và câu mô tả gây nhiễu.", focus: "Nghe được keyword về hành động và vị trí trong tranh.", material: "12 tranh mẫu, danh sách bẫy hay gặp trong Part 1.", quiz: "Mini test 20 câu Part 1 có transcript.", tasks: ["Nghe 12 tranh mẫu", "Làm mini test", "Ghi 5 bẫy hay sai"] },
  { title: "Buổi 4: Thì hiện tại và quá khứ", duration: "55 phút", type: "Tài liệu", detail: "Ôn hiện tại đơn, hiện tại tiếp diễn, quá khứ đơn và dấu hiệu nhận biết trong câu TOEIC.", focus: "Chọn đúng thì khi câu có trạng từ thời gian hoặc ngữ cảnh rõ ràng.", material: "Bảng công thức 4 thì nền tảng và 20 ví dụ công sở.", quiz: "25 câu chia thì có đáp án giải thích.", tasks: ["Đọc tài liệu ngữ pháp", "Làm bài chia thì", "Tóm tắt công thức"] },
  { title: "Buổi 5: Part 2 - Câu hỏi ngắn", duration: "50 phút", type: "Video", detail: "Phân loại câu hỏi WH, Yes/No, lựa chọn và câu đề nghị trong Part 2.", focus: "Không bị bẫy bởi đáp án lặp lại từ trong câu hỏi.", material: "Bảng mẫu câu hỏi Part 2 và chiến thuật loại trừ.", quiz: "25 câu nghe Part 2 theo nhóm dạng câu hỏi.", tasks: ["Nghe ví dụ từng dạng", "Làm 25 câu", "Chép lại 10 câu sai"] },
  { title: "Buổi 6: Danh từ đếm được và không đếm được", duration: "45 phút", type: "Bài tập", detail: "Phân biệt danh từ số ít, số nhiều, danh từ không đếm được và lượng từ.", focus: "Giảm lỗi chọn a/an, many/much, số ít/số nhiều.", material: "Danh sách 40 danh từ TOEIC dễ sai.", quiz: "20 câu Part 5 về danh từ và lượng từ.", tasks: ["Ôn bảng danh từ", "Làm bài tập lượng từ", "Sửa lỗi sai"] },
  { title: "Buổi 7: Từ vựng chủ đề Office", duration: "40 phút", type: "Tài liệu", detail: "Học từ vựng văn phòng, tài liệu, cuộc họp, lịch hẹn và thông báo nội bộ.", focus: "Nhận diện từ vựng lặp lại trong email và memo.", material: "40 từ vựng Office có phiên âm, nghĩa và câu ví dụ.", quiz: "Quiz 20 câu chọn nghĩa và điền từ.", tasks: ["Học 40 từ", "Làm flashcard", "Viết 5 câu ví dụ"] },
  { title: "Buổi 8: Part 3 - Hội thoại ngắn", duration: "65 phút", type: "Mini test", detail: "Nghe hội thoại 2 người, xác định địa điểm, vấn đề và hành động tiếp theo.", focus: "Đọc trước câu hỏi để dự đoán thông tin cần nghe.", material: "5 hội thoại mẫu kèm transcript tô màu keyword.", quiz: "15 câu Part 3 theo chủ đề văn phòng.", tasks: ["Đọc câu hỏi trước", "Nghe 5 hội thoại", "Đối chiếu transcript"] },
  { title: "Buổi 9: Giới từ vị trí và thời gian", duration: "50 phút", type: "Bài tập", detail: "Ôn in, on, at, by, until, during, between, among trong ngữ cảnh TOEIC.", focus: "Chọn giới từ đúng dựa trên thời gian, địa điểm và cụm cố định.", material: "Bảng giới từ thường gặp và 30 cụm cố định.", quiz: "30 câu điền giới từ.", tasks: ["Học bảng giới từ", "Làm 30 câu", "Ghi cụm cố định"] },
  { title: "Buổi 10: Part 6 - Hoàn thành đoạn văn", duration: "60 phút", type: "Video", detail: "Cách đọc ngữ cảnh trước sau chỗ trống để chọn từ, thì và câu phù hợp.", focus: "Không làm Part 6 như từng câu rời rạc.", material: "4 đoạn văn mẫu email, thông báo và thư mời.", quiz: "16 câu Part 6 có phân tích mạch văn.", tasks: ["Xem chiến thuật", "Làm 4 đoạn Part 6", "Tự giải thích đáp án"] },
  { title: "Buổi 11: Mini Test giữa khóa", duration: "75 phút", type: "Mini test", detail: "Kiểm tra Listening Part 1-2 và Reading Part 5-6 sau nửa khóa.", focus: "Biết phần nào còn yếu để điều chỉnh lịch học.", material: "Đề mini test 60 câu kèm phiếu tự chấm.", quiz: "Mini test 60 câu trong 75 phút.", tasks: ["Làm bài đúng giờ", "Xem báo cáo lỗi", "Lập kế hoạch sửa lỗi"] },
  { title: "Buổi 12: Part 4 - Bài nói ngắn", duration: "65 phút", type: "Video", detail: "Nghe thông báo, voicemail, bản tin ngắn và cách bắt thông tin số liệu.", focus: "Bắt được mục đích bài nói và chi tiết quan trọng.", material: "6 bài nói ngắn theo chủ đề thông báo, du lịch, kinh doanh.", quiz: "18 câu Part 4 có transcript.", tasks: ["Đọc câu hỏi trước", "Nghe 6 bài nói", "Ghi từ khóa bị mất"] },
  { title: "Buổi 13: Mệnh đề quan hệ cơ bản", duration: "55 phút", type: "Bài tập", detail: "Phân biệt who, which, that, where, when và cách rút gọn mệnh đề.", focus: "Chọn đại từ quan hệ đúng trong Part 5.", material: "Bảng đại từ quan hệ và ví dụ công sở.", quiz: "25 câu mệnh đề quan hệ.", tasks: ["Ôn bảng đại từ", "Làm bài tập", "Sửa 5 câu sai nhất"] },
  { title: "Buổi 14: Part 7 - Đọc email đơn", duration: "70 phút", type: "Tài liệu", detail: "Tập đọc lướt mục đích email, người gửi, người nhận và thông tin chi tiết.", focus: "Tìm dẫn chứng trong bài thay vì đoán theo cảm giác.", material: "5 email mẫu kèm câu hỏi và vị trí dẫn chứng.", quiz: "20 câu Part 7 dạng email đơn.", tasks: ["Đọc 5 email", "Gạch chân dẫn chứng", "Tổng hợp từ mới"] },
  { title: "Buổi 15: Từ nối và trạng từ liên kết", duration: "50 phút", type: "Bài tập", detail: "Học however, therefore, meanwhile, otherwise, additionally và cách nối ý trong đoạn văn.", focus: "Làm tốt câu chọn từ nối trong Part 6.", material: "Bảng từ nối theo quan hệ đối lập, nguyên nhân, bổ sung, thời gian.", quiz: "25 câu điền từ nối.", tasks: ["Học bảng từ nối", "Làm bài tập", "Viết 5 câu ví dụ"] },
  { title: "Buổi 16: Luyện đề rút gọn", duration: "90 phút", type: "Mini test", detail: "Làm đề rút gọn 100 câu để luyện tốc độ và cách chuyển phần.", focus: "Quản lý thời gian khi làm bài có cả Listening và Reading.", material: "Đề rút gọn 100 câu và bảng phân tích điểm.", quiz: "Mock test 100 câu.", tasks: ["Làm test đúng giờ", "Chấm điểm", "Chọn 3 lỗi cần sửa"] },
  { title: "Buổi 17: Tổng ôn chiến thuật", duration: "60 phút", type: "Live class", detail: "Tổng hợp mẹo làm bài, lỗi cần tránh và kế hoạch 7 ngày trước khi thi.", focus: "Có checklist ôn thi cá nhân hóa.", material: "Checklist chiến thuật 7 Part và mẫu lịch ôn 7 ngày.", quiz: "15 câu kiểm tra chiến thuật.", tasks: ["Xem tổng ôn", "Hoàn thiện checklist", "Đặt lịch thi thử"] },
  { title: "Buổi 18: Thi thử cuối khóa 450+", duration: "120 phút", type: "Mini test", detail: "Làm đề mô phỏng cuối khóa để đánh giá khả năng đạt mốc 450+.", focus: "Hoàn thành bài đúng thời gian và xem báo cáo tổng kết.", material: "Full mini mock test, bảng điểm và nhận xét sau khóa.", quiz: "Đề thi thử cuối khóa.", tasks: ["Làm đề thi thử", "Xem phân tích lỗi", "Nhận chứng nhận hoàn thành"] },
];

const listeningLessons: LessonPlan[] = [
  { title: "Buổi 1: Kỹ thuật nghe bắt keyword", duration: "50 phút", type: "Video", detail: "Học cách đọc trước câu hỏi, gạch keyword và dự đoán loại thông tin cần nghe.", focus: "Nghe chủ động thay vì chờ audio chạy rồi mới đọc câu hỏi.", material: "Mẫu gạch keyword cho Part 2, 3, 4.", quiz: "15 câu Part 2 luyện bắt keyword.", tasks: ["Xem video", "Gạch keyword", "Làm 15 câu nghe"] },
  { title: "Buổi 2: Part 1 - Mô tả người và vật", duration: "55 phút", type: "Bài tập", detail: "Luyện các động từ hành động, trạng thái đồ vật và giới từ vị trí trong tranh.", focus: "Tránh bẫy mô tả đúng vật nhưng sai hành động.", material: "20 tranh TOEIC và bảng từ vựng mô tả.", quiz: "20 câu Part 1.", tasks: ["Nghe tranh", "Ghi động từ", "Sửa lỗi bẫy"] },
  { title: "Buổi 3: Part 2 - WH Questions", duration: "60 phút", type: "Mini test", detail: "Nhận diện What, Where, When, Who, Why, How và câu trả lời gián tiếp.", focus: "Không chọn đáp án chỉ vì lặp từ giống câu hỏi.", material: "Bảng mẫu câu WH và đáp án paraphrase.", quiz: "30 câu WH Questions.", tasks: ["Phân loại câu hỏi", "Nghe 30 câu", "Chép đáp án đúng"] },
  { title: "Buổi 4: Part 2 - Yes/No và câu đề nghị", duration: "60 phút", type: "Bài tập", detail: "Luyện câu hỏi xác nhận, lời đề nghị, lời mời và câu trả lời từ chối lịch sự.", focus: "Nhận ra câu trả lời không trực tiếp Yes/No.", material: "40 mẫu câu giao tiếp công sở.", quiz: "30 câu Part 2 hỗn hợp.", tasks: ["Nghe mẫu", "Làm bài tập", "Ghi 10 câu hay"] },
  { title: "Buổi 5: Bẫy phát âm giống nhau", duration: "45 phút", type: "Tài liệu", detail: "Phân biệt các cặp âm và từ dễ nhầm trong audio TOEIC.", focus: "Nhận diện bẫy âm gần giống như copy/coffee, file/pile.", material: "Danh sách 60 cặp từ dễ nhầm.", quiz: "20 câu chọn từ nghe được.", tasks: ["Nghe cặp âm", "Đọc theo", "Làm quiz"] },
  { title: "Buổi 6: Part 3 - Xác định ngữ cảnh", duration: "70 phút", type: "Video", detail: "Nghe hội thoại và xác định địa điểm, nghề nghiệp, vấn đề, mục đích nói.", focus: "Dự đoán ngữ cảnh bằng câu hỏi trước khi nghe.", material: "6 đoạn hội thoại nơi công sở.", quiz: "18 câu Part 3.", tasks: ["Đọc câu hỏi trước", "Nghe hội thoại", "Gạch dẫn chứng"] },
  { title: "Buổi 7: Part 3 - Hành động tiếp theo", duration: "70 phút", type: "Bài tập", detail: "Luyện câu hỏi What will the man/woman probably do next? và đáp án suy luận nhẹ.", focus: "Nghe câu cuối và lời đề nghị để chọn hành động tiếp theo.", material: "5 hội thoại có tình huống xử lý công việc.", quiz: "15 câu hành động tiếp theo.", tasks: ["Nghe lần 1", "Dự đoán hành động", "Đối chiếu transcript"] },
  { title: "Buổi 8: Part 3 - Bảng biểu và hình ảnh", duration: "75 phút", type: "Mini test", detail: "Kết hợp nghe hội thoại với đọc lịch trình, hóa đơn, bảng giá hoặc sơ đồ.", focus: "Vừa nghe vừa đối chiếu thông tin trên hình.", material: "4 bộ câu hỏi có bảng biểu.", quiz: "12 câu Part 3 graphic.", tasks: ["Xem hình trước", "Nghe hội thoại", "Chọn thông tin đúng"] },
  { title: "Buổi 9: Part 4 - Thông báo", duration: "65 phút", type: "Video", detail: "Luyện nghe thông báo sân bay, công ty, sự kiện và thay đổi lịch.", focus: "Bắt mục đích thông báo và chi tiết thời gian/địa điểm.", material: "6 bài thông báo ngắn.", quiz: "18 câu Part 4.", tasks: ["Nghe bài nói", "Ghi thời gian/địa điểm", "Làm câu hỏi"] },
  { title: "Buổi 10: Part 4 - Voicemail", duration: "65 phút", type: "Bài tập", detail: "Nghe lời nhắn thoại, xác định người gọi, lý do gọi và việc cần làm.", focus: "Không bỏ sót yêu cầu ở cuối lời nhắn.", material: "5 voicemail công việc.", quiz: "15 câu voicemail.", tasks: ["Nghe voicemail", "Tóm tắt ý chính", "Chọn đáp án"] },
  { title: "Buổi 11: Part 4 - Bài nói có biểu đồ", duration: "75 phút", type: "Mini test", detail: "Luyện đọc nhanh hình trước khi nghe và liên kết audio với thông tin trên biểu đồ.", focus: "Tìm đúng dòng/cột cần nghe trong hình.", material: "4 bài nói có lịch, bảng giá, biểu đồ.", quiz: "12 câu graphic.", tasks: ["Đọc hình 20 giây", "Nghe audio", "Khoanh dẫn chứng"] },
  { title: "Buổi 12: Phân tích transcript", duration: "60 phút", type: "Tài liệu", detail: "Học cách dùng transcript để tìm nguyên nhân nghe sai: từ vựng, nối âm, paraphrase, mất tập trung.", focus: "Biến câu sai thành checklist sửa lỗi.", material: "Mẫu bảng phân tích transcript.", quiz: "Bài phân tích 10 câu sai.", tasks: ["Chọn 10 câu sai", "Đọc transcript", "Ghi nguyên nhân"] },
  { title: "Buổi 13: Shadowing công sở", duration: "50 phút", type: "Video", detail: "Luyện nghe - nhại theo câu ngắn để tăng phản xạ với tốc độ TOEIC.", focus: "Bắt nhịp nối âm và trọng âm câu.", material: "30 câu shadowing chủ đề meeting, travel, order.", quiz: "Ghi âm tự đánh giá 5 câu.", tasks: ["Nghe chậm", "Nhại theo", "Tự chấm phát âm"] },
  { title: "Buổi 14: Mini Test Listening #1", duration: "90 phút", type: "Mini test", detail: "Làm bài Listening rút gọn đủ Part 1-4 và xem báo cáo lỗi.", focus: "Kiểm tra khả năng giữ tập trung liên tục.", material: "Đề 70 câu Listening.", quiz: "Mini test 70 câu.", tasks: ["Làm bài", "Chấm điểm", "Lọc lỗi theo Part"] },
  { title: "Buổi 15: Sửa lỗi Listening chuyên sâu", duration: "70 phút", type: "Live class", detail: "Gia sư phân tích lỗi theo nhóm: nghe thiếu keyword, bị bẫy paraphrase, mất thông tin số.", focus: "Biết chiến thuật sửa lỗi cá nhân.", material: "Bảng thống kê lỗi và gợi ý luyện tập.", quiz: "Bài chữa 20 câu sai.", tasks: ["Xem bài chữa", "Ghi chiến thuật", "Làm lại câu sai"] },
  { title: "Buổi 16: Final Listening Mock", duration: "120 phút", type: "Mini test", detail: "Làm bài nghe mô phỏng cuối khóa để đánh giá mục tiêu 350+.", focus: "Ổn định tâm lý và tốc độ nghe đến cuối bài.", material: "Đề Listening full 100 câu.", quiz: "Final mock Listening.", tasks: ["Làm full test", "Xem điểm", "Lập kế hoạch ôn tiếp"] },
];

const readingLessons: LessonPlan[] = [
  { title: "Buổi 1: Chiến thuật Part 5", duration: "55 phút", type: "Video", detail: "Học cách nhìn chỗ trống để đoán loại từ, cấu trúc và nghĩa cần chọn.", focus: "Làm câu dễ trước, câu nghĩa sau để tiết kiệm thời gian.", material: "Sơ đồ xử lý câu Part 5 trong 20 giây.", quiz: "40 câu Part 5 cơ bản.", tasks: ["Xem bài giảng", "Làm 40 câu", "Lọc lỗi theo nhóm"] },
  { title: "Buổi 2: Danh từ, động từ, tính từ, trạng từ", duration: "60 phút", type: "Bài tập", detail: "Ôn từ loại và hậu tố thường gặp như -tion, -ment, -ive, -ly.", focus: "Nhận diện từ loại nhanh qua vị trí và hậu tố.", material: "Bảng hậu tố TOEIC thường gặp.", quiz: "35 câu từ loại.", tasks: ["Học bảng hậu tố", "Làm bài tập", "Sửa câu sai"] },
  { title: "Buổi 3: Thì và sự hòa hợp chủ vị", duration: "60 phút", type: "Bài tập", detail: "Ôn thì cơ bản, dấu hiệu thời gian và chủ ngữ số ít/số nhiều.", focus: "Không sai câu chia động từ đơn giản.", material: "Bảng dấu hiệu thì và S-V agreement.", quiz: "30 câu chia động từ.", tasks: ["Ôn công thức", "Làm 30 câu", "Ghi lỗi sai"] },
  { title: "Buổi 4: Giới từ và cụm cố định", duration: "50 phút", type: "Tài liệu", detail: "Học các giới từ thường đi với động từ, tính từ và danh từ trong TOEIC.", focus: "Nhận diện cụm cố định thay vì dịch từng chữ.", material: "80 cụm preposition collocations.", quiz: "25 câu giới từ.", tasks: ["Học cụm", "Làm bài", "Tạo flashcard"] },
  { title: "Buổi 5: Liên từ và trạng từ liên kết", duration: "55 phút", type: "Video", detail: "Phân biệt although, because, therefore, however, moreover, otherwise.", focus: "Chọn từ nối dựa trên quan hệ ý nghĩa.", material: "Bảng nhóm từ nối theo chức năng.", quiz: "30 câu từ nối.", tasks: ["Xem video", "Làm quiz", "Viết ví dụ"] },
  { title: "Buổi 6: Mệnh đề quan hệ", duration: "60 phút", type: "Bài tập", detail: "Phân biệt who, whom, which, that, where, when và dạng rút gọn mệnh đề.", focus: "Chọn đại từ đúng theo danh từ đứng trước.", material: "Bảng mệnh đề quan hệ có ví dụ TOEIC.", quiz: "25 câu áp dụng.", tasks: ["Ôn bảng đại từ", "Làm 25 câu", "Sửa lỗi"] },
  { title: "Buổi 7: Câu bị động", duration: "50 phút", type: "Bài tập", detail: "Ôn cấu trúc bị động, dấu hiệu by, động từ quá khứ phân từ và ngữ cảnh công việc.", focus: "Phân biệt active/passive trong Part 5.", material: "Công thức bị động theo thì.", quiz: "25 câu bị động.", tasks: ["Học công thức", "Làm bài tập", "Ghi động từ V3"] },
  { title: "Buổi 8: Part 6 - Hoàn thành đoạn văn", duration: "70 phút", type: "Mini test", detail: "Luyện chọn từ, cụm từ và câu phù hợp dựa trên ngữ cảnh trước sau.", focus: "Đọc cả đoạn để hiểu mạch văn.", material: "5 đoạn văn mẫu có phân tích.", quiz: "20 câu Part 6.", tasks: ["Đọc đoạn", "Chọn đáp án", "Giải thích mạch văn"] },
  { title: "Buổi 9: Đọc email Part 7", duration: "70 phút", type: "Tài liệu", detail: "Tập nhận diện mục đích email, người gửi, người nhận và thông tin chi tiết.", focus: "Gạch dẫn chứng trực tiếp trong bài đọc.", material: "5 email đơn và 20 câu hỏi.", quiz: "20 câu Part 7 email.", tasks: ["Đọc 5 email", "Gạch dẫn chứng", "Trả lời câu hỏi"] },
  { title: "Buổi 10: Đọc quảng cáo và thông báo", duration: "65 phút", type: "Video", detail: "Nhận diện thông tin giá, địa điểm, điều kiện, khuyến mãi trong quảng cáo và notice.", focus: "Đọc quét thông tin số và điều kiện đặc biệt.", material: "6 bài quảng cáo/thông báo.", quiz: "24 câu Part 7.", tasks: ["Đọc lướt", "Tìm thông tin", "Ghi từ vựng"] },
  { title: "Buổi 11: Câu hỏi suy luận", duration: "70 phút", type: "Bài tập", detail: "Luyện câu hỏi imply, suggest, infer và cách tìm bằng chứng gián tiếp.", focus: "Suy luận từ dữ kiện, không suy diễn quá xa.", material: "Mẫu câu hỏi inference và cách loại đáp án.", quiz: "20 câu suy luận.", tasks: ["Đọc câu hỏi", "Tìm bằng chứng", "Loại đáp án bẫy"] },
  { title: "Buổi 12: Part 7 đoạn kép", duration: "80 phút", type: "Mini test", detail: "Đọc hai văn bản liên quan như email - hóa đơn, thông báo - lịch trình.", focus: "Liên kết thông tin giữa hai đoạn.", material: "4 bộ double passages.", quiz: "20 câu đoạn kép.", tasks: ["Đọc câu hỏi", "Xác định văn bản chứa đáp án", "Gạch dẫn chứng"] },
  { title: "Buổi 13: Part 7 đoạn ba", duration: "85 phút", type: "Bài tập", detail: "Luyện triple passages với nhiều nguồn thông tin, email, chat, bảng giá.", focus: "Quản lý mắt đọc và không rối khi nhiều văn bản.", material: "3 bộ triple passages.", quiz: "15 câu đoạn ba.", tasks: ["Đọc tiêu đề", "Liên kết thông tin", "Tổng hợp đáp án"] },
  { title: "Buổi 14: Quản lý thời gian Reading", duration: "60 phút", type: "Video", detail: "Chia thời gian Part 5, 6, 7 và chiến thuật bỏ qua câu khó.", focus: "Không mất quá nhiều thời gian ở một câu.", material: "Bảng phân bổ thời gian Reading 75 phút.", quiz: "Bài luyện tốc độ 30 câu.", tasks: ["Xem chiến thuật", "Bấm giờ luyện", "Ghi câu quá thời gian"] },
  { title: "Buổi 15: Mini Reading Test #1", duration: "90 phút", type: "Mini test", detail: "Làm đề Reading rút gọn để đo tốc độ và độ chính xác.", focus: "Tìm phần mất điểm nhiều nhất.", material: "Đề Reading 70 câu.", quiz: "Mini test 70 câu.", tasks: ["Làm bài", "Chấm điểm", "Phân tích lỗi"] },
  { title: "Buổi 16: Sửa lỗi ngữ pháp chuyên sâu", duration: "70 phút", type: "Live class", detail: "Tổng hợp lỗi sai Part 5-6 và cách sửa theo từng nhóm ngữ pháp.", focus: "Biết vì sao đáp án đúng và vì sao đáp án sai.", material: "Bảng lỗi thường gặp cá nhân hóa.", quiz: "Bài chữa 30 câu sai.", tasks: ["Xem bài chữa", "Làm lại câu sai", "Ghi quy tắc"] },
  { title: "Buổi 17: Sửa lỗi đọc hiểu chuyên sâu", duration: "70 phút", type: "Live class", detail: "Chữa Part 7 theo nhóm câu hỏi: mục đích, chi tiết, suy luận, từ đồng nghĩa.", focus: "Tìm dẫn chứng nhanh và chính xác hơn.", material: "Bảng phương pháp tìm dẫn chứng.", quiz: "20 câu Part 7 chữa lỗi.", tasks: ["Xem phân tích", "Khoanh dẫn chứng", "Làm lại bài"] },
  { title: "Buổi 18: Full Reading Practice", duration: "120 phút", type: "Mini test", detail: "Làm bài Reading hoàn chỉnh trong 75 phút và xem báo cáo tốc độ.", focus: "Tối ưu thời gian và độ chính xác.", material: "Đề Reading full 100 câu.", quiz: "Full Reading Practice.", tasks: ["Làm test", "Chấm điểm", "Ghi lỗi theo Part"] },
  { title: "Buổi 19: Tổng ôn Reading 350+", duration: "60 phút", type: "Tài liệu", detail: "Ôn lại toàn bộ chiến thuật ngữ pháp, Part 6 và Part 7 trước bài cuối khóa.", focus: "Có checklist trước khi làm đề thật.", material: "Checklist Reading 350+.", quiz: "20 câu tổng ôn.", tasks: ["Đọc checklist", "Làm tổng ôn", "Chuẩn bị final test"] },
  { title: "Buổi 20: Final Reading Mock", duration: "120 phút", type: "Mini test", detail: "Làm bài cuối khóa để đánh giá mục tiêu Reading 350+.", focus: "Tổng kết điểm mạnh, điểm yếu và kế hoạch ôn tiếp.", material: "Đề final Reading và phiếu nhận xét.", quiz: "Final Reading Mock.", tasks: ["Làm final", "Xem báo cáo", "Nhận chứng nhận"] },
];

const vocabLessons: LessonPlan[] = [
  { title: "Chủ đề 1: Office & Documents", duration: "35 phút", type: "Tài liệu", detail: "Từ vựng về văn phòng, tài liệu, cuộc họp và công việc hành chính.", focus: "Hiểu từ vựng xuất hiện nhiều trong email và memo.", material: "50 từ kèm phát âm và ví dụ.", quiz: "20 câu chọn nghĩa.", tasks: ["Học 50 từ", "Làm flashcard", "Viết 10 câu ví dụ"] },
  { title: "Chủ đề 2: Travel & Hotel", duration: "35 phút", type: "Tài liệu", detail: "Từ vựng về đặt vé, khách sạn, lịch trình và thông báo du lịch.", focus: "Đọc hiểu thông tin đặt phòng, chuyến bay, lịch trình.", material: "50 từ Travel & Hotel.", quiz: "20 câu điền từ.", tasks: ["Học từ", "Nghe phát âm", "Làm quiz"] },
  { title: "Chủ đề 3: Meeting & Schedule", duration: "35 phút", type: "Tài liệu", detail: "Từ vựng về họp, lịch hẹn, thay đổi thời gian và người tham dự.", focus: "Nhận diện lịch trình trong Listening Part 3-4.", material: "50 từ Meeting & Schedule.", quiz: "20 câu chọn từ phù hợp.", tasks: ["Học từ", "Tạo flashcard", "Viết ví dụ"] },
  { title: "Chủ đề 4: Shopping & Order", duration: "35 phút", type: "Tài liệu", detail: "Từ vựng về mua hàng, đơn đặt hàng, hóa đơn và giao hàng.", focus: "Hiểu email đặt hàng và thông báo giao nhận.", material: "50 từ Shopping & Order.", quiz: "20 câu matching.", tasks: ["Học từ", "Làm quiz", "Ghi collocation"] },
  { title: "Chủ đề 5: Human Resources", duration: "35 phút", type: "Tài liệu", detail: "Từ vựng về tuyển dụng, phỏng vấn, đào tạo và chính sách nhân sự.", focus: "Đọc thông báo tuyển dụng và email nhân sự.", material: "50 từ HR.", quiz: "20 câu điền từ.", tasks: ["Học từ", "Nghe phát âm", "Ôn ví dụ"] },
  { title: "Chủ đề 6: Finance & Budget", duration: "35 phút", type: "Tài liệu", detail: "Từ vựng về ngân sách, chi phí, hóa đơn, báo cáo tài chính.", focus: "Không nhầm các từ cost, fee, expense, revenue.", material: "50 từ Finance.", quiz: "20 câu phân biệt nghĩa.", tasks: ["Học từ", "Làm quiz", "Ghi từ dễ nhầm"] },
  { title: "Chủ đề 7: Marketing & Sales", duration: "35 phút", type: "Tài liệu", detail: "Từ vựng về chiến dịch quảng cáo, khách hàng, doanh số và khảo sát.", focus: "Đọc hiểu quảng cáo và báo cáo bán hàng.", material: "50 từ Marketing.", quiz: "20 câu chọn nghĩa.", tasks: ["Học từ", "Làm flashcard", "Viết câu"] },
  { title: "Chủ đề 8: Manufacturing", duration: "35 phút", type: "Tài liệu", detail: "Từ vựng về sản xuất, thiết bị, kho hàng và kiểm tra chất lượng.", focus: "Hiểu thông báo nhà máy và email vận hành.", material: "50 từ Manufacturing.", quiz: "20 câu điền từ.", tasks: ["Học từ", "Ghi collocation", "Làm quiz"] },
  { title: "Chủ đề 9: Customer Service", duration: "35 phút", type: "Tài liệu", detail: "Từ vựng về chăm sóc khách hàng, phàn nàn, hoàn tiền và bảo hành.", focus: "Hiểu email phản hồi khách hàng.", material: "50 từ Customer Service.", quiz: "20 câu tình huống.", tasks: ["Học từ", "Đọc ví dụ", "Làm quiz"] },
  { title: "Chủ đề 10: Technology", duration: "35 phút", type: "Tài liệu", detail: "Từ vựng về máy tính, phần mềm, tài khoản, lỗi kỹ thuật và cập nhật hệ thống.", focus: "Hiểu thông báo IT trong Part 7.", material: "50 từ Technology.", quiz: "20 câu chọn từ.", tasks: ["Học từ", "Nghe phát âm", "Ôn từ sai"] },
  { title: "Ôn tập 600 từ theo mức độ nhớ", duration: "45 phút", type: "Bài tập", detail: "Hệ thống lại từ dễ quên, từ đã nhớ và từ cần đưa vào ví dụ cá nhân.", focus: "Tự ôn theo vòng lặp nhớ - quên.", material: "Bảng phân loại từ vựng 3 mức.", quiz: "40 câu mixed vocabulary.", tasks: ["Phân loại từ", "Ôn từ yếu", "Làm quiz"] },
  { title: "Bài kiểm tra cuối khóa", duration: "45 phút", type: "Mini test", detail: "Kiểm tra khả năng nhớ nghĩa, nhận diện từ loại và áp dụng trong câu.", focus: "Đánh giá khả năng sử dụng 600 từ trong đề TOEIC.", material: "Đề kiểm tra 60 câu.", quiz: "Final vocab test.", tasks: ["Làm 60 câu", "Xem điểm", "Ôn lại từ sai"] },
];

const fullTestLessons: LessonPlan[] = [
  { title: "Buổi 1: Diagnostic Full Test", duration: "120 phút", type: "Mini test", detail: "Làm đề đầu vào để xác định Part mạnh, Part yếu và tốc độ xử lý hiện tại.", focus: "Biết xuất phát điểm trước khi vào giai đoạn luyện 800+.", material: "Full test số 1 và bảng phân tích điểm.", quiz: "200 câu mô phỏng.", tasks: ["Làm full test", "Xem báo cáo", "Chọn mục tiêu cải thiện"] },
  { title: "Buổi 2: Sửa lỗi Listening chuyên sâu", duration: "75 phút", type: "Live class", detail: "Phân tích lỗi nghe sai do keyword, paraphrase, phát âm và mất tập trung.", focus: "Sửa lỗi theo nguyên nhân, không chỉ xem đáp án.", material: "Transcript tô màu keyword và paraphrase.", quiz: "30 câu chữa lỗi.", tasks: ["Xem transcript", "Chữa câu sai", "Ghi chiến thuật"] },
  { title: "Buổi 3: Sửa lỗi Reading chuyên sâu", duration: "75 phút", type: "Live class", detail: "Phân tích lỗi đọc hiểu, lỗi từ loại, lỗi thời gian trong Part 5-7.", focus: "Tăng độ chính xác khi làm đề dài.", material: "Bảng lỗi Reading cá nhân.", quiz: "30 câu chữa lỗi.", tasks: ["Xem bài chữa", "Làm lại câu sai", "Ghi quy tắc"] },
  { title: "Buổi 4: Chiến thuật Part 3-4 điểm cao", duration: "70 phút", type: "Video", detail: "Tập xử lý câu hỏi graphic, suy luận và hành động tiếp theo trong Listening.", focus: "Không mất điểm ở câu khó Part 3-4.", material: "Bộ câu hỏi Part 3-4 nâng cao.", quiz: "36 câu Part 3-4.", tasks: ["Đọc câu hỏi trước", "Nghe nâng cao", "Phân tích bẫy"] },
  { title: "Buổi 5: Chiến thuật Part 7 đoạn kép/ba", duration: "80 phút", type: "Bài tập", detail: "Luyện đọc nhiều văn bản, liên kết dữ kiện và kiểm soát thời gian.", focus: "Giữ tốc độ ở cuối bài Reading.", material: "5 bộ double/triple passages.", quiz: "25 câu Part 7 nâng cao.", tasks: ["Làm bài bấm giờ", "Gạch dẫn chứng", "Sửa lỗi"] },
  { title: "Buổi 6: Mock Test #2", duration: "120 phút", type: "Mini test", detail: "Làm full test số 2 để đo mức tăng điểm sau khi sửa lỗi.", focus: "Tập áp lực thời gian thật.", material: "Full test số 2.", quiz: "200 câu mô phỏng.", tasks: ["Làm test", "Chấm điểm", "So sánh tiến bộ"] },
  { title: "Buổi 7: Review Mock Test #2", duration: "75 phút", type: "Live class", detail: "Chữa các câu sai quan trọng và tối ưu chiến thuật cá nhân.", focus: "Biến lỗi sai thành điểm tăng ở bài sau.", material: "Báo cáo lỗi theo Part.", quiz: "Bài chữa 40 câu.", tasks: ["Xem review", "Làm lại câu sai", "Ghi checklist"] },
  { title: "Buổi 8: Mock Test #3", duration: "120 phút", type: "Mini test", detail: "Làm đề cuối trong giai đoạn tăng tốc để kiểm tra mục tiêu 800+.", focus: "Ổn định phong độ trước bài tổng kết.", material: "Full test số 3.", quiz: "200 câu mô phỏng.", tasks: ["Làm test", "Xem điểm", "Chọn lỗi cuối cùng"] },
  { title: "Buổi 9: Kế hoạch 7 ngày trước thi", duration: "60 phút", type: "Tài liệu", detail: "Lập lịch ôn tập, ngủ nghỉ, luyện đề nhẹ và chiến thuật ngày thi.", focus: "Không quá tải trước ngày thi thật.", material: "Mẫu lịch 7 ngày và checklist phòng thi.", quiz: "Checklist tự đánh giá.", tasks: ["Lập lịch 7 ngày", "Ôn từ yếu", "Chuẩn bị giấy tờ"] },
  { title: "Buổi 10: Final Booster Test", duration: "120 phút", type: "Mini test", detail: "Bài kiểm tra cuối khóa với báo cáo tổng hợp và đề xuất bước tiếp theo.", focus: "Đánh giá khả năng đạt 800+.", material: "Final full test và báo cáo tổng kết.", quiz: "Final Booster Test.", tasks: ["Làm final", "Xem báo cáo", "Nhận kế hoạch ôn tiếp"] },
];

const baseCourses: Course[] = [
  {
    id: "foundation-450",
    title: "TOEIC Nền Tảng 450+",
    subtitle: "Xây gốc ngữ pháp, từ vựng và chiến thuật làm bài cho người mới bắt đầu.",
    status: "Đang học",
    difficulty: "Cơ bản",
    duration: "6 tuần",
    students: 1240,
    rating: 4.9,
    teacher: "Cô Trần Hương",
    icon: GraduationCap,
    color: C.blue,
    bg: C.blueL,
    border: C.blueB,
    goal: "Nắm chắc cấu trúc đề TOEIC và đạt mốc 450+ sau 6 tuần học đều.",
    suitableFor: "Học sinh mới bắt đầu, mất gốc tiếng Anh hoặc chưa từng thi TOEIC.",
    outcomes: ["Hiểu rõ 7 phần thi TOEIC và cách phân bổ thời gian.", "Ôn lại 12 điểm ngữ pháp thường gặp trong Part 5 và Part 6.", "Biết cách nghe bắt từ khoá trong Part 1, Part 2.", "Hoàn thành 3 mini test và 1 đề thi thử cuối khóa."],
    lessons: withStatuses(foundationLessons, 11, 11),
    homework: ["Hoàn thành 30 câu Part 5 mức cơ bản", "Học 40 từ vựng chủ đề Office", "Nộp Mini Test #1 trước Chủ nhật"],
    schedule: ["Thứ 2: Ngữ pháp nền tảng", "Thứ 4: Listening Part 1-2", "Thứ 6: Mini test và sửa lỗi"],
    resources: ["PDF cấu trúc đề TOEIC", "Bảng từ loại TOEIC", "Bộ audio Part 1-2", "Phiếu tự theo dõi lỗi sai"],
    assessment: ["Quiz sau mỗi buổi", "Mini test giữa khóa", "Thi thử cuối khóa", "Chứng nhận hoàn thành nếu đạt 80% nhiệm vụ"],
    nextAction: "Tiếp tục Buổi 12",
  },
  {
    id: "listening-boost",
    title: "Listening Intensive 350+",
    subtitle: "Tập trung Part 1–4, luyện nghe theo ngữ cảnh, keyword và bẫy phát âm.",
    status: "Đề xuất",
    difficulty: "Trung bình",
    duration: "5 tuần",
    students: 895,
    rating: 4.8,
    teacher: "Thầy Minh Quân",
    icon: Headphones,
    color: C.green,
    bg: C.greenL,
    border: C.greenB,
    goal: "Tăng điểm Listening lên 300–350+ bằng phương pháp nghe chủ động và phân tích transcript.",
    suitableFor: "Học sinh đã biết format đề nhưng nghe còn bỏ sót thông tin, dễ mất tập trung.",
    outcomes: ["Biết bắt từ khoá câu hỏi trước khi audio bắt đầu.", "Phân biệt bẫy đồng âm, paraphrase và thông tin nhiễu.", "Tự phân tích transcript để sửa lỗi nghe yếu.", "Hoàn thành 4 bộ luyện Part 3–4 theo chủ đề công việc."],
    lessons: withStatuses(listeningLessons, 0, 0),
    homework: ["Nghe shadowing 10 phút mỗi ngày", "Ghi lại 20 cụm paraphrase", "Làm Mini Listening #1"],
    schedule: ["Thứ 3: Kỹ thuật nghe", "Thứ 5: Luyện Part 3-4", "Chủ nhật: Review transcript"],
    resources: ["Bộ audio Part 1-4", "Transcript tô màu keyword", "Mẫu bảng phân tích lỗi nghe", "File luyện shadowing"],
    assessment: ["Bài nghe 15 phút hằng ngày", "Mini test Listening mỗi tuần", "Bảng lỗi transcript", "Final Listening Mock"],
    nextAction: "Đăng ký học",
  },
  {
    id: "reading-grammar",
    title: "Reading & Grammar 350+",
    subtitle: "Chuyên Part 5–7: ngữ pháp, đọc hiểu email, quảng cáo, thông báo và đoạn kép.",
    status: "Đang học",
    difficulty: "Trung bình",
    duration: "7 tuần",
    students: 1032,
    rating: 4.7,
    teacher: "Cô Mai Anh",
    icon: FileText,
    color: C.purple,
    bg: C.purpleL,
    border: C.purpleB,
    goal: "Tăng tốc độ đọc và giảm lỗi Part 5, Part 6, Part 7 để đạt Reading 300–350+.",
    suitableFor: "Học sinh đọc chậm, hay sai từ loại, thì, mệnh đề quan hệ và câu hỏi suy luận.",
    outcomes: ["Nắm 15 chủ điểm ngữ pháp TOEIC thường gặp.", "Biết đọc lướt, đọc quét và khoanh vùng thông tin Part 7.", "Tăng tốc độ làm Reading lên tối thiểu 75 câu/60 phút.", "Phân tích được vì sao đáp án sai là bẫy."],
    lessons: withStatuses(readingLessons, 8, 8),
    homework: ["Làm 50 câu Part 5", "Đọc 3 bài Part 7 dạng email", "Tổng hợp 10 lỗi sai ngữ pháp"],
    schedule: ["Thứ 2: Ngữ pháp Part 5", "Thứ 5: Part 6 và Part 7", "Thứ 7: Luyện tốc độ"],
    resources: ["Bảng ngữ pháp TOEIC", "Bộ đề Part 5-6", "Bài đọc Part 7 theo dạng", "Bảng quản lý thời gian Reading"],
    assessment: ["Quiz ngữ pháp sau mỗi buổi", "Mini Reading Test", "Bài đọc có dẫn chứng", "Final Reading Mock"],
    nextAction: "Tiếp tục Buổi 9",
  },
  {
    id: "vocab-600",
    title: "600 Từ Vựng TOEIC Theo Chủ Đề",
    subtitle: "Học từ vựng qua flashcard, ví dụ công việc và bài kiểm tra ghi nhớ hằng ngày.",
    status: "Hoàn thành",
    difficulty: "Cơ bản",
    duration: "4 tuần",
    students: 2201,
    rating: 4.9,
    teacher: "Hệ thống AI Coach",
    icon: BookMarked,
    color: C.orange,
    bg: C.orangeL,
    border: C.orangeB,
    goal: "Ghi nhớ 600 từ vựng cốt lõi thường xuất hiện trong đề TOEIC.",
    suitableFor: "Tất cả học sinh cần mở rộng vốn từ để nghe và đọc hiểu tốt hơn.",
    outcomes: ["Nắm 50 chủ đề từ vựng công sở, du lịch, mua sắm, nhân sự.", "Biết dùng từ trong câu ví dụ sát đề thi.", "Ôn lặp lại bằng flashcard theo mức độ nhớ/quên.", "Tự kiểm tra từ vựng theo tuần."],
    lessons: withStatuses(vocabLessons, 12),
    homework: ["Ôn lại bộ từ yếu", "Làm quiz duy trì 10 phút/ngày", "Áp dụng từ mới vào Part 5"],
    schedule: ["Mỗi ngày: 20 phút flashcard", "Thứ 4: Quiz từ vựng", "Chủ nhật: Ôn từ yếu"],
    resources: ["600 flashcard TOEIC", "File phát âm", "Bảng collocation", "Đề final vocabulary"],
    assessment: ["Quiz theo chủ đề", "Ôn tập spaced repetition", "Final vocabulary test", "Chứng nhận hoàn thành từ vựng"],
    nextAction: "Ôn lại khóa học",
  },
  {
    id: "fulltest-800",
    title: "TOEIC Full Test Booster 800+",
    subtitle: "Luyện đề hoàn chỉnh, phân tích lỗi sai và mô phỏng áp lực thời gian thật.",
    status: "Sắp mở",
    difficulty: "Nâng cao",
    duration: "3 tuần",
    students: 520,
    rating: 4.8,
    teacher: "Đội ngũ TOEIC Prep",
    icon: ClipboardList,
    color: C.red,
    bg: C.redL,
    border: C.redB,
    goal: "Bứt phá từ 650–700 lên mục tiêu 800+ bằng luyện đề và sửa lỗi chuyên sâu.",
    suitableFor: "Học sinh đã có nền tảng, cần luyện tốc độ, tâm lý phòng thi và chiến thuật điểm cao.",
    outcomes: ["Hoàn thành 5 đề mô phỏng full test.", "Biết phân tích biểu đồ lỗi sai theo từng part.", "Cải thiện quản lý thời gian Reading.", "Có kế hoạch ôn 7 ngày cuối trước kỳ thi thật."],
    lessons: withStatuses(fullTestLessons, 0),
    homework: ["Chuẩn bị tai nghe", "Ôn lại 7 part", "Đặt lịch làm diagnostic test"],
    schedule: ["Dự kiến mở: 01/07/2026", "Tuần 1: Diagnostic và sửa lỗi", "Tuần 2-3: Mock test tăng tốc"],
    resources: ["Full test mô phỏng", "Bảng phân tích lỗi", "Checklist 7 ngày trước thi", "Phiếu báo cáo mục tiêu 800+"],
    assessment: ["Diagnostic full test", "Review từng mock test", "Final booster test", "Kế hoạch ôn tiếp cá nhân"],
    nextAction: "Nhận thông báo mở khóa",
  },
];


function hydrateCourses(saved: Course[]): Course[] {
  if (!Array.isArray(saved)) return baseCourses;
  return baseCourses.map((base) => {
    const old = saved.find((course) => course?.id === base.id);
    if (!old) return base;
    return {
      ...base,
      status: old.status ?? base.status,
      nextAction: old.nextAction ?? base.nextAction,
      lessons: base.lessons.map((lesson, index) => ({
        ...lesson,
        status: old.lessons?.[index]?.status ?? lesson.status,
      })),
    };
  });
}

function getStats(course: Course) {
  const completedLessons = course.lessons.filter((lesson) => lesson.status === "done").length;
  const totalLessons = course.lessons.length;
  const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  return { completedLessons, totalLessons, progress };
}

function saveTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }: { status: CourseStatus }) {
  const map: Record<CourseStatus, { bg: string; color: string; border: string }> = {
    "Đang học": { bg: C.blueL, color: C.blue, border: C.blueB },
    "Đề xuất": { bg: C.greenL, color: C.green, border: C.greenB },
    "Hoàn thành": { bg: C.orangeL, color: C.orange, border: C.orangeB },
    "Sắp mở": { bg: C.redL, color: C.red, border: C.redB },
  };
  const s = map[status];
  return <span style={{ fontSize: "0.64rem", fontWeight: 800, color: s.color, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 999, padding: "3px 8px", whiteSpace: "nowrap" }}>{status}</span>;
}

function LessonIcon({ status }: { status: LessonStatus }) {
  if (status === "done") return <CheckCircle2 size={15} style={{ color: C.green }} />;
  if (status === "active") return <PlayCircle size={15} style={{ color: C.blue }} />;
  return <Lock size={14} style={{ color: C.muted }} />;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: "1.05rem", fontWeight: 850, color: "var(--foreground)", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "0.68rem", color: "var(--muted-foreground)", marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

function CourseCard({ course, selected, onSelect }: { course: Course; selected: boolean; onSelect: () => void }) {
  const Icon = course.icon;
  const stats = getStats(course);
  return (
    <button onClick={onSelect}
      style={{
        width: "100%", textAlign: "left", border: `1.5px solid ${selected ? course.color : "var(--border)"}`,
        background: selected ? course.bg : "var(--card)", borderRadius: 18, padding: 16, cursor: "pointer",
        boxShadow: selected ? `0 12px 28px ${course.color}18` : "0 2px 10px rgba(15,23,42,0.04)",
        transition: "all 0.16s ease",
      }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: course.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={21} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
            <h3 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 850, color: "var(--foreground)", lineHeight: 1.25 }}>{course.title}</h3>
            <StatusBadge status={course.status} />
          </div>
          <p style={{ margin: 0, color: "var(--muted-foreground)", fontSize: "0.72rem", lineHeight: 1.45 }}>{course.subtitle}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 14 }}>
        <div style={{ background: "rgba(255,255,255,0.65)", border: "1px solid var(--border)", borderRadius: 12, padding: "8px 9px" }}>
          <div style={{ fontSize: "0.62rem", color: "var(--muted-foreground)" }}>Thời lượng</div>
          <div style={{ fontSize: "0.76rem", fontWeight: 800, marginTop: 2 }}>{course.duration}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.65)", border: "1px solid var(--border)", borderRadius: 12, padding: "8px 9px" }}>
          <div style={{ fontSize: "0.62rem", color: "var(--muted-foreground)" }}>Bài học</div>
          <div style={{ fontSize: "0.76rem", fontWeight: 800, marginTop: 2 }}>{stats.completedLessons}/{stats.totalLessons}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.65)", border: "1px solid var(--border)", borderRadius: 12, padding: "8px 9px" }}>
          <div style={{ fontSize: "0.62rem", color: "var(--muted-foreground)" }}>Mức độ</div>
          <div style={{ fontSize: "0.76rem", fontWeight: 800, marginTop: 2 }}>{course.difficulty}</div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--foreground)" }}>Tiến độ</span>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: course.color }}>{stats.progress}%</span>
        </div>
        <div style={{ height: 7, borderRadius: 999, background: "var(--muted)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${stats.progress}%`, background: course.color, borderRadius: 999 }} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted-foreground)", fontSize: "0.68rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} />{course.students.toLocaleString("vi-VN")}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={12} style={{ color: "#f59e0b", fill: "#f59e0b" }} />{course.rating}</span>
        </div>
        <span style={{ display: "flex", alignItems: "center", gap: 4, color: selected ? course.color : "var(--primary)", fontSize: "0.7rem", fontWeight: 800 }}>
          Xem chi tiết <ChevronRight size={13} />
        </span>
      </div>
    </button>
  );
}

function LessonRow({ lesson, index, selected, onClick }: { lesson: Lesson; index: number; selected: boolean; onClick: () => void }) {
  const active = lesson.status === "active";
  const done = lesson.status === "done";
  return (
    <button onClick={onClick} style={{ width: "100%", textAlign: "left", border: `1.5px solid ${selected ? C.blue : active ? C.blueB : done ? C.greenB : "var(--border)"}`, background: selected ? "#eef2ff" : active ? C.blueL : done ? C.greenL : "var(--background)", borderRadius: 14, padding: 14, cursor: "pointer" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: done ? C.green : active ? C.blue : "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", color: done || active ? "#fff" : "var(--muted-foreground)", fontSize: "0.72rem", fontWeight: 850, flexShrink: 0 }}>
          {done ? "✓" : index + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <h4 style={{ margin: 0, fontSize: "0.86rem", fontWeight: 850, color: "var(--foreground)" }}>{lesson.title}</h4>
            <LessonIcon status={lesson.status} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "7px 0 8px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.64rem", color: "var(--muted-foreground)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 999, padding: "2px 8px" }}><Clock size={11} />{lesson.duration}</span>
            <span style={{ fontSize: "0.64rem", color: active ? C.blue : done ? C.green : C.muted, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 999, padding: "2px 8px", fontWeight: 700 }}>{lesson.type}</span>
            <span style={{ fontSize: "0.64rem", color: "var(--muted-foreground)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 999, padding: "2px 8px", fontWeight: 700 }}>{done ? "Đã học" : active ? "Đang mở" : "Bị khóa"}</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.72rem", lineHeight: 1.5, color: "var(--muted-foreground)" }}>{lesson.detail}</p>
        </div>
      </div>
    </button>
  );
}

export function Courses() {
  const [courseList, setCourseList] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem("toeic-courses-demo-v3");
      return saved ? hydrateCourses(JSON.parse(saved) as Course[]) : baseCourses;
    } catch {
      return baseCourses;
    }
  });
  const [homeworkDone, setHomeworkDone] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("toeic-homework-demo-v3");
      return saved ? JSON.parse(saved) as Record<string, boolean> : {};
    } catch {
      return {};
    }
  });
  const [filter, setFilter] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(baseCourses[0].id);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [tutorQuestion, setTutorQuestion] = useState("");

  useEffect(() => {
    localStorage.setItem("toeic-courses-demo-v3", JSON.stringify(courseList));
  }, [courseList]);

  useEffect(() => {
    localStorage.setItem("toeic-homework-demo-v3", JSON.stringify(homeworkDone));
  }, [homeworkDone]);

  const selected = courseList.find((c) => c.id === selectedId) ?? courseList[0];
  const selectedStats = getStats(selected);
  const selectedLesson = selected.lessons[selectedLessonIndex] ?? selected.lessons[0];

  useEffect(() => {
    const course = courseList.find((c) => c.id === selectedId);
    if (!course) return;
    const activeIndex = course.lessons.findIndex((lesson) => lesson.status === "active");
    setSelectedLessonIndex(activeIndex >= 0 ? activeIndex : 0);
  }, [selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courseList.filter((course) => {
      const matchFilter = filter === "Tất cả" || course.status === filter;
      const matchQuery = !q || [course.title, course.subtitle, course.teacher, course.difficulty, course.goal].join(" ").toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [filter, query, courseList]);

  const totalCompleted = courseList.reduce((sum, course) => sum + getStats(course).completedLessons, 0);
  const activeCourses = courseList.filter((c) => c.status === "Đang học").length;
  const avgProgress = Math.round(courseList.filter((c) => c.status === "Đang học").reduce((s, c) => s + getStats(c).progress, 0) / Math.max(1, activeCourses));
  const completedCertificates = courseList.filter((course) => course.status === "Hoàn thành").length;

  function showMessage(text: string) {
    setMessage(text);
  }

  function updateSelectedCourse(updater: (course: Course) => Course) {
    setCourseList((prev) => prev.map((course) => course.id === selected.id ? updater(course) : course));
  }

  function handlePrimaryAction() {
    if (selected.status === "Đề xuất") {
      updateSelectedCourse((course) => ({ ...course, status: "Đang học", nextAction: "Tiếp tục Buổi 1" }));
      setSelectedLessonIndex(0);
      showMessage(`Đã đăng ký khóa “${selected.title}”. Đây là mô phỏng frontend, tiến độ được lưu trên trình duyệt.`);
      return;
    }
    if (selected.status === "Sắp mở") {
      showMessage(`Đã bật nhắc mở khóa “${selected.title}”. Khi demo, thông báo này chỉ hiển thị trên giao diện.`);
      return;
    }
    const activeIndex = selected.lessons.findIndex((lesson) => lesson.status === "active");
    setSelectedLessonIndex(activeIndex >= 0 ? activeIndex : 0);
    showMessage(activeIndex >= 0 ? `Đang mở ${selected.lessons[activeIndex].title}.` : `Khóa này đã hoàn thành, bạn có thể ôn lại từ Buổi 1.`);
  }

  function completeCurrentLesson() {
    if (!selectedLesson || selectedLesson.status === "locked") {
      showMessage("Buổi này đang bị khóa. Hãy hoàn thành buổi đang mở trước.");
      return;
    }
    updateSelectedCourse((course) => {
      const lessons = course.lessons.map((lesson, index) => {
        if (index === selectedLessonIndex) return { ...lesson, status: "done" as LessonStatus };
        if (index === selectedLessonIndex + 1 && lesson.status === "locked") return { ...lesson, status: "active" as LessonStatus };
        return lesson;
      });
      const allDone = lessons.every((lesson) => lesson.status === "done");
      return {
        ...course,
        status: allDone ? "Hoàn thành" : "Đang học",
        nextAction: allDone ? "Ôn lại khóa học" : `Tiếp tục Buổi ${Math.min(selectedLessonIndex + 2, lessons.length)}`,
        lessons,
      };
    });
    const nextIndex = Math.min(selectedLessonIndex + 1, selected.lessons.length - 1);
    setSelectedLessonIndex(nextIndex);
    showMessage("Đã đánh dấu hoàn thành buổi học. Bài kế tiếp đã được mở khóa trong giao diện.");
  }

  function toggleHomework(index: number) {
    const key = `${selected.id}-${index}`;
    setHomeworkDone((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function downloadMaterial() {
    const content = [
      `KHÓA HỌC: ${selected.title}`,
      `Giảng viên: ${selected.teacher}`,
      `Mục tiêu: ${selected.goal}`,
      "",
      "LỊCH HỌC:",
      ...selected.schedule.map((item, index) => `${index + 1}. ${item}`),
      "",
      "DANH SÁCH BÀI HỌC:",
      ...selected.lessons.map((lesson, index) => `${index + 1}. ${lesson.title} - ${lesson.duration} - ${lesson.type}\n   Nội dung: ${lesson.detail}\n   Tài liệu: ${lesson.material}\n   Quiz: ${lesson.quiz}`),
      "",
      "BÀI TẬP CẦN LÀM:",
      ...selected.homework.map((item, index) => `${index + 1}. ${item}`),
    ].join("\n");
    saveTextFile(`${selected.id}-tai-lieu-khoa-hoc.txt`, content);
    showMessage("Đã tạo file tài liệu .txt để tải về máy.");
  }

  function askTutor() {
    const text = tutorQuestion.trim() || `Em cần gia sư giải thích thêm về ${selectedLesson.title} trong khóa ${selected.title}.`;
    setTutorQuestion(text);
    showMessage(`Đã tạo câu hỏi mẫu cho gia sư: “${text}”`);
  }

  function resetDemo() {
    localStorage.removeItem("toeic-courses-demo-v3");
    localStorage.removeItem("toeic-homework-demo-v3");
    setCourseList(baseCourses);
    setHomeworkDone({});
    setSelectedId(baseCourses[0].id);
    setSelectedLessonIndex(11);
    showMessage("Đã reset dữ liệu demo về ban đầu.");
  }

  const primaryLabel = selected.status === "Đề xuất" ? "Đăng ký học" : selected.status === "Sắp mở" ? "Nhận thông báo mở khóa" : selected.status === "Hoàn thành" ? "Ôn lại khóa học" : selected.nextAction;

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1d4ed8 55%,#22c55e 100%)", borderRadius: 22, padding: "24px 28px", color: "#fff", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", right: -40, top: -50, width: 190, height: 190, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
        <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "5px 10px", fontSize: "0.7rem", fontWeight: 750, marginBottom: 10 }}>
            <ShieldCheck size={13} /> Lộ trình khóa học cá nhân hóa
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.35rem", fontWeight: 900, letterSpacing: "-0.02em" }}>Khóa học TOEIC dành cho học sinh</h2>
          <p style={{ margin: 0, color: "#dbeafe", fontSize: "0.84rem", lineHeight: 1.55, maxWidth: 720 }}>
            Phần Khóa Học đã được phát triển theo dạng frontend hoàn chỉnh: xem chi tiết từng buổi, mở bài học, đánh dấu hoàn thành, tải tài liệu mẫu, hỏi gia sư và lưu tiến độ bằng localStorage.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(90px,1fr))", gap: 10, position: "relative" }}>
          {[
            { value: courseList.length, label: "Khóa học" },
            { value: activeCourses, label: "Đang học" },
            { value: `${avgProgress}%`, label: "TB tiến độ" },
          ].map((item) => (
            <div key={item.label} style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: "14px 16px", textAlign: "center", backdropFilter: "blur(5px)" }}>
              <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#fef08a", lineHeight: 1 }}>{item.value}</div>
              <div style={{ fontSize: "0.65rem", color: "#bfdbfe", marginTop: 3 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 14 }}>
        <StatCard label="Bài học đã hoàn thành" value={`${totalCompleted}`} icon={CheckCircle2} color={C.green} />
        <StatCard label="Giờ học tích lũy" value="42h" icon={Clock} color={C.blue} />
        <StatCard label="Điểm mục tiêu" value="800+" icon={Target} color={C.orange} />
        <StatCard label="Chứng nhận đạt được" value={`${completedCertificates}`} icon={Award} color={C.purple} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "390px 1fr", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Filter size={15} style={{ color: C.blue }} />
                <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 850 }}>Danh sách khóa học</h3>
              </div>
              <span style={{ fontSize: "0.68rem", color: "var(--muted-foreground)", fontWeight: 700 }}>{filtered.length}/{courseList.length}</span>
            </div>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm khóa học, gia sư, mức độ..." style={{ width: "100%", boxSizing: "border-box", height: 38, borderRadius: 12, border: "1px solid var(--border)", background: "var(--background)", padding: "0 12px 0 34px", outline: "none", fontSize: "0.78rem" }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {filters.map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{ border: `1px solid ${filter === f ? C.blue : "var(--border)"}`, background: filter === f ? C.blue : "var(--background)", color: filter === f ? "#fff" : "var(--muted-foreground)", borderRadius: 999, padding: "6px 10px", fontSize: "0.7rem", fontWeight: 750, cursor: "pointer" }}>{f}</button>
              ))}
            </div>
          </div>

          {filtered.map((course) => <CourseCard key={course.id} course={course} selected={selected.id === course.id} onSelect={() => setSelectedId(course.id)} />)}
        </div>

        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 30px rgba(15,23,42,0.06)" }}>
          <div style={{ background: `linear-gradient(135deg,${selected.color},#0f172a)`, padding: "22px 24px", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 54, height: 54, borderRadius: 17, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {(() => { const Icon = selected.icon; return <Icon size={27} color="#fff" />; })()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 7 }}>
                  <span style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 999, padding: "3px 9px", fontSize: "0.66rem", fontWeight: 800 }}>{selected.status}</span>
                  <span style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 999, padding: "3px 9px", fontSize: "0.66rem", fontWeight: 800 }}>{selected.difficulty}</span>
                </div>
                <h2 style={{ margin: "0 0 7px", fontSize: "1.22rem", fontWeight: 900 }}>{selected.title}</h2>
                <p style={{ margin: 0, color: "#dbeafe", fontSize: "0.78rem", lineHeight: 1.5 }}>{selected.subtitle}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 18 }}>
              {[
                { label: "Giảng viên", value: selected.teacher, icon: Users },
                { label: "Thời lượng", value: selected.duration, icon: CalendarDays },
                { label: "Bài học", value: `${selectedStats.completedLessons}/${selectedStats.totalLessons}`, icon: BookOpen },
                { label: "Đánh giá", value: `${selected.rating}/5`, icon: Star },
              ].map((m) => (
                <div key={m.label} style={{ background: "rgba(255,255,255,0.13)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 14, padding: "10px 11px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#bfdbfe", fontSize: "0.6rem", marginBottom: 4 }}><m.icon size={11} />{m.label}</div>
                  <div style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 850, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 22, display: "grid", gap: 20 }}>
            {message && (
              <div style={{ border: `1px solid ${selected.border}`, background: selected.bg, borderRadius: 14, padding: "11px 13px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--foreground)", fontSize: "0.75rem", lineHeight: 1.45 }}>
                  <Zap size={14} style={{ color: selected.color, flexShrink: 0 }} /> {message}
                </div>
                <button onClick={() => setMessage("")} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--muted-foreground)", fontWeight: 900 }}>×</button>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={handlePrimaryAction} style={{ border: "none", background: selected.color, color: "#fff", borderRadius: 12, padding: "10px 14px", fontSize: "0.78rem", fontWeight: 850, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}><PlayCircle size={16} />{primaryLabel}</button>
              <button onClick={downloadMaterial} style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", borderRadius: 12, padding: "10px 14px", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}><Download size={15} />Tải tài liệu</button>
              <button onClick={askTutor} style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", borderRadius: 12, padding: "10px 14px", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}><MessageCircle size={15} />Hỏi gia sư</button>
              <button onClick={resetDemo} style={{ border: "1px solid var(--border)", background: "var(--background)", color: "var(--muted-foreground)", borderRadius: 12, padding: "10px 14px", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}><RefreshCcw size={15} />Reset demo</button>
            </div>

            <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 16, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 850 }}>Tiến độ khóa học</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 900, color: selected.color }}>{selectedStats.progress}%</span>
              </div>
              <div style={{ height: 9, background: "var(--muted)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${selectedStats.progress}%`, background: selected.color, borderRadius: 999 }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, color: "var(--muted-foreground)", fontSize: "0.72rem" }}>
                <Zap size={13} style={{ color: "#ca8a04" }} /> Hoàn thành bài học hiện tại để nhận XP và mở bài kế tiếp. Dữ liệu lưu bằng localStorage, không cần backend.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Target size={16} style={{ color: selected.color }} />
                  <h3 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 900 }}>Mục tiêu khóa học</h3>
                </div>
                <p style={{ margin: "0 0 10px", fontSize: "0.74rem", color: "var(--muted-foreground)", lineHeight: 1.55 }}>{selected.goal}</p>
                <div style={{ fontSize: "0.7rem", color: "var(--foreground)", background: selected.bg, border: `1px solid ${selected.border}`, borderRadius: 12, padding: 10 }}>
                  <b>Phù hợp:</b> {selected.suitableFor}
                </div>
              </div>

              <div style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <BarChart3 size={16} style={{ color: selected.color }} />
                  <h3 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 900 }}>Kết quả sau khóa</h3>
                </div>
                <div style={{ display: "grid", gap: 7 }}>
                  {selected.outcomes.map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, fontSize: "0.72rem", color: "var(--foreground)", lineHeight: 1.45 }}>
                      <CheckCircle2 size={13} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} />
                      <span>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BookOpen size={16} style={{ color: selected.color }} />
                    <h3 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 900 }}>Chi tiết từng buổi học</h3>
                  </div>
                  <span style={{ fontSize: "0.68rem", color: "var(--muted-foreground)", fontWeight: 700 }}>{selected.lessons.length} buổi</span>
                </div>
                <div style={{ display: "grid", gap: 10, maxHeight: 560, overflowY: "auto", paddingRight: 4 }}>
                  {selected.lessons.map((lesson, i) => <LessonRow key={lesson.title} lesson={lesson} index={i} selected={selectedLessonIndex === i} onClick={() => setSelectedLessonIndex(i)} />)}
                </div>
              </div>

              <div style={{ border: `1.5px solid ${selectedLesson?.status === "active" ? selected.color : "var(--border)"}`, borderRadius: 16, padding: 16, background: "var(--background)", position: "sticky", top: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                  <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 900 }}>Nội dung buổi đang chọn</h3>
                  <LessonIcon status={selectedLesson?.status ?? "locked"} />
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: 900, color: "var(--foreground)", marginBottom: 6 }}>{selectedLesson?.title}</div>
                <p style={{ margin: "0 0 10px", color: "var(--muted-foreground)", fontSize: "0.72rem", lineHeight: 1.55 }}>{selectedLesson?.detail}</p>
                <div style={{ display: "grid", gap: 9 }}>
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 10 }}>
                    <div style={{ fontSize: "0.66rem", fontWeight: 850, color: selected.color, marginBottom: 4 }}>Trọng tâm</div>
                    <div style={{ fontSize: "0.72rem", lineHeight: 1.45 }}>{selectedLesson?.focus}</div>
                  </div>
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 10 }}>
                    <div style={{ fontSize: "0.66rem", fontWeight: 850, color: selected.color, marginBottom: 4 }}>Tài liệu</div>
                    <div style={{ fontSize: "0.72rem", lineHeight: 1.45 }}>{selectedLesson?.material}</div>
                  </div>
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 10 }}>
                    <div style={{ fontSize: "0.66rem", fontWeight: 850, color: selected.color, marginBottom: 4 }}>Quiz / Kiểm tra</div>
                    <div style={{ fontSize: "0.72rem", lineHeight: 1.45 }}>{selectedLesson?.quiz}</div>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 850, marginBottom: 8 }}>Nhiệm vụ của buổi</div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {selectedLesson?.tasks.map((task, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.7rem", color: "var(--foreground)" }}>
                        {selectedLesson.status === "done" ? <CheckCircle2 size={12} style={{ color: C.green }} /> : selectedLesson.status === "active" ? <Circle size={12} style={{ color: selected.color }} /> : <Lock size={11} style={{ color: C.muted }} />}
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={completeCurrentLesson} disabled={selectedLesson?.status === "done"} style={{ marginTop: 14, width: "100%", border: "none", background: selectedLesson?.status === "done" ? C.green : selected.color, color: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: "0.75rem", fontWeight: 850, cursor: selectedLesson?.status === "done" ? "default" : "pointer" }}>
                  {selectedLesson?.status === "done" ? "Buổi này đã hoàn thành" : selectedLesson?.status === "locked" ? "Thử hoàn thành / mở khóa" : "Đánh dấu hoàn thành buổi này"}
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 16, background: "var(--background)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <ClipboardList size={16} style={{ color: selected.color }} />
                  <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 900 }}>Bài tập cần làm</h3>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {selected.homework.map((h, i) => {
                    const checked = !!homeworkDone[`${selected.id}-${i}`];
                    return (
                      <button key={i} onClick={() => toggleHomework(i)} style={{ textAlign: "left", background: "var(--card)", border: `1.5px solid ${checked ? C.greenB : "var(--border)"}`, borderRadius: 13, padding: 12, cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                          {checked ? <CheckCircle2 size={15} style={{ color: C.green, flexShrink: 0, marginTop: 1 }} /> : <Circle size={15} style={{ color: selected.color, flexShrink: 0, marginTop: 1 }} />}
                          <div>
                            <div style={{ fontSize: "0.66rem", color: "var(--muted-foreground)", fontWeight: 750, marginBottom: 3 }}>Nhiệm vụ {i + 1}</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--foreground)", lineHeight: 1.45, fontWeight: 650 }}>{h}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                <div style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <CalendarDays size={16} style={{ color: selected.color }} />
                    <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 900 }}>Lịch học gợi ý</h3>
                  </div>
                  <div style={{ display: "grid", gap: 7 }}>
                    {selected.schedule.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, fontSize: "0.72rem", lineHeight: 1.45 }}>
                        <CheckCircle2 size={13} style={{ color: selected.color, flexShrink: 0, marginTop: 2 }} /> {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Download size={16} style={{ color: selected.color }} />
                    <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 900 }}>Tài nguyên & đánh giá</h3>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: "0.66rem", fontWeight: 850, color: "var(--muted-foreground)", marginBottom: 6 }}>Tài nguyên</div>
                      {selected.resources.map((item, i) => <div key={i} style={{ fontSize: "0.7rem", lineHeight: 1.5 }}>• {item}</div>)}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.66rem", fontWeight: 850, color: "var(--muted-foreground)", marginBottom: 6 }}>Đánh giá</div>
                      {selected.assessment.map((item, i) => <div key={i} style={{ fontSize: "0.7rem", lineHeight: 1.5 }}>• {item}</div>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 16, background: selected.bg }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <MessageCircle size={16} style={{ color: selected.color }} />
                <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 900 }}>Hỏi gia sư / ghi chú thắc mắc</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                <input value={tutorQuestion} onChange={(e) => setTutorQuestion(e.target.value)} placeholder="Ví dụ: Em chưa hiểu bẫy paraphrase trong Part 3..." style={{ height: 40, borderRadius: 12, border: `1px solid ${selected.border}`, padding: "0 12px", outline: "none", fontSize: "0.78rem" }} />
                <button onClick={askTutor} style={{ border: "none", background: selected.color, color: "#fff", borderRadius: 12, padding: "0 14px", fontSize: "0.75rem", fontWeight: 850, cursor: "pointer" }}>Gửi mô phỏng</button>
              </div>
              <div style={{ marginTop: 8, fontSize: "0.68rem", color: "var(--muted-foreground)" }}>Không cần backend: nút này chỉ tạo phản hồi demo và giữ câu hỏi trên giao diện.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
