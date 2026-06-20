import '@figma/astraui/styles.css';
import { ThemeProvider } from '@figma/astraui';
import { Routes, Route } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { HomePage } from './pages/HomePage';
import { ExamLibraryPage } from './pages/ExamLibraryPage';
import { TestExperiencePage } from './pages/TestExperiencePage';
import { PricingPage } from './pages/PricingPage';
import { PronunciationPage } from './pages/PronunciationPage';
import { TeacherApplyPage } from './pages/TeacherApplyPage';
import BackToHome from '../../components/BackToHome';
import ZaloButton from '../../components/ZaloButton';

/**
 * Actor Khách — mount dưới route "/khach/*" của app chung.
 * Trước đây actor dùng createBrowserRouter riêng; nay chuyển sang <Routes> lồng
 * để chạy chung trong HashRouter của app. Các path con là tương đối với /khach.
 */
export default function KhachApp() {
  return (
    <ThemeProvider>
      <BackToHome /><ZaloButton />
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="exams" element={<ExamLibraryPage />} />
          <Route path="test" element={<TestExperiencePage />} />
          <Route path="pronunciation" element={<PronunciationPage />} />
          <Route path="teacher-apply" element={<TeacherApplyPage />} />
          <Route path="pricing" element={<PricingPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
