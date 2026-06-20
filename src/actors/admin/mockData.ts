import type { User, Course, ContentItem, Payment, Permissions } from './types';

export const initialUsers: User[] = [
  { id: '1',  name: 'Nguyễn Văn An',      email: 'an.nguyen@email.com',      role: 'Học viên',        status: 'active', createdAt: '2024-01-15', avatar: 'NA' },
  { id: '2',  name: 'Trần Thị Bình',      email: 'binh.tran@email.com',      role: 'Giáo viên',       status: 'active', createdAt: '2024-01-20', avatar: 'TB' },
  { id: '3',  name: 'Lê Văn Cường',       email: 'cuong.le@email.com',       role: 'Học viên',        status: 'locked', createdAt: '2024-02-05', avatar: 'LC' },
  { id: '4',  name: 'Phạm Thị Dung',      email: 'dung.pham@email.com',      role: 'Content Manager', status: 'active', createdAt: '2024-02-10', avatar: 'PD' },
  { id: '5',  name: 'Hoàng Văn Em',       email: 'em.hoang@email.com',       role: 'Khách',           status: 'active', createdAt: '2024-02-18', avatar: 'HE' },
  { id: '6',  name: 'Vũ Thị Hoa',         email: 'hoa.vu@email.com',         role: 'Học viên',        status: 'active', createdAt: '2024-03-01', avatar: 'VH' },
  { id: '7',  name: 'Đặng Minh Khoa',     email: 'khoa.dang@email.com',      role: 'Giáo viên',       status: 'active', createdAt: '2024-03-12', avatar: 'DK' },
  { id: '8',  name: 'Bùi Thị Lan',        email: 'lan.bui@email.com',        role: 'Học viên',        status: 'locked', createdAt: '2024-03-20', avatar: 'BL' },
  { id: '9',  name: 'Ngô Văn Minh',       email: 'minh.ngo@email.com',       role: 'Content Manager', status: 'active', createdAt: '2024-04-01', avatar: 'NM' },
  { id: '10', name: 'Đinh Thị Nga',       email: 'nga.dinh@email.com',       role: 'Học viên',        status: 'active', createdAt: '2024-04-15', avatar: 'DN' },
  { id: '11', name: 'Phan Quốc Bảo',      email: 'bao.phan@email.com',       role: 'Học viên',        status: 'active', createdAt: '2024-04-18', avatar: 'PB' },
  { id: '12', name: 'Lý Thanh Hà',        email: 'ha.ly@email.com',          role: 'Giáo viên',       status: 'active', createdAt: '2024-04-20', avatar: 'LH' },
  { id: '13', name: 'Trương Văn Hùng',    email: 'hung.truong@email.com',    role: 'Học viên',        status: 'locked', createdAt: '2024-05-02', avatar: 'TH' },
  { id: '14', name: 'Mai Thị Lan Anh',    email: 'lananh.mai@email.com',     role: 'Content Manager', status: 'active', createdAt: '2024-05-05', avatar: 'ML' },
  { id: '15', name: 'Cao Xuân Trường',    email: 'truong.cao@email.com',     role: 'Học viên',        status: 'active', createdAt: '2024-05-10', avatar: 'CT' },
  { id: '16', name: 'Đỗ Phương Linh',     email: 'linh.do@email.com',        role: 'Học viên',        status: 'active', createdAt: '2024-05-12', avatar: 'DL' },
  { id: '17', name: 'Kiều Anh Tuấn',      email: 'tuan.kieu@email.com',      role: 'Khách',           status: 'active', createdAt: '2024-05-14', avatar: 'KT' },
  { id: '18', name: 'Nguyễn Thị Thu',     email: 'thu.nguyen2@email.com',    role: 'Học viên',        status: 'locked', createdAt: '2024-05-16', avatar: 'NT' },
  { id: '19', name: 'Võ Minh Tuấn',       email: 'tuan.vo@email.com',        role: 'Giáo viên',       status: 'active', createdAt: '2024-05-18', avatar: 'VM' },
  { id: '20', name: 'Hồ Thị Diễm',       email: 'diem.ho@email.com',        role: 'Học viên',        status: 'active', createdAt: '2024-05-20', avatar: 'HD' },
];

export const initialCourses: Course[] = [
  { id: '1', title: 'TOEIC 600+ Foundation',       description: 'Khóa học nền tảng cho người mới bắt đầu luyện thi TOEIC', category: 'Khóa học', questionCount: 450, studentCount: 847, status: 'published', author: 'Trần Thị Bình',  createdAt: '2024-01-10' },
  { id: '2', title: 'Đề thi TOEIC tháng 3/2024',  description: 'Bộ đề thi thử TOEIC format mới nhất',                       category: 'Đề thi',   questionCount: 200, studentCount: 512, status: 'published', author: 'Đặng Minh Khoa', createdAt: '2024-03-01' },
  { id: '3', title: 'TOEIC 750+ Advanced',         description: 'Khóa học nâng cao hướng đến mục tiêu 750+',                 category: 'Khóa học', questionCount: 680, studentCount: 634, status: 'published', author: 'Trần Thị Bình',  createdAt: '2024-02-05' },
  { id: '4', title: 'Đề thi TOEIC tháng 4/2024',  description: 'Đề thi thử sát với đề thi thật',                            category: 'Đề thi',   questionCount: 200, studentCount: 0,   status: 'draft',     author: 'Đặng Minh Khoa', createdAt: '2024-04-01' },
  { id: '5', title: 'Grammar TOEIC Master',        description: 'Toàn bộ ngữ pháp trọng tâm cho TOEIC Part 5 & 6',          category: 'Khóa học', questionCount: 300, studentCount: 389, status: 'published', author: 'Ngô Văn Minh',   createdAt: '2024-02-20' },
  { id: '6', title: 'Listening TOEIC Intensive',   description: 'Luyện nghe chuyên sâu Part 1–4',                             category: 'Khóa học', questionCount: 520, studentCount: 276, status: 'archived',  author: 'Trần Thị Bình',  createdAt: '2023-12-15' },
  { id: '7', title: 'ETS TOEIC 2024 – Full Test',  description: 'Bộ đề ETS 2024 đầy đủ 7 phần',                              category: 'Đề thi',   questionCount: 200, studentCount: 721, status: 'published', author: 'Lý Thanh Hà',    createdAt: '2024-03-15' },
];

export const initialContent: ContentItem[] = [
  { id: '1', title: 'Bài giảng: Mệnh đề quan hệ trong TOEIC',    type: 'Bài giảng', author: 'Phạm Thị Dung',   status: 'pending',  submittedAt: '2024-04-18', description: 'Video bài giảng chi tiết về mệnh đề quan hệ và cách áp dụng trong TOEIC Part 5' },
  { id: '2', title: 'Bộ 50 câu hỏi Vocabulary Part 5',           type: 'Câu hỏi',   author: 'Ngô Văn Minh',    status: 'pending',  submittedAt: '2024-04-17', description: 'Bộ câu hỏi từ vựng chủ đề kinh doanh và thương mại' },
  { id: '3', title: 'Mini Test: Reading Comprehension',           type: 'Đề thi',    author: 'Phạm Thị Dung',   status: 'approved', submittedAt: '2024-04-15', description: 'Bài kiểm tra reading ngắn gồm 3 đoạn văn và 15 câu hỏi' },
  { id: '4', title: 'Podcast: Business English Episode 12',       type: 'Audio',     author: 'Ngô Văn Minh',    status: 'rejected', submittedAt: '2024-04-14', description: 'File audio luyện nghe tiếng Anh thương mại tập 12' },
  { id: '5', title: 'Flashcard: 100 từ vựng TOEIC chủ đề HR',   type: 'Flashcard', author: 'Mai Thị Lan Anh',  status: 'pending',  submittedAt: '2024-04-16', description: 'Bộ flashcard từ vựng nhân sự và quản trị' },
  { id: '6', title: 'Bài giảng: TOEIC Part 3 Strategy',          type: 'Bài giảng', author: 'Ngô Văn Minh',    status: 'approved', submittedAt: '2024-04-12', description: 'Chiến lược làm bài TOEIC Part 3 hiệu quả' },
  { id: '7', title: 'Đề thi thử ETS 2024 – Part 7 Reading',      type: 'Đề thi',    author: 'Mai Thị Lan Anh',  status: 'pending',  submittedAt: '2024-04-19', description: 'Bộ đề Part 7 gồm 54 câu theo format ETS 2024' },
];

export const initialPayments: Payment[] = [
  { id: 'TXN001', userName: 'Nguyễn Văn An',    userEmail: 'an.nguyen@email.com',   courseName: 'TOEIC 600+ Foundation',      amount: 599000,  status: 'success', date: '2024-04-18' },
  { id: 'TXN002', userName: 'Vũ Thị Hoa',        userEmail: 'hoa.vu@email.com',      courseName: 'TOEIC 750+ Advanced',        amount: 899000,  status: 'success', date: '2024-04-18' },
  { id: 'TXN003', userName: 'Đinh Thị Nga',       userEmail: 'nga.dinh@email.com',    courseName: 'Grammar TOEIC Master',       amount: 449000,  status: 'pending', date: '2024-04-17' },
  { id: 'TXN004', userName: 'Hoàng Văn Em',       userEmail: 'em.hoang@email.com',    courseName: 'TOEIC 600+ Foundation',      amount: 599000,  status: 'failed',  date: '2024-04-17' },
  { id: 'TXN005', userName: 'Nguyễn Văn An',    userEmail: 'an.nguyen@email.com',   courseName: 'Listening TOEIC Intensive',  amount: 749000,  status: 'success', date: '2024-04-16' },
  { id: 'TXN006', userName: 'Lê Văn Cường',       userEmail: 'cuong.le@email.com',    courseName: 'Grammar TOEIC Master',       amount: 449000,  status: 'success', date: '2024-04-15' },
  { id: 'TXN007', userName: 'Bùi Thị Lan',        userEmail: 'lan.bui@email.com',     courseName: 'TOEIC 750+ Advanced',        amount: 899000,  status: 'success', date: '2024-04-14' },
  { id: 'TXN008', userName: 'Phan Quốc Bảo',     userEmail: 'bao.phan@email.com',    courseName: 'ETS TOEIC 2024 – Full Test', amount: 299000,  status: 'success', date: '2024-04-14' },
  { id: 'TXN009', userName: 'Lý Thanh Hà',        userEmail: 'ha.ly@email.com',       courseName: 'TOEIC 750+ Advanced',        amount: 899000,  status: 'success', date: '2024-04-13' },
  { id: 'TXN010', userName: 'Cao Xuân Trường',   userEmail: 'truong.cao@email.com',  courseName: 'TOEIC 600+ Foundation',      amount: 599000,  status: 'pending', date: '2024-04-13' },
  { id: 'TXN011', userName: 'Đỗ Phương Linh',    userEmail: 'linh.do@email.com',     courseName: 'Grammar TOEIC Master',       amount: 449000,  status: 'success', date: '2024-04-12' },
  { id: 'TXN012', userName: 'Võ Minh Tuấn',       userEmail: 'tuan.vo@email.com',     courseName: 'ETS TOEIC 2024 – Full Test', amount: 299000,  status: 'failed',  date: '2024-04-11' },
];

export const initialPermissions: Permissions = {
  'Khách':           { viewLessons: false, takeExams: false, createExams: false, gradeExams: false, reviewContent: false, manageUsers: false },
  'Học viên':        { viewLessons: true,  takeExams: true,  createExams: false, gradeExams: false, reviewContent: false, manageUsers: false },
  'Giáo viên':       { viewLessons: true,  takeExams: true,  createExams: true,  gradeExams: true,  reviewContent: false, manageUsers: false },
  'Content Manager': { viewLessons: true,  takeExams: true,  createExams: true,  gradeExams: false, reviewContent: true,  manageUsers: false },
};

export const chartData = [
  { month: 'T10/23', luotThi: 1240 },
  { month: 'T11/23', luotThi: 1580 },
  { month: 'T12/23', luotThi: 2340 },
  { month: 'T1/24',  luotThi: 2890 },
  { month: 'T2/24',  luotThi: 3150 },
  { month: 'T3/24',  luotThi: 3820 },
  { month: 'T4/24',  luotThi: 4310 },
];

export const recentActivities = [
  { id: 1, type: 'register', user: 'Hồ Thị Diễm',     action: 'đã đăng ký tài khoản mới',                              time: '3 phút trước' },
  { id: 2, type: 'payment',  user: 'Vũ Thị Hoa',        action: 'đã thanh toán khóa học TOEIC 750+',                     time: '11 phút trước' },
  { id: 3, type: 'content',  user: 'Phạm Thị Dung',   action: 'gửi nội dung chờ duyệt: Đề thi Part 7 ETS 2024',       time: '45 phút trước' },
  { id: 4, type: 'exam',     user: 'Nguyễn Văn An',    action: 'hoàn thành ETS TOEIC 2024 – Full Test (điểm: 780)',     time: '1 giờ trước' },
  { id: 5, type: 'register', user: 'Kiều Anh Tuấn',    action: 'đã đăng ký tài khoản mới',                              time: '2 giờ trước' },
];
