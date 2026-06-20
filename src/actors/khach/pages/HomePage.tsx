import { Button, Badge, InputField } from '@figma/astraui';
import { ArrowRight, BrainCircuit, BookCheck, LineChart, Star, GraduationCap, Briefcase, Backpack, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-tertiary pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-16">
          <div className="flex flex-col items-center gap-6 z-10 max-w-4xl mx-auto">
            <Badge label="Nền tảng luyện thi thông minh" variant="brand" />
            <h1 className="text-5xl font-bold text-text-primary leading-tight tracking-tight">
              Mọi thứ bạn cần để đạt điểm cao.
            </h1>
            <p className="w-full max-w-3xl mx-auto text-center text-lg text-text-secondary leading-relaxed">
              Trải nghiệm phương pháp học tập hiện đại giúp tiết kiệm 50% thời gian ôn luyện.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-6 w-full max-w-lg mx-auto">
              <div className="flex-1">
                <InputField 
                  placeholder="Nhập địa chỉ email của bạn..." 
                />
              </div>
              <Button 
                variant="primary" 
                size="medium"
                iconEnd={<ArrowRight size={16} />}
                onClick={() => navigate('/khach/exams')}
                className="px-8 whitespace-nowrap shrink-0"
              >
                Học thử miễn phí ngay
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border/50 justify-center">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-tertiary bg-surface-bg flex items-center justify-center text-xs font-medium text-text-secondary">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <span className="text-sm font-medium text-text-secondary mt-1">Hơn <strong className="text-text-primary">10,000+</strong> học viên tin dùng</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 w-full max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-surface-bg">
              <img 
                src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&q=80" 
                alt="Student studying with laptop" 
                className="w-full h-auto object-cover aspect-[21/9]"
              />
              <div className="absolute bottom-6 left-6 bg-surface-bg/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-border flex items-center gap-4 text-left">
                <div className="bg-brand-primary/10 p-3 rounded-full text-brand-primary">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Điểm dự kiến: 850+</p>
                  <p className="text-sm text-text-secondary">AI đang phân tích lộ trình...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-24 bg-surface-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              Lộ trình TOEIC thiết kế riêng cho từng mục tiêu
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 rounded-2xl bg-surface-bg border border-border shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2">
                <Backpack size={24} />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Học sinh THPT</h3>
              <p className="text-text-secondary leading-relaxed">
                Nắm chắc kiến thức nền tảng, bứt phá điểm số để xét tuyển thẳng vào Đại học.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 rounded-2xl bg-surface-bg border border-border shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-2">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Sinh viên</h3>
              <p className="text-text-secondary leading-relaxed">
                Dễ dàng đạt chuẩn đầu ra ngoại ngữ và sở hữu CV ấn tượng trong mắt nhà tuyển dụng.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 rounded-2xl bg-surface-bg border border-border shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-2">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold text-text-primary">Người đi làm</h3>
              <p className="text-text-secondary leading-relaxed">
                Cải thiện giao tiếp tiếng Anh công sở, tự tin đàm phán và mở rộng cơ hội thăng tiến.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 rounded-2xl bg-brand-tertiary border border-border flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">Chấm điểm bằng AI</h3>
              <p className="text-text-secondary">Nhận điểm số ngay lập tức cùng với giải thích chi tiết cho từng câu hỏi sai, giúp bạn hiểu rõ lý do và tránh lặp lại.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 rounded-2xl bg-brand-tertiary border border-border flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
                <BookCheck size={24} />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">Đề thi ETS 2024 mới nhất</h3>
              <p className="text-text-secondary">Thư viện hàng trăm đề thi được cập nhật liên tục bám sát cấu trúc thi thật, đảm bảo bạn không bị bỡ ngỡ.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 rounded-2xl bg-brand-tertiary border border-border flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <LineChart size={24} />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">Phân tích điểm yếu</h3>
              <p className="text-text-secondary">Hệ thống tự động theo dõi tiến độ và chỉ ra những phần bạn cần cải thiện để tập trung ôn luyện hiệu quả nhất.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-brand-tertiary border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Câu chuyện thành công</h2>
            <p className="text-text-secondary">Hàng ngàn học viên đã đạt mục tiêu nhờ TOEIC Pro.</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6 overflow-x-auto pb-4">
            {[
              { name: "Nguyễn Bùi Minh Phi", score: "900+", text: "Nền tảng tuyệt vời! Nhờ các bài thi sát với thực tế và phần giải thích chi tiết của AI, mình đã tự tin hơn rất nhiều khi đi thi thật." },
              { name: "Đỗ Mạnh Duy", score: "850+", text: "Giao diện làm bài thi rất giống với thi trên máy tính của IIG. Mình thích nhất tính năng phân tích điểm yếu giúp tiết kiệm thời gian ôn." },
              { name: "Nguyễn Phan Việt Hoàng", score: "950+", text: "Thư viện đề đa dạng, update liên tục các format mới. Gói Pro hoàn toàn xứng đáng với số tiền bỏ ra. Rất khuyến khích các bạn dùng thử." },
              { name: "Nguyễn Hoàng Khiêm", score: "880+", text: "Phương pháp học tập hiện đại, giúp mình tiết kiệm rất nhiều thời gian. Chấm điểm AI cực kỳ chính xác và nhanh chóng." },
              { name: "Ngô Gia Huy", score: "920+", text: "Hệ thống bài tập phong phú, giải thích rất dễ hiểu. Nhờ TOEIC Pro mà mình đã đạt điểm số cao hơn mong đợi rất nhiều." },
            ].map((testimonial, i) => (
              <div key={i} className="bg-surface-bg p-6 rounded-2xl border border-border flex flex-col gap-4 min-w-[280px]">
                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p className="text-text-secondary flex-grow text-sm">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary shrink-0">
                    {testimonial.name.split(' ').pop()?.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-text-primary text-sm truncate">{testimonial.name}</p>
                    <p className="text-xs text-brand-primary font-medium">Đạt TOEIC {testimonial.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}