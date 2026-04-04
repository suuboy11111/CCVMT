import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  arrayUnion,
  arrayRemove,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import type { Project, Task, TaskStatus, TaskComment, AppView } from '../types';

// Kiểu dữ liệu User thật từ Firestore (khác với firebase/auth User)
export interface AppUser {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
}

interface AppContextProps {
  projects: Project[];
  tasks: Task[];
  users: AppUser[]; // Danh sách users thật từ Firestore
  activeProjectId: string | null;
  activeView: AppView;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveProjectId: (id: string | null) => void;
  setActiveView: (view: AppView) => void;
  addProject: (payload: Omit<Project, 'id' | 'createdAt' | 'memberIds'>) => Promise<void>;
  updateProject: (projectId: string, payload: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addMemberToProject: (projectId: string, userId: string) => Promise<void>;
  removeMemberFromProject: (projectId: string, userId: string) => Promise<void>;
  addTask: (payload: Omit<Task, 'id' | 'createdAt' | 'comments'>) => Promise<void>;
  updateTask: (taskId: string, payload: Partial<Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<AppView>('BOARD');
  const [searchQuery, setSearchQuery] = useState('');

  // Wrapper để reset activeProjectId an toàn
  const setActiveProjectId = (id: string | null) => {
    setActiveProjectIdState(id);
    setActiveView('BOARD');
    setSearchQuery('');
  };

  // 1. Lắng nghe Projects của User hiện tại
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setTasks([]);
      setActiveProjectIdState(null);
      return;
    }

    const q = query(
      collection(db, 'projects'),
      where('memberIds', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData: Project[] = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as Project));
      
      setProjects(projectsData);

      // Tự động chọn project đầu tiên nếu chưa có active
      setActiveProjectIdState(prev => {
        if (!prev && projectsData.length > 0) return projectsData[0].id;
        // Nếu project đang active bị xóa, chuyển sang cái khác
        if (prev && !projectsData.find(p => p.id === prev)) {
          return projectsData.length > 0 ? projectsData[0].id : null;
        }
        return prev;
      });
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Lắng nghe Tasks của Project đang active
  useEffect(() => {
    if (!activeProjectId) {
      setTasks([]);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('projectId', '==', activeProjectId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData: Task[] = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as Task));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [activeProjectId]);

  // 3. Lắng nghe Users của Project đang active (để hiển thị members thật)
  useEffect(() => {
    if (!activeProjectId) {
      setUsers([]);
      return;
    }

    const activeProject = projects.find(p => p.id === activeProjectId);
    if (!activeProject || activeProject.memberIds.length === 0) {
      setUsers([]);
      return;
    }

    // Lắng nghe collection 'users', lọc theo memberIds của project
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const allUsers: AppUser[] = snapshot.docs.map(d => d.data() as AppUser);
      // Lọc chỉ lấy members của project này
      const projectUsers = allUsers.filter(u =>
        activeProject.memberIds.includes(u.uid)
      );
      setUsers(projectUsers);
    });

    return () => unsubscribe();
  }, [activeProjectId, projects]);

  // --- PROJECT ACTIONS ---

  const addProject = async (payload: Omit<Project, 'id' | 'createdAt' | 'memberIds'>) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...payload,
        createdAt: new Date().toISOString(),
        memberIds: [user.uid],
        createdBy: user.uid,
      });
      setActiveProjectId(docRef.id);
    } catch (e) {
      console.error('Error adding project:', e);
    }
  };

  const updateProject = async (projectId: string, payload: Partial<Project>) => {
    try {
      await updateDoc(doc(db, 'projects', projectId), payload);
    } catch (e) {
      console.error('Error updating project:', e);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const batch = writeBatch(db);
      
      // Xóa project document
      batch.delete(doc(db, 'projects', projectId));
      
      // Xóa tất cả tasks thuộc project này (cascade delete)
      const tasksQuery = query(collection(db, 'tasks'), where('projectId', '==', projectId));
      const tasksSnapshot = await getDocs(tasksQuery);
      tasksSnapshot.forEach(taskDoc => {
        batch.delete(taskDoc.ref);
      });

      await batch.commit();
    } catch (e) {
      console.error('Error deleting project:', e);
    }
  };

  const addMemberToProject = async (projectId: string, userId: string) => {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        memberIds: arrayUnion(userId)
      });
    } catch (e) {
      console.error('Error adding member:', e);
    }
  };

  const removeMemberFromProject = async (projectId: string, userId: string) => {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        memberIds: arrayRemove(userId)
      });
    } catch (e) {
      console.error('Error removing member:', e);
    }
  };

  // --- TASK ACTIONS ---

  const addTask = async (payload: Omit<Task, 'id' | 'createdAt' | 'comments'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'tasks'), {
        ...payload,
        createdAt: new Date().toISOString(),
        startDate: payload.startDate || new Date().toISOString(),
        dueDate: payload.dueDate || new Date(Date.now() + 86400000 * 7).toISOString(),
        comments: [],
      });
    } catch (e) {
      console.error('Error adding task:', e);
    }
  };

  const updateTask = async (taskId: string, payload: Partial<Task>) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), payload);
    } catch (e) {
      console.error('Error updating task:', e);
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    await updateTask(taskId, { status });
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (e) {
      console.error('Error deleting task:', e);
    }
  };

  // addComment bây giờ dùng user thật từ Auth
  const addComment = async (taskId: string, content: string) => {
    if (!user) return;
    const newComment: TaskComment = {
      id: `c-${Date.now()}`,
      userId: user.uid,
      content,
      createdAt: new Date().toISOString(),
    };
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        comments: arrayUnion(newComment)
      });
    } catch (e) {
      console.error('Error adding comment:', e);
    }
  };

  return (
    <AppContext.Provider value={{
      projects, tasks, users,
      activeProjectId, searchQuery, activeView,
      setActiveProjectId, setSearchQuery, setActiveView,
      addProject, updateProject, deleteProject,
      addMemberToProject, removeMemberFromProject,
      addTask, updateTask, updateTaskStatus, deleteTask, addComment,
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
