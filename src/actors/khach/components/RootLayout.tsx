import { Outlet, Link, useLocation } from 'react-router';
import { Button, Modal, InputField } from '@figma/astraui';
import { BookOpen, UserCircle2, Facebook, Phone } from 'lucide-react';
import { useState } from 'react';

export function RootLayout() {
  const location = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot_password'>('login');

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setIsAuthOpen(true);
  };

  const getModalTitle = () => {
    if (authMode === 'forgot_password') return 'Khôi phục mật khẩu';
    return authMode === 'login' ? 'Đăng nhập vào TOEIC Pro' : 'Tạo tài khoản miễn phí';
  };

  return (
    <div className="min-h-screen bg-brand-tertiary flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-surface-bg border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-xl">
            <Link to="/khach" className="flex items-center gap-2 text-brand-primary font-bold text-xl">
              <BookOpen className="text-brand-primary" />
              TOEIC Pro
            </Link>

            <nav className="hidden md:flex items-center gap-lg ml-8">
              <Link
                to="/khach"
                className={`text-sm font-medium ${location.pathname === '/khach' ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Trang chủ
              </Link>
              <Link
                to="/khach/exams"
                className={`text-sm font-medium ${location.pathname.startsWith('/khach/exams') ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Thư viện Đề thi
              </Link>
              <Link
                to="/khach/pronunciation"
                className={`text-sm font-medium ${location.pathname.startsWith('/khach/pronunciation') ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Luyện phát âm
              </Link>
              <Link
                to="/khach/teacher-apply"
                className={`text-sm font-medium ${location.pathname.startsWith('/khach/teacher-apply') ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Làm giáo viên
              </Link>
              <Link
                to="/khach#features"
                className="text-sm font-medium text-text-secondary hover:text-text-primary"
              >
                Tính năng
              </Link>
              <Link
                to="/khach/pricing"
                className={`text-sm font-medium ${location.pathname.startsWith('/khach/pricing') ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Bảng giá
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-md">
            <Button variant="subtle" onClick={openLogin}>Đăng nhập</Button>
            <Button variant="primary" onClick={openSignup}>Đăng ký</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet context={{ openSignup }} />
      </main>

      {/* Footer */}
      <footer className="bg-surface-bg border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-text-secondary">
            <BookOpen size={20} />
            <span className="font-semibold text-text-primary">TOEIC Pro</span>
            <span className="text-sm ml-2">© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-lg text-sm text-text-secondary">
            <a href="#" className="hover:text-text-primary">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-text-primary">Chính sách bảo mật</a>
            <a href="#" className="hover:text-text-primary">Liên hệ</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Modal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        title={getModalTitle()}
        size="small"
        footer={
          authMode === 'forgot_password' ? (
            <div className="w-full flex flex-col gap-md text-center">
              <Button variant="primary" className="w-full justify-center">
                Gửi mã xác nhận
              </Button>
              <button 
                className="text-sm text-brand-primary font-medium hover:underline mt-2" 
                onClick={() => setAuthMode('login')}
              >
                Quay lại Đăng nhập
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-md">
              <Button variant="primary" className="w-full justify-center">
                {authMode === 'login' ? 'Đăng nhập' : 'Đăng ký ngay'}
              </Button>
              <div className="text-center text-sm text-text-secondary mt-2">
                {authMode === 'login' ? (
                  <>Chưa có tài khoản? <button className="text-brand-primary font-medium hover:underline" onClick={() => setAuthMode('signup')}>Đăng ký</button></>
                ) : (
                  <>Đã có tài khoản? <button className="text-brand-primary font-medium hover:underline" onClick={() => setAuthMode('login')}>Đăng nhập</button></>
                )}
              </div>
            </div>
          )
        }
      >
        <div className="flex flex-col gap-lg py-4">
          {authMode === 'forgot_password' ? (
            <>
              <p className="text-text-secondary text-sm mb-2">Nhập email hoặc số điện thoại của bạn, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.</p>
              <InputField label="Email hoặc Số điện thoại" placeholder="Nhập thông tin của bạn" />
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <Button variant="neutral" className="w-full justify-center" iconStart={<UserCircle2 size={16} />}>
                  Tiếp tục với Google
                </Button>
                <Button variant="neutral" className="w-full justify-center" iconStart={<Facebook size={16} />}>
                  Tiếp tục với Facebook
                </Button>
                <Button variant="neutral" className="w-full justify-center" iconStart={<Phone size={16} />}>
                  Đăng nhập bằng Số điện thoại
                </Button>
              </div>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink-0 mx-4 text-text-secondary text-sm">Hoặc</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <InputField label="Email" placeholder="Nhập địa chỉ email của bạn" />
              <InputField label="Mật khẩu" placeholder="Nhập mật khẩu" type="password" />
              
              {authMode === 'login' && (
                <div className="flex justify-end mt-1">
                  <button 
                    className="text-sm text-brand-primary hover:underline"
                    onClick={() => setAuthMode('forgot_password')}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}