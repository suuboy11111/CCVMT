import type { User } from '../types';

export const mockUsers: User[] = [
  { id: 'u-1', name: 'Đoàn Nhật Lệ', avatarUrl: 'DL' },
  { id: 'u-2', name: 'Nguyễn Văn A', avatarUrl: 'NA' },
  { id: 'u-3', name: 'Trần B', avatarUrl: 'TB' }
];

export const userService = {
  getUsers: async (): Promise<User[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockUsers), 200));
  }
};
