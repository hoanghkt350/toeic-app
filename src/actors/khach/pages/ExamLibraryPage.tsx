import { useState } from 'react';
import { Button, SelectField, Badge, SearchComponent, Tabs } from '@figma/astraui';
import { Lock, Clock, FileText, PlayCircle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

// Mock data for exams
const exams = [
  { id: 1, title: 'ETS TOEIC 2024 Test 1', year: '2024', type: 'full', questions: 200, attempts: 12500, isFree: true },
  { id: 2, title: 'ETS TOEIC 2024 Test 2', year: '2024', type: 'full', questions: 200, attempts: 8300, isFree: false },
  { id: 3, title: 'Mini Test LC Part 1 & 2', year: '2024', type: 'mini', questions: 36, attempts: 15200, isFree: true },
  { id: 4, title: 'Luyện nghe Part 3 - 2023', year: '2023', type: 'skill', questions: 39, attempts: 45000, isFree: false },
  { id: 5, title: 'Ngữ pháp cơ bản - Bài 1', year: '2024', type: 'grammar', questions: 40, attempts: 9100, isFree: false },
  { id: 6, title: 'ETS TOEIC 2023 Test 1', year: '2023', type: 'full', questions: 200, attempts: 56000, isFree: true },
];

const mockQuestions = [
  {
    id: 1,
    question: "The management team ______ the new policy tomorrow.",
    options: [
      { id: 'A', text: "announce" },
      { id: 'B', text: "will announce" },
      { id: 'C', text: "announced" },
      { id: 'D', text: "announces" },
    ],
    correctAnswer: 'B',
    explanation: "Chọn B vì có trạng từ chỉ thời gian ở tương lai là 'tomorrow' (ngày mai), nên động từ bắt buộc phải chia ở thì tương lai đơn."
  },
  {
    id: 2,
    question: "The new branch office is located ______ the intersection of Main Street and 5th Avenue.",
    options: [
      { id: 'A', text: "at" },
      { id: 'B', text: "in" },
      { id: 'C', text: "on" },
      { id: 'D', text: "to" },
    ],
    correctAnswer: 'A',
    explanation: "Chọn A. Cụm từ 'at the intersection of' (tại ngã tư) là một cụm giới từ cố định chỉ một địa điểm cụ thể. Không dùng 'in' vì 'in' thường chỉ dùng cho không gian rộng lớn (thành phố, quốc gia) hoặc không gian khép kín."
  },
  {
    id: 3,
    question: "All employees must ______ their identification badges when entering the building.",
    options: [
      { id: 'A', text: "display" },
      { id: 'B', text: "displaying" },
      { id: 'C', text: "displayed" },
      { id: 'D', text: "displays" },
    ],
    correctAnswer: 'A',
    explanation: "Chọn A. Theo quy tắc ngữ pháp, đằng sau động từ khuyết thiếu 'must' (phải), ta cần một động từ nguyên thể không chia (bare infinitive). Do đó 'display' (xuất trình, hiển thị) là đáp án hoàn toàn chính xác."
  }
];

function InteractiveQuestion({ data, index }: { data: typeof mockQuestions[0], index: number }) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (id: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(id);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setIsSubmitted(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-8 rounded-2xl bg-surface-bg border border-border shadow-sm flex flex-col gap-6"
    >
      <div className="flex gap-4 items-start">
        <span className="font-bold text-lg text-brand-primary whitespace-nowrap">Câu {index + 1}:</span>
        <p className="text-lg text-text-primary font-medium leading-relaxed">{data.question}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 pl-0 md:pl-16">
        {data.options.map((opt) => {
          const isSelected = selectedAnswer === opt.id;
          const isCorrect = opt.id === data.correctAnswer;
          
          let stateClass = "border-border bg-surface-bg text-text-secondary hover:border-brand-primary/30 cursor-pointer";
          let icon = null;
          let dot = <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-brand-primary' : 'bg-transparent'}`}></div>;

          if (isSubmitted) {
            stateClass = "border-border bg-surface-bg text-text-secondary opacity-70 cursor-default";
            dot = <div className="w-2 h-2 rounded-full bg-transparent"></div>;

            if (isCorrect) {
              stateClass = "border-green-200 bg-green-50 text-green-700 font-medium";
              dot = <div className="w-2 h-2 rounded-full bg-green-500"></div>;
              icon = <CheckCircle size={20} className="ml-auto text-green-500 shrink-0" />;
            } else if (isSelected && !isCorrect) {
              stateClass = "border-red-200 bg-red-50 text-red-700 font-medium";
              dot = <div className="w-2 h-2 rounded-full bg-red-500"></div>;
              icon = <XCircle size={20} className="ml-auto text-red-500 shrink-0" />;
            }
          } else if (isSelected) {
            stateClass = "border-brand-primary bg-brand-primary/5 text-brand-primary font-medium shadow-sm";
          }

          return (
            <div 
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${stateClass}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ${isSubmitted ? (isCorrect ? 'border-green-500' : (isSelected ? 'border-red-500' : 'border-border')) : (isSelected ? 'border-brand-primary' : 'border-border')}`}>
                {dot}
              </div>
              <span className="text-base">({opt.id}) {opt.text}</span>
              {icon}
            </div>
          );
        })}
      </div>
      
      {!isSubmitted ? (
        <div className="pl-0 md:pl-16 mt-2 flex">
          <Button 
            variant={selectedAnswer ? "primary" : "neutral"} 
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full md:w-auto px-8"
          >
            Nộp câu trả lời & Xem giải thích
          </Button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 p-5 rounded-xl bg-brand-primary/5 border border-brand-primary/20 flex gap-4 items-start md:ml-16 overflow-hidden"
        >
           <Lightbulb className="text-brand-primary shrink-0 mt-0.5" size={22} />
           <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-text-primary">Giải thích chi tiết:</span>
              <p className="text-text-secondary leading-relaxed">{data.explanation}</p>
           </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function ExamLibraryPage() {
  const navigate = useNavigate();
  const [year, setYear] = useState('all');
  const [category, setCategory] = useState('full');
  const [search, setSearch] = useState('');

  const filteredExams = exams.filter(exam => {
    if (year !== 'all' && exam.year !== year) return false;
    if (category !== 'all' && exam.type !== category) return false;
    if (search && !exam.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex-1 bg-brand-tertiary">
      <div className="bg-surface-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Thư viện Đề thi</h1>
          <p className="text-text-secondary mb-8">Luyện tập với hàng trăm đề thi được cập nhật liên tục bám sát cấu trúc thi thật.</p>
          
          <Tabs
            tabs={[
              { id: 'full', label: 'Full Test ETS', content: null },
              { id: 'mini', label: 'Mini Test', content: null },
              { id: 'skill', label: 'Luyện theo kỹ năng (Reading/Listening)', content: null },
              { id: 'grammar', label: 'Ngữ pháp & Từ vựng', content: null },
            ]}
            defaultTab={category}
            onChange={setCategory}
            className="mb-8"
          />

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <div className="flex-1 max-w-md">
              <SearchComponent 
                placeholder="Tìm kiếm tên đề thi..." 
                value={search}
                onChange={setSearch} 
              />
            </div>
            <div className="w-full md:w-48">
              <SelectField
                options={[
                  { value: 'all', label: 'Tất cả năm' },
                  { value: '2024', label: 'Năm 2024' },
                  { value: '2023', label: 'Năm 2023' },
                ]}
                value={year}
                onChange={setYear}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredExams.map((exam) => (
            <div key={exam.id} className="bg-surface-bg rounded-xl border border-border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <Badge 
                    label={exam.isFree ? "Miễn phí" : "Pro"} 
                    variant={exam.isFree ? "success" : "brand"} 
                  />
                  {!exam.isFree && <Lock size={16} className="text-text-secondary" />}
                </div>
                
                <h3 className="text-lg font-semibold text-text-primary">{exam.title}</h3>
                
                <div className="flex flex-wrap gap-y-2 gap-x-4 mt-auto pt-4 text-sm text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <FileText size={14} />
                    <span>{exam.questions} câu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{exam.type === 'full' ? '120 phút' : '30 phút'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PlayCircle size={14} />
                    <span>{exam.attempts.toLocaleString()} lượt làm</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-border bg-brand-tertiary/50">
                {exam.isFree ? (
                  <Button 
                    variant="primary" 
                    className="w-full justify-center"
                    onClick={() => navigate('/khach/test')}
                  >
                    Làm bài ngay
                  </Button>
                ) : (
                  <Button 
                    variant="neutral" 
                    className="w-full justify-center text-text-secondary"
                    iconStart={<Lock size={16} />}
                    onClick={() => navigate('/khach/pricing')}
                  >
                    Nâng cấp để mở khóa
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredExams.length === 0 && (
          <div className="text-center py-20 bg-surface-bg rounded-xl border border-border mb-16">
            <p className="text-text-secondary mb-4">Không tìm thấy đề thi phù hợp với bộ lọc.</p>
            <Button variant="neutral" onClick={() => { setYear('all'); setSearch(''); }}>
              Xóa bộ lọc
            </Button>
          </div>
        )}

        {/* Test Experience Section */}
        <div className="max-w-5xl mx-auto py-16 border-t border-border">
          <div className="text-center mb-16 w-full max-w-3xl mx-auto">
            <Badge label="Trải nghiệm tính năng" variant="brand" className="mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Làm quen với AI chấm điểm
            </h2>
            <p className="text-text-secondary text-lg">
              Hãy thử trả lời các câu hỏi dưới đây để xem cách TOEIC Pro phân tích và giải thích tận gốc từng lỗi sai giúp bạn học nhanh hơn.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {mockQuestions.map((q, index) => (
              <InteractiveQuestion key={q.id} data={q} index={index} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
