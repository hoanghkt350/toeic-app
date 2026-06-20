import { useEffect, useMemo, useState } from "react";
import {
  Volume2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle2,
  Layers,
  Flame,
  Star,
  Search,
  BookMarked,
  Brain,
  CalendarClock,
  Trophy,
  ClipboardCheck,
  Target,
  Sparkles,
  Filter,
  CheckSquare,
  Square,
} from "lucide-react";
import { PronunceCheck } from "../lib/speech/PronunceCheck";

interface Word {
  id: number;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  exampleEn: string;
  exampleVi: string;
  category: string;
  synonym: string;
  collocation: string;
  memoryTip: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  target: string;
  level: string;
  words: Word[];
}

type Mode = "learn" | "quiz" | "review" | "notebook";
type AnswerResult = "correct" | "wrong" | null;

interface VocabState {
  mastered: number[];
  studied: number[];
  review: number[];
  wrong: number[];
  nextReview: Record<number, string>;
  quizScores: Record<string, number[]>;
  topicTestScores: Record<string, number[]>;
  topicPassed: Record<string, boolean>;
  doneTasks: Record<string, boolean>;
  studyCount: number;
  lastStudyDate: string;
}

const todayKey = () => new Date().toISOString().slice(0, 10);
const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const initialState: VocabState = {
  mastered: [],
  studied: [],
  review: [],
  wrong: [],
  nextReview: {},
  quizScores: {},
  topicTestScores: {},
  topicPassed: {},
  doneTasks: {},
  studyCount: 0,
  lastStudyDate: todayKey(),
};

const topics: Topic[] = [
  {
    id: "office",
    title: "Office - Văn phòng",
    description: "Từ hay gặp trong email, thông báo nội bộ, lịch làm việc và quản lý văn phòng.",
    target: "Thuộc nhóm từ dùng nhiều ở Part 2, 3, 5, 7",
    level: "Nền tảng",
    words: [
      { id: 1, word: "appointment", phonetic: "/əˈpɔɪnt.mənt/", partOfSpeech: "noun", meaning: "cuộc hẹn", exampleEn: "I have an appointment with the manager at 10 a.m.", exampleVi: "Tôi có cuộc hẹn với quản lý lúc 10 giờ sáng.", category: "Office", synonym: "meeting", collocation: "make an appointment", memoryTip: "App + point: đặt một mốc thời gian để gặp ai đó." },
      { id: 2, word: "schedule", phonetic: "/ˈskedʒ.uːl/", partOfSpeech: "noun/verb", meaning: "lịch trình / lên lịch", exampleEn: "The training session is scheduled for Friday.", exampleVi: "Buổi đào tạo được lên lịch vào thứ Sáu.", category: "Office", synonym: "timetable", collocation: "a tight schedule", memoryTip: "Gắn với calendar: có schedule là có lịch cụ thể." },
      { id: 3, word: "postpone", phonetic: "/poʊstˈpoʊn/", partOfSpeech: "verb", meaning: "hoãn lại", exampleEn: "The meeting was postponed until next week.", exampleVi: "Cuộc họp bị hoãn đến tuần sau.", category: "Office", synonym: "delay", collocation: "postpone a meeting", memoryTip: "Post = sau, pone = đặt: đặt việc đó sang sau." },
      { id: 4, word: "notify", phonetic: "/ˈnoʊ.t̬ə.faɪ/", partOfSpeech: "verb", meaning: "thông báo", exampleEn: "Please notify the receptionist when you arrive.", exampleVi: "Vui lòng thông báo cho lễ tân khi bạn đến.", category: "Office", synonym: "inform", collocation: "notify someone of something", memoryTip: "Notice và notify cùng gốc: nhìn thấy thông tin rồi báo lại." },
      { id: 5, word: "receptionist", phonetic: "/rɪˈsep.ʃən.ɪst/", partOfSpeech: "noun", meaning: "lễ tân", exampleEn: "The receptionist greeted every visitor politely.", exampleVi: "Lễ tân chào đón mọi khách đến một cách lịch sự.", category: "Office", synonym: "front desk clerk", collocation: "front-desk receptionist", memoryTip: "Reception là quầy tiếp nhận, receptionist là người ở quầy đó." },
      { id: 6, word: "memo", phonetic: "/ˈmem.oʊ/", partOfSpeech: "noun", meaning: "bản ghi nhớ / thông báo nội bộ", exampleEn: "Employees received a memo about the new policy.", exampleVi: "Nhân viên nhận được thông báo nội bộ về chính sách mới.", category: "Office", synonym: "notice", collocation: "send a memo", memoryTip: "Memo giống memory: ghi nhớ nội dung ngắn." },
      { id: 7, word: "deadline", phonetic: "/ˈded.laɪn/", partOfSpeech: "noun", meaning: "hạn chót", exampleEn: "The deadline for the report is Monday morning.", exampleVi: "Hạn chót nộp báo cáo là sáng thứ Hai.", category: "Office", synonym: "due date", collocation: "meet a deadline", memoryTip: "Deadline là 'vạch chết': quá vạch là trễ." },
      { id: 8, word: "supervisor", phonetic: "/ˈsuː.pɚ.vaɪ.zɚ/", partOfSpeech: "noun", meaning: "người giám sát", exampleEn: "Ask your supervisor before changing the schedule.", exampleVi: "Hãy hỏi người giám sát trước khi thay đổi lịch.", category: "Office", synonym: "manager", collocation: "direct supervisor", memoryTip: "Super + visor: người nhìn/giám sát ở cấp trên." },
    ],
  },
  {
    id: "meeting",
    title: "Meeting - Cuộc họp",
    description: "Từ dùng khi sắp xếp họp, trình bày ý kiến, thảo luận và ra quyết định.",
    target: "Nghe hiểu hội thoại công sở Part 3",
    level: "Nền tảng",
    words: [
      { id: 9, word: "agenda", phonetic: "/əˈdʒen.də/", partOfSpeech: "noun", meaning: "chương trình họp", exampleEn: "The agenda includes three main topics.", exampleVi: "Chương trình họp gồm ba chủ đề chính.", category: "Meeting", synonym: "schedule", collocation: "meeting agenda", memoryTip: "Agenda là danh sách việc cần bàn trong cuộc họp." },
      { id: 10, word: "attend", phonetic: "/əˈtend/", partOfSpeech: "verb", meaning: "tham dự", exampleEn: "All team members are required to attend the briefing.", exampleVi: "Tất cả thành viên nhóm phải tham dự buổi phổ biến thông tin.", category: "Meeting", synonym: "participate in", collocation: "attend a meeting", memoryTip: "Attend = có mặt tại một sự kiện." },
      { id: 11, word: "briefing", phonetic: "/ˈbriː.fɪŋ/", partOfSpeech: "noun", meaning: "buổi phổ biến thông tin ngắn", exampleEn: "The director held a briefing before the product launch.", exampleVi: "Giám đốc tổ chức buổi phổ biến thông tin trước khi ra mắt sản phẩm.", category: "Meeting", synonym: "short meeting", collocation: "morning briefing", memoryTip: "Brief nghĩa là ngắn gọn, briefing là buổi nói ngắn." },
      { id: 12, word: "proposal", phonetic: "/prəˈpoʊ.zəl/", partOfSpeech: "noun", meaning: "đề xuất", exampleEn: "Her proposal was accepted by the committee.", exampleVi: "Đề xuất của cô ấy được ủy ban chấp nhận.", category: "Meeting", synonym: "suggestion", collocation: "submit a proposal", memoryTip: "Propose là đề nghị, proposal là bản đề xuất." },
      { id: 13, word: "conclude", phonetic: "/kənˈkluːd/", partOfSpeech: "verb", meaning: "kết luận / kết thúc", exampleEn: "The meeting concluded at 4 p.m.", exampleVi: "Cuộc họp kết thúc lúc 4 giờ chiều.", category: "Meeting", synonym: "finish", collocation: "conclude a meeting", memoryTip: "Conclude thường xuất hiện ở cuối bài nghe/bài đọc." },
      { id: 14, word: "minutes", phonetic: "/ˈmɪn.ɪts/", partOfSpeech: "noun", meaning: "biên bản họp", exampleEn: "Could you send me the minutes of yesterday's meeting?", exampleVi: "Bạn gửi cho tôi biên bản cuộc họp hôm qua được không?", category: "Meeting", synonym: "meeting notes", collocation: "take minutes", memoryTip: "Minutes không chỉ là phút, trong họp là biên bản." },
      { id: 15, word: "consensus", phonetic: "/kənˈsen.səs/", partOfSpeech: "noun", meaning: "sự đồng thuận", exampleEn: "The team reached a consensus after a long discussion.", exampleVi: "Nhóm đạt được sự đồng thuận sau một cuộc thảo luận dài.", category: "Meeting", synonym: "agreement", collocation: "reach a consensus", memoryTip: "Consensus gần nghĩa agreement nhưng trang trọng hơn." },
      { id: 16, word: "presentation", phonetic: "/ˌprez.ənˈteɪ.ʃən/", partOfSpeech: "noun", meaning: "bài thuyết trình", exampleEn: "The sales team prepared a presentation for the client.", exampleVi: "Nhóm kinh doanh chuẩn bị bài thuyết trình cho khách hàng.", category: "Meeting", synonym: "talk", collocation: "give a presentation", memoryTip: "Present là trình bày, presentation là bài trình bày." },
    ],
  },
  {
    id: "finance",
    title: "Finance - Tài chính",
    description: "Từ về hóa đơn, ngân sách, doanh thu, chi phí và thanh toán.",
    target: "Tăng điểm Part 5, 6, 7 chủ đề kinh doanh",
    level: "Trung bình",
    words: [
      { id: 17, word: "invoice", phonetic: "/ˈɪn.vɔɪs/", partOfSpeech: "noun", meaning: "hóa đơn", exampleEn: "The supplier sent an invoice for the equipment.", exampleVi: "Nhà cung cấp gửi hóa đơn cho thiết bị.", category: "Finance", synonym: "bill", collocation: "issue an invoice", memoryTip: "Invoice thường đi với send, issue, pay." },
      { id: 18, word: "budget", phonetic: "/ˈbʌdʒ.ɪt/", partOfSpeech: "noun", meaning: "ngân sách", exampleEn: "The project stayed within the budget.", exampleVi: "Dự án vẫn nằm trong ngân sách.", category: "Finance", synonym: "financial plan", collocation: "annual budget", memoryTip: "Budget là túi tiền được giới hạn cho một việc." },
      { id: 19, word: "revenue", phonetic: "/ˈrev.ə.nuː/", partOfSpeech: "noun", meaning: "doanh thu", exampleEn: "Revenue increased during the holiday season.", exampleVi: "Doanh thu tăng trong mùa lễ.", category: "Finance", synonym: "income", collocation: "generate revenue", memoryTip: "Revenue là tiền công ty thu vào, chưa trừ chi phí." },
      { id: 20, word: "expense", phonetic: "/ɪkˈspens/", partOfSpeech: "noun", meaning: "chi phí", exampleEn: "Travel expenses must be approved in advance.", exampleVi: "Chi phí đi lại phải được phê duyệt trước.", category: "Finance", synonym: "cost", collocation: "business expense", memoryTip: "Expense là khoản tiền phải chi ra." },
      { id: 21, word: "refund", phonetic: "/ˈriː.fʌnd/", partOfSpeech: "noun/verb", meaning: "tiền hoàn lại / hoàn tiền", exampleEn: "Customers can request a refund within 30 days.", exampleVi: "Khách hàng có thể yêu cầu hoàn tiền trong vòng 30 ngày.", category: "Finance", synonym: "repayment", collocation: "request a refund", memoryTip: "Re + fund: tiền quay trở lại." },
      { id: 22, word: "profit", phonetic: "/ˈprɑː.fɪt/", partOfSpeech: "noun", meaning: "lợi nhuận", exampleEn: "The store made a significant profit last month.", exampleVi: "Cửa hàng đạt lợi nhuận đáng kể tháng trước.", category: "Finance", synonym: "earnings", collocation: "make a profit", memoryTip: "Profit = revenue - expenses." },
      { id: 23, word: "deposit", phonetic: "/dɪˈpɑː.zɪt/", partOfSpeech: "noun/verb", meaning: "tiền đặt cọc / gửi tiền", exampleEn: "A deposit is required to reserve the room.", exampleVi: "Cần tiền đặt cọc để giữ phòng.", category: "Finance", synonym: "down payment", collocation: "pay a deposit", memoryTip: "Deposit là khoản tiền đặt trước." },
      { id: 24, word: "transaction", phonetic: "/trænˈzæk.ʃən/", partOfSpeech: "noun", meaning: "giao dịch", exampleEn: "The bank recorded every transaction automatically.", exampleVi: "Ngân hàng ghi lại mọi giao dịch tự động.", category: "Finance", synonym: "deal", collocation: "online transaction", memoryTip: "Transaction thường gặp trong ngân hàng/thanh toán." },
    ],
  },
  {
    id: "travel",
    title: "Travel - Du lịch công tác",
    description: "Từ về sân bay, đặt phòng, lịch bay, phương tiện và chuyến công tác.",
    target: "Nghe tốt Part 1, 2, 3 chủ đề di chuyển",
    level: "Nền tảng",
    words: [
      { id: 25, word: "itinerary", phonetic: "/aɪˈtɪn.ə.rer.i/", partOfSpeech: "noun", meaning: "lịch trình chuyến đi", exampleEn: "The travel agent emailed the itinerary to the client.", exampleVi: "Đại lý du lịch gửi lịch trình chuyến đi cho khách hàng.", category: "Travel", synonym: "travel plan", collocation: "travel itinerary", memoryTip: "Itinerary là schedule dành cho chuyến đi." },
      { id: 26, word: "departure", phonetic: "/dɪˈpɑːr.tʃɚ/", partOfSpeech: "noun", meaning: "sự khởi hành", exampleEn: "The departure gate has changed.", exampleVi: "Cổng khởi hành đã thay đổi.", category: "Travel", synonym: "leaving", collocation: "departure gate", memoryTip: "Depart là rời đi, departure là sự rời đi." },
      { id: 27, word: "arrival", phonetic: "/əˈraɪ.vəl/", partOfSpeech: "noun", meaning: "sự đến nơi", exampleEn: "The arrival time is printed on the ticket.", exampleVi: "Giờ đến được in trên vé.", category: "Travel", synonym: "coming", collocation: "arrival time", memoryTip: "Arrive là đến, arrival là sự đến." },
      { id: 28, word: "accommodation", phonetic: "/əˌkɑː.məˈdeɪ.ʃən/", partOfSpeech: "noun", meaning: "chỗ ở", exampleEn: "The company will arrange accommodation for visitors.", exampleVi: "Công ty sẽ sắp xếp chỗ ở cho khách.", category: "Travel", synonym: "lodging", collocation: "hotel accommodation", memoryTip: "Accommodation thường là khách sạn/chỗ nghỉ." },
      { id: 29, word: "reservation", phonetic: "/ˌrez.ɚˈveɪ.ʃən/", partOfSpeech: "noun", meaning: "sự đặt chỗ", exampleEn: "I would like to confirm my hotel reservation.", exampleVi: "Tôi muốn xác nhận đặt phòng khách sạn của mình.", category: "Travel", synonym: "booking", collocation: "make a reservation", memoryTip: "Reserve là giữ chỗ, reservation là việc đặt chỗ." },
      { id: 30, word: "luggage", phonetic: "/ˈlʌɡ.ɪdʒ/", partOfSpeech: "noun", meaning: "hành lý", exampleEn: "Please do not leave your luggage unattended.", exampleVi: "Vui lòng không để hành lý của bạn không có người trông coi.", category: "Travel", synonym: "baggage", collocation: "carry-on luggage", memoryTip: "Luggage = baggage, không đếm từng cái bằng số trực tiếp." },
      { id: 31, word: "commute", phonetic: "/kəˈmjuːt/", partOfSpeech: "verb/noun", meaning: "đi làm hằng ngày", exampleEn: "She commutes to the office by train.", exampleVi: "Cô ấy đi làm đến văn phòng bằng tàu.", category: "Travel", synonym: "travel to work", collocation: "daily commute", memoryTip: "Commute là đi lại đều đặn giữa nhà và chỗ làm." },
      { id: 32, word: "vehicle", phonetic: "/ˈviː.ə.kəl/", partOfSpeech: "noun", meaning: "phương tiện", exampleEn: "Company vehicles must be returned by 6 p.m.", exampleVi: "Xe của công ty phải được trả trước 6 giờ tối.", category: "Travel", synonym: "car", collocation: "rental vehicle", memoryTip: "Vehicle là từ chung cho xe/phương tiện." },
    ],
  },
  {
    id: "contract",
    title: "Contract - Hợp đồng",
    description: "Từ dùng trong thỏa thuận, điều khoản, pháp lý và ký kết hợp đồng.",
    target: "Đọc hiểu văn bản Part 7 nhanh hơn",
    level: "Trung bình",
    words: [
      { id: 33, word: "contract", phonetic: "/ˈkɑːn.trækt/", partOfSpeech: "noun", meaning: "hợp đồng", exampleEn: "The two companies signed a contract last week.", exampleVi: "Hai công ty đã ký hợp đồng tuần trước.", category: "Contract", synonym: "agreement", collocation: "sign a contract", memoryTip: "Contract hay đi với sign, renew, terminate." },
      { id: 34, word: "agreement", phonetic: "/əˈɡriː.mənt/", partOfSpeech: "noun", meaning: "thỏa thuận", exampleEn: "They reached an agreement after several meetings.", exampleVi: "Họ đạt được thỏa thuận sau vài cuộc họp.", category: "Contract", synonym: "deal", collocation: "reach an agreement", memoryTip: "Agree là đồng ý, agreement là sự đồng ý/thỏa thuận." },
      { id: 35, word: "clause", phonetic: "/klɔːz/", partOfSpeech: "noun", meaning: "điều khoản", exampleEn: "Please read each clause carefully before signing.", exampleVi: "Vui lòng đọc kỹ từng điều khoản trước khi ký.", category: "Contract", synonym: "term", collocation: "contract clause", memoryTip: "Clause là một phần nhỏ trong hợp đồng." },
      { id: 36, word: "renew", phonetic: "/rɪˈnuː/", partOfSpeech: "verb", meaning: "gia hạn / làm mới", exampleEn: "The company decided to renew the lease.", exampleVi: "Công ty quyết định gia hạn hợp đồng thuê.", category: "Contract", synonym: "extend", collocation: "renew a contract", memoryTip: "Re + new: làm mới lại." },
      { id: 37, word: "terminate", phonetic: "/ˈtɝː.mə.neɪt/", partOfSpeech: "verb", meaning: "chấm dứt", exampleEn: "Either party may terminate the agreement with notice.", exampleVi: "Mỗi bên có thể chấm dứt thỏa thuận bằng thông báo.", category: "Contract", synonym: "end", collocation: "terminate a contract", memoryTip: "Terminal là điểm cuối, terminate là kết thúc." },
      { id: 38, word: "comply", phonetic: "/kəmˈplaɪ/", partOfSpeech: "verb", meaning: "tuân thủ", exampleEn: "All staff must comply with safety rules.", exampleVi: "Tất cả nhân viên phải tuân thủ quy định an toàn.", category: "Contract", synonym: "obey", collocation: "comply with regulations", memoryTip: "Comply luôn hay đi với with." },
      { id: 39, word: "valid", phonetic: "/ˈvæl.ɪd/", partOfSpeech: "adjective", meaning: "có hiệu lực / hợp lệ", exampleEn: "The coupon is valid until the end of June.", exampleVi: "Phiếu giảm giá có hiệu lực đến cuối tháng Sáu.", category: "Contract", synonym: "effective", collocation: "valid contract", memoryTip: "Valid = dùng được, hợp lệ." },
      { id: 40, word: "obligation", phonetic: "/ˌɑː.bləˈɡeɪ.ʃən/", partOfSpeech: "noun", meaning: "nghĩa vụ", exampleEn: "The supplier has an obligation to deliver on time.", exampleVi: "Nhà cung cấp có nghĩa vụ giao hàng đúng hạn.", category: "Contract", synonym: "duty", collocation: "legal obligation", memoryTip: "Obligation là việc bắt buộc phải làm." },
    ],
  },
  {
    id: "shopping",
    title: "Shopping - Mua sắm",
    description: "Từ dùng trong cửa hàng, sản phẩm, khuyến mãi, đổi trả và dịch vụ khách hàng.",
    target: "Xử lý nhanh hội thoại Part 2, 3",
    level: "Nền tảng",
    words: [
      { id: 41, word: "discount", phonetic: "/ˈdɪs.kaʊnt/", partOfSpeech: "noun", meaning: "giảm giá", exampleEn: "Members receive a 10 percent discount.", exampleVi: "Thành viên nhận được giảm giá 10 phần trăm.", category: "Shopping", synonym: "reduction", collocation: "offer a discount", memoryTip: "Discount là giá được trừ bớt." },
      { id: 42, word: "receipt", phonetic: "/rɪˈsiːt/", partOfSpeech: "noun", meaning: "biên lai", exampleEn: "Keep your receipt in case you need to return the item.", exampleVi: "Hãy giữ biên lai phòng khi bạn cần trả hàng.", category: "Shopping", synonym: "proof of purchase", collocation: "sales receipt", memoryTip: "Receipt có p câm: đọc giống 'ri-sít'." },
      { id: 43, word: "aisle", phonetic: "/aɪl/", partOfSpeech: "noun", meaning: "lối đi giữa các kệ", exampleEn: "Cleaning products are in aisle five.", exampleVi: "Sản phẩm vệ sinh ở lối đi số năm.", category: "Shopping", synonym: "passage", collocation: "grocery aisle", memoryTip: "Aisle có s câm, đọc như 'ai-l'." },
      { id: 44, word: "merchandise", phonetic: "/ˈmɝː.tʃən.daɪz/", partOfSpeech: "noun", meaning: "hàng hóa", exampleEn: "The store displays new merchandise every Monday.", exampleVi: "Cửa hàng trưng bày hàng hóa mới mỗi thứ Hai.", category: "Shopping", synonym: "goods", collocation: "display merchandise", memoryTip: "Merchandise là goods trong cửa hàng." },
      { id: 45, word: "purchase", phonetic: "/ˈpɝː.tʃəs/", partOfSpeech: "noun/verb", meaning: "mua / sự mua hàng", exampleEn: "Customers can purchase tickets online.", exampleVi: "Khách hàng có thể mua vé trực tuyến.", category: "Shopping", synonym: "buy", collocation: "make a purchase", memoryTip: "Purchase trang trọng hơn buy." },
      { id: 46, word: "defective", phonetic: "/dɪˈfek.tɪv/", partOfSpeech: "adjective", meaning: "bị lỗi", exampleEn: "The customer returned a defective product.", exampleVi: "Khách hàng trả lại một sản phẩm bị lỗi.", category: "Shopping", synonym: "faulty", collocation: "defective item", memoryTip: "Defect là lỗi, defective là có lỗi." },
      { id: 47, word: "warranty", phonetic: "/ˈwɔːr.ən.t̬i/", partOfSpeech: "noun", meaning: "bảo hành", exampleEn: "The printer comes with a one-year warranty.", exampleVi: "Máy in đi kèm bảo hành một năm.", category: "Shopping", synonym: "guarantee", collocation: "warranty period", memoryTip: "Warranty bảo đảm sửa/đổi trong một thời gian." },
      { id: 48, word: "retailer", phonetic: "/ˈriː.teɪ.lɚ/", partOfSpeech: "noun", meaning: "nhà bán lẻ", exampleEn: "The retailer offers free shipping this week.", exampleVi: "Nhà bán lẻ cung cấp giao hàng miễn phí tuần này.", category: "Shopping", synonym: "seller", collocation: "online retailer", memoryTip: "Retail là bán lẻ, retailer là bên bán lẻ." },
    ],
  },
  {
    id: "restaurant",
    title: "Restaurant - Nhà hàng",
    description: "Từ về đặt bàn, gọi món, phục vụ, hóa đơn và trải nghiệm khách hàng.",
    target: "Nghe hiểu tình huống đời sống Part 2, 3",
    level: "Nền tảng",
    words: [
      { id: 49, word: "reservation", phonetic: "/ˌrez.ɚˈveɪ.ʃən/", partOfSpeech: "noun", meaning: "đặt chỗ", exampleEn: "We have a dinner reservation for seven o'clock.", exampleVi: "Chúng tôi có đặt bàn ăn tối lúc bảy giờ.", category: "Restaurant", synonym: "booking", collocation: "dinner reservation", memoryTip: "Reservation dùng cho nhà hàng, khách sạn, chuyến bay." },
      { id: 50, word: "menu", phonetic: "/ˈmen.juː/", partOfSpeech: "noun", meaning: "thực đơn", exampleEn: "The waiter brought us the menu.", exampleVi: "Nhân viên phục vụ mang thực đơn cho chúng tôi.", category: "Restaurant", synonym: "food list", collocation: "lunch menu", memoryTip: "Menu là danh sách món ăn." },
      { id: 51, word: "beverage", phonetic: "/ˈbev.ɚ.ɪdʒ/", partOfSpeech: "noun", meaning: "đồ uống", exampleEn: "Coffee and tea are complimentary beverages.", exampleVi: "Cà phê và trà là đồ uống miễn phí.", category: "Restaurant", synonym: "drink", collocation: "beverage service", memoryTip: "Beverage trang trọng hơn drink." },
      { id: 52, word: "serve", phonetic: "/sɝːv/", partOfSpeech: "verb", meaning: "phục vụ", exampleEn: "Breakfast is served from 6 to 10 a.m.", exampleVi: "Bữa sáng được phục vụ từ 6 đến 10 giờ sáng.", category: "Restaurant", synonym: "provide", collocation: "serve breakfast", memoryTip: "Serve food = phục vụ đồ ăn." },
      { id: 53, word: "ingredient", phonetic: "/ɪnˈɡriː.di.ənt/", partOfSpeech: "noun", meaning: "nguyên liệu", exampleEn: "Fresh ingredients are used in every dish.", exampleVi: "Nguyên liệu tươi được dùng trong mọi món ăn.", category: "Restaurant", synonym: "component", collocation: "fresh ingredients", memoryTip: "Ingredient là thứ tạo nên món ăn." },
      { id: 54, word: "complimentary", phonetic: "/ˌkɑːm.pləˈmen.t̬ɚ.i/", partOfSpeech: "adjective", meaning: "miễn phí / tặng kèm", exampleEn: "Guests receive a complimentary breakfast.", exampleVi: "Khách nhận được bữa sáng miễn phí.", category: "Restaurant", synonym: "free", collocation: "complimentary drink", memoryTip: "Trong TOEIC, complimentary thường là free." },
      { id: 55, word: "cater", phonetic: "/ˈkeɪ.t̬ɚ/", partOfSpeech: "verb", meaning: "cung cấp đồ ăn cho sự kiện", exampleEn: "The hotel will cater the company banquet.", exampleVi: "Khách sạn sẽ cung cấp đồ ăn cho tiệc công ty.", category: "Restaurant", synonym: "provide food", collocation: "cater an event", memoryTip: "Catering là dịch vụ tiệc/suất ăn sự kiện." },
      { id: 56, word: "portion", phonetic: "/ˈpɔːr.ʃən/", partOfSpeech: "noun", meaning: "khẩu phần", exampleEn: "The lunch portion is large enough for two people.", exampleVi: "Khẩu phần bữa trưa đủ lớn cho hai người.", category: "Restaurant", synonym: "serving", collocation: "large portion", memoryTip: "Portion là một phần ăn." },
    ],
  },
  {
    id: "logistics",
    title: "Logistics - Vận chuyển",
    description: "Từ về giao hàng, kho, đơn hàng, vận chuyển và kiểm kê.",
    target: "Đọc mail/thông báo giao nhận trong Part 7",
    level: "Trung bình",
    words: [
      { id: 57, word: "shipment", phonetic: "/ˈʃɪp.mənt/", partOfSpeech: "noun", meaning: "lô hàng", exampleEn: "The shipment arrived two days earlier than expected.", exampleVi: "Lô hàng đến sớm hơn dự kiến hai ngày.", category: "Logistics", synonym: "delivery", collocation: "track a shipment", memoryTip: "Ship là vận chuyển, shipment là lô được vận chuyển." },
      { id: 58, word: "warehouse", phonetic: "/ˈwer.haʊs/", partOfSpeech: "noun", meaning: "nhà kho", exampleEn: "The products are stored in a warehouse outside the city.", exampleVi: "Sản phẩm được lưu trữ trong nhà kho ngoài thành phố.", category: "Logistics", synonym: "storage facility", collocation: "warehouse manager", memoryTip: "Ware = hàng hóa, house = nhà." },
      { id: 59, word: "inventory", phonetic: "/ˈɪn.vən.tɔːr.i/", partOfSpeech: "noun", meaning: "hàng tồn kho / kiểm kê", exampleEn: "The store conducts inventory checks every month.", exampleVi: "Cửa hàng kiểm kê hàng tồn kho mỗi tháng.", category: "Logistics", synonym: "stock", collocation: "inventory check", memoryTip: "Inventory thường đi với stock, warehouse, check." },
      { id: 60, word: "deliver", phonetic: "/dɪˈlɪv.ɚ/", partOfSpeech: "verb", meaning: "giao hàng", exampleEn: "The package will be delivered tomorrow morning.", exampleVi: "Gói hàng sẽ được giao vào sáng mai.", category: "Logistics", synonym: "send", collocation: "deliver a package", memoryTip: "Deliver là hành động giao đến nơi." },
      { id: 61, word: "carrier", phonetic: "/ˈker.i.ɚ/", partOfSpeech: "noun", meaning: "đơn vị vận chuyển", exampleEn: "The carrier will contact you before delivery.", exampleVi: "Đơn vị vận chuyển sẽ liên hệ bạn trước khi giao hàng.", category: "Logistics", synonym: "shipping company", collocation: "shipping carrier", memoryTip: "Carry là mang, carrier là bên mang hàng." },
      { id: 62, word: "fragile", phonetic: "/ˈfrædʒ.əl/", partOfSpeech: "adjective", meaning: "dễ vỡ", exampleEn: "The label says the contents are fragile.", exampleVi: "Nhãn ghi rằng hàng bên trong dễ vỡ.", category: "Logistics", synonym: "breakable", collocation: "fragile item", memoryTip: "Fragile = dễ gãy/vỡ, thường dán trên thùng hàng." },
      { id: 63, word: "delay", phonetic: "/dɪˈleɪ/", partOfSpeech: "noun/verb", meaning: "sự chậm trễ / làm chậm", exampleEn: "Bad weather caused a delay in delivery.", exampleVi: "Thời tiết xấu gây chậm trễ trong giao hàng.", category: "Logistics", synonym: "postpone", collocation: "delivery delay", memoryTip: "Delay là trễ, postpone là hoãn có chủ ý." },
      { id: 64, word: "available", phonetic: "/əˈveɪ.lə.bəl/", partOfSpeech: "adjective", meaning: "có sẵn", exampleEn: "The item is currently available in three colors.", exampleVi: "Mặt hàng hiện có sẵn ba màu.", category: "Logistics", synonym: "in stock", collocation: "available in stock", memoryTip: "Available = có thể dùng/mua/đặt được." },
    ],
  },
];

const allWords = topics.flatMap((t) => t.words);
const DAILY_TARGET = 10;
const PASS_SCORE = 70;

const categoryColor: Record<string, string> = {
  Office: "#1d4ed8",
  Meeting: "#7c3aed",
  Finance: "#059669",
  Travel: "#0891b2",
  Contract: "#b45309",
  Shopping: "#be185d",
  Restaurant: "#d97706",
  Logistics: "#0f766e",
};

const posColor: Record<string, string> = {
  verb: "#1d4ed8",
  noun: "#7c3aed",
  adjective: "#059669",
  adverb: "#d97706",
  "noun/verb": "#be185d",
  "verb/noun": "#be185d",
};

function unique(items: number[]) {
  return Array.from(new Set(items));
}

function removeId(items: number[], id: number) {
  return items.filter((item) => item !== id);
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function useVocabState() {
  const [state, setState] = useState<VocabState>(() => {
    if (typeof window === "undefined") return initialState;
    try {
      const raw = window.localStorage.getItem("toeic-vocab-study-state-v2");
      return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("toeic-vocab-study-state-v2", JSON.stringify(state));
    } catch {
      // localStorage can be unavailable in private mode; the UI still works for the current session.
    }
  }, [state]);

  return [state, setState] as const;
}

function StatCard({ icon: Icon, label, value, hint, tone }: { icon: any; label: string; value: string; hint: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-border p-4" style={{ background: "var(--card)" }}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div style={{ fontSize: "0.74rem", color: "var(--muted-foreground)", fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--foreground)", marginTop: 4 }}>{value}</div>
          <div style={{ fontSize: "0.68rem", color: "var(--muted-foreground)", marginTop: 2 }}>{hint}</div>
        </div>
        <div className="rounded-2xl flex items-center justify-center" style={{ width: 44, height: 44, background: `${tone}15`, color: tone }}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export function VocabFlashcard() {
  const [state, setState] = useVocabState();
  const [mode, setMode] = useState<Mode>("learn");
  const [topicId, setTopicId] = useState(topics[0].id);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "mastered" | "review" | "wrong">("all");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult>(null);

  const currentTopic = topics.find((t) => t.id === topicId) ?? topics[0];
  const words = currentTopic.words;
  const word = words[index] ?? words[0];

  const masteredSet = useMemo(() => new Set(state.mastered), [state.mastered]);
  const studiedSet = useMemo(() => new Set(state.studied), [state.studied]);
  const reviewSet = useMemo(() => new Set(state.review), [state.review]);
  const wrongSet = useMemo(() => new Set(state.wrong), [state.wrong]);

  const dueReviewWords = useMemo(() => {
    const today = todayKey();
    const fromSchedule = allWords.filter((w) => state.nextReview[w.id] && state.nextReview[w.id] <= today);
    const fromReview = allWords.filter((w) => reviewSet.has(w.id) || wrongSet.has(w.id));
    const merged = [...fromSchedule, ...fromReview];
    return merged.filter((w, i, arr) => arr.findIndex((x) => x.id === w.id) === i);
  }, [state.nextReview, reviewSet, wrongSet]);

  const quizWords = useMemo(() => shuffle(words).slice(0, Math.min(8, words.length)), [topicId]);
  const quizWord = quizWords[quizIndex] ?? quizWords[0];
  const quizOptions = useMemo(() => {
    if (!quizWord) return [];
    const wrongOptions = shuffle(allWords.filter((w) => w.id !== quizWord.id)).slice(0, 3).map((w) => w.meaning);
    return shuffle([quizWord.meaning, ...wrongOptions]);
  }, [quizWord?.id]);

  const topicStudiedCount = words.filter((w) => studiedSet.has(w.id)).length;
  const topicMasteredCount = words.filter((w) => masteredSet.has(w.id)).length;
  const topicLearnProgress = Math.round((topicStudiedCount / words.length) * 100);
  const topicProgress = state.topicPassed[topicId] ? 100 : topicLearnProgress;
  const topicPassed = !!state.topicPassed[topicId];
  const canTakeTopicTest = topicLearnProgress >= 100;
  const topicScores = state.topicTestScores[topicId] ?? state.quizScores[topicId] ?? [];
  const latestTopicScore = topicScores.length ? topicScores[topicScores.length - 1] : null;
  const totalPassedTopics = topics.filter((topic) => state.topicPassed[topic.id]).length;
  const totalProgress = Math.round((totalPassedTopics / topics.length) * 100);
  const avgQuiz = useMemo(() => {
    const scores = Object.values(state.topicTestScores).flat();
    if (!scores.length) return 0;
    return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  }, [state.topicTestScores]);

  const reviewedToday = Object.values(state.doneTasks).filter(Boolean).length;

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
    setQuizIndex(0);
    setQuizAnswers({});
    setSelectedAnswer(null);
    setAnswerResult(null);
    setMode("learn");
  }, [topicId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode !== "learn") return;
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((v) => !v);
      }
      if (e.key === "ArrowRight") markMastered(word.id);
      if (e.key === "ArrowLeft") markReview(word.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, word?.id]);

  const updateStudyDate = (draft: VocabState) => ({
    ...draft,
    studyCount: draft.studyCount + 1,
    lastStudyDate: todayKey(),
    doneTasks: { ...draft.doneTasks, [`study-${todayKey()}`]: true },
  });

  const markMastered = (id: number) => {
    setState((s) => updateStudyDate({
      ...s,
      studied: unique([...s.studied, id]),
      mastered: unique([...s.mastered, id]),
      review: removeId(s.review, id),
      wrong: removeId(s.wrong, id),
      nextReview: { ...s.nextReview, [id]: addDays(3) },
    }));
    goNext();
  };

  const markReview = (id: number) => {
    setState((s) => updateStudyDate({
      ...s,
      studied: unique([...s.studied, id]),
      review: unique([...s.review, id]),
      mastered: removeId(s.mastered, id),
      nextReview: { ...s.nextReview, [id]: todayKey() },
    }));
    goNext();
  };

  const markWrong = (id: number) => {
    setState((s) => ({
      ...s,
      studied: unique([...s.studied, id]),
      wrong: unique([...s.wrong, id]),
      review: unique([...s.review, id]),
      mastered: removeId(s.mastered, id),
      nextReview: { ...s.nextReview, [id]: todayKey() },
      doneTasks: { ...s.doneTasks, [`quiz-${todayKey()}`]: true },
    }));
  };

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => (i + 1 >= words.length ? 0 : i + 1));
  };

  const playAudio = (targetWord: string) => {
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(targetWord);
      utter.lang = "en-US";
      utter.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  };

  const toggleTask = (key: string) => {
    setState((s) => ({ ...s, doneTasks: { ...s.doneTasks, [key]: !s.doneTasks[key] } }));
  };

  const submitAnswer = (option: string) => {
    if (!quizWord || selectedAnswer) return;
    const isCorrect = option === quizWord.meaning;
    setSelectedAnswer(option);
    setAnswerResult(isCorrect ? "correct" : "wrong");
    setQuizAnswers((a) => ({ ...a, [quizWord.id]: isCorrect }));
  };

  const finishTopicTest = () => {
    if (!quizWord) return;
    const latestAnswers = { ...quizAnswers, [quizWord.id]: answerResult === "correct" };
    const correctIds = quizWords.filter((w) => latestAnswers[w.id]).map((w) => w.id);
    const wrongIds = quizWords.filter((w) => !latestAnswers[w.id]).map((w) => w.id);
    const score = Math.round((correctIds.length / quizWords.length) * 100);
    const passed = score >= PASS_SCORE;

    setState((s) => ({
      ...s,
      studied: unique([...s.studied, ...quizWords.map((w) => w.id)]),
      mastered: passed ? unique([...s.mastered, ...correctIds]) : unique([...s.mastered, ...correctIds]).filter((id) => !wrongIds.includes(id)),
      wrong: unique([...s.wrong.filter((id) => !correctIds.includes(id)), ...wrongIds]),
      review: unique([...s.review.filter((id) => !correctIds.includes(id)), ...wrongIds]),
      nextReview: {
        ...s.nextReview,
        ...Object.fromEntries(correctIds.map((id) => [id, addDays(3)])),
        ...Object.fromEntries(wrongIds.map((id) => [id, todayKey()])),
      },
      topicPassed: { ...s.topicPassed, [topicId]: passed },
      topicTestScores: { ...s.topicTestScores, [topicId]: [...(s.topicTestScores[topicId] ?? []), score] },
      quizScores: { ...s.quizScores, [topicId]: [...(s.quizScores[topicId] ?? []), score] },
      doneTasks: { ...s.doneTasks, [`quiz-${todayKey()}`]: true },
    }));

    setQuizIndex(0);
    setQuizAnswers({});
    setSelectedAnswer(null);
    setAnswerResult(null);
  };

  const nextQuiz = () => {
    if (quizIndex + 1 >= quizWords.length) {
      finishTopicTest();
    } else {
      setSelectedAnswer(null);
      setAnswerResult(null);
      setQuizIndex((i) => i + 1);
    }
  };

  const resetDemo = () => {
    setState(initialState);
    setIndex(0);
    setFlipped(false);
    setQuizIndex(0);
    setQuizAnswers({});
    setSelectedAnswer(null);
    setAnswerResult(null);
  };

  const filteredNotebookWords = allWords.filter((w) => {
    const q = search.trim().toLowerCase();
    const text = `${w.word} ${w.meaning} ${w.category} ${w.exampleEn}`.toLowerCase();
    const matchSearch = !q || text.includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "mastered" && masteredSet.has(w.id)) ||
      (filter === "review" && reviewSet.has(w.id)) ||
      (filter === "wrong" && wrongSet.has(w.id));
    return matchSearch && matchFilter;
  });

  const currentColor = categoryColor[word?.category] ?? "#1d4ed8";
  const posCol = posColor[word?.partOfSpeech] ?? "#6b7280";

  const dailyTasks = [
    { key: `learn-${todayKey()}`, label: "Học ít nhất 10 từ mới", hint: `${Math.min(state.studyCount, DAILY_TARGET)}/${DAILY_TARGET} từ` },
    { key: `quiz-${todayKey()}`, label: "Học xong topic thì bấm bài kiểm tra bắt buộc", hint: !canTakeTopicTest ? `Còn ${words.length - topicStudiedCount} từ nữa mới mở` : state.doneTasks[`quiz-${todayKey()}`] ? "Đã xong" : "Đã mở khóa" },
    { key: `review-${todayKey()}`, label: "Ôn lại từ sai / từ chưa thuộc", hint: `${dueReviewWords.length} từ cần ôn` },
    { key: `sentence-${todayKey()}`, label: "Đặt 2 câu ví dụ với từ mới", hint: "Tự luyện ghi nhớ" },
  ];

  return (
    <div className="w-full flex flex-col gap-6" style={{ maxWidth: 1120, margin: "0 auto" }}>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
        <StatCard icon={BookMarked} label="Tổng từ vựng" value={`${allWords.length}`} hint="Chia theo 8 chủ đề TOEIC" tone="#1d4ed8" />
        <StatCard icon={CheckCircle2} label="Chủ đề đã qua" value={`${totalPassedTopics}/${topics.length}`} hint={`${totalProgress}% hoàn thành qua kiểm tra`} tone="#16a34a" />
        <StatCard icon={RotateCcw} label="Cần ôn" value={`${dueReviewWords.length}`} hint="Từ sai và từ đến hạn ôn" tone="#ea580c" />
        <StatCard icon={Trophy} label="Điểm quiz TB" value={`${avgQuiz}%`} hint="Lưu bằng localStorage" tone="#7c3aed" />
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "minmax(0, 1fr) 320px" }}>
        <div className="flex flex-col gap-5" style={{ minWidth: 0 }}>
          <div className="rounded-2xl border border-border p-4" style={{ background: "var(--card)" }}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {(["learn", ...(canTakeTopicTest ? (["quiz"] as Mode[]) : []), "review", "notebook"] as Mode[]).map((m) => {
                const active = mode === m;
                const labels: Record<Mode, string> = {
                  learn: "Học flashcard",
                  quiz: "Bài kiểm tra bắt buộc",
                  review: "Ôn từ chưa thuộc",
                  notebook: "Sổ tay từ vựng",
                };
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="rounded-xl px-4 py-2 transition-all"
                    style={{
                      border: active ? "1px solid var(--primary)" : "1px solid var(--border)",
                      background: active ? "var(--accent)" : "var(--card)",
                      color: active ? "var(--primary)" : "var(--muted-foreground)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {labels[m]}
                  </button>
                );
              })}
            </div>

            {!canTakeTopicTest && (
              <div className="rounded-2xl px-4 py-3 mb-4" style={{ background: "#f8fafc", border: "1px dashed var(--border)" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 900, color: "var(--foreground)" }}>Bài kiểm tra bắt buộc sẽ chỉ hiện sau khi học xong topic.</div>
                <div style={{ fontSize: "0.74rem", color: "var(--muted-foreground)", marginTop: 4 }}>Bạn đang học {topicStudiedCount}/{words.length} từ của chủ đề <b>{currentTopic.title}</b>. Khi đủ {words.length}/{words.length}, hệ thống sẽ hiện nút <b>Làm bài kiểm tra bắt buộc</b>.</div>
              </div>
            )}

            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
              {topics.map((topic) => {
                const active = topic.id === topicId;
                const studied = topic.words.filter((w) => studiedSet.has(w.id)).length;
                const pct = Math.round((studied / topic.words.length) * 100);
                const passed = !!state.topicPassed[topic.id];
                const topicScoreList = state.topicTestScores[topic.id] ?? [];
                const latestScore = topicScoreList.length ? topicScoreList[topicScoreList.length - 1] : null;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setTopicId(topic.id)}
                    className="rounded-2xl p-4 text-left transition-all hover:opacity-90"
                    style={{
                      background: active ? "var(--accent)" : "var(--muted)",
                      border: active ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      cursor: "pointer",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div style={{ fontSize: "0.82rem", fontWeight: 800, color: active ? "var(--primary)" : "var(--foreground)" }}>{topic.title}</div>
                      <span style={{ fontSize: "0.65rem", fontWeight: 800, color: passed ? "#16a34a" : active ? "var(--primary)" : "var(--muted-foreground)" }}>{passed ? "Đạt" : `${pct}%`}</span>
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "var(--muted-foreground)", marginTop: 5, lineHeight: 1.4 }}>{topic.level} · {topic.words.length} từ · {passed ? "Đã qua kiểm tra" : latestScore !== null ? `Điểm gần nhất ${latestScore}%` : "Chưa kiểm tra"}</div>
                    <div className="h-1.5 rounded-full mt-3 overflow-hidden" style={{ background: active ? "rgba(29,78,216,0.16)" : "var(--border)" }}>
                      <div className="h-full rounded-full" style={{ width: `${passed ? 100 : pct}%`, background: passed ? "#16a34a" : active ? "var(--primary)" : "#94a3b8" }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {mode === "learn" && (
            <div className="grid gap-5" style={{ gridTemplateColumns: "minmax(0, 1fr) 270px" }}>
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Layers size={16} style={{ color: "var(--primary)" }} />
                        <span style={{ fontSize: "0.86rem", fontWeight: 800 }}>{currentTopic.title}</span>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.72rem", color: "var(--muted-foreground)" }}>{currentTopic.description}</p>
                    </div>
                    <span className="rounded-full px-3 py-1" style={{ background: "var(--accent)", color: "var(--primary)", fontSize: "0.72rem", fontWeight: 800 }}>
                      {index + 1}/{words.length}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-muted overflow-hidden mb-5">
                    <div className="h-full rounded-full" style={{ width: `${topicProgress}%`, background: "var(--primary)" }} />
                  </div>

                  <div className="relative" style={{ perspective: "1200px" }}>
                    <div
                      className="rounded-3xl border border-border cursor-pointer select-none"
                      style={{ background: "var(--card)", minHeight: 360, boxShadow: "0 4px 24px rgba(29,78,216,0.08)" }}
                      onClick={() => setFlipped((f) => !f)}
                    >
                      {!flipped ? (
                        <div className="flex flex-col items-center justify-center gap-5 p-8 text-center" style={{ minHeight: 360 }}>
                          <span className="rounded-full px-3 py-1" style={{ fontSize: "0.7rem", fontWeight: 800, background: `${currentColor}15`, color: currentColor }}>{word.category}</span>
                          <div>
                            <div style={{ fontSize: "3rem", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--foreground)", lineHeight: 1.05 }}>{word.word}</div>
                            <div className="flex items-center justify-center gap-3 mt-3">
                              <span style={{ fontSize: "1rem", color: "var(--muted-foreground)", fontStyle: "italic" }}>{word.phonetic}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); playAudio(word.word); }}
                                className="rounded-full flex items-center justify-center transition-all hover:scale-110"
                                style={{ width: 36, height: 36, background: "var(--primary)", border: "none", cursor: "pointer" }}
                              >
                                <Volume2 size={16} color="#fff" />
                              </button>
                            </div>
                            <span className="inline-block mt-3 rounded-full px-3 py-1" style={{ fontSize: "0.72rem", fontWeight: 700, background: `${posCol}15`, color: posCol }}>{word.partOfSpeech}</span>
                          </div>
                          <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                            <PronunceCheck target={word.word} />
                          </div>
                          <div className="rounded-full px-4 py-2" style={{ background: "var(--muted)", color: "var(--muted-foreground)", fontSize: "0.72rem" }}>Nhấn để xem nghĩa, ví dụ và mẹo nhớ</div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 p-6" style={{ minHeight: 360 }}>
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div style={{ fontSize: "1.45rem", fontWeight: 900, color: "var(--primary)" }}>{word.word}</div>
                              <div style={{ fontSize: "0.76rem", color: "var(--muted-foreground)", marginTop: 2 }}>{word.phonetic} · {word.partOfSpeech}</div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); playAudio(word.word); }} className="rounded-full flex items-center justify-center" style={{ width: 34, height: 34, border: "none", background: "var(--primary)", cursor: "pointer" }}>
                              <Volume2 size={15} color="#fff" />
                            </button>
                          </div>
                          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                            <div className="rounded-2xl p-4" style={{ background: "var(--muted)" }}>
                              <div style={{ fontSize: "0.67rem", fontWeight: 900, color: "var(--muted-foreground)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Nghĩa chính</div>
                              <div style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: 7 }}>{word.meaning}</div>
                            </div>
                            <div className="rounded-2xl p-4" style={{ background: "var(--muted)" }}>
                              <div style={{ fontSize: "0.67rem", fontWeight: 900, color: "var(--muted-foreground)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Cụm hay đi chung</div>
                              <div style={{ fontSize: "1rem", fontWeight: 800, marginTop: 7 }}>{word.collocation}</div>
                            </div>
                          </div>
                          <div className="rounded-2xl p-4" style={{ background: "#f8fafc", border: "1px solid var(--border)" }}>
                            <div style={{ fontSize: "0.7rem", fontWeight: 900, color: "var(--muted-foreground)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>Ví dụ TOEIC</div>
                            <p style={{ margin: 0, lineHeight: 1.55, fontSize: "0.9rem", color: "var(--foreground)" }}>{word.exampleEn}</p>
                            <p style={{ margin: "6px 0 0", lineHeight: 1.5, fontSize: "0.82rem", color: "var(--muted-foreground)", fontStyle: "italic" }}>{word.exampleVi}</p>
                          </div>
                          <div className="rounded-2xl p-4" style={{ background: `${currentColor}10`, border: `1px solid ${currentColor}24` }}>
                            <div className="flex items-start gap-2">
                              <Sparkles size={16} style={{ color: currentColor, marginTop: 2 }} />
                              <div>
                                <div style={{ fontSize: "0.75rem", fontWeight: 900, color: currentColor }}>Mẹo nhớ nhanh</div>
                                <div style={{ fontSize: "0.82rem", color: "var(--foreground)", marginTop: 4, lineHeight: 1.45 }}>{word.memoryTip}</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: 5 }}>Đồng nghĩa: <b>{word.synonym}</b></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 mt-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
                    <button onClick={() => markReview(word.id)} className="rounded-2xl py-3 flex items-center justify-center gap-2" style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", color: "#ea580c", cursor: "pointer", fontWeight: 800, fontSize: "0.82rem" }}>
                      <XCircle size={18} /> Chưa thuộc
                    </button>
                    <button onClick={() => markReview(word.id)} className="rounded-2xl py-3 flex items-center justify-center gap-2" style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)", cursor: "pointer", fontWeight: 800, fontSize: "0.82rem" }}>
                      <RotateCcw size={17} /> Học lại sau
                    </button>
                    <button onClick={() => markMastered(word.id)} className="rounded-2xl py-3 flex items-center justify-center gap-2" style={{ background: "var(--primary)", border: "1.5px solid var(--primary)", color: "#fff", cursor: "pointer", fontWeight: 800, fontSize: "0.82rem" }}>
                      <CheckCircle2 size={18} /> Đã thuộc
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-4">
                    <button onClick={() => { setIndex((i) => (i === 0 ? words.length - 1 : i - 1)); setFlipped(false); }} className="flex items-center gap-1 rounded-lg px-3 py-2" style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "0.78rem", color: "var(--muted-foreground)", fontWeight: 600 }}><ChevronLeft size={15} /> Trước</button>
                    <button onClick={goNext} className="flex items-center gap-1 rounded-lg px-3 py-2" style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "0.78rem", color: "var(--muted-foreground)", fontWeight: 600 }}>Tiếp <ChevronRight size={15} /></button>
                  </div>

                  {!canTakeTopicTest && (
                    <div className="rounded-2xl p-4 mt-5" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: 900, color: "#9a3412" }}>Chưa mở bài kiểm tra bắt buộc.</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--foreground)", marginTop: 5, lineHeight: 1.5 }}>Hãy học hết các từ trong topic này trước. Còn <b>{words.length - topicStudiedCount}</b> từ nữa, nút kiểm tra sẽ tự động hiện ra.</div>
                    </div>
                  )}

                  {canTakeTopicTest && !topicPassed && (
                    <div className="rounded-2xl p-4 mt-5" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: 900, color: "#1d4ed8" }}>Bạn đã học xong toàn bộ từ của chủ đề này.</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--foreground)", marginTop: 5, lineHeight: 1.5 }}>Bây giờ hệ thống mới hiện nút kiểm tra bắt buộc. Phải đạt từ {PASS_SCORE}% trở lên thì topic mới được tính là đã thuộc. Từ trả lời sai sẽ tự đưa vào mục ôn lại.</div>
                      <button onClick={() => setMode("quiz")} className="rounded-xl px-4 py-2 mt-3" style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 800, fontSize: "0.8rem" }}>Làm bài kiểm tra bắt buộc</button>
                    </div>
                  )}

                  {topicPassed && (
                    <div className="rounded-2xl p-4 mt-5" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: 900, color: "#166534" }}>Chủ đề này đã hoàn thành.</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--foreground)", marginTop: 5 }}>Điểm kiểm tra gần nhất: <b>{latestTopicScore ?? 0}%</b>. Bạn vẫn có thể làm lại để tăng điểm.</div>
                      <button onClick={() => setMode("quiz")} className="rounded-xl px-4 py-2 mt-3" style={{ background: "#16a34a", color: "#fff", border: "none", cursor: "pointer", fontWeight: 800, fontSize: "0.8rem" }}>Làm lại bài kiểm tra</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-border p-4" style={{ background: "var(--card)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} style={{ color: "var(--primary)" }} />
                    <div style={{ fontSize: "0.86rem", fontWeight: 900 }}>Mục tiêu chủ đề</div>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>{currentTopic.target}</p>
                  <div className="mt-4">
                    <div className="flex justify-between" style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--muted-foreground)" }}><span>Đã học</span><span>{topicStudiedCount}/{words.length} từ</span></div>
                    <div className="h-2 rounded-full mt-2 overflow-hidden" style={{ background: "var(--muted)" }}><div className="h-full rounded-full" style={{ width: `${topicLearnProgress}%`, background: topicPassed ? "#16a34a" : "var(--primary)" }} /></div>
                    <div className="rounded-xl p-3 mt-3" style={{ background: topicPassed ? "#f0fdf4" : topicLearnProgress === 100 ? "#eff6ff" : "var(--muted)", border: topicPassed ? "1px solid #bbf7d0" : "1px solid var(--border)" }}>
                      <div style={{ fontSize: "0.73rem", fontWeight: 900, color: topicPassed ? "#166534" : "var(--foreground)" }}>{topicPassed ? "Đã qua bài kiểm tra" : topicLearnProgress === 100 ? "Đã mở bài kiểm tra" : "Cần học hết từ trước"}</div>
                      <div style={{ fontSize: "0.68rem", color: "var(--muted-foreground)", marginTop: 3 }}>{latestTopicScore !== null ? `Điểm gần nhất: ${latestTopicScore}%` : `Điểm đạt yêu cầu: ${PASS_SCORE}%`}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border p-4" style={{ background: "var(--card)" }}>
                  <div className="flex items-center gap-2 mb-3"><ClipboardCheck size={16} style={{ color: "var(--primary)" }} /><div style={{ fontSize: "0.86rem", fontWeight: 900 }}>Việc cần làm hôm nay</div></div>
                  <div className="flex flex-col gap-2">
                    {dailyTasks.map((task) => {
                      const done = !!state.doneTasks[task.key] || (task.key.startsWith("learn") && state.studyCount >= DAILY_TARGET);
                      return (
                        <button key={task.key} onClick={() => toggleTask(task.key)} className="rounded-xl p-3 text-left flex items-start gap-3" style={{ border: "1px solid var(--border)", background: done ? "#f0fdf4" : "var(--card)", cursor: "pointer" }}>
                          {done ? <CheckSquare size={16} style={{ color: "#16a34a", marginTop: 2 }} /> : <Square size={16} style={{ color: "var(--muted-foreground)", marginTop: 2 }} />}
                          <div>
                            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: done ? "#166534" : "var(--foreground)" }}>{task.label}</div>
                            <div style={{ fontSize: "0.68rem", color: "var(--muted-foreground)", marginTop: 2 }}>{task.hint}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--muted-foreground)", marginTop: 10 }}>{reviewedToday}/4 đầu mục đã hoàn thành.</div>
                </div>
              </div>
            </div>
          )}

          {mode === "quiz" && (
            <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
              {!canTakeTopicTest ? (
                <div className="rounded-3xl p-8 text-center" style={{ background: "var(--muted)" }}>
                  <Brain size={38} style={{ color: "var(--primary)", margin: "0 auto 12px" }} />
                  <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--foreground)" }}>Bài kiểm tra đang bị khóa</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: 6, lineHeight: 1.55 }}>Bạn cần học hết {words.length} từ trong chủ đề này trước. Hiện tại bạn mới học {topicStudiedCount}/{words.length} từ.</div>
                  <button onClick={() => setMode("learn")} className="rounded-xl px-4 py-2 mt-5" style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 800, fontSize: "0.82rem" }}>Quay lại học tiếp</button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div>
                      <div className="flex items-center gap-2"><Brain size={17} style={{ color: "var(--primary)" }} /><h3 style={{ margin: 0, fontSize: "1rem" }}>Bài kiểm tra bắt buộc: {currentTopic.title}</h3></div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.74rem", color: "var(--muted-foreground)" }}>Học xong chủ đề phải đạt từ {PASS_SCORE}% trở lên mới tính là đã thuộc. Trả lời sai sẽ tự đưa từ vào mục cần ôn.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full px-3 py-1" style={{ background: topicPassed ? "#dcfce7" : "var(--accent)", color: topicPassed ? "#166534" : "var(--primary)", fontSize: "0.72rem", fontWeight: 800 }}>{topicPassed ? "Đã đạt" : "Chưa đạt"}</span>
                      <span className="rounded-full px-3 py-1" style={{ background: "var(--accent)", color: "var(--primary)", fontSize: "0.72rem", fontWeight: 800 }}>Câu {quizIndex + 1}/{quizWords.length}</span>
                    </div>
                  </div>

                  {latestTopicScore !== null && (
                    <div className="rounded-2xl p-4 mb-4" style={{ background: latestTopicScore >= PASS_SCORE ? "#f0fdf4" : "#fff7ed", border: latestTopicScore >= PASS_SCORE ? "1px solid #bbf7d0" : "1px solid #fed7aa" }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 900, color: latestTopicScore >= PASS_SCORE ? "#166534" : "#9a3412" }}>Kết quả gần nhất: {latestTopicScore}%</div>
                      <div style={{ fontSize: "0.74rem", color: "var(--muted-foreground)", marginTop: 3 }}>{latestTopicScore >= PASS_SCORE ? "Đã đủ điều kiện hoàn thành chủ đề." : "Chưa đạt, hãy ôn lại các từ sai rồi làm lại."}</div>
                    </div>
                  )}

                  {quizWord && (
                    <div className="rounded-3xl p-6" style={{ background: "var(--muted)" }}>
                      <div className="text-center mb-5">
                        <div style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>Từ này nghĩa là gì?</div>
                        <div style={{ fontSize: "2.3rem", fontWeight: 900, color: "var(--foreground)", marginTop: 6 }}>{quizWord.word}</div>
                        <button onClick={() => playAudio(quizWord.word)} className="mt-3 rounded-full px-3 py-2 inline-flex items-center gap-2" style={{ border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 800 }}><Volume2 size={14} /> Nghe phát âm</button>
                      </div>

                      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
                        {quizOptions.map((option) => {
                          const isSelected = selectedAnswer === option;
                          const isCorrect = option === quizWord.meaning;
                          const showCorrect = selectedAnswer && isCorrect;
                          const showWrong = isSelected && !isCorrect;
                          return (
                            <button key={option} disabled={!!selectedAnswer} onClick={() => submitAnswer(option)} className="rounded-2xl p-4 text-left transition-all" style={{
                              border: showCorrect ? "1.5px solid #16a34a" : showWrong ? "1.5px solid #dc2626" : "1px solid var(--border)",
                              background: showCorrect ? "#f0fdf4" : showWrong ? "#fef2f2" : "var(--card)",
                              color: "var(--foreground)", cursor: selectedAnswer ? "default" : "pointer", fontSize: "0.86rem", fontWeight: 800,
                            }}>
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {selectedAnswer && (
                        <div className="rounded-2xl p-4 mt-5" style={{ background: answerResult === "correct" ? "#f0fdf4" : "#fff7ed", border: answerResult === "correct" ? "1px solid #bbf7d0" : "1px solid #fed7aa" }}>
                          <div style={{ fontSize: "0.86rem", fontWeight: 900, color: answerResult === "correct" ? "#166534" : "#9a3412" }}>{answerResult === "correct" ? "Chính xác!" : "Chưa đúng, từ này sẽ được đưa vào mục cần ôn nếu hết bài vẫn sai."}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--foreground)", marginTop: 5 }}>Đáp án: <b>{quizWord.meaning}</b></div>
                          <div style={{ fontSize: "0.76rem", color: "var(--muted-foreground)", marginTop: 5 }}>{quizWord.exampleEn}</div>
                          <button onClick={nextQuiz} className="rounded-xl px-4 py-2 mt-4" style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 800, fontSize: "0.8rem" }}>{quizIndex + 1 >= quizWords.length ? "Nộp bài & xem kết quả" : "Câu tiếp theo"}</button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}


          {mode === "review" && (
            <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2"><CalendarClock size={17} style={{ color: "var(--primary)" }} /><h3 style={{ margin: 0, fontSize: "1rem" }}>Từ cần ôn lại</h3></div>
                  <p style={{ margin: "4px 0 0", fontSize: "0.74rem", color: "var(--muted-foreground)" }}>Từ sai hoặc từ đến hạn ôn sẽ nằm ở đây. Bấm “Đã thuộc” để dời lịch ôn sau 3 ngày.</p>
                </div>
                <button onClick={() => setState((s) => ({ ...s, doneTasks: { ...s.doneTasks, [`review-${todayKey()}`]: true } }))} className="rounded-xl px-3 py-2" style={{ background: "var(--accent)", color: "var(--primary)", border: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: 800 }}>Đánh dấu đã ôn</button>
              </div>

              {dueReviewWords.length === 0 ? (
                <div className="rounded-2xl p-8 text-center" style={{ background: "var(--muted)" }}>
                  <Star size={34} style={{ color: "var(--primary)", margin: "0 auto 10px" }} />
                  <div style={{ fontSize: "1rem", fontWeight: 900 }}>Không có từ cần ôn hôm nay</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", marginTop: 4 }}>Bạn có thể học thêm chủ đề mới hoặc làm quiz để kiểm tra.</div>
                </div>
              ) : (
                <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
                  {dueReviewWords.map((w) => (
                    <div key={w.id} className="rounded-2xl border border-border p-4" style={{ background: "var(--card)" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div style={{ fontSize: "1rem", fontWeight: 900, color: "var(--foreground)" }}>{w.word}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", marginTop: 2 }}>{w.phonetic} · {w.category}</div>
                        </div>
                        <button onClick={() => playAudio(w.word)} className="rounded-full flex items-center justify-center" style={{ width: 30, height: 30, border: "none", background: "var(--muted)", cursor: "pointer", color: "var(--primary)" }}><Volume2 size={14} /></button>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--foreground)", marginTop: 10, fontWeight: 700 }}>{w.meaning}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: 6, lineHeight: 1.45 }}>{w.exampleEn}</div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <button onClick={() => markReview(w.id)} className="rounded-xl py-2" style={{ border: "1px solid #fed7aa", background: "#fff7ed", color: "#ea580c", cursor: "pointer", fontWeight: 800, fontSize: "0.74rem" }}>Vẫn chưa thuộc</button>
                        <button onClick={() => markMastered(w.id)} className="rounded-xl py-2" style={{ border: "1px solid var(--primary)", background: "var(--primary)", color: "#fff", cursor: "pointer", fontWeight: 800, fontSize: "0.74rem" }}>Đã thuộc</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {mode === "notebook" && (
            <div className="rounded-2xl border border-border p-5" style={{ background: "var(--card)" }}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--muted)", flex: 1, minWidth: 220 }}>
                  <Search size={15} style={{ color: "var(--muted-foreground)" }} />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm từ, nghĩa, chủ đề..." style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: "0.82rem", color: "var(--foreground)" }} />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={15} style={{ color: "var(--muted-foreground)" }} />
                  {(["all", "mastered", "review", "wrong"] as const).map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className="rounded-xl px-3 py-2" style={{ border: filter === f ? "1px solid var(--primary)" : "1px solid var(--border)", background: filter === f ? "var(--accent)" : "var(--card)", color: filter === f ? "var(--primary)" : "var(--muted-foreground)", cursor: "pointer", fontSize: "0.72rem", fontWeight: 800 }}>
                      {f === "all" ? "Tất cả" : f === "mastered" ? "Đã thuộc" : f === "review" ? "Cần ôn" : "Từ sai"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
                {filteredNotebookWords.map((w) => {
                  const status = masteredSet.has(w.id) ? "Đã thuộc" : wrongSet.has(w.id) ? "Từ sai" : reviewSet.has(w.id) ? "Cần ôn" : "Chưa học";
                  const tone = masteredSet.has(w.id) ? "#16a34a" : wrongSet.has(w.id) ? "#dc2626" : reviewSet.has(w.id) ? "#ea580c" : "var(--muted-foreground)";
                  return (
                    <div key={w.id} className="rounded-2xl border border-border p-4" style={{ background: "var(--card)" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div style={{ fontSize: "1rem", fontWeight: 900 }}>{w.word}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", marginTop: 2 }}>{w.phonetic} · {w.partOfSpeech}</div>
                        </div>
                        <span className="rounded-full px-2 py-1" style={{ background: `${tone}15`, color: tone, fontSize: "0.65rem", fontWeight: 900 }}>{status}</span>
                      </div>
                      <div style={{ fontSize: "0.86rem", fontWeight: 800, marginTop: 10 }}>{w.meaning}</div>
                      <div style={{ fontSize: "0.74rem", color: "var(--muted-foreground)", marginTop: 6, lineHeight: 1.45 }}>{w.collocation} · {w.exampleEn}</div>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <button onClick={() => playAudio(w.word)} className="rounded-xl py-2" style={{ border: "1px solid var(--border)", background: "var(--muted)", cursor: "pointer", fontSize: "0.7rem", fontWeight: 800, color: "var(--primary)" }}>Nghe</button>
                        <button onClick={() => markReview(w.id)} className="rounded-xl py-2" style={{ border: "1px solid #fed7aa", background: "#fff7ed", cursor: "pointer", fontSize: "0.7rem", fontWeight: 800, color: "#ea580c" }}>Cần ôn</button>
                        <button onClick={() => markMastered(w.id)} className="rounded-xl py-2" style={{ border: "1px solid var(--primary)", background: "var(--primary)", cursor: "pointer", fontSize: "0.7rem", fontWeight: 800, color: "#fff" }}>Đã thuộc</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <aside className="hidden lg:flex flex-col gap-4">
          <div className="rounded-2xl border border-border p-4" style={{ background: "var(--card)" }}>
            <div className="flex items-center gap-2 mb-3"><Flame size={16} style={{ color: "#ea580c" }} /><div style={{ fontSize: "0.9rem", fontWeight: 900 }}>Cách học để thuộc</div></div>
            <div className="flex flex-col gap-3">
              {[
                ["1", "Nhìn từ + nghe phát âm"],
                ["2", "Lật thẻ xem nghĩa và ví dụ"],
                ["3", "Bấm Đã thuộc hoặc Chưa thuộc"],
                ["4", "Học đủ topic rồi bấm kiểm tra bắt buộc"],
                ["5", "Ôn lại từ sai mỗi ngày"],
              ].map(([num, text]) => (
                <div key={num} className="flex items-center gap-3">
                  <div className="rounded-full flex items-center justify-center" style={{ width: 26, height: 26, background: "var(--accent)", color: "var(--primary)", fontSize: "0.72rem", fontWeight: 900 }}>{num}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--foreground)", fontWeight: 700 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border p-4" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", color: "#fff" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 900 }}>Quy tắc nhớ lâu</div>
            <p style={{ fontSize: "0.76rem", lineHeight: 1.55, color: "#dbeafe", margin: "8px 0 0" }}>
              Từ nào sai sẽ quay lại ngay hôm nay. Từ nào thuộc sẽ được hẹn ôn sau 3 ngày. Cứ học theo vòng này thì không cần backend vẫn mô phỏng được app học thật.
            </p>
          </div>

          <div className="rounded-2xl border border-border p-4" style={{ background: "var(--card)" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 900, marginBottom: 3 }}>Thao tác demo</div>
            <p style={{ margin: "0 0 12px", fontSize: "0.72rem", color: "var(--muted-foreground)", lineHeight: 1.45 }}>Dữ liệu lưu trên trình duyệt bằng localStorage.</p>
            <button onClick={resetDemo} className="w-full rounded-xl py-2 flex items-center justify-center gap-2" style={{ background: "var(--muted)", border: "1px solid var(--border)", cursor: "pointer", color: "var(--foreground)", fontSize: "0.78rem", fontWeight: 800 }}><RotateCcw size={14} /> Reset demo</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
