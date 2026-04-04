import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { HeaderFilter } from './components/layout/HeaderFilter';
import { KanbanBoard } from './components/board/KanbanBoard';
import { BacklogView } from './components/board/BacklogView';
import { TimelineView } from './components/board/TimelineView';
import { MembersView } from './components/project/MembersView';
import { TaskSidePanel } from './components/task/TaskSidePanel';
import { LoginPage } from './components/auth/LoginPage';
import { useAuth } from './context/AuthContext';
import type { Task } from './types';
import './index.css';

import { useAppContext } from './context/AppContext';

function App() {
  const { user, loading } = useAuth();
  const { tasks, activeView } = useAppContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  if (loading) {
    return <div className="loading-screen">Đang tải...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
  };

  const handleClosePanel = () => {
    setSelectedTaskId(null);
  };

  const activeTask = tasks.find(t => t.id === selectedTaskId) || null;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <HeaderFilter />
        <main>
          {activeView === 'BOARD' && <KanbanBoard onTaskClick={handleTaskClick} />}
          {activeView === 'BACKLOG' && <BacklogView onTaskClick={handleTaskClick} />}
          {activeView === 'MEMBERS' && <MembersView />}
          {activeView === 'TIMELINE' && <TimelineView onTaskClick={handleTaskClick} />}
        </main>
      </div>
      
      <TaskSidePanel 
        task={activeTask}
        isOpen={!!activeTask}
        onClose={handleClosePanel}
      />
    </div>
  );
}

export default App;
