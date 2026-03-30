export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskType = 'TASK' | 'STORY' | 'EPIC' | 'BUG';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type AppView = 'BOARD' | 'BACKLOG' | 'TIMELINE' | 'MEMBERS';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string; // Tên viết tắt hoặc đường dẫn ảnh
}

export interface TaskComment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  key: string; // VD: PRE, WEB, APP
  createdAt: string;
  memberIds: string[]; // Bổ sung quản lý thành viên thực tế
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority; // Bổ sung độ ưu tiên
  startDate?: string; // Bổ sung ngày bắt đầu (ISO)
  dueDate?: string; // Bổ sung hạn chót (ISO)
  assigneeId?: string;
  reporterId: string;
  projectId: string;
  createdAt: string;
  comments?: TaskComment[];
}
