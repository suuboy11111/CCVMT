export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskType = 'TASK' | 'STORY' | 'EPIC' | 'BUG';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string; // Tên viết tắt hoặc đường dẫn ảnh
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  type: TaskType;
  assigneeId?: string;
  reporterId: string;
  createdAt: string;
  comments?: Comment[];
}
