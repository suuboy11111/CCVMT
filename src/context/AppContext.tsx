import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Project, Task, TaskStatus, TaskComment, AppView } from '../types';

interface AppContextProps {
  projects: Project[];
  tasks: Task[];
  activeProjectId: string | null;
  activeView: AppView;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveProjectId: (id: string | null) => void;
  setActiveView: (view: AppView) => void;
  addProject: (payload: Omit<Project, 'id' | 'createdAt' | 'memberIds'>) => void;
  updateProject: (projectId: string, payload: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  addMemberToProject: (projectId: string, userId: string) => void;
  removeMemberFromProject: (projectId: string, userId: string) => void;
  addTask: (payload: Omit<Task, 'id' | 'createdAt' | 'comments'>) => void;
  updateTask: (taskId: string, payload: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  addComment: (taskId: string, content: string, userId: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Khởi tạo Dữ liệu Ảo ban đầu để demo
const INITIAL_PROJECTS: Project[] = [
  { id: 'p-1', name: 'Đồ án Phân tích Thiết kế', key: 'PTTK', createdAt: new Date().toISOString(), memberIds: ['u-1', 'u-2'] },
  { id: 'p-2', name: 'Nhập môn Công cụ', key: 'CCPM', createdAt: new Date().toISOString(), memberIds: ['u-1', 'u-3'] }
];

const INITIAL_TASKS: Task[] = [
  { id: 'PTTK-1', title: 'Vẽ biều đồ Use Case', description: 'Mô tả chi tiết flow cho khách hàng.', status: 'DONE', type: 'STORY', priority: 'MEDIUM', reporterId: 'u-1', projectId: 'p-1', createdAt: new Date().toISOString(), startDate: new Date(Date.now() - 86400000*2).toISOString(), dueDate: new Date(Date.now() - 86400000).toISOString(), comments: [] },
  { id: 'CCPM-1', title: 'Dựng khung UI React Vite', description: 'Sử dụng Vite và Lucide React.', status: 'IN_PROGRESS', type: 'TASK', priority: 'HIGH', assigneeId: 'u-1', reporterId: 'u-2', projectId: 'p-2', createdAt: new Date().toISOString(), startDate: new Date().toISOString(), dueDate: new Date(Date.now() + 86400000*3).toISOString(), comments: [] },
  { id: 'CCPM-2', title: 'Tích hợp Firebase Auth', description: '', status: 'TODO', type: 'EPIC', priority: 'LOW', reporterId: 'u-1', projectId: 'p-2', createdAt: new Date().toISOString(), startDate: new Date(Date.now() + 86400000*4).toISOString(), dueDate: new Date(Date.now() + 86400000*10).toISOString(), comments: [] },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('__preproject_projects');
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse projects from localStorage', e);
    }
    return INITIAL_PROJECTS;
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('__preproject_tasks');
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse tasks from localStorage', e);
    }
    return INITIAL_TASKS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );
  const [activeView, setActiveView] = useState<AppView>('BOARD');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('App context initialized!', { projectsCount: projects.length, tasksCount: tasks.length });
  }, []);

  useEffect(() => {
    localStorage.setItem('__preproject_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('__preproject_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addProject = (payload: Omit<Project, 'id' | 'createdAt' | 'memberIds'>) => {
    const newProject: Project = { 
      ...payload, 
      id: `p-${Date.now()}`, 
      createdAt: new Date().toISOString(),
      memberIds: ['u-1'] // Mặc định người tạo (Lệ) tham gia
    };
    setProjects(p => [...p, newProject]);
    setActiveProjectId(newProject.id); 
  };

  const updateProject = (projectId: string, payload: Partial<Project>) => {
    setProjects(p => p.map(item => item.id === projectId ? { ...item, ...payload } : item));
  };

  const deleteProject = (projectId: string) => {
    if (projects.length <= 1) return; // Không cho xóa project cuối cùng
    setProjects(p => p.filter(item => item.id !== projectId));
    setTasks(t => t.filter(item => item.projectId !== projectId));
    setActiveProjectId(projects.find(p => p.id !== projectId)?.id || null);
  };

  const addMemberToProject = (projectId: string, userId: string) => {
    setProjects(p => p.map(item => {
      if (item.id === projectId && !item.memberIds.includes(userId)) {
        return { ...item, memberIds: [...item.memberIds, userId] };
      }
      return item;
    }));
  };

  const removeMemberFromProject = (projectId: string, userId: string) => {
    setProjects(p => p.map(item => {
      if (item.id === projectId) {
        return { ...item, memberIds: item.memberIds.filter(id => id !== userId) };
      }
      return item;
    }));
  };

  const addTask = (payload: Omit<Task, 'id' | 'createdAt' | 'comments'>) => {
    const activeProject = projects.find(p => p.id === payload.projectId);
    const key = activeProject ? activeProject.key : 'TASK';
    const newTask: Task = { 
      ...payload, 
      id: `${key}-${Math.floor(Math.random() * 1000)}`, 
      createdAt: new Date().toISOString(),
      startDate: payload.startDate || new Date().toISOString(),
      dueDate: payload.dueDate || new Date(Date.now() + 86400000*7).toISOString(),
      comments: []
    };
    setTasks(t => [...t, newTask]);
  };

  const updateTask = (taskId: string, payload: Partial<Task>) => {
    setTasks(t => t.map(item => item.id === taskId ? { ...item, ...payload } : item));
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
  };

  const deleteTask = (taskId: string) => {
    setTasks(t => t.filter(task => task.id !== taskId));
  };

  const addComment = (taskId: string, content: string, userId: string) => {
    const newComment: TaskComment = {
      id: `c-${Date.now()}`,
      userId,
      content,
      createdAt: new Date().toISOString()
    };
    setTasks(t => t.map(task => 
      task.id === taskId 
        ? { ...task, comments: [...(task.comments || []), newComment] } 
        : task
    ));
  };

  return (
    <AppContext.Provider value={{ 
      projects, tasks, activeProjectId, searchQuery, activeView,
      setActiveProjectId, setSearchQuery, setActiveView,
      addProject, updateProject, deleteProject, addMemberToProject, removeMemberFromProject,
      addTask, updateTask, updateTaskStatus, deleteTask, addComment 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
