export type Role = 'Khách' | 'Học viên' | 'Giáo viên' | 'Content Manager';
export type UserStatus = 'active' | 'locked';
export type ContentStatus = 'pending' | 'approved' | 'rejected';
export type CourseStatus = 'published' | 'draft' | 'archived';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Khóa học' | 'Đề thi';
  questionCount: number;
  studentCount: number;
  status: CourseStatus;
  author: string;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: string;
  author: string;
  status: ContentStatus;
  submittedAt: string;
  description: string;
}

export interface Payment {
  id: string;
  userName: string;
  userEmail: string;
  courseName: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
}

export type PermissionKey =
  | 'viewLessons'
  | 'takeExams'
  | 'createExams'
  | 'gradeExams'
  | 'reviewContent'
  | 'manageUsers';

export interface Permissions {
  [role: string]: { [key in PermissionKey]: boolean };
}

export type Page =
  | 'overview'
  | 'users'
  | 'teachers'
  | 'roles'
  | 'content'
  | 'courses'
  | 'payments'
  | 'settings';
