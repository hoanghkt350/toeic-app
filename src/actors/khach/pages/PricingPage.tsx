import { useState } from 'react';
import { Button, Badge } from '@figma/astraui';
import { Check, X, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useOutletContext } from 'react-router';

function FAQItem({ question, answer, defaultExpanded = false }: { question: string, answer: string, defaultExpanded?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-brand-tertiary rounded-xl border border-border overflow-hidden">
      <button 
        className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="font-semibold text-text-primary">{question}</h4>
        {isExpanded ? (
          <ChevronUp className="text-text-secondary shrink-0" size={20} />
        ) : (
          <ChevronDown className="text-text-secondary shrink-0" size={20} />
        )}
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 pt-0">
          <p className="text-text-secondary">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function PricingPage() {
  const { openSignup } = useOutletContext<{ openSignup: () => void }>();

  return (
    <div className="flex-1 bg-surface-bg py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Nâng cấp để tối đa hóa điểm số</h1>
          <p className="text-lg text-text-secondary">Chọn gói phù hợp với mục tiêu học tập của bạn. Bắt đầu miễn phí và nâng cấp bất cứ lúc nào.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Card */}
          <div className="bg-brand-tertiary rounded-2xl p-8 border border-border flex flex-col">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Tài khoản Khách</h2>
            <p className="text-text-secondary mb-6 h-12">Trải nghiệm các tính năng cơ bản hoàn toàn miễn phí.</p>
            
            <div className="text-4xl font-bold text-text-primary mb-8">
              0đ<span className="text-lg font-normal text-text-secondary">/tháng</span>
            </div>

            <Button variant="neutral" className="w-full mb-8 justify-center" onClick={openSignup}>
              Tạo tài khoản miễn phí
            </Button>

            <div className="flex flex-col gap-4 mt-auto">
              <div className="flex items-start gap-3">
                <Check className="text-green-500 shrink-0 mt-0.5" size={20} />
                <span className="text-text-secondary">Truy cập 20% thư viện đề thi</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-green-500 shrink-0 mt-0.5" size={20} />
                <span className="text-text-secondary">Chấm điểm tự động (Chỉ hiện điểm số)</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="text-text-tertiary shrink-0 mt-0.5" size={20} />
                <span className="text-text-tertiary line-through decoration-text-tertiary/50">Giải thích đáp án bằng AI</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="text-text-tertiary shrink-0 mt-0.5" size={20} />
                <span className="text-text-tertiary line-through decoration-text-tertiary/50">Phân tích điểm yếu chuyên sâu</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="text-text-tertiary shrink-0 mt-0.5" size={20} />
                <span className="text-text-tertiary line-through decoration-text-tertiary/50">Lộ trình học tập cá nhân hóa</span>
              </div>
            </div>
          </div>

          {/* Pro Card */}
          <div className="bg-surface-bg rounded-2xl p-8 border-2 border-brand-primary shadow-xl flex flex-col relative transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge label="Phổ biến nhất" variant="brand" />
            </div>

            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold text-text-primary">Gói Pro</h2>
              <Sparkles className="text-brand-primary" size={24} />
            </div>
            
            <p className="text-text-secondary mb-6 h-12">Mở khóa toàn bộ sức mạnh của AI để chinh phục mục tiêu 900+.</p>
            
            <div className="text-4xl font-bold text-text-primary mb-8">
              199.000đ<span className="text-lg font-normal text-text-secondary">/tháng</span>
            </div>

            <Button variant="primary" className="w-full mb-8 justify-center" onClick={openSignup}>
              Mua ngay
            </Button>

            <div className="flex flex-col gap-4 mt-auto">
              <div className="flex items-start gap-3">
                <Check className="text-brand-primary shrink-0 mt-0.5" size={20} />
                <span className="text-text-primary font-medium">Truy cập 100% thư viện đề thi (Hơn 500+ đề)</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-brand-primary shrink-0 mt-0.5" size={20} />
                <span className="text-text-primary font-medium">Chấm điểm & giải thích chi tiết từng câu bằng AI</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-brand-primary shrink-0 mt-0.5" size={20} />
                <span className="text-text-primary font-medium">Báo cáo phân tích điểm yếu chuyên sâu</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-brand-primary shrink-0 mt-0.5" size={20} />
                <span className="text-text-primary font-medium">Lộ trình học tập cá nhân hóa theo mục tiêu</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-brand-primary shrink-0 mt-0.5" size={20} />
                <span className="text-text-primary font-medium">Không có quảng cáo</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-text-primary text-center mb-8">Các câu hỏi thường gặp</h3>
          <div className="space-y-4">
            <FAQItem 
              question="Gói Pro có thời hạn sử dụng bao lâu?"
              answer="Gói Pro có thời hạn sử dụng trong vòng 6 tháng hoặc 1 năm tùy vào gói bạn chọn, tính từ ngày thanh toán thành công."
              defaultExpanded={true}
            />
            <FAQItem 
              question="Tôi có thể thanh toán qua các hình thức nào?"
              answer="Momo, VNPay, Chuyển khoản ngân hàng."
            />
            <FAQItem 
              question="Có được hoàn tiền nếu không hài lòng không?"
              answer="Chính sách hoàn tiền 100% trong 7 đầu tiên nếu bạn không hài lòng với dịch vụ."
            />
          </div>
        </div>
      </div>
    </div>
  );
}