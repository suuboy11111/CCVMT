import React, { createContext, useContext, useState } from 'react';
import type { Project, Task, TaskStatus } from '../types';

interface AppContextProps {
  projects: Project[];
  tasks: Task[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string) => void;
  addProject: (payload: Omit<Project, 'id' | 'createdAt'>) => void;
  addTask: (payload: Omit<Task, 'id' | 'createdAt' | 'comments'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Khởi tạo Dữ liệu Ảo ban đầu để demo
const INITIAL_PROJECTS: Project[] = [
  { id: 'p-1', name: 'Đồ án Phân tích Thiết kế', key: 'PTTK', createdAt: new Date().toISOString() },
  { id: 'p-2', name: 'Nhập môn Công cụ PT Phần Mềm', key: 'CCPM', createdAt: new Date().toISOString() }
];

const INITIAL_TASKS: Task[] = [
  { id: 'PTTK-1', title: 'Vẽ biều đồ Use Case', description: '', status: 'DONE', type: 'STORY', reporterId: 'u-1', projectId: 'p-1', createdAt: new Date().toISOString() },
  { id: 'CCPM-1', title: 'Dựng khung UI React Vite', description: '', status: 'IN_PROGRESS', type: 'TASK', assigneeId: 'u-1', reporterId: 'u-2', projectId: 'p-2', createdAt: new Date().toISOString() },
  { id: 'CCPM-2', title: 'Tích hợp Firebase', description: '', status: 'TODO', type: 'EPIC', reporterId: 'u-1', projectId: 'p-2', createdAt: new Date().toISOString() },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(INITIAL_PROJECTS[0].id);

  const addProject = (payload: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = { ...payload, id: `p-${Date.now()}`, createdAt: new Date().toISOString() };
    setProjects(p => [...p, newProject]);
    setActiveProjectId(newProject.id); // Tự động nhảy sang dự án mới
  };

  const addTask = (payload: Omit<Task, 'id' | 'createdAt' | 'comments'>) => {
    const activeProject = projects.find(p => p.id === payload.projectId);
    const key = activeProject ? activeProject.key : 'TASK';
    const newTask: Task = { 
      ...payload, 
      id: `${key}-${Math.floor(Math.random() * 1000)}`, 
      createdAt: new Date().toISOString(),
      comments: []
    };
    setTasks(t => [...t, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(t => t.map(task => task.id === taskId ? { ...task, status } : task));
  };

  return (
    <AppContext.Provider value={{ projects, tasks, activeProjectId, setActiveProjectId, addProject, addTask, updateTaskStatus }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
