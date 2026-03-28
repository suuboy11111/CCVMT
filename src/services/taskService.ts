import type { Task, TaskStatus } from '../types';

// DỮ LIỆU MOCK (ẢO) TRƯỚC KHI CÓ FIREBASE
let mockTasks: Task[] = [
  {
    id: 't-1', title: 'Thiết kế giao diện Dark Mode', description: 'Tạo palette màu và hiệu ứng CSS...', status: 'DONE', type: 'STORY', assigneeId: 'u-1', reporterId: 'u-1', createdAt: new Date().toISOString(),
  },
  {
    id: 't-2', title: 'Xây dựng kéo thả (Drag & Drop)', description: 'Nghiên cứu dnd-kit hoặc HTML5 DnD...', status: 'IN_PROGRESS', type: 'TASK', assigneeId: 'u-1', reporterId: 'u-2', createdAt: new Date().toISOString(),
  },
  {
    id: 't-3', title: 'Tích hợp Firebase Auth', description: 'Để sau mới làm', status: 'TODO', type: 'EPIC', reporterId: 'u-1', createdAt: new Date().toISOString()
  },
  {
    id: 't-4', title: 'Lỗi vỡ layout màn hình nhỏ', description: 'Giao diện Header bị vỡ khi resize cửa sổ...', status: 'TODO', type: 'BUG', assigneeId: 'u-2', reporterId: 'u-1', createdAt: new Date().toISOString(),
  }
];

// --- HÀM SERVICE (Gọi API / Firebase) ---

export const taskService = {
  // Lấy toàn bộ task
  getTasks: async (): Promise<Task[]> => {
    // GIẢ LẬP ĐỘ TRỄ MẠNG
    return new Promise(resolve => setTimeout(() => resolve([...mockTasks]), 500));
  },

  // Đổi trạng thái khi kéo thả
  updateTaskStatus: async (taskId: string, newStatus: TaskStatus): Promise<Task> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = mockTasks.findIndex(t => t.id === taskId);
        if (idx > -1) {
          mockTasks[idx].status = newStatus;
          resolve(mockTasks[idx]);
        } else reject('Not found');
      }, 200);
    });
  },

  // Lấy chi tiết Task
  getTaskById: async (taskId: string): Promise<Task | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTasks.find(t => t.id === taskId));
      }, 300);
    });
  }
};
