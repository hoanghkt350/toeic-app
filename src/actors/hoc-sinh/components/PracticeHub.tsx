import { useState, useRef, useEffect } from "react";
import {
  Headphones, BookOpen, ClipboardList, FileText,
  Play, Pause, Volume2, CheckCircle2, Clock, Circle,
  Send, Zap, RotateCcw, AlertCircle, ChevronDown,
  Star, ChevronRight, Image as ImageIcon, MessageSquare,
} from "lucide-react";

/* ─── palette ───────────────────────────────────────────── */
const C = {
  blue:"#1d4ed8", blueL:"#eff6ff", blueB:"#bfdbfe",
  green:"#16a34a", greenL:"#f0fdf4", greenB:"#bbf7d0",
  red:"#dc2626", redL:"#fef2f2", redB:"#fecaca",
  orange:"#d97706", orangeL:"#fffbeb",
  muted:"#64748b", border:"#e2e8f0", bg:"#f8faff", card:"#ffffff", text:"#111827",
};

/* ─── question bank ─────────────────────────────────────── */
interface Question {
  id: number;
  text: string;          // question stem (empty for Part 1 — audio only)
  choices: { key: string; text: string }[];
  correct: string;
  explanation: string;
}

interface TaskContent {
  instruction: string;
  passage?: string;      // reading passage
  imageDesc?: string;    // Part 1 image description (shown as placeholder)
  questions: Question[];
  tips: string[];
}

const CONTENT: Record<string, TaskContent> = {

  /* ── LISTENING PART 1 ─────────────────────────────────── */
  l1: {
    instruction: "Nhìn vào hình ảnh trong sách bài thi. Bạn sẽ nghe 4 câu mô tả hình ảnh. Chọn câu mô tả ĐÚNG NHẤT với hình ảnh.",
    imageDesc: "📷 Hình ảnh: Một văn phòng hiện đại — người phụ nữ đang ngồi tại bàn làm việc, gõ máy tính xách tay. Trên bàn có điện thoại và tập tài liệu. Cửa sổ phía sau nhìn ra thành phố.",
    questions: [
      {
        id:1, text:"[Nghe bản ghi âm — Track 1]",
        choices:[
          { key:"A", text:"The woman is standing next to the window." },
          { key:"B", text:"The woman is typing on a laptop computer." },
          { key:"C", text:"The woman is talking on the phone." },
          { key:"D", text:"The woman is reading a document." },
        ],
        correct:"B",
        explanation:"Hình ảnh cho thấy người phụ nữ đang GÕ máy tính (typing on a laptop). Đáp án A sai (bà đang ngồi, không đứng). C và D là hành động không có trong hình.",
      },
      {
        id:2, text:"[Nghe bản ghi âm — Track 2]",
        choices:[
          { key:"A", text:"Some files are stacked on the desk." },
          { key:"B", text:"A computer monitor is turned off." },
          { key:"C", text:"The office has no furniture." },
          { key:"D", text:"A phone is placed on the floor." },
        ],
        correct:"A",
        explanation:"Trên bàn có tập tài liệu/tài liệu (files are stacked on the desk). B sai (máy tính đang được dùng). C và D hoàn toàn không đúng.",
      },
      {
        id:3, text:"[Nghe bản ghi âm — Track 3]",
        choices:[
          { key:"A", text:"The blinds are completely closed." },
          { key:"B", text:"The window overlooks a city view." },
          { key:"C", text:"There are plants on the windowsill." },
          { key:"D", text:"The curtains are drawn." },
        ],
        correct:"B",
        explanation:"Cửa sổ nhìn ra thành phố (overlooks a city view). Không có bằng chứng về rèm hay cây cảnh trong hình.",
      },
    ],
    tips:[
      "Nhìn ảnh thật kỹ TRƯỚC KHI nghe — chú ý chủ ngữ đang làm gì",
      "Loại trừ đáp án dùng từ trong ảnh nhưng mô tả sai hành động",
      "Cảnh giác: người/vật CÓ trong ảnh nhưng hành động SAI cũng là bẫy",
    ],
  },

  /* ── LISTENING PART 2 ─────────────────────────────────── */
  l2: {
    instruction: "Nghe một câu hỏi hoặc phát biểu. Chọn câu trả lời PHÙ HỢP NHẤT trong số A, B, C.",
    questions: [
      {
        id:1, text:"🎧 \"Where did you put the quarterly report?\"",
        choices:[
          { key:"A", text:"It's on the conference room table." },
          { key:"B", text:"I wrote it last week." },
          { key:"C", text:"The report was very detailed." },
        ],
        correct:"A",
        explanation:"Câu hỏi 'Where...?' cần câu trả lời chỉ địa điểm. A trả lời đúng (trên bàn phòng họp). B và C không trả lời được 'ở đâu'.",
      },
      {
        id:2, text:"🎧 \"Haven't you already spoken with the client?\"",
        choices:[
          { key:"A", text:"Yes, we met this morning." },
          { key:"B", text:"The client called yesterday." },
          { key:"C", text:"I'll speak more carefully." },
        ],
        correct:"A",
        explanation:"Câu hỏi đuôi phủ định — câu trả lời 'Yes, we met this morning' xác nhận đã gặp. B và C không trả lời trực tiếp câu hỏi.",
      },
      {
        id:3, text:"🎧 \"Would you like me to reschedule the meeting?\"",
        choices:[
          { key:"A", text:"The meeting lasted two hours." },
          { key:"B", text:"That would be very helpful, thanks." },
          { key:"C", text:"He was scheduled for Tuesday." },
        ],
        correct:"B",
        explanation:"Câu đề nghị 'Would you like me to...?' — trả lời chấp nhận/từ chối. B là câu chấp nhận phù hợp. A và C không liên quan.",
      },
      {
        id:4, text:"🎧 \"When is the new product launch scheduled?\"",
        choices:[
          { key:"A", text:"It's a very innovative product." },
          { key:"B", text:"In the main conference hall." },
          { key:"C", text:"Sometime in mid-October, I think." },
        ],
        correct:"C",
        explanation:"'When?' hỏi thời gian — C trả lời đúng (giữa tháng 10). A nói về sản phẩm, B nói về địa điểm.",
      },
      {
        id:5, text:"🎧 \"You're presenting at tomorrow's staff meeting, right?\"",
        choices:[
          { key:"A", text:"Yes, I've been preparing all week." },
          { key:"B", text:"The meeting room is on the second floor." },
          { key:"C", text:"I usually attend every Friday." },
        ],
        correct:"A",
        explanation:"Câu xác nhận — A trả lời 'có, tôi đã chuẩn bị cả tuần' là hợp lý nhất. B và C lạc đề.",
      },
    ],
    tips:[
      "Xác định từ để hỏi đầu tiên: Who/What/When/Where/Why/How",
      "Câu hỏi đuôi phủ định (Haven't you...?): trả lời theo thực tế, không theo câu hỏi",
      "Cảnh giác bẫy: lặp lại từ trong câu hỏi nhưng nghĩa không liên quan",
    ],
  },

  /* ── LISTENING PART 3 ─────────────────────────────────── */
  l3: {
    instruction: "Nghe đoạn hội thoại giữa hai hoặc ba người. Trả lời các câu hỏi về nội dung cuộc trò chuyện.",
    imageDesc: "🎧 Đoạn hội thoại — Cuộc gọi điện thoại giữa nhân viên kinh doanh và khách hàng về đơn hàng bị trễ.\n\nM: \"Good morning, this is Mark from Apex Solutions. I'm calling about order number 4471.\"\nF: \"Yes, I've been waiting for that delivery. It was supposed to arrive on Monday.\"\nM: \"I apologize for the delay. There was an issue with our warehouse inventory. We can ship it by Thursday, with a 15% discount for the inconvenience.\"\nF: \"Thursday is acceptable, but I'd also like a written confirmation sent to my email.\"\nM: \"Absolutely. I'll send that right away. Can you confirm your email address?\"",
    questions: [
      {
        id:1, text:"What is the purpose of the man's call?",
        choices:[
          { key:"A", text:"To place a new order for a client" },
          { key:"B", text:"To discuss a delayed shipment" },
          { key:"C", text:"To ask for a product catalog" },
          { key:"D", text:"To confirm a meeting appointment" },
        ],
        correct:"B",
        explanation:"Người đàn ông gọi để thảo luận về đơn hàng bị trễ (\"calling about order number 4471\" + xin lỗi về sự chậm trễ). Đáp án B chính xác.",
      },
      {
        id:2, text:"What does the man offer to compensate for the delay?",
        choices:[
          { key:"A", text:"Free expedited shipping" },
          { key:"B", text:"A full refund of the order" },
          { key:"C", text:"A 15% discount on the order" },
          { key:"D", text:"A replacement product" },
        ],
        correct:"C",
        explanation:"Người đàn ông đề nghị 'a 15% discount for the inconvenience' — giảm 15% để bồi thường. C là đáp án đúng.",
      },
      {
        id:3, text:"What does the woman request at the end of the conversation?",
        choices:[
          { key:"A", text:"A phone call from the manager" },
          { key:"B", text:"A written confirmation by email" },
          { key:"C", text:"An immediate delivery today" },
          { key:"D", text:"A catalogue of new products" },
        ],
        correct:"B",
        explanation:"Người phụ nữ yêu cầu 'a written confirmation sent to my email'. Đáp án B chính xác.",
      },
      {
        id:4, text:"What caused the delay according to the man?",
        choices:[
          { key:"A", text:"A transportation strike" },
          { key:"B", text:"A system error in ordering" },
          { key:"C", text:"A warehouse inventory issue" },
          { key:"D", text:"Bad weather conditions" },
        ],
        correct:"C",
        explanation:"Nguyên nhân: 'There was an issue with our warehouse inventory' — vấn đề về hàng tồn kho. C là đúng.",
      },
      {
        id:5, text:"When will the order be shipped?",
        choices:[
          { key:"A", text:"On Monday" },
          { key:"B", text:"On Wednesday" },
          { key:"C", text:"On Thursday" },
          { key:"D", text:"On Friday" },
        ],
        correct:"C",
        explanation:"Người đàn ông nói 'We can ship it by Thursday'. C là đáp án đúng. Monday là ngày giao hàng dự kiến ban đầu (sai).",
      },
    ],
    tips:[
      "Đọc câu hỏi TRƯỚC khi nghe để biết cần tìm thông tin gì",
      "Ghi chú nhanh: ai nói gì, số liệu, ngày tháng, lý do",
      "Câu hỏi cuối thường hỏi về hành động tiếp theo (What will X do next?)",
    ],
  },

  /* ── LISTENING PART 4 ─────────────────────────────────── */
  l4: {
    instruction: "Nghe một đoạn độc thoại (thông báo, quảng cáo, bài phát biểu). Trả lời các câu hỏi sau.",
    imageDesc: "🎧 Đoạn thông báo tại sân bay:\n\n\"Attention all passengers on flight VN 214 to Hanoi. This is to inform you that your flight has been delayed by approximately 90 minutes due to a technical inspection. The new departure time is 16:45. We apologize for any inconvenience caused. Passengers are invited to use the lounge facilities on Level 2. Boarding will begin 30 minutes before departure. Please listen for further announcements. Thank you for your patience.\"",
    questions: [
      {
        id:1, text:"Where is this announcement being made?",
        choices:[
          { key:"A", text:"At a train station" },
          { key:"B", text:"At an airport" },
          { key:"C", text:"On a bus" },
          { key:"D", text:"At a hotel lobby" },
        ],
        correct:"B",
        explanation:"Thông báo về chuyến bay (flight VN 214) và có phòng chờ (lounge) — đây là sân bay (airport). B đúng.",
      },
      {
        id:2, text:"What is the reason for the delay?",
        choices:[
          { key:"A", text:"Bad weather conditions" },
          { key:"B", text:"A crew scheduling problem" },
          { key:"C", text:"A technical inspection" },
          { key:"D", text:"Air traffic congestion" },
        ],
        correct:"C",
        explanation:"Thông báo rõ 'delayed... due to a technical inspection'. C là đáp án chính xác.",
      },
      {
        id:3, text:"What is the new departure time?",
        choices:[
          { key:"A", text:"15:15" },
          { key:"B", text:"16:00" },
          { key:"C", text:"16:45" },
          { key:"D", text:"17:30" },
        ],
        correct:"C",
        explanation:"Thông báo 'The new departure time is 16:45'. C đúng.",
      },
    ],
    tips:[
      "Xác định ngữ cảnh ngay từ câu đầu: thông báo gì? ở đâu? cho ai?",
      "Chú ý số liệu cụ thể: giờ, ngày, số tầng, số hiệu",
      "Đáp án thường xuất hiện theo thứ tự trong bài nghe",
    ],
  },

  /* ── READING PART 5 ─────────────────────────────────── */
  r5: {
    instruction: "Chọn từ hoặc cụm từ phù hợp nhất để hoàn thành câu. Chú ý loại từ (noun/verb/adj/adv) và cấu trúc ngữ pháp.",
    questions: [
      {
        id:1, text:"The new software update will _______ be available to all subscribers by the end of the month.",
        choices:[
          { key:"A", text:"automatic" },
          { key:"B", text:"automatically" },
          { key:"C", text:"automation" },
          { key:"D", text:"automated" },
        ],
        correct:"B",
        explanation:"Cần trạng từ (adverb) để bổ nghĩa cho động từ 'be available'. 'Automatically' (tự động) là trạng từ đúng. A là tính từ, C là danh từ, D là tính từ.",
      },
      {
        id:2, text:"Employees are _______ to submit their expense reports before the 5th of each month.",
        choices:[
          { key:"A", text:"requiring" },
          { key:"B", text:"requirement" },
          { key:"C", text:"required" },
          { key:"D", text:"requires" },
        ],
        correct:"C",
        explanation:"'Be + past participle' — cần dạng bị động 'required' (được yêu cầu). Cấu trúc: 'are required to do something' = bắt buộc phải làm gì.",
      },
      {
        id:3, text:"The annual conference will be held in Singapore, _______ is known for its excellent convention facilities.",
        choices:[
          { key:"A", text:"that" },
          { key:"B", text:"which" },
          { key:"C", text:"who" },
          { key:"D", text:"where" },
        ],
        correct:"B",
        explanation:"Mệnh đề quan hệ không xác định (non-defining relative clause) bổ sung thông tin cho 'Singapore' — dùng 'which'. 'That' không dùng trong mệnh đề không xác định. 'Who' dùng cho người.",
      },
      {
        id:4, text:"Despite the economic _______, the company managed to increase its market share.",
        choices:[
          { key:"A", text:"decline" },
          { key:"B", text:"declining" },
          { key:"C", text:"declined" },
          { key:"D", text:"declines" },
        ],
        correct:"A",
        explanation:"Sau mạo từ (the) cần danh từ. 'Decline' (sự suy giảm) là danh từ phù hợp. Cụm 'economic decline' = suy thoái kinh tế.",
      },
      {
        id:5, text:"All participants must register _______ advance to ensure their place at the workshop.",
        choices:[
          { key:"A", text:"in" },
          { key:"B", text:"on" },
          { key:"C", text:"at" },
          { key:"D", text:"by" },
        ],
        correct:"A",
        explanation:"Cụm cố định 'in advance' = trước, trước thời hạn. Đây là colocation phổ biến trong tiếng Anh thương mại.",
      },
    ],
    tips:[
      "Xác định loại từ cần điền TRƯỚC (danh từ / động từ / tính từ / trạng từ)",
      "Đọc toàn câu để hiểu nghĩa, không chỉ nhìn chỗ trống",
      "Cụm từ cố định (collocations): in advance, on behalf of, at the expense of...",
    ],
  },

  /* ── READING PART 6 ─────────────────────────────────── */
  r6: {
    instruction: "Đọc đoạn văn sau và chọn từ/câu phù hợp nhất để điền vào chỗ trống (1)–(4).",
    passage: `Memorandum

TO: All Marketing Department Staff
FROM: Helen Park, Marketing Director
RE: New Campaign Strategy Meeting

I am writing to inform you that we will be holding a mandatory meeting on Friday, June 20th at 10:00 A.M. in Conference Room B. (1)_______ the purpose of this meeting is to review the Q3 marketing campaign results and plan our strategy for Q4.

Attendance is (2)_______ for all full-time marketing employees. Part-time staff are encouraged to attend if their schedule permits. Please come prepared with your individual performance reports and any suggestions you may have for improving our outreach efforts.

(3)_______ If you have a scheduling conflict, please notify me by Wednesday so we can make alternative arrangements.

Refreshments will be (4)_______ during the meeting. We look forward to a productive discussion.`,
    questions: [
      {
        id:1, text:"Chọn từ phù hợp cho chỗ trống (1):",
        choices:[
          { key:"A", text:"Specifically," },
          { key:"B", text:"However," },
          { key:"C", text:"Therefore," },
          { key:"D", text:"Alternatively," },
        ],
        correct:"A",
        explanation:"'Specifically' (cụ thể là) phù hợp để giới thiệu chi tiết mục đích cuộc họp sau câu tổng quát. 'However' và 'Alternatively' tạo nghĩa mâu thuẫn không hợp lý.",
      },
      {
        id:2, text:"Chọn từ phù hợp cho chỗ trống (2):",
        choices:[
          { key:"A", text:"optional" },
          { key:"B", text:"mandatory" },
          { key:"C", text:"voluntary" },
          { key:"D", text:"recommended" },
        ],
        correct:"B",
        explanation:"Memo đã nói 'mandatory meeting' ở trên — vì vậy việc tham dự cũng là 'mandatory' (bắt buộc). Các đáp án A, C, D đều mang nghĩa tự nguyện, mâu thuẫn với 'mandatory' trước đó.",
      },
      {
        id:3, text:"Câu nào phù hợp nhất để điền vào chỗ trống (3)?",
        choices:[
          { key:"A", text:"The meeting will last approximately two hours." },
          { key:"B", text:"Parking spaces are available in Lot C." },
          { key:"C", text:"Please ensure your reports are submitted before the meeting." },
          { key:"D", text:"The conference room holds up to 30 people." },
        ],
        correct:"A",
        explanation:"Câu (3) nằm sau thông tin về xung đột lịch trình và trước thông tin về đồ uống — cần câu chuyển tiếp về thực tế cuộc họp. A cung cấp thông tin về thời lượng, liên kết logic nhất.",
      },
      {
        id:4, text:"Chọn từ phù hợp cho chỗ trống (4):",
        choices:[
          { key:"A", text:"served" },
          { key:"B", text:"cooking" },
          { key:"C", text:"ordered" },
          { key:"D", text:"eaten" },
        ],
        correct:"A",
        explanation:"'Refreshments will be served' = đồ ăn nhẹ sẽ được phục vụ. Đây là cụm từ cố định thường gặp trong thông báo sự kiện công sở.",
      },
    ],
    tips:[
      "Đọc toàn bộ đoạn văn trước để hiểu ngữ cảnh và giọng điệu",
      "Chú ý từ liên kết trước và sau chỗ trống để chọn đúng",
      "Câu chèn: chọn câu phù hợp về nội dung VÀ logic với câu xung quanh",
    ],
  },

  /* ── READING PART 7 ─────────────────────────────────── */
  r7: {
    instruction: "Đọc kỹ văn bản sau và trả lời các câu hỏi. Áp dụng kỹ thuật scanning để tìm thông tin cụ thể.",
    passage: `HARGROVE TECHNOLOGIES — JOB POSTING

Position: Senior Project Manager
Department: Operations
Location: Ho Chi Minh City, Vietnam (Hybrid)
Posted: June 1, 2026 | Deadline: June 30, 2026

ABOUT THE ROLE
Hargrove Technologies is seeking an experienced Senior Project Manager to lead cross-functional teams in delivering software development projects on time and within budget. The successful candidate will report directly to the VP of Operations.

RESPONSIBILITIES
• Manage end-to-end project lifecycle for 3–5 simultaneous projects
• Coordinate with development, QA, and client services teams
• Prepare detailed project plans, status reports, and risk assessments
• Conduct weekly progress meetings with stakeholders
• Ensure projects are delivered within scope, schedule, and budget constraints

REQUIREMENTS
• Minimum 7 years of project management experience in the IT sector
• PMP or PRINCE2 certification required
• Proficiency in project management tools (Jira, MS Project, or equivalent)
• Strong written and verbal communication skills in English
• Experience with Agile/Scrum methodology preferred

COMPENSATION & BENEFITS
• Competitive salary: $2,500–$3,800/month (based on experience)
• Annual performance bonus (up to 20% of base salary)
• 15 days paid annual leave + 5 personal days
• Full health insurance coverage for employee and one dependent
• Professional development budget: $1,000/year

HOW TO APPLY
Send your CV and cover letter to careers@hargrove-tech.com
Subject line: "Senior PM Application – [Your Name]"
Applications without a cover letter will not be reviewed.`,
    questions: [
      {
        id:1, text:"What is the deadline to apply for this position?",
        choices:[
          { key:"A", text:"June 1, 2026" },
          { key:"B", text:"June 15, 2026" },
          { key:"C", text:"June 30, 2026" },
          { key:"D", text:"July 1, 2026" },
        ],
        correct:"C",
        explanation:"Deadline được nêu rõ 'June 30, 2026' trong phần thông tin đầu. A là ngày đăng tuyển, không phải hạn nộp.",
      },
      {
        id:2, text:"According to the posting, what certification is REQUIRED for this role?",
        choices:[
          { key:"A", text:"Scrum Master certification" },
          { key:"B", text:"PMP or PRINCE2 certification" },
          { key:"C", text:"Six Sigma certification" },
          { key:"D", text:"AWS Cloud certification" },
        ],
        correct:"B",
        explanation:"'PMP or PRINCE2 certification required' — được ghi rõ trong phần Requirements. Agile/Scrum chỉ là 'preferred' (ưu tiên), không phải bắt buộc.",
      },
      {
        id:3, text:"What will happen to applications submitted without a cover letter?",
        choices:[
          { key:"A", text:"They will be reviewed after the deadline." },
          { key:"B", text:"They will be forwarded to HR." },
          { key:"C", text:"They will not be reviewed." },
          { key:"D", text:"They will receive a response within 5 days." },
        ],
        correct:"C",
        explanation:"'Applications without a cover letter will not be reviewed' — nêu rõ trong hướng dẫn nộp hồ sơ. C chính xác.",
      },
      {
        id:4, text:"How many days of paid leave does the position offer in total?",
        choices:[
          { key:"A", text:"10 days" },
          { key:"B", text:"15 days" },
          { key:"C", text:"20 days" },
          { key:"D", text:"25 days" },
        ],
        correct:"C",
        explanation:"15 ngày phép năm + 5 ngày cá nhân = 20 ngày tổng cộng. Cần đọc kỹ và cộng hai số liệu lại.",
      },
      {
        id:5, text:"To whom does the Senior Project Manager report?",
        choices:[
          { key:"A", text:"The CEO of Hargrove Technologies" },
          { key:"B", text:"The Head of Human Resources" },
          { key:"C", text:"The VP of Operations" },
          { key:"D", text:"The Client Services Director" },
        ],
        correct:"C",
        explanation:"'The successful candidate will report directly to the VP of Operations' — được nêu rõ trong phần mô tả vai trò.",
      },
    ],
    tips:[
      "Đọc câu hỏi trước, sau đó dùng kỹ thuật scanning để tìm thông tin",
      "Câu hỏi tính toán: đọc kỹ, cộng/trừ các số liệu trong bài",
      "Cảnh giác bẫy: từ trong bài xuất hiện trong đáp án sai (e.g., 'June 1' là ngày đăng, không phải deadline)",
    ],
  },

  /* ── MINI TEST ─────────────────────────────────────── */
  m3: {
    instruction: "Bài kiểm tra mini gồm 5 câu hỏi kết hợp Nghe và Đọc. Làm trong 10 phút.",
    questions: [
      {
        id:1, text:"🎧 [Nghe] \"We need to finalize the budget report before Thursday's board meeting.\" — What does the speaker imply?",
        choices:[
          { key:"A", text:"The board meeting was cancelled." },
          { key:"B", text:"The report must be completed before Thursday." },
          { key:"C", text:"The budget is already approved." },
          { key:"D", text:"Thursday is a holiday." },
        ],
        correct:"B",
        explanation:"'Finalize... before Thursday's board meeting' — cần hoàn thành báo cáo trước thứ Năm. B diễn đạt đúng ý này.",
      },
      {
        id:2, text:"[Đọc] The shipment was delayed _______ to severe weather conditions along the route.",
        choices:[
          { key:"A", text:"due" },
          { key:"B", text:"because" },
          { key:"C", text:"since" },
          { key:"D", text:"result" },
        ],
        correct:"A",
        explanation:"'Due to' là giới từ cụm chỉ nguyên nhân, theo sau là danh từ/cụm danh từ. 'Because' cần mệnh đề hoàn chỉnh. 'Due to + noun' là đúng.",
      },
      {
        id:3, text:"[Đọc] The consultant's _______ was well-received by the executive team and led to several policy changes.",
        choices:[
          { key:"A", text:"present" },
          { key:"B", text:"presented" },
          { key:"C", text:"presentation" },
          { key:"D", text:"presenting" },
        ],
        correct:"C",
        explanation:"Cần danh từ (noun) sau mạo từ 'The'. 'Presentation' (bài thuyết trình) là danh từ đúng. 'Present' (hiện tại) không phù hợp nghĩa.",
      },
      {
        id:4, text:"🎧 [Nghe] \"Could you forward me the latest version of the proposal?\" — What is being requested?",
        choices:[
          { key:"A", text:"A printed copy of the proposal" },
          { key:"B", text:"An email with the most recent proposal" },
          { key:"C", text:"A meeting to discuss the proposal" },
          { key:"D", text:"The original version of the proposal" },
        ],
        correct:"B",
        explanation:"'Forward' = chuyển tiếp email. 'Latest version' = phiên bản mới nhất. Yêu cầu gửi email với bản đề xuất mới nhất. B đúng.",
      },
      {
        id:5, text:"[Đọc] Employees who wish to take unpaid leave must submit their request _______ least two weeks in advance.",
        choices:[
          { key:"A", text:"at" },
          { key:"B", text:"in" },
          { key:"C", text:"on" },
          { key:"D", text:"by" },
        ],
        correct:"A",
        explanation:"'At least' là cụm cố định có nghĩa 'ít nhất'. Đây là colocation không thể thay thế.",
      },
    ],
    tips:[
      "Quản lý thời gian: 10 phút cho 5 câu = 2 phút/câu",
      "Câu nghe: đọc đáp án trước khi nghe",
      "Câu đọc: xác định loại từ và nghĩa ngữ cảnh",
    ],
  },

  /* ── FULL MOCK TEST (chỉ hiện 5 câu mẫu) ─────────────── */
  f1: {
    instruction: "Bài thi thử toàn bộ gồm 200 câu trong 120 phút. Dưới đây là 5 câu mẫu đại diện để làm quen định dạng.",
    passage: `EMAIL

From: Patricia Lam <p.lam@globalvest.com>
To: Thomas Reid <t.reid@globalvest.com>
Date: June 10, 2026
Subject: Re: Q2 Sales Conference Venue

Thomas,

Following our conversation this morning, I've spoken with the events team and we have narrowed it down to two venues: the Parkview Grand Hotel and the Meridian Convention Centre.

The Parkview Grand is $12,000 for the full day, which includes AV equipment and catering. The Meridian is $9,500 but catering must be arranged separately, which would add approximately $2,000.

Given that both venues come to a similar final cost, I would recommend the Parkview Grand for its convenience and the fact that their AV technician will be on-site throughout the event.

Please let me know your decision by end of day Thursday so I can proceed with the booking.

Patricia`,
    questions: [
      {
        id:1, text:"Why did Patricia write this email?",
        choices:[
          { key:"A", text:"To cancel a venue booking" },
          { key:"B", text:"To provide venue options for a conference" },
          { key:"C", text:"To request a budget increase" },
          { key:"D", text:"To confirm a catering order" },
        ],
        correct:"B",
        explanation:"Patricia viết để cung cấp thông tin về hai địa điểm tổ chức hội nghị và đưa ra khuyến nghị. B đúng.",
      },
      {
        id:2, text:"What is the total estimated cost for the Meridian Convention Centre?",
        choices:[
          { key:"A", text:"$9,500" },
          { key:"B", text:"$11,500" },
          { key:"C", text:"$12,000" },
          { key:"D", text:"$14,000" },
        ],
        correct:"B",
        explanation:"Meridian: $9,500 + ~$2,000 (catering) = $11,500. Cần đọc kỹ và tính toán. B đúng.",
      },
      {
        id:3, text:"Why does Patricia recommend the Parkview Grand Hotel?",
        choices:[
          { key:"A", text:"It is cheaper than the Meridian." },
          { key:"B", text:"It has a larger capacity." },
          { key:"C", text:"It includes AV support and catering in one package." },
          { key:"D", text:"It is closer to the office." },
        ],
        correct:"C",
        explanation:"Patricia nêu lý do: 'convenience and the fact that their AV technician will be on-site' — gói trọn tiện ích, không cần sắp xếp riêng. C phản ánh đúng.",
      },
      {
        id:4, text:"[Nghe] 🎧 \"The client wants the revised contract on her desk first thing tomorrow morning.\" — What does this mean?",
        choices:[
          { key:"A", text:"The contract should be emailed tonight." },
          { key:"B", text:"The contract should arrive at the start of tomorrow's workday." },
          { key:"C", text:"The client wants to revise the contract herself." },
          { key:"D", text:"The contract is already on the client's desk." },
        ],
        correct:"B",
        explanation:"'First thing tomorrow morning' = ngay đầu buổi sáng hôm sau. 'On her desk' = đặt sẵn trên bàn. B mô tả đúng.",
      },
      {
        id:5, text:"[Đọc] By when must Thomas respond to Patricia?",
        choices:[
          { key:"A", text:"By Wednesday morning" },
          { key:"B", text:"By Thursday end of day" },
          { key:"C", text:"By Friday noon" },
          { key:"D", text:"By June 10" },
        ],
        correct:"B",
        explanation:"'Please let me know your decision by end of day Thursday' — Thomas phải trả lời trước cuối ngày Thứ Năm. B đúng.",
      },
    ],
    tips:[
      "Phần Nghe (100 câu, 45 phút): làm tuần tự, không quay lại",
      "Phần Đọc (100 câu, 75 phút): P5 ≈ 10 phút, P6 ≈ 10 phút, P7 ≈ 55 phút",
      "Không bỏ trống — luôn chọn đáp án dù chưa chắc chắn",
    ],
  },
};

/* Fallback for completed tasks */
const FALLBACK: Record<string, TaskContent> = {
  m1: { instruction:"Mini Test #1 đã hoàn thành. Làm lại để cải thiện điểm.", questions:CONTENT.m3.questions, tips:CONTENT.m3.tips },
  m2: { instruction:"Mini Test #2 đã hoàn thành. Làm lại để cải thiện điểm.", questions:CONTENT.m3.questions, tips:CONTENT.m3.tips },
};

/* ─── task meta ─────────────────────────────────────────── */
interface Task { id:string; cat:Cat; title:string; parts:string; status:Status; questions:number; duration:string; hasAudio:boolean; xp:number; accuracy?:number }
type Status = "todo"|"inprogress"|"completed";
type Cat    = "Nghe"|"Đọc"|"Kiểm Tra Mini"|"Thi Thử Toàn Bộ";

const tasks: Task[] = [
  { id:"l1", cat:"Nghe", title:"Nghe Phần 1", parts:"Mô Tả Hình Ảnh",         status:"completed", questions:6,   duration:"5",   hasAudio:true,  xp:20,  accuracy:88 },
  { id:"l2", cat:"Nghe", title:"Nghe Phần 2", parts:"Hỏi & Đáp",               status:"completed", questions:25,  duration:"12",  hasAudio:true,  xp:20,  accuracy:72 },
  { id:"l3", cat:"Nghe", title:"Nghe Phần 3", parts:"Đoạn Hội Thoại Ngắn",     status:"inprogress",questions:39,  duration:"20",  hasAudio:true,  xp:25 },
  { id:"l4", cat:"Nghe", title:"Nghe Phần 4", parts:"Bài Nói Ngắn",             status:"todo",      questions:30,  duration:"18",  hasAudio:true,  xp:25 },
  { id:"r5", cat:"Đọc",  title:"Đọc Phần 5",  parts:"Hoàn Thành Câu",          status:"inprogress",questions:30,  duration:"25",  hasAudio:false, xp:30 },
  { id:"r6", cat:"Đọc",  title:"Đọc Phần 6",  parts:"Hoàn Thành Đoạn Văn",    status:"todo",      questions:16,  duration:"15",  hasAudio:false, xp:30 },
  { id:"r7", cat:"Đọc",  title:"Đọc Phần 7",  parts:"Đọc Hiểu",                status:"todo",      questions:54,  duration:"55",  hasAudio:false, xp:40 },
  { id:"m1", cat:"Kiểm Tra Mini", title:"Kiểm Tra Mini #1", parts:"50 câu · Nghe + Đọc", status:"completed", questions:50, duration:"35", hasAudio:true,  xp:50, accuracy:76 },
  { id:"m2", cat:"Kiểm Tra Mini", title:"Kiểm Tra Mini #2", parts:"50 câu · Nghe + Đọc", status:"completed", questions:50, duration:"35", hasAudio:true,  xp:50, accuracy:82 },
  { id:"m3", cat:"Kiểm Tra Mini", title:"Kiểm Tra Mini #3", parts:"50 câu · Nghe + Đọc", status:"todo",      questions:50, duration:"35", hasAudio:true,  xp:50 },
  { id:"f1", cat:"Thi Thử Toàn Bộ", title:"Thi Thử Toàn Bộ #1", parts:"200 câu · Định dạng ETS chính thức", status:"todo", questions:200, duration:"120", hasAudio:true, xp:200 },
];

const catMeta = {
  "Nghe":             { color:"#1d4ed8", bg:"#eff6ff", border:"#bfdbfe", icon:Headphones,   label:"Kỹ Năng Nghe" },
  "Đọc":              { color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe", icon:BookOpen,      label:"Kỹ Năng Đọc" },
  "Kiểm Tra Mini":    { color:"#059669", bg:"#f0fdf4", border:"#bbf7d0", icon:ClipboardList, label:"Kiểm Tra Mini" },
  "Thi Thử Toàn Bộ": { color:"#d97706", bg:"#fffbeb", border:"#fde68a", icon:FileText,      label:"Thi Thử Toàn Bộ" },
};
const statusCfg = {
  todo:       { label:"Chưa Làm",   icon:Circle,       color:C.muted, bg:"#f1f5f9" },
  inprogress: { label:"Đang Làm",   icon:Clock,        color:C.blue,  bg:C.blueL },
  completed:  { label:"Hoàn Thành", icon:CheckCircle2, color:C.green, bg:C.greenL },
};

/* ─── Audio player ──────────────────────────────────────── */
function AudioPlayer({ taskId }: { taskId:string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [plays, setPlays] = useState(0);
  const iRef = useRef<ReturnType<typeof setInterval>|null>(null);
  useEffect(() => { setPlaying(false); setProgress(0); setPlays(0); clearInterval(iRef.current!); }, [taskId]);
  const toggle = () => {
    if (playing) { clearInterval(iRef.current!); setPlaying(false); }
    else {
      if (progress >= 100) setProgress(0);
      setPlaying(true); setPlays(p => p+1);
      iRef.current = setInterval(() => setProgress(p => { if (p>=100) { clearInterval(iRef.current!); setPlaying(false); return 100; } return p+0.5; }), 150);
    }
  };
  const s = Math.round((progress/100)*240);
  const fmt = (n:number) => `${Math.floor(n/60)}:${String(n%60).padStart(2,"0")}`;
  const warn = plays >= 2;
  return (
    <div style={{ background:C.blueL, border:`1.5px solid ${warn?"#fecaca":C.blueB}`, borderRadius:16, padding:"14px 18px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
        <Headphones size={13} style={{ color:C.blue }} />
        <span style={{ fontSize:"0.7rem", fontWeight:700, color:C.blue, textTransform:"uppercase", letterSpacing:"0.06em" }}>Bản Ghi Âm</span>
        {plays > 0 && <span style={{ marginLeft:"auto", fontSize:"0.62rem", fontWeight:700, background:warn?"#fef2f2":"#fef9c3", color:warn?C.red:"#92400e", borderRadius:999, padding:"1px 8px" }}>{warn?"⚠ Đã nghe "+plays+" lần":"Lần phát "+plays}</span>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={toggle} style={{ width:38, height:38, borderRadius:"50%", background:C.blue, border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
          {playing ? <Pause size={15} color="#fff"/> : <Play size={15} color="#fff" style={{marginLeft:2}}/>}
        </button>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:"0.72rem" }}>
            <span style={{ fontWeight:600, color:C.text }}>Track 1 · Hội thoại</span>
            <span style={{ color:C.muted }}>{fmt(s)} / 4:00</span>
          </div>
          <div style={{ height:5, borderRadius:999, background:C.blueB, cursor:"pointer" }} onClick={e => { const r=e.currentTarget.getBoundingClientRect(); setProgress(Math.max(0,Math.min(100,((e.clientX-r.left)/r.width)*100))); }}>
            <div style={{ height:"100%", borderRadius:999, background:C.blue, width:`${progress}%` }}/>
          </div>
        </div>
        <Volume2 size={14} style={{ color:C.muted, flexShrink:0 }}/>
      </div>
      <p style={{ margin:"8px 0 0", fontSize:"0.62rem", color:C.muted, textAlign:"center" }}>💡 Thi thật chỉ phát 1 lần — hãy luyện nghe một lần ngay từ đầu</p>
    </div>
  );
}

/* ─── Main export ───────────────────────────────────────── */
export function PracticeHub() {
  const [selId, setSelId]       = useState<string|null>("l3");
  const [answers, setAnswers]   = useState<Record<number,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [filter, setFilter]     = useState("Tất Cả");
  const [tipOpen, setTipOpen]   = useState(false);

  const sel = tasks.find(t => t.id === selId) ?? null;
  const content: TaskContent|undefined = sel ? (CONTENT[sel.id] ?? FALLBACK[sel.id]) : undefined;
  const qs = content?.questions ?? [];

  const cats = ["Tất Cả","Nghe","Đọc","Kiểm Tra Mini","Thi Thử Toàn Bộ"];
  const list = filter === "Tất Cả" ? tasks : tasks.filter(t => t.cat === filter);
  const groups = (filter==="Tất Cả" ? ["Nghe","Đọc","Kiểm Tra Mini","Thi Thử Toàn Bộ"] as Cat[] : [filter as Cat])
    .map(cat => ({ cat, ts: list.filter(t => t.cat===cat) })).filter(g => g.ts.length);

  const score = qs.filter(q => answers[q.id] === q.correct).length;
  const pct   = qs.length ? Math.round((score/qs.length)*100) : 0;
  const xpEarned = sel ? Math.round((pct/100)*sel.xp) : 0;
  const answered  = Object.keys(answers).length;

  const handleSelect = (id:string) => { setSelId(id); setAnswers({}); setSubmitted(false); setTipOpen(false); };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"minmax(260px,320px) 1fr", gap:20, alignItems:"start", maxWidth:1140, margin:"0 auto" }}>

      {/* ── LEFT: Task list ─────────────────────────────── */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, overflow:"hidden" }}>
        <div style={{ padding:"16px 16px 12px", borderBottom:`1px solid ${C.border}` }}>
          <h3 style={{ margin:"0 0 10px" }}>Danh Sách Bài Tập</h3>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
            {[{ l:`${tasks.filter(t=>t.status==="completed").length} xong`, c:C.green, b:C.greenL },
              { l:`${tasks.filter(t=>t.status==="inprogress").length} đang làm`, c:C.blue, b:C.blueL },
              { l:`${tasks.filter(t=>t.status==="todo").length} chưa làm`, c:C.muted, b:"#f1f5f9" }].map(s=>(
              <div key={s.l} style={{ flex:1, background:s.b, borderRadius:8, padding:"5px 4px", textAlign:"center", fontSize:"0.62rem", fontWeight:700, color:s.c }}>{s.l}</div>
            ))}
          </div>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setFilter(c)}
                style={{ padding:"3px 9px", borderRadius:999, fontSize:"0.67rem", fontWeight:600, border:`1.5px solid ${filter===c?C.blue:C.border}`, background:filter===c?C.blue:"transparent", color:filter===c?"#fff":C.muted, cursor:"pointer" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxHeight:580, overflowY:"auto" }}>
          {groups.map(({ cat, ts }) => {
            const m = catMeta[cat];
            return (
              <div key={cat}>
                <div style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px 5px", background:"#f8faff", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:1 }}>
                  <m.icon size={12} style={{ color:m.color }}/>
                  <span style={{ fontSize:"0.65rem", fontWeight:800, color:m.color, textTransform:"uppercase", letterSpacing:"0.07em" }}>{m.label}</span>
                  <span style={{ fontSize:"0.6rem", color:C.muted, marginLeft:"auto" }}>{ts.filter(t=>t.status==="completed").length}/{ts.length}</span>
                </div>
                {ts.map(task => {
                  const isSel = task.id === selId;
                  const m2 = catMeta[task.cat];
                  const sc = statusCfg[task.status];
                  const SI = sc.icon;
                  return (
                    <button key={task.id} onClick={()=>handleSelect(task.id)}
                      style={{ width:"100%", textAlign:"left", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", border:"none", borderBottom:`1px solid ${C.border}`, borderLeft:`3px solid ${isSel?m2.color:"transparent"}`, background:isSel?m2.bg:"transparent", cursor:"pointer" }}>
                      <div style={{ width:32, height:32, borderRadius:9, background:task.status==="completed"?C.greenL:isSel?m2.color:C.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {task.status==="completed"
                          ? <CheckCircle2 size={15} style={{ color:C.green }}/>
                          : <m2.icon size={14} style={{ color:isSel?"#fff":m2.color }}/>}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:"0.79rem", fontWeight:isSel?700:600, color:C.text }}>{task.title}</div>
                        <div style={{ fontSize:"0.63rem", color:C.muted, marginTop:1 }}>{task.parts} · {task.questions}Q · {task.duration} phút</div>
                        {task.accuracy != null && (
                          <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:3 }}>
                            <div style={{ flex:1, height:3, borderRadius:999, background:C.border }}>
                              <div style={{ height:"100%", borderRadius:999, width:`${task.accuracy}%`, background:task.accuracy>=75?C.green:C.orange }}/>
                            </div>
                            <span style={{ fontSize:"0.59rem", fontWeight:700, color:task.accuracy>=75?C.green:C.orange }}>{task.accuracy}%</span>
                          </div>
                        )}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3, flexShrink:0 }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:3, background:sc.bg, color:sc.color, borderRadius:999, padding:"2px 7px", fontSize:"0.62rem", fontWeight:700 }}>
                          <SI size={10}/> {sc.label}
                        </span>
                        <span style={{ fontSize:"0.59rem", background:"#fef9c3", color:"#92400e", borderRadius:999, padding:"1px 6px", fontWeight:700 }}>+{task.xp}XP</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT: Practice area ────────────────────────── */}
      {sel && content ? (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Header card */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"20px 22px" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:12 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <h2 style={{ margin:0, fontSize:"1.05rem" }}>{sel.title}</h2>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:3, background:statusCfg[sel.status].bg, color:statusCfg[sel.status].color, borderRadius:999, padding:"3px 9px", fontSize:"0.68rem", fontWeight:700 }}>
                    {(() => { const SI = statusCfg[sel.status].icon; return <SI size={11}/>; })()}
                    {statusCfg[sel.status].label}
                  </span>
                </div>
                <p style={{ margin:0, fontSize:"0.76rem", color:C.muted }}>{sel.parts}</p>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5, background:"#fef9c3", border:"1px solid #fde68a", borderRadius:10, padding:"6px 12px", flexShrink:0 }}>
                <Zap size={13} style={{ color:"#ca8a04" }}/><span style={{ fontSize:"0.82rem", fontWeight:800, color:"#92400e" }}>+{sel.xp} XP</span>
              </div>
            </div>

            {/* Instruction */}
            <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:12, padding:"12px 14px", fontSize:"0.8rem", color:"#0c4a6e", lineHeight:1.65, marginBottom:10 }}>
              📋 <strong>Hướng dẫn:</strong> {content.instruction}
            </div>

            {/* Tips */}
            <button onClick={()=>setTipOpen(v=>!v)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:6, padding:"7px 12px", borderRadius:9, border:`1px solid ${C.border}`, background:"transparent", color:C.muted, fontSize:"0.73rem", fontWeight:600, cursor:"pointer", textAlign:"left" }}>
              <Star size={12} style={{ color:C.orange }}/> Mẹo & Chiến lược
              <ChevronDown size={12} style={{ marginLeft:"auto", transform:tipOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}/>
            </button>
            {tipOpen && (
              <div style={{ marginTop:6, padding:"10px 14px", background:C.orangeL, border:"1px solid #fde68a", borderRadius:10 }}>
                <ul style={{ margin:0, paddingLeft:16, display:"flex", flexDirection:"column", gap:5 }}>
                  {content.tips.map((t,i)=>(
                    <li key={i} style={{ fontSize:"0.77rem", color:"#78350f", lineHeight:1.5 }}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Image description (Part 1) */}
          {content.imageDesc && (
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
                <ImageIcon size={14} style={{ color:C.blue }}/>
                <span style={{ fontSize:"0.72rem", fontWeight:700, color:C.blue, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                  {sel.hasAudio ? "Hình Ảnh & Bản Ghi Âm" : "Đoạn Văn / Ngữ Cảnh"}
                </span>
              </div>
              <div style={{ background:"#f8faff", border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", fontSize:"0.82rem", color:C.text, lineHeight:1.7, whiteSpace:"pre-line", fontFamily:"inherit" }}>
                {content.imageDesc}
              </div>
            </div>
          )}

          {/* Reading passage */}
          {content.passage && (
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
                <MessageSquare size={14} style={{ color:"#7c3aed" }}/>
                <span style={{ fontSize:"0.72rem", fontWeight:700, color:"#7c3aed", textTransform:"uppercase", letterSpacing:"0.05em" }}>Đoạn Văn Bài Đọc</span>
              </div>
              <div style={{ background:"#fafbff", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px 16px", fontSize:"0.82rem", color:C.text, lineHeight:1.8, whiteSpace:"pre-line", maxHeight:280, overflowY:"auto" }}>
                {content.passage}
              </div>
            </div>
          )}

          {/* Audio player */}
          {sel.hasAudio && <AudioPlayer taskId={sel.id}/>}

          {/* Answer sheet */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"20px 22px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <h3 style={{ margin:0 }}>Phiếu Trả Lời</h3>
              {!submitted && (
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  {qs.map((_,i)=>(
                    <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:answers[i+1]?C.blue:C.border, transition:"background 0.15s" }}/>
                  ))}
                  <span style={{ fontSize:"0.68rem", color:C.muted, marginLeft:4 }}>{answered}/{qs.length}</span>
                </div>
              )}
            </div>

            {submitted ? (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {/* Score banner */}
                <div style={{ background:pct>=80?C.greenL:pct>=60?C.blueL:C.redL, border:`1.5px solid ${pct>=80?C.greenB:pct>=60?C.blueB:C.redB}`, borderRadius:14, padding:"16px 18px", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                  <div style={{ textAlign:"center", flexShrink:0 }}>
                    <div style={{ fontSize:"2.2rem", fontWeight:800, color:pct>=80?C.green:pct>=60?C.blue:C.red, lineHeight:1 }}>{score}/{qs.length}</div>
                    <div style={{ fontSize:"0.65rem", color:C.muted, marginTop:2 }}>câu đúng</div>
                  </div>
                  <div style={{ flex:1, minWidth:160 }}>
                    <div style={{ fontSize:"0.95rem", fontWeight:700, marginBottom:3 }}>{pct>=80?"🏆 Xuất sắc!":pct>=60?"✅ Tốt lắm!":"📚 Cần ôn thêm!"}</div>
                    <div style={{ fontSize:"0.75rem", color:C.muted, marginBottom:6 }}>{pct}% chính xác · +{xpEarned} XP</div>
                    <div style={{ height:7, borderRadius:999, background:"rgba(0,0,0,0.08)" }}>
                      <div style={{ height:"100%", borderRadius:999, width:`${pct}%`, background:pct>=80?C.green:pct>=60?C.blue:C.red, transition:"width 0.6s ease" }}/>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:4, background:"#fef9c3", borderRadius:10, padding:"8px 12px", flexShrink:0 }}>
                    <Zap size={14} style={{ color:"#ca8a04" }}/><span style={{ fontSize:"1rem", fontWeight:800, color:"#92400e" }}>+{xpEarned}</span>
                  </div>
                </div>

                {/* Per-question review */}
                {qs.map(q => {
                  const chosen  = answers[q.id];
                  const ok      = chosen === q.correct;
                  return (
                    <div key={q.id} style={{ border:`1px solid ${ok?C.greenB:C.redB}`, borderRadius:14, padding:"14px 16px", background:ok?C.greenL:C.redL }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:10 }}>
                        {ok ? <CheckCircle2 size={15} style={{ color:C.green, flexShrink:0, marginTop:1 }}/> : <AlertCircle size={15} style={{ color:C.red, flexShrink:0, marginTop:1 }}/>}
                        <span style={{ fontSize:"0.8rem", color:C.text, lineHeight:1.5 }}>
                          <strong style={{ color:ok?C.green:C.red }}>Câu {q.id}.</strong> {q.text}
                        </span>
                      </div>
                      {/* Choices */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10, paddingLeft:22 }}>
                        {q.choices.map(ch => {
                          const isCorrect = ch.key === q.correct;
                          const isChosen  = ch.key === chosen;
                          const wrong     = isChosen && !ok;
                          return (
                            <div key={ch.key} style={{ display:"flex", alignItems:"flex-start", gap:6, padding:"6px 10px", borderRadius:9, border:`1.5px solid ${isCorrect?"#bbf7d0":wrong?"#fecaca":C.border}`, background:isCorrect?"#f0fdf4":wrong?"#fef2f2":"transparent", fontSize:"0.75rem" }}>
                              <span style={{ fontWeight:800, color:isCorrect?C.green:wrong?C.red:C.muted, flexShrink:0 }}>{ch.key}</span>
                              <span style={{ color:isCorrect?C.green:wrong?C.red:C.muted }}>{ch.text}{isCorrect?" ✓":wrong?" ✗":""}</span>
                            </div>
                          );
                        })}
                      </div>
                      {/* Explanation */}
                      <div style={{ paddingLeft:22, borderTop:`1px solid ${ok?C.greenB:C.redB}`, paddingTop:8 }}>
                        <div style={{ fontSize:"0.65rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:ok?C.green:C.red, marginBottom:3 }}>💡 Giải thích</div>
                        <p style={{ margin:0, fontSize:"0.77rem", color:"#374151", lineHeight:1.55 }}>{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}

                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={()=>{ setAnswers({}); setSubmitted(false); }}
                    style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"11px 0", borderRadius:12, border:`1.5px solid ${C.border}`, background:"transparent", color:C.text, fontSize:"0.82rem", fontWeight:600, cursor:"pointer" }}>
                    <RotateCcw size={13}/> Làm Lại
                  </button>
                  <button style={{ flex:2, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"11px 0", borderRadius:12, border:"none", background:C.blue, color:"#fff", fontSize:"0.82rem", fontWeight:700, cursor:"pointer" }}>
                    <ChevronRight size={13}/> Bài Tiếp Theo
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                  {qs.map(q => (
                    <div key={q.id} style={{ borderBottom:`1px solid ${C.border}`, paddingBottom:18 }}>
                      <div style={{ fontSize:"0.82rem", fontWeight:600, color:C.text, lineHeight:1.55, marginBottom:10 }}>
                        <span style={{ color:C.blue, fontWeight:800, marginRight:6 }}>Câu {q.id}.</span>{q.text}
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
                        {q.choices.map(ch => {
                          const sel2 = answers[q.id] === ch.key;
                          return (
                            <label key={ch.key}
                              style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"9px 12px", borderRadius:10, border:`1.5px solid ${sel2?C.blue:C.border}`, background:sel2?C.blueL:C.card, cursor:"pointer", transition:"all 0.12s", userSelect:"none" }}>
                              <input type="radio" name={`q${q.id}`} value={ch.key} checked={sel2}
                                onChange={()=>setAnswers(p=>({ ...p, [q.id]:ch.key }))}
                                style={{ accentColor:C.blue, flexShrink:0, marginTop:2 }}/>
                              <div>
                                <span style={{ fontSize:"0.75rem", fontWeight:sel2?700:600, color:sel2?C.blue:C.muted, marginRight:6 }}>{ch.key}.</span>
                                <span style={{ fontSize:"0.78rem", color:sel2?C.blue:C.text, fontWeight:sel2?600:400 }}>{ch.text}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:4 }}>
                  <div>
                    <div style={{ fontSize:"0.72rem", color:C.muted }}>{answered}/{qs.length} câu đã chọn</div>
                    {answered < qs.length && <div style={{ fontSize:"0.65rem", color:C.orange, marginTop:2 }}>⚠ Còn {qs.length-answered} câu chưa chọn đáp án</div>}
                  </div>
                  <button onClick={()=>setSubmitted(true)} disabled={answered<qs.length}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 24px", borderRadius:12, border:"none", background:answered<qs.length?"#e2e8f0":C.blue, color:answered<qs.length?C.muted:"#fff", fontSize:"0.88rem", fontWeight:700, cursor:answered<qs.length?"not-allowed":"pointer", boxShadow:answered>=qs.length?"0 4px 14px rgba(29,78,216,0.28)":"none" }}>
                    <Send size={15}/> Nộp Bài
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", minHeight:300 }}>
          <div style={{ textAlign:"center" }}>
            <ClipboardList size={32} style={{ color:C.muted, opacity:0.4, marginBottom:10 }}/>
            <p style={{ color:C.muted, fontSize:"0.88rem", margin:0 }}>Chọn một bài tập để bắt đầu luyện tập</p>
          </div>
        </div>
      )}
    </div>
  );
}
